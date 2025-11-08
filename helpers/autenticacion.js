
import 'dotenv/config';
import JsonWebToken from 'jsonwebtoken';

export function generarToken(usuario){
 return JsonWebToken.sign({ id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol:usuario.rol}, process.env.JWT_TOKEN_SECRET,{expiresIn: '1h'});
}


