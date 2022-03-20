import express from 'express';
import registerUser from '../controllers/user.controller.js';

const routes = express.Router();

routes.post('/', registerUser);

export default routes;
