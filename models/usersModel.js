import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        lowercase:true,
        trim:true
    },
    nombre:{
        type: String,
        require:true
    },
    password:{
        type:String,
        require:true,
        trim:true
    },
    token:String,
    expira:Date,
    imagen: String
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next()
    }
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    next()
})

//Autenticar usuarios
userSchema.methods = {
    compararPassword: function(password){
        return bcrypt.compareSync(password, this.password)
    }
}

export default userSchema