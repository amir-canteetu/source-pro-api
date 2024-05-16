const { body, validationResult } = require('express-validator');
const Tender = require('../models/tenderModel');

// Validation and sanitization middleware functions
const validateTender = [
  // Example validations for 'createTender' endpoint
  body('title').notEmpty().withMessage('Title is required').trim().escape(),
  body('short_description').optional().isLength({ max: 255 }).withMessage('Short description must be less than 255 characters').trim().escape(),
  body('deadline').optional().isISO8601().toDate().withMessage('Invalid deadline format'),
   
];

getAllTenders = async (req, res, next) => {
  try {
    const tenders = await Tender.getAllTenders();
    res.json(tenders);
  } catch (error) {
    next(error);
  }
};

getTenderById = async (req, res, next) => {
  const tenderId = req.params.tenderId;
  try {
    const tender = await Tender.getTenderById(tenderId);
    res.json(tender);
  } catch (error) {
    next(error);
  }
};

createTender = [
  validateTender, // Apply input validation middleware
  async (req, res, next) => {
    // Check for validation errors
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
  }
];

updateTender = [
  validateTender, // Apply input validation middleware
  async (req, res, next) => {
    // Check for validation errors
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
  }
];

deleteTender = async (req, res, next) => {
  const tenderId = req.params.tenderId;
  try {
    const rowsAffected = await Tender.deleteTender(tenderId);
    res.json({ message: 'Tender deleted successfully', rowsAffected });
  } catch (error) {
    next(error);
  }
};

module.exports = {
    getAllTenders,
    getTenderById,
    createTender,
    updateTender,
    deleteTender
  };
