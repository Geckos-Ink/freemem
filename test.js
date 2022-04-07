const freemem = require('./index');

let sqlite = freemem('test.sqlite');
let db = sqlite.getDb();
let tableTest = db.getTable('test');

let testVar = new freemem.Var(db);