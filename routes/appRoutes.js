import Express from "express";
import { mostrarTrabajos, panelAdmin, buscarVacantes, noEncontrado } from "../contollers/appController.js";
import { verificarUsuario } from "../src/middleware/autizacion.js";

const appRoutes = Express.Router()
    
appRoutes.get('/', mostrarTrabajos)

//Administracion 
appRoutes.get('/administracion', verificarUsuario, panelAdmin)

//Buscador
appRoutes.post('/buscador', buscarVacantes)

//No encontrado
appRoutes.get('/404', noEncontrado)

export default appRoutes