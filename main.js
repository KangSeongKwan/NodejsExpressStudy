// Express 모듈 가져오는 작업
const express = require('express');
const app = express();
var fs = require('fs');
var template = require('./lib/template.js');
var qs = require('querystring');
var path = require('path');
var sanitizeHTML = require('sanitize-html');

/* app.get을 통해 최상위 루트로 접속하는 request에 대해 response로 Hello World 출력
첫 번째 인자로 접속 경로, 두 번째 인자로 Callback 함수를 호출하도록 약속되어 있음
app.get('/', (req, res) => res.send('Hello World'));
*/
// express가 제공하는 route 기능을 활용하면 코드가 Express 사용 전보다 간소화됨
// get메소드는 express 모듈의 Router 객체가 갖고있는 함수임.
// get, post, send 메소드 등이 존재함.
app.get('/', function(request, response) {
  fs.readdir('./data', function(error, filelist){
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(filelist);
    var html = template.HTML(title, list, `<h2>${title}</h2>
    <p>${description}</p>`, `
    <a href="/create">Create</a>`);
    response.send(html);
  });
});

// :pageId 부분은 /page 아래에 인수를 주면 그 값을 request.params에 저장함.
app.get('/page/:pageId', function(request, response) {
  fs.readdir('./data', function(error, filelist){
    // 정확하게는 request.params에는 /page/아래의 모든 :변수명 값을 저장함
    var filterId = path.parse(request.params.pageId).base;
    var list = template.list(filelist);
    fs.readFile(`./data/${filterId}`, 'utf-8', function(err, description){
      var title = request.params.pageId;
      var sanitizedTitle = sanitizeHTML(title);
      var sanitizedDescription = sanitizeHTML(description, {
        allowedTags:['h1']
      });
      var html = template.HTML(title, list, `<h2>${sanitizedTitle}</h2>
      <p>${sanitizedDescription}</p>`,
      `
      <a href= "/create">Create</a> 
      <a href = "/update/${sanitizedTitle}">Update</a>    
      <form action="delete_process" method="post">
        <input type="hidden" name="id" value="${sanitizedTitle}">
        <input type="submit" value="delete">
      </form>`);
      // QueryString을 사용하는 것은 Get 방식
      /* 삭제 버튼을 Link로 구현하는 것은 대단히 잘못된일(소스를 조작할 수 있기 때문)
      <a href = "/delete?id=${title}">Delete</a> 
      */
      response.send(html)
    });
  });
});

app.get('/create', function(request, response){
  fs.readdir('./data', function(error, filelist){
    var title = 'WEB - create';
    var list = template.list(filelist);
    var html = template.HTML(title, list, `
      <form action="/create_process" method="post">
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
});

app.post('/create_process', function(request, response){
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
});

app.get('/update/:pageId', function(request, response){
  var filterId = path.parse(request.params.pageId).base;
  fs.readdir('./data/', function(error, filelist){
    fs.readFile(`./data/${filterId}`, 'utf-8', function(err, description){
      var title = request.params.pageId;
      var list = template.list(filelist);
      var html = template.HTML(title, list, `
        <form action="/update_process" method="post">
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
      <a href="/create">Create</a> 
      <a href = "/update/${title}">Update</a>`);
      response.send(html);
    });
  });
});

app.post('/update_process', function(request, response){
  var body = '';
  request.on('data', function(data){
    body += data;
  });
  request.on('end', function(){
    var post = qs.parse(body);
    var id = post.id;
    var filterId = path.parse(id).base;
    var title = post.title;
    var description = post.description;
      fs.rename(`./data/${filterId}`, `./data/${title}`, function(error){
        fs.writeFile(`./data/${title}`, description, 'utf8', function(err){
          response.writeHead(302, {Location: `/?id=${title}`});
          response.end();
      });
    });
  });
});
app.listen(3000, () => console.log('Example app listening of port 3000'));