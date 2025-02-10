
const checkSession = (req, res, next) => {
    if (req.session.admin) {
        return next();
    }
    res.redirect('/admin');
}

const isLogin = (req, res, next) => {
    if (!req.session.admin) {
        return next(); 
    }
    res.redirect('/admin/dashboard');
}   

module.exports = {
    checkSession,
    isLogin
};