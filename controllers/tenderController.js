// controllers/tenderController.js

const Tender = require('../models/tenderModel');

exports.getAllTenders = (req, res) => {
  Tender.getAllTenders(tenders => {
    res.json(tenders);
  });
};

exports.getTenderById = (req, res) => {
  const tenderId = req.params.tenderId;
  Tender.getTenderById(tenderId, tender => {
    res.json(tender);
  });
};

exports.createTender = (req, res) => {
  const newTender = req.body;
  Tender.createTender(newTender, tenderId => {
    res.status(201).json({ message: 'Tender created successfully', tenderId });
  });
};

exports.updateTender = (req, res) => {
  const tenderId = req.params.tenderId;
  const updatedTender = req.body;
  Tender.updateTender(tenderId, updatedTender, rowsAffected => {
    res.json({ message: 'Tender updated successfully', rowsAffected });
  });
};

exports.deleteTender = (req, res) => {
  const tenderId = req.params.tenderId;
  Tender.deleteTender(tenderId, rowsAffected => {
    res.json({ message: 'Tender deleted successfully', rowsAffected });
  });
};
