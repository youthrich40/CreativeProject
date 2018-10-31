var express = require('express');
var router = express.Router();
var fs = require('fs');
var cors = require("cors");
var request = require('request');
request = request.defaults({jar: true});

var username;
var password;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('login.html', { root:  'public' });
});

module.exports = router;

//this.cookieJar = request.jar();

router.post('/login', function (req, res) {
    console.log("IN LOGIN POST");
    console.log(req.body);
    username = req.body.user;
    password = req.body.password;
})

var clerkURL = 'http://clerk.lds.org';
var loginURL = 'https://ident.lds.org/sso/UI/Login';
var unitListURL = 'https://www.lds.org/directory/services/web/v3.0/unit/current-user-units/';
var teachingPoolURL = "https://www.lds.org/mls/mbr/services/report/progress-record/%s/teaching-pool?lang=eng";
router.get('/getUnits', function(req,res) {                                                                                  //https://stackoverflow.com/questions/17765525/scraping-a-website-which-requires-authentication-using-node-js
  //var j = request.jar();
    //var request = request.defaults({ jar : true }) //it will make the session default for every request
    //...
    var request = require('request');
    var j = request.jar();
    request = request.defaults({jar:j});
    
    
    request.get({
        //headers: {'Content-Type': 'application/json'},
        url: clerkURL,
        method:"GET",
        followAllRedirects: true,
        //jar: this.cookieJar
    },
    function(error,response,body){
        console.log("In callback");
        //Do your logic here or even another request like
        if(response.statusCode == 200){
            console.log('Success??');
        } else {
            console.log('error: '+ response.statusCode);
            //console.log(body);
        }
        request.post({
            url: loginURL,
            method: "POST",
            form:{  IDToken1:username,
                    IDToken2:password,
                    IDButton: 'Log+In',
                    goto: '',
                    gotoOnFail: '',
                    SunQueryParamsString: 'c2VydmljZT1jcmVkZW50aWFscw==',
                    encoded: 'false',
                    gx_charset: 'UTF-8'
            },
            followAllRedirects: true,
            //jar: this.cookieJar
        },
        function(error, response, body) {
            if(response.statusCode == 200) {
                console.log('Success??');
                //var sessionCookies = response.headers['set-cookie'];
            } else {
                console.log('error: '+ response.statusCode);
                //console.log(body);
            }
            //res.send(response.body);
            
            request.get({
                //sessionCookies,
                headers: {
                    path: "/directory/services/web/v3.0/unit/current-user-units/",
                    scheme: "https",
                    authority: 'www.lds.org',
                    host: 'www.lds.org'
                },
                url: unitListURL,
                //header: response.headers,
                method: "GET",
                gzip: true,
                followAllRedirects: true,
                //jar: this.cookieJar
            }, function(error, response, body) {
                //console.log(req);
                if(response.statusCode == 200) {
                    console.log('Success??');
                } else {
                    console.log('error: '+ response.statusCode);
                    //console.log(body);
                }
                res.send(response.body);
                res.status(200);
            });
        });
    });
});