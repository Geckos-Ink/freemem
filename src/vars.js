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

        if(!row)
            return;
        
        for(let f in row){
            Object.defineProperty(this, f, { 
                get() { 
                    let id = this._changes[f] || row[f];

                    if(this._table.cols[f].typeTable){
                        let colTable = this._table.db.getTable(typeTable);
                        return colTable.get(id);
                    }

                    return id; 
                },
                set(val) { 
                    if(val instanceof Row)
                        val = val.id;

                    this._changes[f] = val;
                }
            });
        }

        if(this.Exists) 
            this.exists = true;
        else
            this.Exists = true;


        Object.defineProperty(this, '_', {
            get(){
                if(!this.__)
                    this.__ = new Proxy(this, {
                        get(target, prop) { //,receiver => you know also where to it's assigned
                            return target[prop];
                        },
                        set(target, prop, val){
                            target._changes[prop] = val;
                        }
                    });

                return this.__;
            }
        })

        
    }
}

module.exports.Row = Row;
