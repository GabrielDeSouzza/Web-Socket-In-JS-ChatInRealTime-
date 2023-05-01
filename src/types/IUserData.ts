export default interface IUserData{
    id?: number;
    username:string,
    password?:string,
    nomeFuncionario: string,
    setor: string,
    cargo: string,
    isadm: number,
    isdeleted?: number
}