const path=require('path');
const fs = require('fs'); 
const { validationResult } = require('express-validator');
const db = require ('../database/models');


/* Logica para traer los productos */
let jsonProducts = fs.readFileSync(path.resolve(__dirname, '../data/products.json'), 'utf-8');
let products = JSON.parse(jsonProducts); //Convertimos el json a array

const nuevoId = () => {
    let ultimo = 0;
    products.forEach(product => {
        if (product.id > ultimo) {
            ultimo = product.id;
        }
    });
    return ultimo + 1;
}


let controller = {
    inventory:  (req,res)=> {
       db.Productos.findAll()
        .then(function(inventory){
            res.render('inventory',{inventory})
        })
       
        
    },      
    
    mostrarProductos:  (req,res)=> {
        db.Productos.findAll()
        .then(function(mostrar){
            res.render('inventory',{mostrar})
        })
     },
     decoracion:  (req,res)=> {
        db.Productos.findAll()
        .then(function(mostrar){
            res.render('products',{mostrar})
        })
        },
    usopersonal:  (req,res)=> {       
        db.Productos.findAll()
        .then(function(mostrar){
            res.render('products',{mostrar})
        })
        },
     muebles:  (req,res)=> {       
        db.Productos.findAll()
        .then(function(mostrar){
            res.render('products',{mostrar})
        })
            },
    
    viajes:  (req,res)=> {       
        db.Productos.findAll()
        .then(function(mostrar){
            res.render('products',{mostrar})
        })
        },

    detallar: function (req, res) { 
        let mostrarlo = db.Productos.findAll()
        let productos = db.Productos.findByPk(req.params.id, {
            include: [{association:"colors"},{association:"materials"},{association:"Country"}]
        })
        Promise.all([productos,mostrarlo])
         .then(function([product,mostrar]){console.log(product)
            res.render('detail', {product,mostrar});
         })
     
    },
    comprar: (req,res) => {
        res.render('cart');

    },
    create: (req,res) => {
        let categoria = db.Category.findAll()
        let color =db.Color.findAll()
        let country =db.Country.findAll()
        let material =db.Material.findAll()
        Promise.all([color,categoria,country,material])
            .then(function([color,categoria,country,material]){
               return res.render('createproduct',{Colors:color,Categoria:categoria,Country:country,Material:material});
               
            }).catch(error => console.log(error));
    },
    edit: (req,res) => {
        let pedidoproducto = db.Productos.findByPk(req.params.id)
        let categoria = db.Category.findAll()
        let color =db.Color.findAll()
        let country =db.Country.findAll()
        let material =db.Material.findAll()
            Promise.all([pedidoproducto,color,categoria,country,material])
                .then(function([product,color,categoria,country,material]){ 
                    res.render('editproduct', {product,color,categoria,country,material});
        
        }).catch(error => console.log(error));
        
    

    },

    update:(req,res) => {
        // Editamos el producto buscandolo con una condición
        let productoid = req.params.id
        db.Productos.update({
            name:req.body.name,
            description:req.body.description,
            measure: req.body.measurements,
            price:req.body.price,
            img:req.file.filename || 'img-default.jpeg',
            country_id:req.body.origin,
            material_id:req.body.material, 
            }, {
                where: {
                    id: productoid
                }
            })
            .then(function(productocreado){
                db.ProductColor.update({
                    color_id:req.body.color,
                    product_id:productoid
                },
                {
                    where: {
                        id: productoid
                            }
                })
                db.ProductCategory.update({
                    category_id:req.body.category,
                    product_id:productoid
                
            },
            {
                where: {
                    id: productoid
                        }
            }
            ).catch(error => console.log(error));          
            })
            
        res.redirect('/');


    
    },
    store (req, res) {
        const resultValidation = validationResult(req);console.log(resultValidation)
        if (resultValidation.errors.length > 0) {
            let categoria = db.Category.findAll()
            let color =db.Color.findAll()
            let country =db.Country.findAll()
            let material =db.Material.findAll()
                Promise.all([color,categoria,country,material])
                    .then(function([color,categoria,country,material]){
			            return res.render('createproduct', {
			            	errors: resultValidation.mapped(),
			            	oldData: req.body,
                            Colors:color,
                            Categoria:categoria,
                            Country:country,
                            Material:material
                        }).catch(error => console.log(error));
            });
		}
        
        db.Productos.create({
            name:req.body.name,
            description:req.body.description,
            measure: req.body.measurements,
            price:req.body.price,
            img:req.file.filename || 'img-default.jpeg',
            country_id:req.body.origin,
            material_id:req.body.material, 
            })
            .then(function(productocreado){
                db.ProductColor.create({
                    color_id:req.body.color,
                    product_id:productocreado.id
                })
                db.ProductCategory.create({
                    category_id:req.body.category,
                    product_id:productocreado.id
                
            }).catch(error => console.log(error));          
            })
            
            
        res.redirect('/');
    },

    delete (req, res) {

        db.Productos.destroy({
            where: {
                id:req.params.id
            }
        })

        
        db.Productos.findByPk(req.params.id)
            .then(function(borrarimagen){
                console.log(borrarimagen)})
        //fs.unlinkSync(path.resolve(__dirname,'../public/img/productos/'+borrarimagen.img)); // devuelve el nombre del archivo, me borra la imagen del producto

        

        res.redirect('/');
    }

};
module.exports = controller;