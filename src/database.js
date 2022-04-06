
// All things she said, all about SQL
exports = {};

class Database {
    constructor(conn, name='freemem'){
        this.conn = conn;
        this.name = name;

        this.tables = {};
    }

    getTable(name){

    }
}

exports.Database = Database;


class Table {
    constructor(db, name="keyvalue"){
        this.db = db;
        this.name = name;

        this.fields = {};
    }

    init(){
        
    }
}

exports.Table = Table;


class Field {
    constructor(table, name, type='string'){
        this.table = table;
        this.name = name;
        this.type = type;
    }
}

exports.Field = Field;