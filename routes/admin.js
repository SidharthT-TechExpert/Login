const express = require('express');
const routes = express.Router();
const AdminController = require('../controller/adminController.js');
const adminAuth = require('../middleware/adminAuth.js');

routes.get('/', adminAuth.isLogin, AdminController.loadLogin);   
routes.post('/login', adminAuth.isLogin, AdminController.login);
routes.get('/login', adminAuth.isLogin, AdminController.login);
routes.get('/dashboard', adminAuth.checkSession, AdminController.loadDashboard);
routes.get('/logout', adminAuth.checkSession, AdminController.logout);
routes.post('/edit-user', adminAuth.checkSession, AdminController.editUser);
routes.post('/add-user', adminAuth.checkSession, AdminController.addUser);
routes.get('/delete-user/:id', adminAuth.checkSession, AdminController.deleteUser);
routes.post('/search-user', adminAuth.checkSession, AdminController.searchUser);

module.exports = routes; 