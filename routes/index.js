var express = require('express');
var router = express.Router();

router.get('/',function(req,res){
    res.render('index',{title:'Express'});
});

router.route('/login')
    .get(function(req,res){
        if(req.session.user){
            res.redirect('/home');
        }
        res.render('login',{title:'用户登录'});
    })
    .post(function(req,res){
        var user ={
            username:'admin',
            password:'111'
        }
        if(req.body.username === user.username && req.body.password === user.password){
            req.session.user = user;
            res.redirect('/home');
        }else{
            req.session.error ='用户名或密码错误';
            res.redirect('/login');
        }
    });

router.get('/logout',function(req,res){
    req.session.user = null;
    res.redirect('/');
});

function authentication(req,res){
    if(!req.session.user) return res.redirect('/login');
}

router.get('/home',function(req,res){
    authentication(req,res);
    /* var user={
        username:'admin',
        password:'111'
    }
    res.render('home',{title:'Home',user:user}); */
    res.render('home',{title:'Home'});
});
module.exports = router;