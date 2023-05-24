// import mongoose from "mongoose";
// import MongoStore from "connect-mongo";
import Express from "express";
import {engine} from "express-handlebars";
import { fileURLToPath } from 'url';
import path from "path";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash"
import createError from "http-errors"
import appRoutes  from "./routes/appRoutes.js";
import vacantesRoutes from "./routes/vacantesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import passport from "./config/passport.js"

dotenv.config({path:'.env'})

const app = Express();

app.use(cookieParser())

app.use(Express.json())
app.use(Express.urlencoded({extended:true}))

//Enable handlebars
app.engine('handlebars', engine())
app.set('views', './views')
app.set('view engine', 'handlebars')

//Static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(Express.static(path.join(__dirname, 'public')));

//Express Session
app.use(session({
    secret: process.env.SECRETO,
    KEY:process.env.KEY,
    resave: false,
    saveUninitialized: false,
    // store: new MongoStore({mongooseConnection: mongoose.connection})
}))

//passport
app.use(passport.initialize())
app.use(passport.session())

// Alertas y flash messages
app.use(flash());

//Routes
app.use('/', appRoutes)
app.use('/', userRoutes)
app.use('/vacantes', vacantesRoutes)
app.use('/auth', authRoutes)

app.use((req,rex,next) => {
    next(createError(404, 'No encontrado'))
})
app.use((error,req,res, next) => {
    const status = error.statusCode || 500;

    res.render('404',{
        nombrePagina: `${status} - ${error.message}` 
    })
})

const port = process.env.PORT;
app.listen(port, ()=>console.log(`Escuchando puerto ${port}`))