if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const mysql = require('mysql');
const util = require('util')

const env = process.env;

interface IMessage {
    room: string,
    creatDate: Date,
    message: string,
    username: string,
    upImage: string,
    nameUpImage: string
}

const db: object = {
    
    getUser: async (user: string) => {
        const connetDB = mysql.createConnection({
            host: env.HOST,
            user: env.USER,
            password: env.PASSWORD,
            database: env.DATABASE
        }

        );
        const query = util.promisify(connetDB.query).bind(connetDB)
        try {
            const sql: string = `SELECT users.username, users.password from users where users.username='${user}'`
            const data = await query(sql)
            return data
        }
        catch (e) {
            console.log(e)
            return []
        }
        finally {
            connetDB.end();
        }
    },
    getMessagesRoom: async (room: string) => {
        const connetDB = mysql.createConnection({
            host: env.HOST,
            user: env.USER,
            password: env.PASSWORD,
            database: env.DATABASE
        })
        const query = util.promisify(connetDB.query).bind(connetDB)
        try {
            const sql: string = `select rooms.message, users.username, rooms.date, rooms.upImage, rooms.nameUpImage from rooms
             INNER join users on (rooms.usersId = users.id) where rooms.room = '${room}' 
            order by rooms.date asc`
            const data = await query(sql)
            return data
        }
        catch (e) {
            console.log(e)
            return []
        }
        finally {
            connetDB.end()
        }
    },
    verifyUser: async (username: string) => {
        const connetDB = mysql.createConnection({
            host: env.HOST,
            user: env.USER,
            password: env.PASSWORD,
            database: env.DATABASE
        })
        const query = util.promisify(connetDB.query).bind(connetDB)
        try {
            const sql: string = `select users.username from users where users.username ='${username}'`
            const data = await query(sql)
            if (data.length == 0)
                return false
            else
                return true
        }
        catch (e) {
            console.log(e + " adsad")
            return []
        }
        finally {
            connetDB.end()
        }


    },
    registerUser: async (username: string, password: string) => {
        const connetDB = mysql.createConnection({
            host: env.HOST,
            user: env.USER,
            password: env.PASSWORD,
            database: env.DATABASE
        })
        const query = util.promisify(connetDB.query).bind(connetDB)
        try {
            const sql = `INSERT INTO users(username, password) VALUES ('${username}','${password}')`
            await query(sql)
            return "Cadastrado com sucesso"
        }
        catch (e) {
            console.log(e)
            return "Erro ao cadastrar"
        }
        finally {
            connetDB.end()
        }
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
            let sql: string = `SELECT users.id from users where users.username='${message.username}'`
            const userId = await query(sql)

            sql = `INSERT INTO rooms(room, usersId, message, date, upImage, nameUpImage) VALUES
             ('${message.room}','${userId[0].id}','${message.message}','${message.creatDate}','${message.upImage}','${message.nameUpImage}')`
            await query(sql)
        }
        catch (e) {
            console.log(e)
            return "Erro ao cadastrar"
        }
        finally {
            connetDB.end()
        }

    }



};

module.exports = db