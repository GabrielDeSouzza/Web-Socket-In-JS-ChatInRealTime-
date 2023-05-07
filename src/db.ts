import IUserCreateRoom from "./types/IUserCreateRoom";
import IMessage from "./types/IMessage";
import IUserData from "./types/IUserData";
import IAlterRoom from "./types/IAlterRoom";
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
    //controle de usuarios
    getUser: async (user: string) => {
        const sql: string = `SELECT * from users where users.username='${user}'`
        const data = await dbConnection(sql, [])
        return data
    },
    getUsersNotAdm: async () => {
        const sql: string = `Select nomeFuncionario, username, setor,
         cargo FROM users WHERE isadm = 0 AND isdeleted =0`
        const data = await dbConnection(sql, [])
        return data
    },
    updateUser: async (user: IUserData) => {
        const sql: string = `UPDATE users SET password='${user.password}',
        username='${user.username}' where id = ${user.id}`
        return await dbConnection(sql, false)
    },
    desableUser: async (username: string) => {
        const sql = `UPDATE users SET isdeleted= 1 WHERE users.username = '${username}'`
        return await await dbConnection(sql, false).then((response) => {
            if (response.erro == true) {
                return false
            }
        })
    },
    verifyUser: async (username: string) => {
        const sql: string = `SELECT users.username from users where users.username ='${username}'`
        const data = await dbConnection(sql, [])
        if (data.length == 0)
            return false
        else
            return true
    },
    registerUser: async (user: IUserData) => {
        const sql = `INSERT INTO users(username, password, nomeFuncionario, setor, cargo, isadm) VALUES ('${user.username}',
        '${user.password}','${user.nomeFuncionario}' ,'${user.setor}', '${user.cargo}', '${user.isadm}')`
        const isSucess = await dbConnection(sql, false)
        return isSucess
    },
    getUserNames: async () => {
        const sql = "SELECT users.username from users WHERE isadm = 0 AND isdeleted =0"
        const data = await dbConnection(sql, "Deu rui")
        return data
    },
    //constrole de salas
    getMessagesRoom: async (room: string) => {
        const sql: string = `SELECT users.setor, users.cargo,users.nomeFuncionario,
        ${room}.fk_name_user, 
         ${room}.messages, ${room}.nameUpimage, ${room}.date FROM users
          INNER JOIN ${room} On users.username = ${room}.fk_name_user
           ORDER BY ${room}.date ASC;`
        const data = await dbConnection(sql, [])
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

            const sql = `INSERT INTO ${message.room}(fk_name_user, messages,nameUpImage,date ) VALUES
             ('${message.username}','${message.messages}','${message.nameUpImage}',
             '${message.date}')`
            await query(sql)
        }
        catch (e) {
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
        if (result.erro == true) {
            return 'erro ao criar sala'
        }
        const sql_createTable = `CREATE TABLE ${data.nameRoom} (fk_name_user VARCHAR(20) NOT NULL ,
         messages VARCHAR(250) NULL , nameUpimage VARCHAR(50) NULL ,
         date DATETIME NOT NULL ,
           id INT NOT NULL AUTO_INCREMENT , PRIMARY KEY (id),
        CONSTRAINT FK_user_${data.username.replace(/[^a-zA-Z]/g, "") + "_room_" + data.nameRoom} FOREIGN KEY (fk_name_user) REFERENCES users(username)
        ON UPDATE CASCADE ON DELETE CASCADE)`

        const result_create = await dbConnection(sql_createTable, true)
        if (result.erro || result_create == true) {
            return 'erro ao criar sala'
        }
    },
    getRooms: async () => {
        const sql = `SELECT * from roomscreated`
        const result = await dbConnection(sql, [])
        return result
    },
    getRoomsCreatedBy: async (username: string) => {
        const sql = `SELECT * from roomscreated WHERE fk_name_user = '${username}'`
        const result = await dbConnection(sql, [])
        return result
    }
    ,
    getSpecificRoomUser: async (username: string) => {
        const sql = `SELECT roomscreated.* FROM roomscreated INNER JOIN usersmember ON usersmember.nametable = roomscreated.name_room
        INNER JOIN users ON users.username = usersmember.username WHERE usersmember.username = '${username}';`
        const data = await dbConnection(sql, [])
        return data
    }
    ,
    verifyUserIsMemberRoom: async (username: string, room: string) => {
        const sql = `SELECT username, nametable from usersmember
        WHERE usersmember.username = '${username}' 
        AND usersmember.nametable='${room}'`
        const data = await dbConnection(sql, "Usuario não é membro desta sala").then(response => {
            if (response.erro == true) {
                return false
            }
            return true
        })
        return data
    },
    getAllUsersMember: async () => {
        const sql = "SELECT username, nametable from usersmember"
        const data = await dbConnection(sql, "Erro ao procurar")
        if (data.erro) {
            return data.erroReturn
        }
        return data
    },
    addUsersMember: async (username: string, room: string) => {
        const sql: string = `INSERT INTO usersmember (username, nametable)
        VALUES ('${username}','${room}')`
        dbConnection(sql, false).then(response => {
            if (response.erro == true) {
                return false
            }
            return true
        })
    },
    delMemberRoom: async (username: string, room: string) => {
        const sql = `DELETE FROM usersmember WHERE usersmember.username= '${username}'
        AND usersmember.nametable = '${room}'`
        const data = dbConnection(sql, "Erro ao deletar usuario").then(response => {
            if (response.erro == true) {
                return response.erroReturn
            }
            return true
        })
    },
    delMemberAllRoom: async (username: string) => {
        const sql = `DELETE FROM usersmember WHERE usersmember.username= '${username}'`
        dbConnection(sql, "Erro ao deletar usuario").then(response => {
            if (response.erro == true) {
                return response.erroReturn
            }
            return true
        })
    },
    //Gerencia de salas
    alterNameRoom: async (alterRoom: IAlterRoom) => {
        const sql = `RENAME TABLE ${alterRoom.oldName} TO ${alterRoom.newName}`
        const sqlUpdadteroomsCreated = `UPDATE roomscreated SET description = '${alterRoom.description}'
        , name_room = '${alterRoom.newName}' WHERE name_room = '${alterRoom.oldName}'`
        const result: any = await dbConnection(sql, "Não Foi possivel atualizar a Sala")
        if (result.erro == true) {
            return result.erroReturn
        }
        const result2: any = await dbConnection(sqlUpdadteroomsCreated, "Erro ao atualizar Tablea")
        if (result2.erro) {
            return result2.erroReturn
        }
        return "Sala atualizada com sucesso"

    },
    alterDescriptionRoom: async (room: string, newDescription: string) => {
        
        const sql = `UPDATE roomscreated SET description = '${newDescription}'
        WHERE name_room = '${room}'`
        const data = await dbConnection(sql, "Não Foi possivel atualizar a Sala")
        if (data.erro == true) {
            return data.erroReturn
        }
        return "Alteração realizada com sucesso"
    },
    deleteRoom: async (room: string) => {
        const sql = `DROP TABLE ${room}`;
        const result = await dbConnection(sql, 'Erro ao deletar sala')
        if (result.erro) {
            return result.erroReturn
        }
        else {
            const sql2 = `DELETE FROM roomscreated WHERE name_room = '${room}'`
            const result2 = await dbConnection(sql2, "Erro ao deletar sala")
            if (result2.erro) {
                return result2.erroReturn
            }
            else {
                return "Sala deletada com sucesso"
            }
        }
    }
};


export default db