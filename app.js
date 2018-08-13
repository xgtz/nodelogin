var http = require('http'),
    express = require('express'),
    fs = require('fs')
    routes =require('./routes/index');

var app=express();
var handlebars = require('express3-handlebars').create({
    defaultLayout:'main',
    helpers:{
        section:function(name,options){
            if(!this._sections) this._sections={};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});
app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');
app.set('port',process.env.PORT || '3000');

app.use(require('morgan')('dev'));
app.use(express.static(__dirname+'/public'));
app.use(require('body-parser')());

app.use(function(req,res,next){
    var domain = require('domain').create();
    domain.on('error',function(err){
        console.log('DOMAIN ERROR CAUGHT\n',err.stack);
        try{
            setTimeout(function(){
                console.error('Failsafe shutdown.');
                process.exit(1);
            },5000);
            var worker = require('cluster').worker;
            if(worker) worker.disconnect();
            server.close();
            try{
                next(err);
            }
            catch(err){
                console.error('Express error mechaism failed.\n',err.stack);
                res.statusCode(500);
                res.setHeader('content-type','text/plain');
                res.end('Server error.');
            }
        }
        catch(err){
            console.log('Unable to send 500 response. \n',err.stack);
        }
    });
    domain.add(req);
    domain.add(res);
    domain.run(next);
});

app.use(function(req,res,next){
    var cluster = require('cluster');
    if(cluster.isWorker) console.log('Worker %d received request.',cluster.worker.id);
    next();
});

app.use('/',routes)

app.use(function(req,res,next){
    res.status(404);
    res.render('404');
});
app.use(function(err,req,res,next){
    console.log(err.stack);
    res.status(500);
    res.render('500');
});

function startServer(){
    http.createServer(app).listen(app.get('port'),function(){
        console.log('Express started in '+app.get('env')+
        ' mode on http://localhost:'+app.get('port'));
    });
}

if(require.main === module){
    startServer();
}
else{
    module.exports = startServer;
}