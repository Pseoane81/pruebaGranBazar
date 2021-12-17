//ESTE LO DEJE APARTE PORQUE UNA VEZ QUE LO PONGAMOS DESDE LA DB CREO QUE YA NO SE USA


const fs = require("fs");
const path=require('path');


//Modelo de usuario
const user = {
    fileName: path.resolve(__dirname,"../data/users.json"),
    //fileName: "./data/users.json", // A Pablo le funciona con esta linea
    //fileName: "./src//data/users.json", // A Elena/Melina le funciona con esta linea
    // Tenemos que ver este tema

    getdata: function () { //toda la info del json
        return JSON.parse(fs.readFileSync(this.fileName, "utf-8"));
    },

    generateId: function () { // generas el id
        let allUsers = this.findAll();
        let lastUser = allUsers.pop();
        if(lastUser) {
        return lastUser.id + 1;
        }
        return 1;
    },

    findAll: function () { // buscas toda la info
        return this.getdata();
    },

    findByPk: function (id) { // buscas el user por pk
        let allUsers = this.findAll(); //trae todos los user
        let userFound = allUsers.find(oseUser => oseUser.id == id); //se trae el user x id
        return userFound;
    },

    findByField: function (field, text) {
        let allUsers = this.findAll();
        let userFound = allUsers.find(oseUser => oseUser[field] == text);
        return userFound;
    },

    create: function (userdata) {
        let allUsers = this.findAll();
        let newUser = {
            id: this.generateId(),
            ...userdata
        }
        allUsers.push(newUser);
        fs.writeFileSync(this.fileName, JSON.stringify(allUsers, null, " "));
        return newUser;
    },

    delete: function (req,userdata) {
        let allUsers = this.findAll();
        let finalUsers = allUsers.filter( oneUser => oneUser.id !== req.id);

        let borrarimagen = allUsers.filter(user => {
            return user.id == req.id; // me guarda la info del producto a borrar
        })
        
        
        fs.unlinkSync(path.resolve(__dirname,'../../public/img/avatars/'+borrarimagen[0].avatar)); // devuelve el nombre del archivo, me borra la imagen del producto
        fs.writeFileSync(this.fileName, JSON.stringify(finalUsers, null, " "));
        return true;
    },
    change: function(req,userdata) {
        let allUsers = this.findAll();
        allUsers.forEach(user => {
            if(user.id == req.params.id){
                user.name = userdata.name;
                user.lastname = userdata.lastname;
                user.dob = userdata.dob;
                user.avatar = userdata.avatar == undefined ? 'img-default.jpeg' : userdata.avatar;
                user.password =  userdata.password
               }
        })
        fs.writeFileSync(this.fileName, JSON.stringify(allUsers, null, " "));
        
    }
}
//console.log(user.create({name: "pepe", lastname: "jose", email: "a@s.com" }))
//console.log(user.delete(4))
module.exports = user;


