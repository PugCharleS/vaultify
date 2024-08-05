import express from 'express';
import v1Routes from '../routes/v1/index.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.set('trust proxy', 1);

        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(helmet({
            contentSecurityPolicy: {
                useDefaults: true,
                directives: {
                    "default-src": ["'self'"],
                    "script-src": ["'self'", "trustedscripts.com"],
                    "object-src": ["'none'"],
                    "upgrade-insecure-requests": []
                }
            },
            referrerPolicy: { policy: "no-referrer" },
        }));

        // const loginLimiter = rateLimit({
        //     windowMs: 15 * 60 * 1000,
        //     max: 10,
        //     message: 'Too many login attempts from this IP, please try again after 15 minutes'
        // });

        this.app.use('/api/v1/auth/login', loginLimiter);
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
