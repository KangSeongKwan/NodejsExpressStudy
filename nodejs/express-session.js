var express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')
// 세션 데이터를 세션 파일에 저장하기 위한 모듈
var FileStore = require('session-file-store')(session)

var app = express()

// session 미들웨어는 request 의 session 객체를 추가함
app.use(session({
  secret: 'adfaffafsdfasfs',
  // 세션 데이터 값이 바뀌건 바뀌지 않건 계속 세션 데이터 저장소에 값을 저장하는 옵션이므로 false 권장
  resave: false,
  // 세션이 필요하기 전 까지 세션을 구동시키지 않는 옵션으로 true가 권장값
  saveUninitialized: true,
  // 세션파일 저장소를 생성하는 코드
  store:new FileStore()
}))

/*
app.use(function (req, res, next) {
  if (!req.session.views) {
    req.session.views = {}
  }

  // get the url pathname
  var pathname = parseurl(req).pathname

  // count the views
  req.session.views[pathname] = (req.session.views[pathname] || 0) + 1

  next()
})
*/

app.get('/', function (req, res, next) {
  if(req.session.num == undefined) {
    req.session.num = 1;
  }
  else {
    req.session.num += 1;
  }
  
  res.send(`Views : ${req.session.num}`);
})


app.listen(3000, function(){
    console.log('3000')
})