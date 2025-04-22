import cron from 'node-cron';
import https from 'https';

const pingServer = () => {
  https
    .get('https://foodigo.onrender.com/api', (res) => {
      console.log('Ping status:', res.statusCode);
      res.on('data', (d) => {
        process.stdout.write(d);
      });
    })
    .on('error', (err) => {
      console.error('Ping failed:', err.message);
    });
};

// Run every 14 minutes
const job = cron.schedule('*/14 * * * *', () => {
  console.log('Cron job running:', new Date().toISOString());
  pingServer();
});

// Start the cron job
job.start();

export default job;
