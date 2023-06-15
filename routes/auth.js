var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHTML = require('sanitize-html');
var template = require('../lib/template.js');

// 여기서 순서가 중요해지게됨.
router.get('/login', function(request, response){
  var fmsg = request.flash();
  var feedback = '';
  if(fmsg.error){
    feedback = fmsg.error[0];
  }
  console.log(fmsg);
  var title = 'WEB - login';
  var list = template.list(request.list);
  var html = template.HTML(title, list, `
    <div style="color:red;">${feedback}</div>
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



/* 기존의 세션활용한 인증 방식
router.post('/login_process', function(request, response){
  var post = request.body;
  var email = post.email;
  var password = post.passowrd;
  if(email === authData.email && password === authData.password) {
    // login success
    request.session.is_logined = true;
    request.session.nickname = authData.nickname;
    // 세션 객체에 있는 데이터를 세션 데이터 스토어에 반영하는 작업을 바로 시작한다.(작업이 끝나고 callback 호출되도록 약속되어 있음)
    // 이 함수 안쓰면 모든 작업이 끝나고 세션 스토어에 데이터 기록을 시작함
    request.session.save(function(){
      response.redirect(`/`);
    });
  } else {
    response.send('Who?');
  }
});
*/

router.get('/logout', (request, response) => {
  /*
    passport.js 버전 때문인지 request.logout() 안에 콜백함수 정의해야함
  */
  request.logout(() => {
    request.session.save(function(err){
      if(err) { throw err; }
      response.redirect('/');
    });
  });
  
  /* 기존의 세션방식
  request.session.destroy(function(err){
    response.redirect('/');
  });
  */
});


module.exports = router;