
class Var {

    constructor(conn, path, parent = undefined){
        this.conn = conn;
        this.path = path;
        this.parent = parent;
    }

    get(name){

    }

    set(val, name){

    }

    proxy(){
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#browser_compatibility
        new Proxy(target, {
            
        });
    }
}

exports = Var;