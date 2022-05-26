import { createServer as createHttpServer } from 'http';
import config from './config';
import app from './app';

export const { httpServer } = (() => {
  const PORT = config.app.port;

  const httpServer = createHttpServer();

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

  // Starts the HTTP server listening for connections
  httpServer.listen(PORT);

  return { httpServer };
})();

export default httpServer;
