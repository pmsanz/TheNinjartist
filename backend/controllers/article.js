'use strict'

var validator = require('validator');
var Articles = require('../models/articles');
var fs = require('fs');
var path = require('path');

var controller = {

    testGet: (req,res) => {

        return res.status(200).send({message: 'soy la accion Get test de tu controlador article'});

    },

    testPost: (req,res) => {

        return res.status(200).send({message: 'soy la accion Post test de tu controlador article'});

    },

    save: (req,res) => {

        var params = req.body;
       /*  console.log(params);
        return res.status(200).send(params); */
      
        try {

            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            if(validate_title && validate_content)
              {
                    var article = new Articles();
                    article.title = params.title;
                    article.content = params.content;
                    article.image = null;

                   article.save((err,articleSaved)=>{

                    if(err || !articleSaved){

                        return res.status(200).send({message: 'Error al querer guardar articulo'});
                    }else{
                        return res.status(200).send({message:'el articulo se guardo correctamente' , articuloGuardado: articleSaved});

                    }

                   });
              }
            else
                throw new Excepcion();

        } catch (error) {
            
            return res.status(200).send({message: 'Faltan datos por enviar'});
        }


        
    },
    getArticles:(req,res) =>{

        var params = req.body;
        var query = Articles.find({});

        var last = !validator.isEmpty(params.last);

        if(last){
            query = query.limit(4);

        }

        query.sort('-_id').exec((err,objs)=>{

            if(err)
                return res.status(200).send({status:'Error al querer buscar articulos en la BD.',
                    message: 'Existe un error al querer obtener los articulos'});
            else{
                return res.status(200).send(objs);
                }

        });
    },
    getArticle:(req,res) =>{

        var params = req.body;
        var query = Articles.find({});

        var id = params.id;
        console.log(id);
       if(!validator.isEmpty(id)){

        Articles.findById(id,(err, article)=>{

            if(!err){

                return res.status(200).send(article);

            }
            else 
                return res.status(200).send({status:'Error al querer buscar articulo con id:' + id,
            message: 'Existe un error al querer obtener los articulos'});

        });

       }
    },
    update:(req,res) =>{

      /*   return res.status(200).send({status:'ok datos: ', params: req.params, body:req.body,
        message: 'Existe un error al querer obtener los articulos'}); */
        
        var parameters = req.body;
        var id = req.params.id;
      
        console.log(parameters);
        var datosValidos = !validator.isEmpty(id) && !validator.isEmpty(parameters.title) && !validator.isEmpty(parameters.content);

        
        console.log(id);
        console.log(datosValidos);
       
          
                if(datosValidos)
                {
                    Articles.findOneAndUpdate({_id: id},parameters,{new:true},(err,articleUpdate)=>{

                        if(!err){

                            return res.status(200).send(articleUpdate);

                        }else
                        {
                            return res.status(500).send({status:'Error al querer actualizar',
                            message: err});

                        }

                    });
                }
               //validar datos

      

       

    },
    delete:(req,res) => {
                    
        var id = req.params.id;
       

        Articles.findOneAndDelete({'_id':id},(err,articleDeleted)=>{

            if(!err){
            
            if(articleDeleted)
                return res.status(200).send({
                    status:'Se elimino el articulo :' , articleDeleted: articleDeleted});
            else
                return res.status(200).send({
                    status:'No existe elemento ', Elemento:id});
            
            }else
            return res.status(200).send({
                status:'Error ! al querer eliminar articulo:' + id});

        });


        

    }, upload:(req,res)=>{

      
        var image_name = 'sin-imagen...';
        console.log(req.files);

if(!req.files){

    return res.status(404).send({
        status: 'error', message: 'image_file' });

}else{
        //obtengo nombre del archivo
        var file_fullname = req.files.image.path;
        //console.log({file:file_fullname});
        var file_name = file_fullname.split('/')[2];

        //console.log({nombre:file_fullname});
        var extension_name = file_name.split('.');
        //console.log({extension1:extension_name});
        extension_name = extension_name[1];
        //console.log({extension2:extension_name});
        if(extension_name != 'jpg' && extension_name != 'jpge' && extension_name != 'bmp' && extension_name != 'png')
        {
            console.log('formato invalido');
            console.log({Name:file_name});
            //borro el archivo si no es de ninguna de estas extensiones.
            fs.unlink(file_fullname,(err)=>{

                if(err)
                    return res.status(500).send({
                        message: 'Error al querer eliminar archivo' });
              

                

            });

            return res.status(500).send({
                message: 'El archivo subido no es de un formato  valido' });

        }
        else{
                //Si todo sale bien actualizo imagen articulo

                var article_id = req.params.id;
                console.log({id: article_id});
            Articles.findOneAndUpdate({'_id':article_id},{image:file_name},{new:true},(err,ArticleUpdated)=>{

                if(err){

                return res.status(200).send({
                    message: 'Error al querer actualizar Imagen' });

                }else{

                    return res.status(200).send({
                        message: 'Se actualiza nombre de la imagen corrrectamente',articleImageUpdated:ArticleUpdated});

                }

                

            });
            

        }

        }

    },getImage:(req,res) => {
        
        var imageName = req.params.image;
        var pathImagen = './upload/articles/'+imageName;
        console.log(pathImagen);
        fs.exists(pathImagen,(exist)=>{
            console.log(exist);
            if(exist){
                return res.sendFile(path.resolve(pathImagen));
            }
            else{
                return res.status(404).send({message:'la imagen no existe'});
            }

        })


    }
    ,search:(req,res) => {
        
        var searchString = req.params.search;
        console.log(searchString);
        Articles.find({ "$or":[
            {"title": {"$regex":searchString, "$options":"i"}},
            {"content": {"$regex":searchString, "$options":"i"}}
        ]})
        .sort([['date','descending']])
        .exec((error,articles)=>{

            if(error)
                return res.status(500).send({message:'Consulta Correcta',articles:articles});

            if(!error && !articles)
                return res.status(200).send({message:'Consulta Correcta',articles:'no hay articles'});
            //si esta todo ok
            return res.status(200).send({message:'Consulta Correcta',articles});
           
        });

        
    }

}

module.exports = controller;