
exports = function Connection(opts) {
    if(!this.connections){
        this.connections = [];
    }

    opts = opts || {};

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
}

Connection.MySQL = MySQL;

class SQLite {
    constructor(opts){
        var sqlite3 = require('sqlite3').verbose();
        this.db = new sqlite3.Database(opts.file); 

        this.db.serialize(function() {
            this.db.run("CREATE TABLE lorem (info TEXT)");

            var stmt = this.db.prepare("INSERT INTO lorem VALUES (?)");
            for (var i = 0; i < 10; i++) {
                stmt.run("Ipsum " + i);
            }
            stmt.finalize();

            this.db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
                console.log(row.id + ": " + row.info);
            });
        });

        db.close();
    }
}

Connection.SQLite = SQLite;