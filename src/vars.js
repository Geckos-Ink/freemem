const db = require('./database');

module.exports = {};

class Var {

    constructor(table, path, parent = undefined){
        this.table = table;
        this.path = path || '';
        this.parent = parent;

        console.error("TODO: Var");
    }

    get(name=undefined){

    }

    set(val, name=undefined){

    }

    delete(name=undefined){

    }

    proxy(){
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#browser_compatibility
        new Proxy(target, {
            
        });
    }

    init(){
        this.table.init();
    }
}

module.exports.Var = Var;

class Dictionary {
    constructor(table){
        if(table instanceof db.Database)
            table = table.getTable('vars');  

        this.table = table;

        console.error("TODO: Dictionary");
    }

    get(parent=0){

    }

    set(val, parent=0){

    }
}

module.exports.Dictionary = Dictionary;

///
/// For clarity
///

class Row {
    constructor(table, row){
        this._table = table;
        this._row = row;
        this._changes = {};

        for(let f in row){
            Object.defineProperty(this, f, { 
                get() { 
                    return this._changes[f] || row[f]; 
                },
                set(val) { 
                    if(val instanceof Row)
                        val = val.id;
                        
                    this._changes[f] = val;
                }
            });
        }
    }
}

module.exports.Row = Row;
