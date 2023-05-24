const verificarUsuario = (req, res, next) =>{
    if(req.isAuthenticated()){
        return next()
    }

    res.redirect('/auth/iniciar-sesion')
}

export {
    verificarUsuario
}