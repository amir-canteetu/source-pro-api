import { body, validationResult } from 'express-validator';
import Tender from '../models/tenderModel.js';

// Validation and sanitization middleware functions
const validateTender = [
  body('title').notEmpty().withMessage('Title is required').trim().escape(),
  body('short_description').optional().isLength({ max: 255 }).withMessage('Short description must be less than 255 characters').trim().escape(),
  body('deadline').optional().isISO8601().toDate().withMessage('Invalid deadline format'),
];

const getAllTenders = async (req, res, next) => {
  try {
    const tenders = await Tender.getAllTenders();
    res.json(tenders);
  } catch (error) {
    next(error);
  }
};

const getTenderById = async (req, res, next) => {
  const tenderId = req.params.tenderId;
  try {
    const tender = await Tender.getTenderById(tenderId);
    res.json(tender);
  } catch (error) {
    next(error);
  }
};

const createTender = [
  validateTender,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newTender = req.body;
    try {
      const insertId = await Tender.createTender(newTender);
      res.status(201).json({ message: 'Tender created successfully', tenderId: insertId });
    } catch (error) {
      next(error);
    }
  },
];

const updateTender = [
  validateTender,
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const tenderId = req.params.tenderId;
    const updatedTender = req.body;
    try { 
      const rowsAffected = await Tender.updateTender(tenderId, updatedTender);
      res.json({ message: 'Tender updated successfully', rowsAffected });
    } catch (error) {
      next(error);
    }
  },
];

const deleteTender = async (req, res, next) => {
  const tenderId = req.params.tenderId;
  try {
    const rowsAffected = await Tender.deleteTender(tenderId);
    res.json({ message: 'Tender deleted successfully', rowsAffected });
  } catch (error) {
    next(error);
  }
};

export {
  getAllTenders,
  getTenderById,
  createTender,
  updateTender,
  deleteTender,
};
