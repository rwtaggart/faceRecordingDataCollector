// This is some bogus 'worker' file

var debug = require('debug')('worker');  // We're naming this debug 'module' "worker"

setInterval(function(){ 
    debug('doing some bogus work at sn interval.')    
})