import { env } from "process"
import  jwt  from "jsonwebtoken"
import IUserData from '../../types/IUserData'


function createToken(user: IUserData){
    const secret = env.SECRET_TOKEN
    const token = jwt.sign({
        id: user.id,
        username: user.username,
        isadm: user.isadm,
        isdeleted: user.isdeleted,
        cargo: user.cargo,
        setor: user.setor,
        nomeFuncionario: user.nomeFuncionario
        },
          secret as string,{
        expiresIn: '1d'
    })
    return token
}

function verifyToken(token:string){
    const user: any = jwt.verify(token as string, env.SECRET_TOKEN as string)
    return user
}



export  {
    verifyToken,
    createToken
}