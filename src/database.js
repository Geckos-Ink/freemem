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

        this.cols = undefined; // defined by connection...

        this.init();
    }

    init(){
        if(this.inited)
            return;

        // create only when it needed
        if(!this.db.tableExists(this.name)){
            this.db.conn._newTable(this.name);
        }
        
        this.db.conn._loadTableInfo(this);

        for(let c in this.cols){
            let col = this.cols[c];

            let name = col.name;
            if(name.startsWith('__')){
                name = name.substr(2);
                col.typeTable = name; 
            }

            this.cols[name] = col.name;
            delete this.cols[col.name];
        }

        this.inited = true;
    }

    getDictionary(){
        return this.db.getDictionary(this);
    }

    getVar(){
        return this.db.getVar(this);
    }

    get(where){
        if(typeof where == 'number')
            where = [['id=',where]];
        
        let row = new Vars.Row(this, this.select({get: true, where: where}));
        return row;
    }

    insert(data){
        return this.db.conn._insertIntoTable(this, data);
    }

    select(opts){
        return this.db.conn._tableSelect(this, opts);
    }

    update(opts){
        return this.db.conn._tableUpdate(this, opts);
    }

    delete(opts){
        return this.db.conn._tableDelete(this, opts);
    }

    ///
    /// Internals
    ///
    _getWhere(opts){
        if(!opts) return [];
        if(opts.where) return opts.where;
        return opts;
    }

    _checkWhere(opts){
        let where = this._getWhere(opts);
                
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