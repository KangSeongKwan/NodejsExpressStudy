
var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHTML = require('sanitize-html');
var template = require('../lib/template.js');
// ID식별자 사용하기위한 미들웨어
var shortid = require('shortid');
var db = require('../lib/db.js');

// router exports를 맨 마지막에 하던 것을 function형태로 리팩토링
module.exports = function(passport){
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

  // 기본 인증은 passport.authenticate('위치 및 전략'(function 생략 가능){성공 시 동작, 실패 시 동작})을 정의하는 것이 기초 형태
  router.post('/login_process', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash:true
    //successFlash:true
  }));

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

  // 회원가입 UI 화면
  router.get('/register', function(request, response){
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
      <form action="/auth/register_process" method="post">
      <p><input type="text" name="email" placeholder="email" value="kang2772@gmail.com"></p>
      <p><input type="password" name="pwd" placeholder="password" value="111111"></p>
      <p><input type="password" name="pwd2" placeholder="password" value="111111"></p>
      <p><input type="text" name="displayName" placeholder="display name" value="kang"></p>
      <p>
          <input type="submit" value="register">
      </p>
      </form>`, '');
    response.send(html);
  });

  // 회원가입 과정 및 메인화면 복귀
  router.post('/register_process', function(request, response){
    var post = request.body;
    var email = post.email;
    var pwd = post.pwd;
    var pwd2 = post.pwd2;
    var displayName = post.displayName;
    if(pwd !== pwd2) {
      request.flash('error', 'Password Must Same!');
      response.redirect('/auth/register');
    } else {
      var user = {
        id:shortid.generate(),
        email:email,
        password:pwd,
        displayName:displayName
      };
      // db.get의 push에 id, email 등을 담는 것이 아닌 user 변수를 활용
      db.get('users').push(user).write();
      //Passport.js의 login모듈을 사용
      request.login(user, function(err){
        response.redirect('/');
      });
    }
  });

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

  return router;
}