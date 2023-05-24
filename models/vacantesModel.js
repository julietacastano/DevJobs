import mongoose from "mongoose";
import slug from "slug";
import { nanoid } from "nanoid";

const vacantesSchema = new mongoose.Schema({
    titulo:{
        type:String,
        require:'El titulo es obligatorio',
        trim:true
    },
    empresa:{
        type:String,
        trim:true
    },
    ubicacion:{
        type:String,
        require:'La ubicacion es obligatoria',
        trim:true
    },
    salario:{
        type:String,
        default:0
    },
    contrato:{
        type:String,
        trim:true
    },
    descripcion:{
        type:String,
        trim:true
    },
    url:{
        type:String,
        lowercase:true
    },
    skills:[String],
    candidatos:[{
        nombre:String,
        email:String,
        cv:String
    }],
    autor:{
        type:mongoose.Schema.ObjectId,
        ref:'user',
        required:'El autor es obligatorio'
    }
});

vacantesSchema.pre('save', function(next){
    //crear url
    const url = slug(this.titulo)
    this.url = `${url}-${nanoid()}`

    next()
})

//Generar indice
vacantesSchema.index({titulo: 'text'})

export default vacantesSchema