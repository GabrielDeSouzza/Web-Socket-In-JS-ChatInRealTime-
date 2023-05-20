import { type } from "os";


type TUserData = {
    id?: number;
    userName:string,
    password?:string,
    nomeFuncionario: string,
    setor: string,
    cargo: string,
    isadm: number,
    isdeleted?: number
}
export default TUserData