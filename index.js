import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import taskList from './server/api/task-list';
import mongoose from 'mongoose';
import proxy from 'express-http-proxy';

const server = express();
server.disable('x-powered-by');
server.use('/', express.static(path.join('.', 'static')));
if (process.env.NODE_ENV !== 'production') {
  server.use('/build', proxy('localhost:5002'));
} else {
  server.use('/build', express.static(path.join('.', 'build')));
}

server.use(bodyParser.json());
server.use('/api/task-list', taskList);

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/tasklist", (err) => {
  if (err) {
    console.error('failed to connect to the database', err);
  } else {
    server.listen(5001, (err) => {
      console.info('Express server listening on port', 5001);
    });
  }
});
