import { check, validationResult } from "express-validator"
import multer from "multer"
import { vacantesDb } from "../config/db.js"
import { skills } from "../helpers/handlebars.js"
import uploadCv from "../src/middleware/uploadCv.js"

//Crear nueva vacante-------------------------------------------------------------------------
const formularioNuevaVacante = async (req,res) =>{
    res.render('nueva-vacante',{
        nombrePagina:'Nueva vacante',
        tagline:'Llena el formulario para publicar una nueva vacante',
        skills,
        usuario: req.user,
    })
}
const agregarVacante = async (req,res) =>{
    await check('titulo').notEmpty().withMessage('El titulo es obligatorio').run(req)
    await check('empresa').notEmpty().withMessage('La empresa es obligatoria').run(req)
    await check('ubicacion').notEmpty().withMessage('La ubicacion es obligatoria').run(req)

    let resultadoErrores = validationResult(req)

    if(!resultadoErrores.isEmpty()){
        return res.render('nueva-vacante',{
            nombrePagina:'Nueva vacante',
            tagline:'Llena el formulario para publicar una nueva vacante',
            skills,
            errores: resultadoErrores.array(),
            usuario: req.user,
            data:req.body
        })
    }

    const arraySkills = req.body.skills.split(',')
    const autorId = req.user._id
    const{titulo, empresa, ubicacion, salario, contrato, descripcion} = req.body
    const nuevaVacante = await vacantesDb.create({
        titulo,
        empresa,
        ubicacion,
        salario,
        contrato,
        descripcion,
        skills: arraySkills,
        autor: autorId
    })

    req.flash('message', 'La vacante fue publicada correctamente');

    res.redirect(`/vacantes/${nuevaVacante.url}`)

}

//Mostrar vacante-------------------------------------------------------------------------
const mostrarVacante = async (req,res,next) =>{
    const vacante = await vacantesDb.findOne({url:req.params.url}).populate('autor').lean()

    if(!vacante) return res.redirect('/404')
    
    const msg = req.flash('message')
    const err = req.flash('error')

    res.render('vacante',{
        nombrePagina:vacante.titulo,
        vacante,
        usuario: req.user,
        msg,
        err
    })
}

//Subir CV -----------------------------------------------------------------
const subirCV = async (req,res, next) => {
    
    uploadCv(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            if(err.code === 'LIMIT_FILE_SIZE'){
                req.flash('error', 'El archivo es muy grande: máximo 150KB');         
                return res.redirect('back')
            } else {
                    req.flash('error', `${err.message}`);   
                    return res.redirect('back')
                }
            } else if (err) {
                // An unknown error occurred when uploading.
                req.flash('error', `${err.message}`); 

                return res.redirect('back')


        }
        // Everything went fine.
        next()
    })
}

//Contactar ---------------------------------------------------------------
const contactar = async (req,res) => {
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacio').run(req)
    await check('email').notEmpty().withMessage('El email no puede ir vacio').run(req)

    let resultadoErrores = validationResult(req)
    
    const vacante = await vacantesDb.findOne({url:req.params.url})
    if(!vacante) return res.redirect('/404')

    if(!resultadoErrores.isEmpty()){
        let errores = resultadoErrores.array()
        errores.forEach(err => {
            req.flash('error', `${err.msg}`);
        })
        return res.redirect('back')

    }

    const nuevoCandidato = {
        nombre: req.body.nombre,
        email:req.body.email,
        cv:req.file.filename
    }


    vacante.candidatos.push(nuevoCandidato)
    await vacante.save()

    req.flash('message', 'Mensaje enviado correctamente');
    res.redirect('/')

}

//Mostrar candidatos de una vacante ---------------------------------------------------
const mostrarCandidatos = async (req,res) => {
    const vacante = await vacantesDb.findById(req.params.id).lean()
    if(!vacante) return res.redirect('/404')
    
    const usuarioId = req.user._id
    if(vacante.autor.toString() != usuarioId.toString()) return res.redirect('/404')

    res.render('candidatos',{
        nombrePagina: `Candidatos ${vacante.titulo}`,
        usuario: req.user,
        nombre:req.user.nombre,
        candidatos:vacante.candidatos
    })
    
}

//Editar vacante-------------------------------------------------------------------------
const formularioEditarVacante = async (req,res,next) => {
    const vacante = await vacantesDb.findOne({url:req.params.url}).lean()
    if(!vacante) return res.redirect('/404')

    res.render('editar-vacante',{
        nombrePagina:`Editar ${vacante.titulo}`,
        vacante,
        skills,
        usuario: req.user,
    })

}
const editarVacante = async (req,res) =>{
    await check('titulo').notEmpty().withMessage('El titulo es obligatorio').run(req)
    await check('empresa').notEmpty().withMessage('La empresa es obligatoria').run(req)
    await check('ubicacion').notEmpty().withMessage('La ubicacion es obligatoria').run(req)

    let resultadoErrores = validationResult(req)

    if(!resultadoErrores.isEmpty()){
        return res.render('nueva-vacante',{
            nombrePagina:'Nueva vacante',
            tagline:'Llena el formulario para publicar una nueva vacante',
            skills,
            errores: resultadoErrores.array(),
            usuario: req.user,
            data:req.body
        })
    }

    const vacante = await vacantesDb.findOne({url:req.params.url})
    const arraySkills = req.body.skills.split(',')
    const{titulo, empresa, ubicacion, salario, contrato, descripcion} = req.body
    const datosActualizados = {
        titulo, 
        empresa, 
        ubicacion, 
        salario, 
        contrato, 
        descripcion,
        skills: arraySkills
    }

    await vacantesDb.findOneAndUpdate({url:req.params.url}, datosActualizados)

    req.flash('message', 'Cambios guardados correctamente');

    res.redirect(`/vacantes/${vacante.url}`)

}

//Eliminar vacante ---------------------------------------------------------------------------
const eliminarVacante = async (req,res) => {
    const { id } = req.params;
    const vacante = await vacantesDb.findById(id)
    
    if(vacante.autor.equals(req.user._id)){
        vacante.deleteOne()
        res.status(200).send('Vacante eliminada correctamente')
    }else{
        res.status(403).send('Error')
    }
    
}

//Exports--------------------------------------------
export{
    formularioNuevaVacante,
    agregarVacante,
    mostrarVacante,
    subirCV,
    contactar,
    mostrarCandidatos,
    formularioEditarVacante,
    editarVacante,
    eliminarVacante,

}