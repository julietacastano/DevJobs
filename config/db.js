import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config({path:'.env'})
import vacantesSchema from "../models/vacantesModel.js";
import userSchema from "../models/usersModel.js";

const uli = process.env.DATABASE

//Vacantes model
const vacantesDb = mongoose.model('vacante', vacantesSchema)

//User model
const userDb = mongoose.model('user', userSchema)

mongoose.connect(uli, {useNewUrlParser:true})

mongoose.connection.on('error', (error)=>{console.log(error)} )


export{ 
    vacantesDb,
    userDb
}

