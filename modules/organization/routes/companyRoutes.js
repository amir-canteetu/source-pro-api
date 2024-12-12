const express = require("express");
const {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
} = require("../controllers/companyController.js");

const router = express.Router();

router.get("/", getAllCompanies);
router.get("/:companyId", getCompanyById);
router.post("/", createCompany);
router.patch("/:companyId", updateCompany);
router.delete("/:companyId", deleteCompany);

module.exports = router;
