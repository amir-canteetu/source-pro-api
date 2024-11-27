import { body, validationResult } from 'express-validator';
import Company from '../models/companyModel.js';

// Validation and sanitization middleware functions
const validateCompany = [
  body('company_name').notEmpty().withMessage('Company name is required').trim().escape(),
  body('industry').optional().trim().escape(),
  body('company_type').notEmpty().withMessage('Company type is required').isIn(['service_provider', 'procuring_company']).withMessage('Invalid company type').trim().escape(),
  body('contact_person_id').isInt().withMessage('Contact person ID must be an integer'),
  body('domain').optional().trim().escape(),
  body('country_id').optional().isInt().withMessage('Country ID must be an integer'),
  body('address').optional().trim().escape(),
  body('city').optional().trim().escape(),
  body('province').optional().trim().escape(),
  body('employee_count').optional().isInt().withMessage('Employee count must be an integer'),
  body('registration_number').optional().trim().escape(),
  body('legal_status').optional().trim().escape(),
  body('tax_id').optional().trim().escape(),
  body('certifications').optional().trim().escape(),
  body('service_regions').optional().trim().escape(),
  body('operating_since').optional().isInt().withMessage('Operating since must be an integer'),
  body('major_clients').optional().trim().escape(),
  body('social_media').optional().trim().escape(),
  body('past_projects').optional().trim().escape(),
];

const getAllCompanies = async (req, res, next) => {
  try {
    const companies = await Company.getAllCompanies();
    res.json(companies);
  } catch (error) {
    next(error);
  }
};

const getCompanyById = async (req, res, next) => {
  const companyId = req.params.companyId;
  try {
    const company = await Company.getCompanyById(companyId);
    res.json(company);
  } catch (error) {
    next(error);
  }
};

const createCompany = [
  validateCompany,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newCompany = req.body;
    try {
      const insertId = await Company.createCompany(newCompany);
      res.status(201).json({ message: 'Company created successfully', companyId: insertId });
    } catch (error) {
      next(error);
    }
  },
];

const updateCompany = [
  validateCompany,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const companyId = req.params.companyId;
    const updatedCompany = req.body;
    try {
      const rowsAffected = await Company.updateCompany(companyId, updatedCompany);
      res.json({ message: 'Company updated successfully', rowsAffected });
    } catch (error) {
      next(error);
    }
  },
];

const deleteCompany = async (req, res, next) => {
  const companyId = req.params.companyId;
  try {
    const rowsAffected = await Company.deleteCompany(companyId);
    res.json({ message: 'Company deleted successfully', rowsAffected });
  } catch (error) {
    next(error);
  }
};

export {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
};
