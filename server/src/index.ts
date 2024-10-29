import cookieParser from 'cookie-parser';
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

import mountRouter from './routes';

dotenv.config();

const App = express();
App.use(express.json());
App.use(cookieParser());
App.use(express.static(path.join(__dirname, '../build')));

App.get(["/", "/login"], (req, res) => {
    res.sendFile(path.join(__dirname, "../build/index.html"));
    return;
});
mountRouter(App);

App.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "../build/index.html"));
    return;
});

App.listen(process.env.PORT, () => {
    console.log(`Webserver is opened on port ${process.env.PORT}`);
});