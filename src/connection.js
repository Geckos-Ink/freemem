
exports = {};

class Connection{

}

class MySQL {
    constructor(){
        var mysql      = require('mysql');
        var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'me',
        password : 'secret',
        database : 'my_db'
        });
        
        connection.connect();
        
        connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results[0].solution);
        });
        
        connection.end();

        console.warn("MySQL to be implemented!");
    }
}

exports.MySQL = MySQL;

class SQLite {
    constructor(){
        var sqlite3 = require('sqlite3').verbose();
        var db = new sqlite3.Database(':memory:');

        db.serialize(function() {
        db.run("CREATE TABLE lorem (info TEXT)");

        var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
        for (var i = 0; i < 10; i++) {
            stmt.run("Ipsum " + i);
        }
        stmt.finalize();

        db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
            console.log(row.id + ": " + row.info);
        });
        });

        db.close();
    }
}

exports.SQLite = SQLite;