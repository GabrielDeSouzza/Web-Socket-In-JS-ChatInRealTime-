import TUserCreateRoom from "./Types/TUserCreateRoom";
import TMessage from "./Types/TMessage";
import TUserData from "./Types/TUserData";
import TAlterRoom from "./Types/TAlterRoom";
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const mysql = require('mysql');
const util = require('util')

const env = process.env;


async function ConnectionMysql(SQL: string, erroReturn: any) {
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

const DbConnection = {
    //controle de usuarios
    getUser: async (user: string) => {
        const sql: string = `SELECT * from users where users.username='${user}'`
        const data = await ConnectionMysql(sql, [])
        return data
    },
    getUsersNotAdm: async () => {
        const sql: string = `Select nomeFuncionario, userName, setor,
         cargo FROM users WHERE isadm = 0 AND isdeleted =0`
        const data = await ConnectionMysql(sql, [])
        return data
    },
    updateUser: async (user: TUserData) => {
        const sql: string = `UPDATE users SET password='${user.password}',
        username='${user.userName}' where id = ${user.id}`
        return await ConnectionMysql(sql, false)
    },
    desableUser: async (userName: string) => {
        const sql = `UPDATE users SET isdeleted= 1 WHERE users.username = '${userName}'`
        return await await ConnectionMysql(sql, false).then((response) => {
            if (response.erro == true) {
                return false
            }
        })
    },
    verifyUser: async (userName: string) => {
        const sql: string = `SELECT users.username from users where users.username ='${userName}'`
        const data = await ConnectionMysql(sql, [])
        if (data.length == 0)
            return false
        else
            return true
    },
    registerUser: async (user: TUserData) => {
        const sql = `INSERT INTO users(username, password, nomeFuncionario, setor, cargo, isadm) VALUES ('${user.userName}',
        '${user.password}','${user.nomeFuncionario}' ,'${user.setor}', '${user.cargo}', '${user.isadm}')`
        const isSucess = await ConnectionMysql(sql, false)
        return isSucess
    },
    getUserNames: async () => {
        const sql = "SELECT users.username from users WHERE isadm = 0 AND isdeleted =0"
        const data = await ConnectionMysql(sql, "Deu rui")
        return data
    },
    //constrole de salas
    getMessagesRoom: async (room: string) => {
        const sql: string = `SELECT users.setor, users.cargo,users.nomeFuncionario,
        ${room}.fk_name_user, 
         ${room}.messages, ${room}.nameFile, ${room}.date FROM users
          INNER JOIN ${room} On users.username = ${room}.fk_name_user
           ORDER BY ${room}.date ASC;`
        const data = await ConnectionMysql(sql, [])
        return data
    },
    saveMessages: async (message: TMessage) => {
        const sql = `INSERT INTO ${message.room}(fk_name_user, messages,nameFile,date ) VALUES
             ('${message.userName}','${message.messages}','${message.nameFile}',
             '${message.date}')`
        const result = await ConnectionMysql(sql, "Não Foi possível add mensagem")
        if(result.erro){
            return result.erroReturn
        }
        return "Mensagem salva"

    },
    createRoom: async (data: TUserCreateRoom) => {
        const date = new Date()
        const sql = `INSERT INTO roomscreated (fk_name_user,name_room, description)
                    VALUES ('${data.userName}','${data.nameRoom}','${data.descriptionRoom}')`
        const result = await ConnectionMysql(sql, "criado com sucesso")
        if (result.erro == true) {
            return 'erro ao criar sala'
        }
        const sql_createTable = `CREATE TABLE ${data.nameRoom} (fk_name_user VARCHAR(20) NOT NULL ,
         messages VARCHAR(250) NULL , nameFile VARCHAR(100) NULL ,
         date DATETIME NOT NULL ,
           id INT NOT NULL AUTO_INCREMENT , PRIMARY KEY (id),
        CONSTRAINT FK_user_${data.userName.replace(/[^a-zA-Z]/g, "") + "_room_" + data.nameRoom} FOREIGN KEY (fk_name_user) REFERENCES users(username)
        ON UPDATE CASCADE ON DELETE CASCADE)`

        const result_create = await ConnectionMysql(sql_createTable, true)
        if (result.erro || result_create == true) {
            return 'erro ao criar sala'
        }
    },
    getRooms: async () => {
        const sql = `SELECT * from roomscreated`
        const result = await ConnectionMysql(sql, [])
        return result
    },
    getRoomsCreatedBy: async (userName: string) => {
        const sql = `SELECT * from roomscreated WHERE fk_name_user = '${userName}'`
        const result = await ConnectionMysql(sql, [])
        return result
    }
    ,
    getSpecificRoomUser: async (userName: string) => {
        const sql = `SELECT roomscreated.* FROM roomscreated INNER JOIN usersmember ON usersmember.nametable = roomscreated.name_room
        INNER JOIN users ON users.username = usersmember.username WHERE usersmember.username = '${userName}';`
        const data = await ConnectionMysql(sql, [])
        return data
    }
    ,
    verifyUserIsMemberRoom: async (userName: string, room: string) => {
        const sql = `SELECT username, nametable from usersmember
        WHERE usersmember.username = '${userName}' 
        AND usersmember.nametable='${room}'`
        const data = await ConnectionMysql(sql, "Usuario não é membro desta sala").then(response => {
            if (response.erro == true) {
                return false
            }
            return true
        })
        return data
    },
    getAllUsersMember: async () => {
        const sql = "SELECT username, nametable from usersmember"
        const data = await ConnectionMysql(sql, "Erro ao procurar")
        if (data.erro) {
            return data.erroReturn
        }
        return data
    },
    addUsersMember: async (username: string, room: string) => {
        const sql: string = `INSERT INTO usersmember (username, nametable)
        VALUES ('${username}','${room}')`
        ConnectionMysql(sql, false).then(response => {
            if (response.erro == true) {
                return false
            }
            return true
        })
    },
    delMemberRoom: async (userName: string, room: string) => {
        const sql = `DELETE FROM usersmember WHERE usersmember.userName= '${userName}'
        AND usersmember.nametable = '${room}'`
        const data = ConnectionMysql(sql, "Erro ao deletar usuario").then(response => {
            if (response.erro == true) {
                return response.erroReturn
            }
            return true
        })
    },
    delMemberAllRoom: async (userName: string) => {
        const sql = `DELETE FROM usersmember WHERE usersmember.username= '${userName}'`
        ConnectionMysql(sql, "Erro ao deletar usuario").then(response => {
            if (response.erro == true) {
                return response.erroReturn
            }
            return true
        })
    },
    //Gerencia de salas
    alterNameRoom: async (alterRoom: TAlterRoom) => {
        const sql = `RENAME TABLE ${alterRoom.oldName} TO ${alterRoom.newName}`
        const sqlUpdadteroomsCreated = `UPDATE roomscreated SET description = '${alterRoom.description}'
        , name_room = '${alterRoom.newName}' WHERE name_room = '${alterRoom.oldName}'`
        const result: any = await ConnectionMysql(sql, "Não Foi possivel atualizar a Sala")
        if (result.erro == true) {
            return result.erroReturn
        }
        const result2: any = await ConnectionMysql(sqlUpdadteroomsCreated, "Erro ao atualizar Tablea")
        if (result2.erro) {
            return result2.erroReturn
        }
        return "Sala atualizada com sucesso"

    },
    alterDescriptionRoom: async (room: string, newDescription: string) => {

        const sql = `UPDATE roomscreated SET description = '${newDescription}'
        WHERE name_room = '${room}'`
        const data = await ConnectionMysql(sql, "Não Foi possivel atualizar a Sala")
        if (data.erro == true) {
            return data.erroReturn
        }
        return "Alteração realizada com sucesso"
    },
    deleteRoom: async (room: string) => {
        const sql = `DROP TABLE ${room}`;
        const result = await ConnectionMysql(sql, 'Erro ao deletar sala')
        if (result.erro) {
            return result.erroReturn
        }
        else {
            const sql2 = `DELETE FROM roomscreated WHERE name_room = '${room}'`
            const result2 = await ConnectionMysql(sql2, "Erro ao deletar sala")
            if (result2.erro) {
                return result2.erroReturn
            }
            else {
                return "Sala deletada com sucesso"
            }
        }
    }
};


export default DbConnection