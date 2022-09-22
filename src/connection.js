
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
        conn = new module.exports.SQLite(opts);
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
    
            let rows = this.db.prepare(sql).all();

            for(var col in rows){
                table.cols[col.name] = col;
            }
        }
    
        _newTable(name){
            let sql = "CREATE TABLE "+name+" ( id INTEGER PRIMARY KEY AUTOINCREMENT );"
            this.db.prepare(sql).run();
        }

        _extractType(value){
            let type = typeof value;

            switch(type){
                case 'string':
                    type = 'TEXT';
                    break;

                case 'object':
                    if(value instanceof Date)
                        type = 'NUMERIC'
                    break;

                case 'number':
                    type = isInt(value) ? 'NUMERIC' : 'REAL';
            }

            return type;
        }

        _convertType(type){ //TODO: convert type of other DBMS
            if(!type)
                return undefined;

            return type;
        }
    
        _alterTable(table, opts){    
            switch(opts.todo){
                case 'addCol':
                    opts.type = this._convertType(opts.type) || this._extractType(opts.sample);
                    this.db.prepare("ALTER TABLE "+table.name+" ADD "+opts.col + ' ' + opts.type).run();
                    this._loadTableInfo(table);
                    break;
            }
        }

        _formatValue(val){
            let tVal = typeof val;

            if(tVal == 'string'){
                return "'"+val+"'";
            }
            else if(tVal == 'object'){
                if(tVal instanceof Date)
                    return tVal.getTime();
            }

            return val;
        }

        _insertIntoTable(table, row){
            /// Check new columns
            for(let col in data){
                let ct = col.split(':');
                if(!table.cols[ct[0]]){
                    this._alterTable(this, {todo: 'addCol', col, type: ct[1], sample: data[col]});
                }
    
                if(ct.length>1){
                    data[ct[0]] = data[col];
                    delete data[col];
                }
            }

            /// Insert
            let arrNames = [];
            let arrValues = [];

            for(let r in table.cols){
                let val = row[r];
                if(val){
                    arrNames.push(r);
                    arrNames.push(this._formatValue(val));
                }
            }

            let sql = 'INSERT INTO '+table.name+' ('+arrNames.join(',')+') VALUES ('+arrValues.join(',')+')';
            let stmt = this.db.prepare(sql);
            let info = stmt.run();
            // info.changes
            return info;
        }

        _tableSelect(table, opts){
            let sql = 'SELECT * FROM '+table.name+' ';

            if(!opts.where){
                sql += 'WHERE 1';
            }
            else {
                sql += opts.where.join(' ');
            }

            const stmt = this.db.prepare(sql);
            let res = stmt.all();
            return res;
        }

        _tableUpdate(table, opts){
            let sql = 'UPDATE '+table.name+' SET '

            for(let s in opts.set){
                sql += s +'='+ this._formatValue(opts.set[s]);
            }

            sql += ' WHERE ';
            if(!opts.where){
                sql += '1'
            }
            else {
                sql += opts.where.join(' ')
            }

            const stmt = this.db.prepare(sql);
            let info = stmt.run();
            return info;
        }

        _tableDelete(table, opts){
            let sql = 'DELETE FROM '+table.name+' ';

            if(!opts.where){
                sql += 'WHERE 1';
            }
            else {
                sql += opts.where.join(' ');
            }

            const stmt = this.db.prepare(sql);
            let info = stmt.run();
            return info;
        }
    
        getDb(){
            return new db.Database(this);
        }
    }

    // Replace module
    module.exports.SQLite = Better_SQLite3;
}
catch(ex){

}

///
/// General functions
///
function isInt(n){
    return n % 1 === 0;
}