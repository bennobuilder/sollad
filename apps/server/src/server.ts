import { createServer as createHttpServer } from 'http';
import config from './config';
import app from './app';
import { connectDB } from './db';

(async () => {
  const PORT = config.app.port;
  const httpServer = createHttpServer();

  // Connect to Database
  await connectDB();

  // Assign express as request listeners
  app.set('port', PORT);
  httpServer.on('request', app);

  // Emitted when an error occurs
  // https://nodejs.org/api/net.html#event-error
  httpServer.on('error', (error) => {
    throw error;
  });

  // Emitted when the server has been bound after calling server.listen()
  // https://nodejs.org/api/net.html#net_event_listening
  httpServer.on('listening', () => {
    console.log(`Running on Port: ${PORT}`);
  });

  // Start HTTP server and listen for connections to the specified PORT
  httpServer.listen(PORT);
})();
