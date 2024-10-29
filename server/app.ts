import express from 'express';
import Config from './utils/config';
import next from 'next';

// Set up handlers
const dev = process.env.NODE_ENV !== "production";
const nextApplication = next({ dev });
const nextHandler = nextApplication.getRequestHandler();

// Set up the express server
const server = express();
server.use(express.urlencoded());
server.use(express.json());

/** The main application */ 
const main = () => {

    try {
        // Prepare Nextjs
        nextApplication.prepare();

        // Configure express to pass all request to the Nextjs handler
        server.all('*', (request: express.Request, response: express.Response) => {
            return nextHandler(request, response);
        });

        // Listen for requests
        server.listen(Config.port, () => {
            console.log(`Application listening on port ${Config.port}`);
        });
    }

    catch (error) {
        console.error(error);
        process.exit(1);
    }

};

main();