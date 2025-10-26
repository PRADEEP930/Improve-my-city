# Deployment Guide

## AWS Deployment Steps

### Backend (Elastic Beanstalk)
1. Create Elastic Beanstalk environment
2. Set environment variables in AWS console
3. Deploy backend code

### Frontend (S3 + CloudFront)
1. Build: `npm run build`
2. Upload to S3 bucket
3. Configure CloudFront distribution

### Database (RDS)
1. Create PostgreSQL RDS instance
2. Update connection string

### Environment Variables Needed:


DB_HOST=your-rds-endpoint
DB_USER=your-username
DB_PASSWORD=your-password
DB_NAME=improve_my_city
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=us-east-1



## Local Development
- Backend: `npm run dev` (port 5000)
- Frontend: `npm run dev` (port 3000)