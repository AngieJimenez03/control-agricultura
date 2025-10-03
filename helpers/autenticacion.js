
import 'dotenv/config';
import JsonWebToken from 'jsonwebtoken';

export function generarToken(email){
 return JsonWebToken.sign({email}, process.env.JWT_TOKEN_SECRET,{expiresIn: '1h'});
}

