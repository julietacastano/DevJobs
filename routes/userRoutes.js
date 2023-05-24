import Express from "express";
import { formEditarPerfil, editarPerfil, subirImagen } from "../contollers/userController.js";
import { verificarUsuario } from "../src/middleware/autizacion.js";

const userRoutes = Express.Router()

//Editar perfil
userRoutes.get('/editar-perfil', verificarUsuario, formEditarPerfil)
userRoutes.post('/editar-perfil', verificarUsuario, subirImagen, editarPerfil)



export default userRoutes