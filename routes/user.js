const express = require('express');
const routes = express.Router();
const userController = require('../controller/userController');
const auth = require('../middleware/Auth.js');

routes.get('/', auth.isLogin, userController.loadlogin);
routes.get('/user/:message', auth.isLogin, userController.loadlogin);
routes.get('/wrongUser',auth.isLogin , userController.wrongUser)
routes.post('/wrongUser',auth.isLogin , userController.wrongUser)
routes.get('/login', auth.isLogin, userController.loadlogin);
routes.post('/login', auth.isUser, userController.login);
routes.post('/signUp', userController.registerUser);
routes.get('/signUp',auth.isLogin,userController.login);
routes.get('/home/:email', auth.checkSession, userController.loadHome);
routes.get('/logout', auth.checkSession, userController.logout);

module.exports = routes;