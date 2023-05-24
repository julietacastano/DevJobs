import passport from "passport";
import crypto from "crypto"
import { check, validationResult } from "express-validator"
import { userDb } from "../config/db.js"
import { reestablecerPassMail } from "../helpers/email.js";

const authUser = passport.authenticate('local',{
    successRedirect: '/administracion',
    failureRedirect: '/auth/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
})

//Registrar usuario -------------------------------------------------------------------
const formCrearCuenta = (req,res) => {

    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta',
        tagline: 'Comienza a publicar tus vacantes gratis! Solo debes crear una cuenta'
    })
}
const crearUsuario = async (req,res,next) => {
    //Validaciones
    await check('nombre').notEmpty().withMessage('El nombre no puede estar vacio').run(req)
    await check('email').isEmail().withMessage('El email debe ser valido').run(req)
    await check('password').isLength({min:6}).withMessage('La contraseña es muy corta').run(req)
    await check('repetirPassword').equals(req.body.password).withMessage('Las contraseñas no son iguales').run(req)

    let resultadoErrores = validationResult(req)

    //Mostrar errores
    if(!resultadoErrores.isEmpty()){
        return res.render('crear-cuenta', {
            nombrePagina: 'Crea tu cuenta',
            tagline: 'Comienza a publicar tus vacantes gratis! Solo debes crear una cuenta',
            errores: resultadoErrores.array()
        })
    }

    //Verificar si el usuario esta registrado
    const usuarioUsado = await userDb.findOne({email:req.body.email})
    if(usuarioUsado){
        return res.render('crear-cuenta', {
            nombrePagina: 'Crea tu cuenta',
            tagline: 'Comienza a publicar tus vacantes gratis! Solo debes crear una cuenta',
            errores: [{msg:'El email ingresado ya se encuentra registrado'}]
        })
    }

    //Crear usuario
    const {nombre, email, password} = req.body
    await userDb.create({
        nombre,
        email,
        password
    })

    res.redirect('/administracion')
}

//Inicio de sesion ------------------------------------------------------------------------------------
const formIniciarSesion = (req,res) => {
    const err = req.flash('error')
    const msg = req.flash('message')

    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar sesión',
        err,
        msg
    })
}

//Reestablecer Password --------------------------------------------------------------------------------
const formReestablecerPass = (req,res) => {
    const err = req.flash('error')

    res.render('reestablecer-password',{
        nombrePagina: 'Reestablece tu contraseña',
        tagline:'Por favor ingresa tu e-mail para reestablecer tu contraseña',
        err
    })
}
//Generar y enviar token
const enviarToken = async (req,res) => {
    const usuario = await userDb.findOne({email: req.body.email})
    if(!usuario){
        req.flash('error', 'El email ingresado no existe')
        return res.redirect('/auth/iniciar-sesion')
    }

    const token = crypto.randomBytes(20).toString('hex')

    usuario.token = token
    usuario.expira = Date.now() + 3600000 //Date.now() + 1 hora (en milisegundos)

    await usuario.save()

    const resetUrl = `${req.headers.host}/auth/reestablecer-password/${usuario.token}`

    reestablecerPassMail({
        nombre: usuario.nombre,
        email:usuario.email,
        resetUrl
    })

    req.flash('message', 'Te enviamos un mail para reestablecer tu contraseña')
    res.redirect('/auth/iniciar-sesion');
}
//Reestablecer password
const reestablecerPass = async (req,res) => {
    const usuario = await userDb.findOne({
        token: req.params.token,
        expira:{$gt: Date.now()}
    })

    if(!usuario){
        req.flash('error', 'El formulario no es valido, por favor intenta otra vez.')
        return res.redirect('/auth/reestablecer-password')
    }

    res.render('nuevo-password',{
        nombrePagina:'Nueva contraseña'
    })
}
//Guardar password
const guardarPass = async (req,res) => {
    const usuario = await userDb.findOne({
        token: req.params.token,
        expira:{$gt: Date.now()}
    })

    if(!usuario){
        req.flash('error', 'El formulario no es valido, por favor intenta otra vez.')
        return res.redirect('/auth/reestablecer-password')
    }

    usuario.password = req.body.password
    usuario.token = undefined
    usuario.expira = undefined

    await usuario.save()

    req.flash('message', 'Contraseña modificada correctamente')
    res.redirect('/auth/iniciar-sesion');

}

//Cerrar sesion -------------------------------------------
const cerrarSesion = (req,res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
    res.redirect('/auth/iniciar-sesion');
    })
}

export{
    authUser,
    formCrearCuenta,
    crearUsuario,
    formIniciarSesion,
    formReestablecerPass,
    enviarToken,
    reestablecerPass,
    guardarPass,
    cerrarSesion
}