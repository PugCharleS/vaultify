import express from 'express';
import v1Routes from '../routes/v1/index.js';

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(express.json());
    }

    routes() {
        this.app.use('/api/v1', v1Routes);
    }

    start() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

export default Server;
