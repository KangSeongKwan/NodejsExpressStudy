// Express 모듈 가져오는 작업
const { request } = require('express');
const express = require('express');
const app = express();

/* app.get을 통해 최상위 루트로 접속하는 request에 대해 response로 Hello World 출력
첫 번째 인자로 접속 경로, 두 번째 인자로 Callback 함수를 호출하도록 약속되어 있음
app.get('/', (req, res) => res.send('Hello World'));
*/
app.get('/', function(req, res) {
  return res.send('Hello World')
});

app.get('/page', function(req, res) {
  return res.send('/page')
});

app.get('/page:pageId', function(req, res) {
  var title = req.params.pageId;
  return res.send(title);
});

app.listen(3000, () => console.log('Example app listening of port 3000'));