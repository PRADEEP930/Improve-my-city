const pool = require('../config/database');
const { sendStatusUpdateEmail } = require('../services/emailService');

// Report a new issue
const reportIssue = async (req, res) => {
  try {
    console.log('📨 Received issue report:', req.body);
    console.log('📸 File received:', req.file);
    
    const { title, description, category_id, latitude, longitude, address, user_id } = req.body;
    
    // Handle photo URL - either from file upload or keep existing logic
    let photo_url = null;
    if (req.file) {
      photo_url = `/uploads/${req.file.filename}`;
    }

    // Validate required fields
    if (!title || !description || !category_id) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and category are required'
      });
    }

    console.log('📊 Inserting into database...');
    
    const result = await pool.query(
      `INSERT INTO issues (title, description, category_id, latitude, longitude, address, photo_url, user_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [title, description, category_id, latitude, longitude, address, photo_url, user_id || 1]
    );

    console.log('✅ Issue inserted successfully:', result.rows[0]);
    
    res.status(201).json({
      success: true,
      message: 'Issue reported successfully',
      issue: result.rows[0]
    });
  } catch (error) {
    console.error('❌ Error reporting issue:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all issues (public dashboard)
const getAllIssues = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.*, c.name as category_name, u.name as user_name 
      FROM issues i 
      LEFT JOIN categories c ON i.category_id = c.id 
      LEFT JOIN users u ON i.user_id = u.id 
      ORDER BY i.created_at DESC
    `);

    res.json({
      success: true,
      issues: result.rows
    });
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get issues by status (for admin)
const getIssuesByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const result = await pool.query(
      `SELECT i.*, c.name as category_name, u.name as user_name 
       FROM issues i 
       LEFT JOIN categories c ON i.category_id = c.id 
       LEFT JOIN users u ON i.user_id = u.id 
       WHERE i.status = $1 
       ORDER BY i.created_at DESC`,
      [status]
    );

    res.json({
      success: true,
      issues: result.rows
    });
  } catch (error) {
    console.error('Error fetching issues by status:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update issue status (admin)
const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // First get the current issue to know the old status
    const currentIssue = await pool.query(
      'SELECT * FROM issues WHERE id = $1',
      [id]
    );

    if (currentIssue.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    const oldStatus = currentIssue.rows[0].status;

    // Update the issue status
    const result = await pool.query(
      `UPDATE issues SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [status, id]
    );

    const updatedIssue = result.rows[0];

    // Send email notification (in background, don't wait for it)
    if (oldStatus !== status) {
      // For demo, we'll use a test email. In real app, get from user table
      const userEmail = 'test@city.com'; // This would come from users table
      
      sendStatusUpdateEmail(
        userEmail, 
        updatedIssue.title, 
        oldStatus, 
        status, 
        updatedIssue.id
      ).then(success => {
        if (success) {
          console.log(`📧 Email notification sent for issue #${updatedIssue.id}`);
        }
      });
    }

    res.json({
      success: true,
      message: 'Issue status updated successfully',
      issue: updatedIssue
    });
  } catch (error) {
    console.error('Error updating issue status:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  reportIssue,
  getAllIssues,
  getIssuesByStatus,
  updateIssueStatus
};