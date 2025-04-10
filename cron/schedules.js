import cron from 'node-cron';
import resetVentLimits from '../routes/resetVentLimits.js';
import checkVents from '../routes/checkVentsCronJob.js';
// Function to initialize all cron jobs
export const initializeCronJobs = () => {
  // Reset vent limits daily at midnight
  cron.schedule('0 0 * * *', () => {
    console.log('Running daily vent limits reset...');
    resetVentLimits();
  });
  console.log('Cron jobs initialized');
}; 

// Function to initialize all cron jobs
export const HourlyVentCheckCronJob = () => {
  // Reset vent limits daily at midnight
  cron.schedule('0 * * * *', () => {
    console.log('Running hourly vent check...');
    checkVents();
  });
  console.log('Cron jobs initialized');
}; 

