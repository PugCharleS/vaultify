import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

export const verifyAppsmithSignature = (req, res, next) => {
    const signature = req.headers['x-appsmith-signature'];
    const sessionKey = process.env.APPSMITH_SESSION_KEY;

    if (!signature) {
        return res.status(401).json({ message: 'Appsmith signature missing' });
    }

    try {
        jwt.verify(signature, sessionKey);
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid Appsmith signature', error });
    }
};

export const combinedAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const userToken = authHeader && authHeader.split(' ')[1];
    const appsmithSignature = req.headers['x-appsmith-signature'];
    const sessionKey = process.env.APPSMITH_SESSION_KEY;

    if (!userToken || !appsmithSignature) {
        return res.status(401).json({ message: 'Missing authentication' });
    }

    jwt.verify(userToken, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid JWT', err });
        }
        req.user = user;

        try {
            jwt.verify(appsmithSignature, sessionKey);
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Invalid Appsmith signature', error });
        }
    });
};
