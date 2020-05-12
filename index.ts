import http from 'http';
import { config } from 'dotenv';
import { resolve } from 'path';
import cron from 'node-cron';

config({ path: resolve(__dirname, '../.env') });

import app from './app';
import { updateServicesDataInAllSongs } from './helpers/jobs';

const port = process.env.PORT || 3000;
app.set('port', port);

const server = http.createServer(app);

// run every month on 1st at 01:00 AM
cron.schedule('0 1 1 * *', async () => {
  // tslint:disable no-console
  console.log('Running services data update job...');
  await updateServicesDataInAllSongs();
  console.log('Update job finished');
  // tslint:enable no-console
});

server.listen(port);
