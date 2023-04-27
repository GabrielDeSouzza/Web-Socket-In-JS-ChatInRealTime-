import IUserCreateRoom from "./types/IUserCreateRoom";
import IMessage from "./types/IMessage";
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const mysql = require('mysql');
const util = require('util')

const env = process.env;


async function dbConnection(SQL: string, erroReturn: any) {
    const connetDB = mysql.createConnection({
        host: env.HOST,
        user: env.USER,
        password: env.PASSWORD,
        database: env.DATABASE
    }

    );
    const query = util.promisify(connetDB.query).bind(connetDB)
    try {
        const data = await query(SQL)
        return data
    }
    catch (e) {
        console.log(e)
        return {
            erro: true,
            return: erroReturn,
            messageErro: e
        }
    }
    finally {
        connetDB.end();
    }
}

const db = {

    getUser: async (user: string) => {
        const sql: string = `SELECT users.username, users.password, id from users where users.username='${user}'`
        const data = await dbConnection(sql, [])
        return data
    },
    getMessagesRoom: async (room: string) => {
        const sql: string = `SELECT * from ${room} ORDER BY ${room}.date ASC;`
        const data = await dbConnection(sql, [])
        console.log(data)
        return data
    },
    verifyUser: async (username: string) => {
        const sql: string = `select users.username from users where users.username ='${username}'`
        const data = await dbConnection(sql, [])
        if (data.length == 0)
            return false
        else
            return true
    },
    registerUser: async (username: string, password: string) => {
        const sql = `INSERT INTO users(username, password) VALUES ('${username}','${password}')`
        const data = await dbConnection(sql, "Erro ao cadastrar Usuario")
        return data
    },
    saveMessages: async (message: IMessage) => {
        const connetDB = mysql.createConnection({
            host: env.HOST,
            user: env.USER,
            password: env.PASSWORD,
            database: env.DATABASE
        })
        const query = util.promisify(connetDB.query).bind(connetDB)
        try {

            const sql = `INSERT INTO ${message.room}(fk_name_user, messages,nameUpImage , url_Image,date ) VALUES
             ('${message.username}','${message.messages}','${message.nameUpImage}','${message.url_Image}','${message.date}')`
            await query(sql)
        }
        catch (e) {
            console.log(e)
            return "Erro ao cadastrar"
        }
        finally {
            connetDB.end()
        }

    },
    CreateRoom: async (data: IUserCreateRoom) => {
        const date = new Date()
        const sql = `INSERT INTO roomscreated (fk_name_user,name_room, description)
                    VALUES ('${data.username}','${data.nameRoom}','${data.descriptionRoom}')`
        const result = await dbConnection(sql, "criado com sucesso")
        if(result.erro == true){
            console.log(result.messageErro)
            return 'erro ao criar sala'
        }
        const sql_createTable = `CREATE TABLE ${data.nameRoom} (fk_name_user VARCHAR(20) NOT NULL ,
         messages VARCHAR(250) NULL , nameUpimage VARCHAR(50) NULL ,
          url_Image VARCHAR(200) NULL , date DATETIME NOT NULL ,
           id INT NOT NULL AUTO_INCREMENT , PRIMARY KEY (id),
        CONSTRAINT FK_user_${data.username.replace(/[^a-zA-Z]/g, "")+"_room_"+data.nameRoom} FOREIGN KEY (fk_name_user) REFERENCES users(username)
        ON UPDATE CASCADE ON DELETE CASCADE)`

        const result_create = await dbConnection(sql_createTable, true)
        if(result.erro || result_create == true){
            console.log(result.messageErro)
            return 'erro ao criar sala'
        }
    },

    getRooms: async()=> {
        const sql = `SELECT * from roomscreated`
        const result = await dbConnection(sql, [])
        return result
    }
};


export default db