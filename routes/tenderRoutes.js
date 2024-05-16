import express from 'express';
import { getAllTenders, getTenderById, createTender, updateTender, deleteTender } from '../controllers/tenderController.js';

const router = express.Router();

router.get('/', getAllTenders);
router.get('/:tenderId', getTenderById);
router.post('/', createTender);
router.put('/:tenderId', updateTender);
router.delete('/:tenderId', deleteTender);

export default router;
