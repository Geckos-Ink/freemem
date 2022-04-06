
const db = require('./database');
const await = require('./await');

module.exports = function Connection(opts) {
    if(!this.connections){
        this.connections = [];
    }

    opts = opts || {};

    if(typeof opts == 'string')
        opts = {file: opts}; // check if file or connection?

    let conn;
    if(opts.host){
        conn = new MySQL(opts);
    }
    else {
        if(!opts.file)
            opts.file = ':memory:';
        conn = new SQLite(opts);
    }

    this.connections.push(conn);
    return conn;
}


class MySQL {
    constructor(opts){
        var mysql = require('mysql');
        this.connection = mysql.createConnection({
        host     : opts.host,
        user     : opts.user,
        password : opts.pass,
        database : opts.db
        });
        
        this.connection.connect();
        
        this.connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results[0].solution);
        });
        
        this.connection.end();

        console.warn("MySQL to be implemented!");
    }

    getDb(name){
        //todo
    }
}

module.exports.MySQL = MySQL;

class SQLite {
    constructor(opts){
        var sqlite3 = require('sqlite3').verbose();
        this.db = new sqlite3.Database(opts.file); 
        
        //this.db.close();
    }

    _loadDBInfo(db){
        db.tablesName = [];

        let end = false;
        this.db.serialize(()=> {
            this.db.all("select name from sqlite_schema where type='table'", function(err, rows) { // ... or sqlite_master
                if(err)
                    return console.error(err);

                for(let row of rows){
                    db.tablesName.push(row.name);
                }

                end = true;
            });
        });

        await(()=>!end);
    }

    _newTable(name){
        let sql = "CREATE TABLE "+name+" ( id INTEGER PRIMARY KEY);"
        this.db.run(sql);
    }

    getDb(){
        return new db.Database(this);
    }
}

module.exports.SQLite = SQLite;