import { Router } from 'express';
import user from "./user";

const routes = Router();
routes.use('/user', user);
routes.get('/', (req, res) => {
    res.send('Hello World');
});

export default routes;