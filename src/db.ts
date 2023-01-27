if(process.env.NODE_ENV !=="production"){
    require('dotenv').config()
}

const mysql = require('mysql');
const util = require('util')

const connectstring  =process.env.DATABASE_URL;

const db: object= {
    exec : async function(sql:string, values:any) {
        const connetDB = mysql.createConnection(connectstring);
        const query = util.promisify(connetDB.query).bind(connetDB)
        try{
            const data = await  query(sql,values);
            return data
        }
        catch(e){
            console.log(e)
            return []
        }
        finally{
            connetDB.end();
        }
    },
    getUser:async (user:string) => {
        const connetDB = mysql.createConnection(connectstring);
        const query = util.promisify(connetDB.query).bind(connetDB)
        try{
            const sql:string = "SELECT users.username, users.password from users where users.username='"+user+"'"
            const data = await query(sql)
            return data
        }
        catch(e){
            console.log(e)
            return []
        }
        finally{
            connetDB.end();
        }
    }
     
};

module.exports = db