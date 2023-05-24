import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { userDb } from "./db.js";

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
    },
    async (email, password, done) =>{
        const usuario = await userDb.findOne({email})
        if(!usuario){
            return done(null, false, {message: 'Error de autenticación'})
        }

        const verificarPassword = usuario.compararPassword(password)
        if(!verificarPassword){
            return done(null, false, {message: 'Error de autenticación'})
        }

        return done(null, usuario)
    }
))

passport.serializeUser((usuario, done) => done(null, usuario._id))
passport.deserializeUser(async(id, done) => {
    const usuario = await userDb.findById(id)
    return done(null, usuario)
})

export default passport