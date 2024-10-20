import { Application } from 'express';

import LoginRouter from './login';
import AuthRouter from './auth';

const mountRouters = (app: Application) => {
    app.use(LoginRouter);
    app.use(AuthRouter);
}

export default mountRouters;