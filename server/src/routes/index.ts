import { Application } from 'express';

import LoginRouter from './login';
import AuthRouter from './auth';
import APIRouter1 from './api_folders';
import APIRouter2 from './api_images';

const mountRouters = (app: Application) => {
    app.use(LoginRouter);
    app.use(AuthRouter);
    app.use(APIRouter1);
    app.use(APIRouter2);
}

export default mountRouters;