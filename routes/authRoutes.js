import Express from "express";
import {authUser, formCrearCuenta, crearUsuario, formIniciarSesion, formReestablecerPass, enviarToken, reestablecerPass, guardarPass, cerrarSesion } from "../contollers/authController.js"
import { verificarUsuario } from "../src/middleware/autizacion.js";

const authRoutes = Express.Router()

//Registrar usuario
authRoutes.get('/crear-cuenta', formCrearCuenta)
authRoutes.post('/crear-cuenta', crearUsuario)

//Iniciar sesion
authRoutes.get('/iniciar-sesion', formIniciarSesion)
authRoutes.post('/iniciar-sesion', authUser)

//Reestablecer Password
authRoutes.get('/reestablecer-password', formReestablecerPass)
authRoutes.post('/reestablecer-password', enviarToken )
authRoutes.get('/reestablecer-password/:token', reestablecerPass )
authRoutes.post('/reestablecer-password/:token', guardarPass )

//Cerrar sesion
authRoutes.get('/cerrar-sesion', verificarUsuario, cerrarSesion)

export default authRoutes