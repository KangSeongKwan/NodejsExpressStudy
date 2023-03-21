// Express 모듈 가져오는 작업
const express = require('express');
const app = express();
var fs = require('fs');
var template = require('./lib/template.js');
var qs = require('querystring');
// body-parser 미들웨어를 이용해 body 부분에 들어가는 데이터 내용을 파싱할 수 있음
var bodyParser = require('body-parser');
// compression 미들웨어를 이용해 웹에서 송수신되는 데이터를 압축한다.(보통은 gzip방식)
var compression = require('compression');
var topicRoute = require('./routes/topic');

// 정적인 파일을 서비스하고자 할 때 static 미들웨어 사용
app.use(express.static('public'));
// bodyParser 미들웨어를 가져오는 표현식
app.use(bodyParser.urlencoded({extended : true}));
// compression 미들웨어 가져오는 표현식
app.use(compression());
// readdir 호출을 미들웨어화
app.use(function(request, response, next){
  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
    next();
  });
})

// Router 기능을 활용하여 소스코드를 파일단위로 관리
app.use('/topic', topicRoute);


/* app.get을 통해 최상위 루트로 접속하는 request에 대해 response로 Hello World 출력
첫 번째 인자로 접속 경로, 두 번째 인자로 Callback 함수를 호출하도록 약속되어 있음
app.get('/', (req, res) => res.send('Hello World'));
*/
// express가 제공하는 route 기능을 활용하면 코드가 Express 사용 전보다 간소화됨
// get메소드는 express 모듈의 Router 객체가 갖고있는 함수임.
// get, post, send 메소드 등이 존재함.
app.get('/', function(request, response) {
  var title = 'Welcome';
  var description = 'Hello, Node.js';
  var list = template.list(request.list);
  var html = template.HTML(title, list, `<h2>${title}</h2>
  <p>${description}</p>
  <img src="/images/hello.jpg" style="width:300px; display:block margin-top:10px;">
  `, `
  <a href="/topic/create">Create</a>`);
  response.send(html);
});


app.use(function(req, res, next){
  res.status(404).send('Sorry Can not find that!');
});

app.use(function(err, req, res, next){  
  res.status(500).send('Something broke!');
});

app.listen(3000, 
  () => console.log('Example app listening of port 3000'));