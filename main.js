// Express 모듈 가져오는 작업
var express = require('express');
var app = express();
var fs = require('fs');
// body-parser 미들웨어를 이용해 body 부분에 들어가는 데이터 내용을 파싱할 수 있음
var bodyParser = require('body-parser');
// compression 미들웨어를 이용해 웹에서 송수신되는 데이터를 압축한다.(보통은 gzip방식)
var compression = require('compression');
// 잘 알려진 보안 이슈를 자동으로 해결할 수 있는 도구로 app.use까지 하면 기본 기능을 사용할 수 있음
var helmet = require('helmet');
app.use(helmet());
var session = require('express-session')
// 세션 데이터를 세션 파일에 저장하기 위한 모듈
var FileStore = require('session-file-store')(session)
// connect-flash를 사용하면 성공 및 실패 메시지를 한 번만 볼 수 있게 할 수 있음
// 보통 로그인 실패 시 다시 로그인하라고 할 때 많이 사용하는 듯 하다
var flash = require('connect-flash');

// 정적인 파일을 서비스하고자 할 때 static 미들웨어 사용
app.use(express.static('public'));

// bodyParser 미들웨어를 가져오는 표현식
app.use(bodyParser.urlencoded({extended : true}));

// compression 미들웨어 가져오는 표현식
app.use(compression());

app.use(session({
  // secure: true 값 부여하면 hhtps에서만 세션을 주고받을 수 있도록 할 수 있음
  // HttpOnly: true 값 부여하면 자바스크립트를 통해 세션 쿠키를 사용할 수 없도록 강제할 수 있음
  secret: 'adfaffafsdfasfs',
  // 세션 데이터 값이 바뀌건 바뀌지 않건 계속 세션 데이터 저장소에 값을 저장하는 옵션이므로 false 권장
  resave: false,
  // 세션이 필요하기 전 까지 세션을 구동시키지 않는 옵션으로 true가 권장값
  saveUninitialized: true,
  // 세션파일 저장소를 생성하는 코드
  store:new FileStore()
}))
// 내부적으로 세션을 사용하므로 반드시 세션 밑에 미들웨어 정의해야 함
app.use(flash());

/*
app.get('/flash', function(req, res){
  // 페이지 Reload 할 때 마다 Session에 Flash 메시지가 추가됨
  req.flash('msg', 'Flash is Back!!');
  res.send('flash');
});

// flash 데이터 삭제하는 동작
app.get('/flash-display', function(req, res){
  var fmsg = req.flash();
  console.log(fmsg);
  res.send(fmsg);
  // res.render('index', { message: req.flash('info') });
})
*/

// 이 형태로 passport 모듈 안에 정의된 function에 express를 주입시킬 수 있음
var passport = require('./lib/passport.js')(app);

// readdir 호출을 미들웨어화
app.get('*', function(request, response, next){
  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
    next();
  });
})

// index.js에 있는 메인페이지 가져오기
var indexRouter = require('./routes/index');
var topicRoute = require('./routes/topic');
var authRoute = require('./routes/auth')(passport);

// Router를 활용하여 인덱스 페이지를 따로 분리
app.use('/', indexRouter);
// Router 기능을 활용하여 소스코드를 파일단위로 관리
app.use('/topic', topicRoute);
app.use('/auth', authRoute);
 
app.use(function(req, res, next){
  res.status(404).send('Sorry Can not find that!');
});

app.use(function(err, req, res, next){ 
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(3000, 
  () => console.log('Example app listening of port 3000'));