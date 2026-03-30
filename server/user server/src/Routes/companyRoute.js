
const express = require('express');
const companyController = require("./../Controllers/companyController");
const { validateToken } = require("./../middleware/auth");

const router = express.Router();

router.route("/addCompany").post(validateToken, companyController.addCompanyandRole);
router.route("/getCompanies").get(validateToken, companyController.getCompanyandRole);

module.exports = router;