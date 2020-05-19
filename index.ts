import http from 'http';
import { config } from 'dotenv';
import { resolve } from 'path';
import cron from 'node-cron';
import mongoose from 'mongoose';

config({ path: resolve(__dirname, '../.env') });

mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true });

import app from './app';
import { updateServicesDataInAllSongs } from './helpers/jobs';

const port = process.env.PORT || 3000;
app.set('port', port);

const server = http.createServer(app);

// run every day at 02:00 AM
cron.schedule('0 2 * * *', async () => {
  // tslint:disable no-console
  console.log('Running services data update job...');
  await updateServicesDataInAllSongs();
  console.log('Update job finished');
  // tslint:enable no-console
});

server.listen(port);

process.on('SIGINT', () => {
  mongoose.connection.close();
  process.exit();
});
