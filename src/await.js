
async function waitForIt(fun){
    await new Promise((resolve) => {
        let interval = setInterval(()=>{
            if(!fun()){
                clearInterval(interval);
                resolve();
            }
        }, 1);
    });
}

module.exports = function(fun){
    let good = false;

    try{
        let deasync = require('deasync')        
        deasync.loopWhile(fun);
        good = true;
    }catch{}

    if(!good){
        waitForIt(fun);
    }
}