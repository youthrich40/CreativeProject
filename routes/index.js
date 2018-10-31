var express = require('express');
var router = express.Router();
var fs = require('fs');
var cors = require("cors");
//var request = require('request');
//request = request.defaults({jar: true});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('login.html', { root:  'public' });
});

module.exports = router;

var username;
var password;

//this.cookieJar = request.jar();

var clerkURL = 'http://clerk.lds.org';
var loginURL = 'https://ident.lds.org/sso/UI/Login';
var unitListURL = 'https://www.lds.org/directory/services/web/v3.0/unit/current-user-units/';
var teachingPoolURL = "https://www.lds.org/mls/mbr/services/report/progress-record/%s/teaching-pool?lang=eng";

var request = require('request');

router.post('/login', function(req, res) {
    username = req.body.user;
    password = req.body.password;
    
    var j = request.jar();
    request = request.defaults({jar:j});
});

router.get('/getUnits', function(req,res) {                                                                                  //https://stackoverflow.com/questions/17765525/scraping-a-website-which-requires-authentication-using-node-js
    request.get({
        url: clerkURL,
        method:"GET",
        followAllRedirects: true,
        //jar: this.cookieJar
    },
    function(error,response,body){
        console.log("In callback");
        if(response.statusCode == 200){
            console.log('Success??');
        } else {
            console.log('error: '+ response.statusCode);
            //console.log(body);
        }
        request.post({
            url: loginURL,
            method: "POST",
            form:{  IDToken1: username,
                    IDToken2: password,
                    IDButton: 'Log+In',
                    goto: '',
                    gotoOnFail: '',
                    SunQueryParamsString: 'c2VydmljZT1jcmVkZW50aWFscw==',
                    encoded: 'false',
                    gx_charset: 'UTF-8'
            },
            followAllRedirects: true,
        },
        function(error, response, body) {
            if(response.statusCode == 200) {
                console.log('Success??');
            } else {
                console.log('error: '+ response.statusCode);
            }
            
            request.get({
                path: "/directory/services/web/v3.0/unit/current-user-units/",
                scheme: "https",
                authority: 'www.lds.org',
                url: unitListURL,
                method: "GET",
                gzip: true,
                followAllRedirects: true,
            }, function(error, response, body) {
                //console.log(req.headers);
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

router.get('/getTeachingPool', function(req,res) {                                                                                  //https://stackoverflow.com/questions/17765525/scraping-a-website-which-requires-authentication-using-node-js
  console.log("In teaching pool getter, q=" + req.query.q);
  teachingPoolURL = teachingPoolURL.replace(/%s/g, req.query.q);
  console.log("url = " + teachingPoolURL);

            request.get({
                scheme: "https",
                authority: 'www.lds.org',
                url: teachingPoolURL,
                method: "GET",
                gzip: true,
                followAllRedirects: true,
            }, function(error, response, body) {
                //console.log(req.headers);
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