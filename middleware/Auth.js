const userModel = require('../model/userModel');
const bcrypt = require('bcrypt');

const checkSession = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/');
}

const isLogin = async(req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    const email = req.session.user;
    const users = await userModel.findOne({email});

    res.render('user/home',{users});
}

const wrong = (req, res) => {
    req.session.message = 'Invalid Credentials';
    res.redirect('/');
}


module.exports = {
    checkSession,
    isLogin,
    wrong
};