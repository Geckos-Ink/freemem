const Vars = require('./vars');

// All things she said, all about SQL
exports = {};

class Database {
    constructor(conn, name='freemem'){
        this.conn = conn;
        this.name = name;

        this.tables = {};

        conn._loadDBInfo(this);
    }

    getTable(name){
        if(name instanceof Table)
            return name;

        return this.tables[name] = this.tables[name] || new Table(this, name);
    }

    tableExists(name){
        return this.tablesName.indexOf(name) >= 0;      
    }

    getDictionary(table){
        return new Vars.Dictionary(this.getTable(table));
    }

    getVar(table) {
        return new Vars.Var(this.getTable(table));
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
        if(this.inited)
            return;

        // create only when it needed
        if(!this.db.tableExists(this.name)){
            this.db.conn._newTable(this.name);

            //default values...
        }
        else {
            this.db.conn._loadTableInfo(this);
        }

        this.inited = true;
    }

    getDictionary(){
        return this.db.getDictionary(this);
    }

    getVar(){
        return this.db.getVar(this);
    }

    insert(data){
        for(let col in data){
            let ct = col.split(':');
            if(!this.fields[ct[0]]){
                this.db.conn._alterTable(this, {todo: 'addCol', col, type: ct[1], sample: data[col]});
            }
        }
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