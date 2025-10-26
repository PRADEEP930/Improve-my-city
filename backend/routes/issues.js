const express = require('express');
const router = express.Router();
const { reportIssue, getAllIssues, getIssuesByStatus, updateIssueStatus } = require('../controllers/issueController');
const upload = require('../middleware/upload');

// Public routes
router.post('/report', upload.single('photo'), reportIssue); // Add upload middleware
router.get('/all', getAllIssues);

// Admin routes
router.get('/status/:status', getIssuesByStatus);
router.put('/:id/status', updateIssueStatus);

router.post('/report', upload.single('photo'), (req, res, next) => {
  console.log('=== FORM DATA RECEIVED ===');
  console.log('File:', req.file);
  console.log('Body fields:', req.body);
  console.log('=== END FORM DATA ===');
  next();
}, reportIssue);

module.exports = router;