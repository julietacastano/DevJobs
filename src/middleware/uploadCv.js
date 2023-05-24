import multer from "multer";
import path from "path"
import { nanoid } from "nanoid";


const fileStorage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,'public/uploads/cv')
    },
    filename: (req,file,cb) =>{
        cb(null, nanoid() + path.extname(file.originalname))
    }
})

const configMulter = {
    limits: {fileSize: 150000},
    storage:fileStorage,
    fileFilter(req,file,cb){
        if(file.mimetype === 'application/pdf'){
            cb(null,true)
        }else{
            cb(new Error('Formato del archivo no valido'), false)
        }
    },
}

const uploadCv = multer(configMulter).single('cv')


export default uploadCv