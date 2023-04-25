import { env } from "process"
import  jwt  from "jsonwebtoken"
import IUserData from '../../types/IUserData'


function createToken(user: IUserData){

    const secret = env.SECRET_TOKEN
    const token = jwt.sign({id: user.id }, secret as string,{
        expiresIn: '1d'
    })
    return token
}

function verifyToken(token:string){
    return jwt.verify(token as string, env.SECRET_TOKEN as string)
}



export  {
    verifyToken,
    createToken
}