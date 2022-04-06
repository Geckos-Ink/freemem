
module.exports = function(fun){
    //todo: check if package is installed
    require('deasync').loopWhile(fun);
}