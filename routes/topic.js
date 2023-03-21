var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHTML = require('sanitize-html');
var template = require('../lib/template.js');

// 여기서 순서가 중요해지게됨. /topic 아래에서는 우선순위가 create가 먼저 실행되는 부분
router.get('/create', function(request, response){
    var title = 'WEB - create';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
      <form action="/topic/create_process" method="post">
      <p><input type="text" name="title" placeholder="title"></p>
      <p>
          <textarea name="description" placeholder="description"></textarea>
      </p>
      <p>
          <input type="submit">
      </p>
      </form>
    `);
    response.send(html);
  });
  
  router.post('/create_process', function(request, response){
    var post = request.body;
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function(err){
      response.redirect(`/topic/${title}`);
      /*
      response.writeHead(302, {Location: `/?id=${title}`});
      response.end();
      */
    });
  
    /* body-parser의 urlencode 미들웨어를 활용해 리팩토링
    var body = '';
    request.on('data', function(data){
      body += data;
    });
    request.on('end', function(){
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`./data/${title}`, description, 'utf8', function(err){
        response.writeHead(302, {Location: `/?id=${title}`});
        response.end();
      });
    });
    */
  });
  
  router.get('/update/:pageId', function(request, response){
    var filterId = path.parse(request.params.pageId).base;
    fs.readFile(`./data/${filterId}`, 'utf-8', function(err, description){
      var title = request.params.pageId;
      var list = template.list(request.list);
      var html = template.HTML(title, list, `
        <form action="/topic/update_process" method="post">
        <input type="hidden" name="id" value="${title}">
        <p><input type="text" name="title" 
        placeholder="title" value="${title}"></p>
        <p>
            <textarea name="description" 
            placeholder="description">${description}</textarea>
        </p>
        <p>
            <input type="submit">
        </p>
        </form>
      `,
      `
      <a href="/topic/create">Create</a> 
      <a href = "/topic/update/${title}">Update</a>`);
      response.send(html);
    });
  });
  
  router.post('/update_process', function(request, response){
    var post = request.body;
    var id = post.id;
    var filterId = path.parse(id).base;
    var title = post.title;
    var description = post.description;
    fs.rename(`./data/${filterId}`, `./data/${title}`, function(error){
      fs.writeFile(`./data/${title}`, description, 'utf8', function(err){
        response.redirect(`/topic/${title}`)
      });
    });
  });
  
  router.post('/delete_process', function(request,response){
    var post = request.body;
    var id = post.id;
    var filterId = path.parse(id).base;
    fs.unlink(`./data/${filterId}`, function(error){
      response.redirect('/');      
      /* 리다이렉션 기능은 위처럼 express 스타일로 리팩토링 가능
      response.writeHead(302, {Location: '/'});
      response.end();
      */
    });
  });
  
  // :pageId 부분은 /page 아래에 인수를 주면 그 값을 request.params에 저장함.
  router.get('/:pageId', function(request, response, next) {
    // 정확하게는 request.params에는 /page/아래의 모든 :변수명 값을 저장함
    var filterId = path.parse(request.params.pageId).base;
    var list = template.list(request.list);
    fs.readFile(`./data/${filterId}`, 'utf-8', function(err, description){
      if(err){
        next(err);
        // next('route'); 는 정상처리임
      }
      else {
        var title = request.params.pageId;
        var sanitizedTitle = sanitizeHTML(title);
        var sanitizedDescription = sanitizeHTML(description, {
          allowedTags:['h1']
        });
        var html = template.HTML(title, list, `<h2>${sanitizedTitle}</h2>
        <p>${sanitizedDescription}</p>`,
        `
        <a href= "/topic/create">Create</a> 
        <a href = "/topic/update/${sanitizedTitle}">Update</a>    
        <form action="/topic/delete_process" method="post">
          <input type="hidden" name="id" value="${sanitizedTitle}">
          <input type="submit" value="delete">
        </form>`);
        // QueryString을 사용하는 것은 Get 방식
        /* 삭제 버튼을 Link로 구현하는 것은 대단히 잘못된일(소스를 조작할 수 있기 때문)
        <a href = "/delete?id=${title}">Delete</a> 
        */
        response.send(html);
      }
    
    });
  });
  module.exports = router;