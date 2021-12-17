//const path=require('path');
const {validationResult, body}=require('express-validator');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const User = require("../models/user")
const db = require ('../database/models') // creo q esta ruta pisaria a la de arriba a la hora de quitar el CRUD con JSON

//let users = fs.readFileSync(path.resolve(__dirname, '../data/users.json'), { encoding: 'utf-8'});
//users = JSON.parse(users);

/*const iduser = () => {
    let ultimo = 0;
    users.forEach(user => {
        if (user.id > ultimo) {
            ultimo = user.id;
        }
    });
    return ultimo + 1;
}*/

module.exports = {
    register:  (req,res)=> {
        
        res.render('register')
        
    },
    processRegister:(req,res)=>{
        const resultValidation=validationResult(req)
           
    
         if(resultValidation.errors.length > 0){
            res.render('register',{
                errors:resultValidation.mapped(),
                oldData:req.body
            });
         }
         
         let userInDB = User.findByField("email", req.body.email);

         if (userInDB) {
            return res.render("register", {
                errors: {
                    email: {
                    msg: "Este EMAIL ya esta registrado"
                        }
            },
            oldData:req.body
            });            
         }

         let userToCreate = { //crea el usuario
             ...req.body,
             avatar : req.file.filename,
             password: bcrypt.hashSync(req.body.password, 12)
         }
         delete userToCreate.repassword;
         let userCreated = User.create(userToCreate)
         
         return res.redirect("login")
         
         /*else {
            const user = {
                id:iduser(),
                ...req.body,
                password: bcrypt.hashSync(req.body.password, 12),
                avatar: req.file.filename
            }
            delete user.repassword;

            
            users.push(user);

            let jsonDeUsuarios = JSON.stringify(users, null, 4);
            fs.writeFileSync(path.resolve(__dirname, '../data/users.json'), jsonDeUsuarios);
            return res.redirect('/users/login');
        }*/
        },

    login: (req,res) => {
        return res.render('login');

    }, 

    logged: (req,res) => {
            
        let userToLogin = User.findByField("email", req.body.email)
        
        if (userToLogin) {
            let isokpassword = bcrypt.compareSync(req.body.password, userToLogin.password)
            if (isokpassword) {
                delete userToLogin.password;
                req.session.userLogged = userToLogin;
                if(req.body.recordame){
                    res.cookie("email", req.body.email, {maxAge: (1000 * 60)*200})
                }
                return res.redirect("/")
            }
            return res.render("login", {
                errors: {
                    email: {
                    msg: "Datos Erroneos"
                        }
            },
            });    
        };

        return res.render("login", {
            errors: {
                email: {
                msg: "No se encuentra este usuario registrado"
                    }
        },
        });            
     
         
        
        
        /*users.forEach(user => {
            if(user.email == req.body.email && bcrypt.compareSync(req.body.password, user.password)) {
                req.session=user.email;
                req.locals.user=user;
            } 

        });
       res.redirect('/');*/
    },

    userProfile: (req,res) => { 
        
        return res.render('userprofile', {
            user: req.session.userLogged,
        });
    
    },

    logout: (req,res) => {
        res.clearCookie("email")
        req.session.destroy();
        res.redirect("/")
    },
    editProfile: (req,res) => { 
        
        return res.render('editprofile', {
            user: req.session.userLogged,
        });
    
    },
    savechangesprofile: (req,res) => { 
        
        const resultValidation=validationResult(req)
           
    
         if(resultValidation.errors.length > 0){
            res.render('editprofile',{
                errors:resultValidation.mapped(),
                oldData:req.body
            });
         }
         
         let userToChange = { 
             ...req.body,
             avatar : req.file.filename,
             password: bcrypt.hashSync(req.body.password, 12)
         }
         delete userToChange.repassword;
         User.change(req,userToChange)
         
         res.clearCookie("email")
         req.session.destroy();
          res.redirect("/users/login")
        },
        delete: (req,res) => {
            let userInDB = User.findByField("id", req.params.id);
            console.log
            if (userInDB){
                User.delete(userInDB);  
            }
            res.clearCookie("email")
            req.session.destroy();
            res.redirect("/users/register")
        }

 }



