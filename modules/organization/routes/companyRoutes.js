import express from 'express';
import { getAllCompanies, getCompanyById, createCompany, updateCompany, deleteCompany } from '../controllers/companyController.js';

const router = express.Router();

router.get('/', getAllCompanies);
router.get('/:companyId', getCompanyById);
router.post('/', createCompany);
router.patch('/:companyId', updateCompany);
router.delete('/:companyId', deleteCompany);

export default router;