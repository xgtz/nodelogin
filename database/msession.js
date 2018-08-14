var Settings = require('./settings');
var Db = require('mongodb').Db;
var Server = require('mongodb').Server;
var db=new Db(Settings.DB,new Server(Settings.HOST,Settings.PORT,{auto_reconect:true,native_parser:true}),{safe:true});

module.exports = db;
