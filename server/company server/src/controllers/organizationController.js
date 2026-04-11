const OrgModel = require("./../models/organizationModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Interview = require("../models/interviewModel");
const Result = require("../models/resultsModel");

function jwtToken(userId){
  let accessToken = jwt.sign({id : userId},process.env.JWT_SECRET_STRING,{
    expiresIn : '3d'
  })
  let refreshToken = jwt.sign({id : userId},process.env.JWT_SECRET_STRING,{
    expiresIn : "30d"
  })
  return {accessToken,refreshToken};
}

// ────────────────────────────────────────────
// AUTH
// ────────────────────────────────────────────

// Bug #5 FIXED: Strip password hash before sending to client
exports.registerCompany = async (req,res)=>{
  try {
    const registeredCompany = await OrgModel.create(req.body);
    const {accessToken,refreshToken} = jwtToken(registeredCompany._id);
    if(registeredCompany){
      // Strip password hash before sending to client
      const orgData = registeredCompany.toObject();
      delete orgData.password;

      res.status(201).json({
        status : "success",
        message : "Company Registered Successfully",
        accessToken,
        refreshToken,
        organization : orgData
      })
    }else{
      res.status(400).json({
        status : "fail",
        message : "Something went wrong"
      })
    }
  } catch (error) {
    res.status(400).json({
      status : "fail",
      error : error.message
    })
  }
}

// Bug #1 FIXED: Changed `email` to `companyEmail` to match frontend payload
// Bug #4 FIXED: Strip password hash before sending to client
exports.login = async(req,res)=>{
  try {
    const {companyEmail, password} = req.body;
    const organization = await OrgModel.findOne({companyEmail}).select("+password");
    if(!organization){
      return res.status(400).json({
        status : "fail",
        message : "Invalid Email"
      })
    }
    const passwordVerification = await bcrypt.compare(password, organization.password);
    if(!passwordVerification){
      return res.status(400).json({
        status : "fail",
        message : "Invalid password"
      })
    }
    const {accessToken,refreshToken} = jwtToken(organization._id);

    // Strip password hash before sending to client
    const orgData = organization.toObject();
    delete orgData.password;

    return res.status(200).json({
      status : "success",
      accessToken,
      refreshToken,
      organization: orgData
    })
  } catch (error) {
    res.status(400).json({
      status : "fail",
      error : error.message
    })
  }
}

// Bug #10 FIXED: Decode refresh token JWT to get user ID instead of requiring email in body
exports.refreshToken = async(req,res)=>{
  try {
    const refreshToken = req.headers["refresh-token"];

    if (!refreshToken) {
      return res.status(400).json({
        status: "fail",
        message: "Refresh token is required"
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_STRING);

    // Use the user ID from the decoded refresh token — no need for email
    const org = await OrgModel.findById(decoded.id);
    if (!org) {
      return res.status(404).json({
        status: "fail",
        message: "Organization not found"
      });
    }

    const token = jwtToken(org._id);

    return res.status(200).json({
      status : "success",
      accessToken : token.accessToken,
      refreshToken : token.refreshToken
    })

  } catch (err) {
    if(err.name === "TokenExpiredError"){
      return res.status(401).json({
        status : "fail",
        message : "Refresh Token Expired, Login Again"
      })
    }
    return res.status(403).json({
      status : "fail",
      message : "Invalid Token"
    })
  }
}

// ────────────────────────────────────────────
// DASHBOARD
// ────────────────────────────────────────────

// FIX: Now uses req.organization.id (set by validateOrgToken middleware)
// FIX: Changed status: "shortlisted" → status: "SHORTLISTED" to match Result enum
exports.getDashboardOverview = async (req, res) => {
  try {
    const organizationId = req.organization.id;

    const dateFilter = {};
    const { from, to } = req.query;

    if (from && to) {
      dateFilter.createdAt = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    const totalInterviews = await Interview.countDocuments({
      organizationId,
      ...dateFilter,
    });

    const activeInterviews = await Interview.countDocuments({
      organizationId,
      status: "published",
      scheduledAt: { $gte: new Date() },
    });

    const totalCandidatesAttempted = await Result.countDocuments({
      organizationId,
      ...dateFilter,
    });

    // FIX: uppercase "SHORTLISTED" to match the Result model enum
    const shortlistedCandidates = await Result.countDocuments({
      organizationId,
      status: "SHORTLISTED",
      ...dateFilter,
    });

    return res.status(200).json({
      status: "success",
      data: {
        totalInterviews,
        activeInterviews,
        totalCandidatesAttempted,
        shortlistedCandidates,
      },
    });
  } catch (error) {
    console.error("Dashboard Overview Error:", error);
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// ────────────────────────────────────────────
// PROFILE  (NEW)
// ────────────────────────────────────────────

/**
 * PATCH /api/v2/organization/profile
 * Update the logged-in organization's profile fields.
 * Auth: validateOrgToken → req.organization.id
 */
exports.updateProfile = async (req, res) => {
  try {
    const organizationId = req.organization.id;

    // Only allow these fields to be updated
    const allowedFields = [
      "companyName",
      "contactPerson",
      "phoneNumber",
      "industry",
      "description",
      "website",
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "No valid fields provided for update",
      });
    }

    updates.updatedAt = new Date();

    const updatedOrg = await OrgModel.findByIdAndUpdate(
      organizationId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedOrg) {
      return res.status(404).json({
        status: "fail",
        message: "Organization not found",
      });
    }

    // Strip password just in case (select: false should handle it, but be safe)
    const orgData = updatedOrg.toObject();
    delete orgData.password;

    return res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      organization: orgData,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

// ────────────────────────────────────────────
// CHANGE PASSWORD  (NEW)
// ────────────────────────────────────────────

/**
 * PATCH /api/v2/organization/password
 * Change the logged-in organization's password.
 * Auth: validateOrgToken → req.organization.id
 */
exports.changePassword = async (req, res) => {
  try {
    const organizationId = req.organization.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: "fail",
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        status: "fail",
        message: "New password must be at least 6 characters",
      });
    }

    // Fetch org WITH password (select: false by default)
    const org = await OrgModel.findById(organizationId).select("+password");

    if (!org) {
      return res.status(404).json({
        status: "fail",
        message: "Organization not found",
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, org.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "fail",
        message: "Current password is incorrect",
      });
    }

    // Hash and save new password directly (bypass the pre-save hook
    // to avoid any double-hashing edge cases)
    
    org.password = newPassword;
    org.updatedAt = new Date();
    await org.save({ validateBeforeSave: false });

    return res.status(200).json({
      status: "success",
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change Password Error:", error);
    return res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
