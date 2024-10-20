import { Application } from 'express';

import LoginRouter from './login';
import AuthRouter from './auth';
import APIRouter from './api';

const mountRouters = (app: Application) => {
    app.use(LoginRouter);
    app.use(AuthRouter);
    app.use(APIRouter);
}

export default mountRouters;