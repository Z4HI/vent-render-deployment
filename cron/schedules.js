import cron from 'node-cron';
import resetVentLimits from '../routes/resetVentLimits.js';
import checkVents from '../routes/checkVentsCronJob.js';
import getQOD from '../routes/getQOD.js';
import resetDailyLikes from '../routes/resetDailyLikes.js';

// Function to initialize all cron jobs
export const initializeCronJobs = () => {
  // Reset vent limits and likes daily at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily reset tasks...');
    try {
      await Promise.all([
        resetVentLimits(),
        getQOD(),
        resetDailyLikes()
      ]);
      console.log('Daily reset tasks completed successfully');
    } catch (error) {
      console.error('Error in daily reset tasks:', error);
    }
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

