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

        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                status: "fail",
                message: "Authorization token missing"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_STRING
        );

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


//  Bug #10 FIXED: Decode refresh token JWT to get user ID instead of requiring email in body
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

//  Bug #5 FIXED: Strip password hash before sending to client
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

//  Bug #1 FIXED: Changed `email` to `companyEmail` to match frontend payload
//  Bug #4 FIXED: Strip password hash before sending to client
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

exports.getDashboardOverview = async (req, res) => {
    try {
        const organizationId = req.user.id;

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
            scheduledAt: { $gte: new Date() },
        });

        const totalCandidatesAttempted = await Result.countDocuments({
            organizationId,
            ...dateFilter,
        });

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
