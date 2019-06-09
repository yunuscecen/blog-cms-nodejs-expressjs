module.exports = {
    isAuthenticated : (req,res,next) => {
        if(req.isAuthenticated()){
            next();
        }else {
            res.redirect('/login');
        }
    },
    isAdmin : (req,res,next) => {
        if(req.user.isAdmin === true){
            next();
        }else {
            res.redirect("/admin");
        }
    },
    isLoggedIn : (req,res,next) => {
        if(req.user){
            res.redirect("/");
        }else {
            next();
        }
    }
}