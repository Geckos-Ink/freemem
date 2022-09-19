
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

///
/// MySQL
///
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

        console.warn("MySQL must be implemented!");
    }

    getDb(name){
        //todo
    }
}

module.exports.MySQL = MySQL;

///
/// SQLite
///
class SQLite {
    constructor(opts){
        var sqlite3 = require('sqlite3').verbose();
        this.db = new sqlite3.Database(opts.file); 

        //this.db.close();

        console.warn("This SQLite connection is based on sqlite3 package and not on better-sqlite3");
        console.warn("This class is still incomplete. Is advised to try to force better-sqlite3 installation");
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

    _loadTableInfo(table){
        let sql = 'PRAGMA table_info('+table.name+')';

        let end = false;

        table.cols = {};

        this.db.serialize(()=> {
            this.db.all(sql, function(err, rows) { // ... or sqlite_master
                if(err)
                    return console.error(err);

                for(var col in rows){
                    table.cols[col.name] = col;
                }

                end = true;
            });
        });

        await(()=>!end);
    }

    _newTable(name){
        let sql = "CREATE TABLE "+name+" ( id INTEGER PRIMARY KEY AUTOINCREMENT );"
        this.db.run(sql);
    }

    _alterTable(table, opts){

        function convertType(type){
            if(!type)
                return "";

            return " " + type;
        }

        switch(opts.todo){
            case 'addCol':
                this.db.run("ALTER TABLE "+table.name+" ADD "+opts.col + convertType(opts.type));
                break;
        }
    }

    getDb(){
        return new db.Database(this);
    }
}

module.exports.SQLite = SQLite;

///
/// Better SQLite
///
try{
    const betterSqlite3 = require('better-sqlite3');

    function verboseSqlLite(log){
        console.log("SQLite3:", log);
    }

    class Better_SQLite3 {
        constructor(opts){
            this.db = betterSqlite3(opts.file, {verbose: verboseSqlLite}); 
        }
    
        _loadDBInfo(db){
            db.tablesName = [];
    
            let rows = this.db.prepare("select name from sqlite_schema where type='table'").all();

            for(let row of rows){
                db.tablesName.push(row.name);
            }
        }
    
        _loadTableInfo(table){
            let sql = 'PRAGMA table_info('+table.name+')';
    
            table.cols = {};
    
            this.db.prepare(sql).all();

            for(var col in rows){
                table.cols[col.name] = col;
            }
        }
    
        _newTable(name){
            let sql = "CREATE TABLE "+name+" ( id INTEGER PRIMARY KEY AUTOINCREMENT );"
            this.db.prepare(sql).run();
        }
    
        _alterTable(table, opts){
    
            function convertType(type){
                if(!type)
                    return "";
    
                return " " + type;
            }
    
            switch(opts.todo){
                case 'addCol':
                    this.db.prepare("ALTER TABLE "+table.name+" ADD "+opts.col + convertType(opts.type)).run();
                    break;
            }
        }
    
        getDb(){
            return new db.Database(this);
        }
    }

    // Replace module
    module.exports.SQLite = Better_SQLite3;
}
catch{}