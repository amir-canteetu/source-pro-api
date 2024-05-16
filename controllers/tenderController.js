const Tender = require('../models/tenderModel');

exports.getAllTenders = async (req, res, next) => {
  try {
    const tenders = await Tender.getAllTenders();
    res.json(tenders);
  } catch (error) {
    next(error);
  }
};

exports.getTenderById = async (req, res, next) => {
  const tenderId = req.params.tenderId;
  try {
    const tender = await Tender.getTenderById(tenderId);
    res.json(tender);
  } catch (error) {
    next(error);
  }
};

exports.createTender = async (req, res, next) => {
  const newTender = req.body;
  try {
    const insertId = await Tender.createTender(newTender);
    res.status(201).json({ message: 'Tender created successfully', tenderId: insertId });
  } catch (error) {
    next(error);
  }
};

exports.updateTender = async (req, res, next) => {
  const tenderId = req.params.tenderId;
  const updatedTender = req.body;
  try {
    const rowsAffected = await Tender.updateTender(tenderId, updatedTender);
    res.json({ message: 'Tender updated successfully', rowsAffected });
  } catch (error) {
    next(error);
  }
};

exports.deleteTender = async (req, res, next) => {
  const tenderId = req.params.tenderId;
  try {
    const rowsAffected = await Tender.deleteTender(tenderId);
    res.json({ message: 'Tender deleted successfully', rowsAffected });
  } catch (error) {
    next(error);
  }
};
