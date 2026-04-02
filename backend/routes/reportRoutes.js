const express = require('express');
const router  = express.Router();
const {
  createReport, getPendingReports, resolveReport, getMyReports,
} = require('../controllers/reportController');
const { protect, staffOrAdmin } = require('../middleware/authMiddleware');

router.post('/',            protect, createReport);
router.get('/my',           protect, getMyReports);
router.get('/',             protect, staffOrAdmin, getPendingReports);
router.put('/:id/resolve',  protect, staffOrAdmin, resolveReport);

module.exports = router;
