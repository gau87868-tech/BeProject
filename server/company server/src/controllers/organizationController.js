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

exports.validateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token;

    // Extract token
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "Authorization token missing"
      });
    }

    // Verify token (SYNC, CLEAN)
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_STRING
    );

    // Attach user info to request
    req.user = {
      id: decoded.id,
    };

    next();

  } catch (error) {

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "fail",
        message: "Token expired"
      });
    }

    return res.status(403).json({
      status: "fail",
      message: "Invalid token"
    });
  }
};


exports.refreshToken = async(req,res)=>{
    try {
        const org = await OrgModel.findOne({companyEmail : req.body.email});
        const refreshToken = req.headers["refresh-token"];

        const decodeToken = jwt.verify(refreshToken,process.env.JWT_SECRET_STRING);

        const token = jwtToken(org._id);

        return res.status(200).json({
            status : "success",
            token : {
                accessToken : token.accessToken,
                refreshToken : token.refreshToken
            }
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

exports.registerCompany = async (req,res)=>{
    try {
        const registeredCompany = await OrgModel.create(req.body);
        const {accessToken,refreshToken} = jwtToken(registeredCompany._id);
        if(registeredCompany){
            res.status(201).json({
                status : "success",
                message : "Company Registered Successfully",
                accessToken,
                refreshToken,
                organization : registeredCompany
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

exports.login = async(req,res)=>{
    try {
        const {email,password} = req.body;
        const organization = await OrgModel.findOne({companyEmail : email}).select("+password");
        if(!organization){
            return res.status(400).json({
                status : "fail",
                message : "Invald Email"
            })
        }
        const passwordVerification = await bcrypt.compare(password,organization.password);
        if(!passwordVerification){
            return res.status(400).json({
                status : "fail",
                message : "Invald password"
            })
        }
        const {accessToken,refreshToken} = jwtToken(organization._id);
        return res.status(200).json({
            status : "success",
            accessToken,
            refreshToken,
            organization
        })
    } catch (error) {
        res.status(400).json({
            status : "fail",
            error : error.message
        })
    }
}

exports.getDashboardOverview = async (req, res) => {
  try {
    const organizationId = req.user.id;

    // Optional date filter
    const dateFilter = {};
    const { from, to } = req.query;

    if (from && to) {
      dateFilter.createdAt = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    // ---- INTERVIEW METRICS ----

    // Total interviews created
    const totalInterviews = await Interview.countDocuments({
      organizationId,
      ...dateFilter,
    });

    // Active interviews (scheduled in future)
    const activeInterviews = await Interview.countDocuments({
      organizationId,
      scheduledAt: { $gte: new Date() },
    });

    // ---- CANDIDATE METRICS ----

    // Total candidates attempted (1 result = 1 attempt)
    const totalCandidatesAttempted = await Result.countDocuments({
      organizationId,
      ...dateFilter,
    });

    // Shortlisted candidates
    const shortlistedCandidates = await Result.countDocuments({
      organizationId,
      status: "shortlisted",
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