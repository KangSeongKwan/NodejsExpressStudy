// Express 모듈 가져오는 작업
var express = require('express');
var app = express();
var fs = require('fs');
// body-parser 미들웨어를 이용해 body 부분에 들어가는 데이터 내용을 파싱할 수 있음
var bodyParser = require('body-parser');
// compression 미들웨어를 이용해 웹에서 송수신되는 데이터를 압축한다.(보통은 gzip방식)
var compression = require('compression');
var topicRoute = require('./routes/topic');
// index.js에 있는 메인페이지 가져오기
var indexRouter = require('./routes/index');
// 잘 알려진 보안 이슈를 자동으로 해결할 수 있는 도구로 app.use까지 하면 기본 기능을 사용할 수 있음
var helmet = require('helmet');
app.use(helmet());


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

// Router를 활용하여 인덱스 페이지를 따로 분리
app.use('/', indexRouter);
// Router 기능을 활용하여 소스코드를 파일단위로 관리
app.use('/topic', topicRoute);

app.use(function(req, res, next){
  res.status(404).send('Sorry Can not find that!');
});

app.use(function(err, req, res, next){  
  res.status(500).send('Something broke!');
});

app.listen(3000, 
  () => console.log('Example app listening of port 3000'));