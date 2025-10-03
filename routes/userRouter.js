import express from 'express';
const route = express.Router();
import userController  from '../controllers/user.js';

route.post('/register',userController.register);
route.post('/login',userController.login);
// route.get('/');
// route.put('/');
// route.delete('/');

export default route