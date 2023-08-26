import jwt from 'jsonwebtoken';
import jsend from 'jsend';

export const jwtValidator = (req: any ,res:any, next: any) =>{
    const authorization = req.headers['authorization']
    const token = authorization && authorization.split(' ')[1]
    if (token == null){
        res.send(jsend.error({message:'invalid or expired token' , code: 401} ))
    }else{
        jwt.verify(token,process.env.TOKEN_KEY as string, (err:any,decoded:any)=>{
            if(err) {
                res.send(jsend.error({message:'invalid or expired token' , code: 403}))
            }else{
                next()
            } 
        })
    }
}

