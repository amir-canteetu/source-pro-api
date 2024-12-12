const express = require("express");
const {
  getAllTenders,
  getTenderById,
  createTender,
  updateTender,
  deleteTender,
} = require("../controllers/tenderController.js");

const router = express.Router();

router.get("/", getAllTenders);
//router.get('/:q', searchTenders);
router.get("/:tenderId", getTenderById);
//router.get('/:tenderId/bids', getBidsByTenderId);
//router.get('/:cat', getTendersByCategory);
router.post("/", createTender);
router.patch("/:tenderId", updateTender);
router.delete("/:tenderId", deleteTender);

module.exports = router;
