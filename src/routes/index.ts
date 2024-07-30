import { Router } from 'express';
import user from "./user";
import file from "./file";

const routes = Router();

routes.use('/user', user);
routes.use('/file', file);
// routes.get('/', (req, res) => {
//     res.send('Hello World');
// });

export default routes;