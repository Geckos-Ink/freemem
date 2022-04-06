const db = require('./database');

class Var {

    constructor(table, path, parent = undefined){
        if(table instanceof db.Database)
            table = table.getTable('vars');

        this.table = table;
        this.path = path;
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

exports = Var;