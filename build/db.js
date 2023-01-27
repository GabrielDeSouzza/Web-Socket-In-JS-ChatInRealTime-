"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const mysql = require('mysql');
const util = require('util');
const connectstring = process.env.DATABASE_URL;
const db = {
    exec: function (sql, values) {
        return __awaiter(this, void 0, void 0, function* () {
            const connetDB = mysql.createConnection(connectstring);
            const query = util.promisify(connetDB.query).bind(connetDB);
            try {
                const data = yield query(sql, values);
                return data;
            }
            catch (e) {
                console.log(e);
                return [];
            }
            finally {
                connetDB.end();
            }
        });
    }
};
module.exports = db;
