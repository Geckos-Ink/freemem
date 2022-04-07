const db = require('./database');

module.exports = {};

class Var {

    constructor(table, path, parent = undefined){
        this.table = table;
        this.path = path || '';
        this.parent = parent;
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
    }
}

module.exports.Dictionary = Dictionary;