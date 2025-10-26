const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1'
});

const ses = new AWS.SES();

const sendStatusUpdateEmail = async (toEmail, issueTitle, oldStatus, newStatus, issueId) => {
  // For demo purposes, we'll simulate email sending if AWS credentials aren't set
  if (!process.env.AWS_ACCESS_KEY_ID) {
    console.log(`📧 [SIMULATED] Email would be sent to ${toEmail}: Issue "${issueTitle}" updated from ${oldStatus} to ${newStatus}`);
    return true;
  }

  try {
    const params = {
      Destination: {
        ToAddresses: [toEmail]
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: #1976d2; color: white; padding: 20px; text-align: center; }
                  .content { padding: 20px; background: #f9f9f9; }
                  .status-update { background: white; padding: 15px; border-left: 4px solid #1976d2; margin: 10px 0; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>Improve My City</h1>
                    <p>Your issue status has been updated</p>
                  </div>
                  <div class="content">
                    <h2>Issue: ${issueTitle}</h2>
                    <div class="status-update">
                      <p><strong>Status Changed:</strong> ${oldStatus} → ${newStatus}</p>
                      <p><strong>Issue ID:</strong> #${issueId}</p>
                    </div>
                    <p>Thank you for helping improve our city!</p>
                    <p><a href="http://localhost:3000">View your issues</a></p>
                  </div>
                </div>
              </body>
              </html>
            `
          },
          Text: {
            Charset: 'UTF-8',
            Data: `Issue "${issueTitle}" status updated from ${oldStatus} to ${newStatus}. Issue ID: #${issueId}. Thank you for using Improve My City!`
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: `Issue Update: ${issueTitle} is now ${newStatus}`
        }
      },
      Source: process.env.SES_FROM_EMAIL || 'noreply@improve-my-city.com'
    };

    const result = await ses.sendEmail(params).promise();
    console.log('✅ Email sent successfully:', result.MessageId);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    // Don't fail the entire request if email fails
    return false;
  }
};

module.exports = {
  sendStatusUpdateEmail
};