import multer from "multer"
import { check, validationResult } from "express-validator"
import { userDb } from "../config/db.js"
import uploadImg from "../src/middleware/uploadImg.js"

//Editar perfil ------------------------------------------------------------    
const formEditarPerfil = (req,res) => {
    const email = req.user.email
    const nombre = req.user.nombre

    const err = req.flash('error')

    res.render('editar-perfil',{
        nombrePagina:'Edita tu perfil',
        email,
        nombre,
        usuario: req.user,
        err

    })
}
const editarPerfil = async (req,res) => {
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacio').run(req)
    await check('email').notEmpty().withMessage('El email no puede ir vacio').run(req)

    let resultadoErrores = validationResult(req)

    const usuario = await userDb.findById(req.user._id)
    const{nombre, email, password} = req.body
    
    if(!resultadoErrores.isEmpty()){
        return res.render('editar-perfil',{
            nombrePagina:'Edita tu perfil',
            email,
            nombre,
            usuario: req.user,
            errores:resultadoErrores.array()
        })
    }

    usuario.nombre = nombre
    usuario.email = email
    if(password){
        usuario.password = password
    }
    if(req.file){
        usuario.imagen = req.file.filename
    }

    await usuario.save()

    req.flash('message', 'Cambios guardados correctamente');
    
    res.redirect('/administracion',)
}

// //Subir imagen ----------------------------------------------------------------
const subirImagen = (req,res, next) => {

    uploadImg(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            if(err.code === 'LIMIT_FILE_SIZE'){
                req.flash('error', 'El archivo es muy grande: máximo 100KB');         
                return res.redirect('back')    

            } else {
                const email = req.user.email
                const nombre = req.user.nombre
                return res.render('editar-perfil',{
                    nombrePagina:'Edita tu perfil',
                    email,
                    nombre,
                    usuario: req.user,
                    errores:[{msg: err.message}]
                })        
            }
        } else if (err) {
            // An unknown error occurred when uploading.
            const email = req.user.email
            const nombre = req.user.nombre
            return res.render('editar-perfil',{
                nombrePagina:'Edita tu perfil',
                email,
                nombre,
                usuario: req.user,
                errores:[{msg: err.message}]
            })            
        }
        // Everything went fine.
        next()
    })
}

export{
    formEditarPerfil,
    editarPerfil,
    subirImagen
}