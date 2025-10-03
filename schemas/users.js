import mongoose from 'mongoose';

const usuariosSchema = new mongoose.Schema(
    {
nombre:{
    type: String,
    required: true,
    trim: true // que no quede en blanco
},
email:{
    type: String,
    required: true,
    unique: true,
    trim: true
},

telefono:{
    type: String,
    required:false,

},

clave:{
    type: String,
    required: true,


}

},{timestamps:true}//llevar seguimiento de cuando fue creado y actualizado

);

export default mongoose.model('users', usuariosSchema);