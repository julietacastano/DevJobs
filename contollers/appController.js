import { vacantesDb } from "../config/db.js"

//Mostrar trabajos -------------------------------------------------------------------
const mostrarTrabajos = async (req,res, next) => {

    const vacantes = await vacantesDb.find().lean()

    if(!vacantes) return res.redirect('/404')

    const msg = req.flash('message')


    res.render('home',{
        nombrePagina:'devJobs',
        tagline:'Encuentra y publica trabajos para desarrolladores web',
        boton:true,
        buscador:true,
        usuario: req.user,
        vacantes,
        msg
    })
}

//Panel de administracion
const panelAdmin = async (req,res) => {
    //Encontrar usuario identificado
    const vacantesPosted = await vacantesDb.find({autor:req.user._id}).lean()

    const msg = req.flash('message')
    
    res.render('administracion',{
        nombrePagina:'Panel de administración',
        tagline:'Crea y administra tus vacantes',
        vacantesPosted,
        msg,
        usuario: req.user,
        nombre:req.user.nombre,
        img:req.user.imagen
    })
}

//Bsucar vacantes ------------------------------------------------
const buscarVacantes = async (req,res) =>{
    const vacantes = await vacantesDb.find({
        $text:{$search:req.body.q}
    }).lean()

    res.render('home',{
        nombrePagina:'devJobs',
        tagline:'Encuentra y publica trabajos para desarrolladores web',
        boton:true,
        buscador:true,
        usuario: req.user,
        vacantes,
    })
}

// 404 no encontrado ----------------------------------------------
const noEncontrado = (req, res) =>{
    res.render('404', {
        nombrePagina:'404 - No encontrado',
    })
}

//Exports -------------------------------------
export {
    mostrarTrabajos,
    panelAdmin,
    buscarVacantes,
    noEncontrado,
}