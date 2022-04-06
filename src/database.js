
// All things she said, all about SQL
exports = {};

class Database {
    constructor(conn, name='freemem'){
        this.conn = conn;
        this.name = name;

        conn._loadDBInfo(this);
    }

    getTable(name){
        return new Table(this, name);
    }

    tableExists(name){
        return this.tablesName.indexOf(name) >= 0;      
    }
}

module.exports.Database = Database;


class Table {
    constructor(db, name="keyvalue"){
        this.db = db;
        this.name = name;

        this.fields = {};
        this.init();
    }

    init(){
        // create only when it needed
        if(!this.db.tableExists(this.name))
            this.db.conn._newTable(this.name);
    }
}

module.exports.Table = Table;


class Field {
    constructor(table, name, type='string'){
        this.table = table;
        this.name = name;
        this.type = type;
    }
}

module.exports.Field = Field;