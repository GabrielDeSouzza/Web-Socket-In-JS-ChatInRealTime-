import { type } from "os"

type TMessage = {
    room:string,
    date:Date,
    messages:string,
    userName:string,
    url_file?:string
    nameFile?:string,
    setor:string,
    cargo: string,
    nomeFuncionario: string
}

export default TMessage