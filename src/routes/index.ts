import { Router } from 'express';
import user from "./user";
import filter from "./filter";
import file from "./file";

const routes = Router();

routes.use('/user', user);
routes.use('/file', file);
routes.use('/filter', filter);
// routes.get('/', (req, res) => {
//     res.send('Hello World');
// });

export default routes;