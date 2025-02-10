const userModel = require('../model/userModel');
const bcrypt = require('bcrypt');

const checkSession = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.redirect('/');
}

const isLogin = (req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    res.redirect('/home');
}   

const isUser = async (req,res,next) => {
      const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        console.log(user);
        if (!user)
             return res.status(400).redirect('/user/wrongUser');
        console.log(user);
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch);
        if (!isMatch) 
            return res.status(400).redirect('/user/wrongUser');
        
        req.session.user = true ; 
        next()
}
module.exports = {
    checkSession,
    isLogin,
    isUser,
};