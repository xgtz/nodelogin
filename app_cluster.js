var cluster = require('cluster');

function startWorker(){
    var workder = cluster.fork();
    console.log('CLUSTER:Worker %d started', workder.id);
}

if(cluster.isMaster){
    require('os').cpus().forEach(function(){
        startWorker();
    });
    cluster.on('disconnect',function(worker){
        console.log('CLUSTER:Worker %d disconnected from the cluster.',worker.id);
    });
    cluster.on('exit',function(worker,code,signal){
        console.log('CLUSTER:Worker %d dided with exit code %d(%d)',worker.id,code,signal);
        startWorker();
    });
}else{
    require('./app.js')();
}