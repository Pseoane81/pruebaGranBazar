const User = require("../models/user");

function userloggedmiddleware(req,res,next){
    res.locals.islogged = false
    
    let emailincookie = req.cookies.email;
    let userfromcookie = User.findByField("email",emailincookie);
    
    if(userfromcookie) {
        req.session.userLogged = userfromcookie
    }
    
    if (req.session && req.session.userLogged) {
        res.locals.isLogged = true
        res.locals.userLogged = req.session.userLogged
    }

    next()
}

module.exports = userloggedmiddleware