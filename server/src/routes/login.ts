import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post("/login", (req, res) => {
    console.log(req.body)
    if (!req.body || !req.body.username || !req.body.password) {
        res.status(200).json({
            status: "failed",
            message: "Please Enter a valid username and password"
        });
        return;
    }
    if (req.body.username !== process.env.ac_USERNAME || req.body.password !== process.env.ac_PASSWORD) {
        res.status(200).json({
            status: "failed",
            message: "Incorrect Username or Password"
        });
        return;
    }

    const token = jwt.sign({
        logged_in: true,
    }, process.env.SECRET);
    res.cookie("jwt", token);

    res.status(200).json({
        status: "Success",
        message: "Logging you in..."
    });
});

export default router;