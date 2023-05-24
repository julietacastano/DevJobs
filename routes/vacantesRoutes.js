import Express  from "express";
import { formularioNuevaVacante, agregarVacante, mostrarVacante, subirCV, contactar, mostrarCandidatos, formularioEditarVacante, editarVacante, eliminarVacante } from "../contollers/vacantesController.js";
import { verificarUsuario } from "../src/middleware/autizacion.js";

const vacantesRoutes = Express.Router()

//Agregar vacantes
vacantesRoutes.get('/nueva', verificarUsuario, formularioNuevaVacante)
vacantesRoutes.post('/nueva', verificarUsuario, agregarVacante)

//Mostrar vacante
vacantesRoutes.get('/:url', mostrarVacante)
//Recibir mensajes de candidatos
vacantesRoutes.post('/:url', subirCV, contactar)

//Mostrar candidatos de una vacante
vacantesRoutes.get('/candidatos/:id', verificarUsuario, mostrarCandidatos)

//Editar vacante
vacantesRoutes.get('/editar/:url', verificarUsuario, formularioEditarVacante)
vacantesRoutes.post('/editar/:url', verificarUsuario, editarVacante)

//Eliminar vacante
vacantesRoutes.delete('/eliminar/:id', eliminarVacante)

export default vacantesRoutes
