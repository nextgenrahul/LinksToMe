import 'dotenv/config';
import { App } from './app';

const PORT = process.env.PORT || 5000;
const server = new App(PORT);

const start = async () => {
    // Ensure DB and Routes are ready
    await server.bootstrap();
    
    // Start listening
    server.listen();
};

start();