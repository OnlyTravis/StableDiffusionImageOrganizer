import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.get("/is_loggedIn", (req, res) => {
    if (!req.cookies || !req.cookies.jwt) {
        res.status(200).json({ logged_in: false });
        return;
    }

    jwt.verify(req.cookies.jwt, process.env.SECRET, (err, decoded) => {
        if (err || !decoded) {
            res.status(200).json({ logged_in: false });
            return;
        }

        res.status(200).json({ logged_in: true });
    });
})
router.all("/*", (req, res, next) => {
    if (!req.cookies || !req.cookies.jwt) {
        res.status(401).send("No Peeking");
        return;
    }

    jwt.verify(req.cookies.jwt, process.env.SECRET, (err, decoded) => {
        if (err || !decoded) {
            res.status(401).send("No Peeking");
            return;
        }

        next();
    });
});

export default router;