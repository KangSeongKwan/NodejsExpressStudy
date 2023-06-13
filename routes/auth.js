var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHTML = require('sanitize-html');
var template = require('../lib/template.js');

var authData = {
  email:'kang2222@gmail.com',
  passowrd:'111111',
  nickname:'kangsk'
}

// 여기서 순서가 중요해지게됨. /topic 아래에서는 우선순위가 create가 먼저 실행되는 부분
router.get('/login', function(request, response){
  var title = 'WEB - login';
  var list = template.list(request.list);
  var html = template.HTML(title, list, `
    <form action="/auth/login_process" method="post">
    <p><input type="text" name="email" placeholder="email"></p>
    <p>
      <p><input type="password" name="pwd" placeholder="password"></p>
    </p>
    <p>
        <input type="submit" value="login">
    </p>
    </form>`, '');
  response.send(html);
});

router.post('/login_process', function(request, response){
  var post = request.body;
  var email = post.email;
  var password = post.passowrd;
  if(email === authData.email && password === authData.password) {
    // login success
    request.session.is_logined = true;
    request.session.nickname = authData.nickname;
    response.redirect(`/`);
  } else {
    response.send('Who?');
  }
});

module.exports = router;