const express = require('express');
const routes = express.Router();
const userController = require('../controller/userController');
const auth = require('../middleware/Auth.js');

//Get Methods
routes.get('/', auth.isLogin, userController.loadlogin);
routes.get('/user', auth.isLogin, userController.loadlogin);
routes.get('/wrongUser',auth.wrong , userController.wrongUser)
routes.get('/login', auth.isLogin, userController.loadlogin);
routes.get('/home', auth.isLogin, userController.loadHome);
routes.get('/logout', auth.checkSession, userController.logout);
routes.get('/forget',userController.loadForget);
routes.get('/cancel',userController.cancel);
//Post Methods
routes.post('/login', userController.login);
routes.post('/signUp', userController.registerUser);
routes.post('/forgetPass', userController.forget)


module.exports = routes;

