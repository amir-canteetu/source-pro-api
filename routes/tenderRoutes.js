// routes/tenderRoutes.js

const express = require('express');
const tenderController = require('../controllers/tenderController');
const router = express.Router();

router.get('/', tenderController.getAllTenders);
router.get('/:tenderId', tenderController.getTenderById);
router.post('/', tenderController.createTender);
router.put('/:tenderId', tenderController.updateTender);
router.delete('/:tenderId', tenderController.deleteTender);

module.exports = router;
