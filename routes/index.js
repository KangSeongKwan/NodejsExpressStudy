/* app.get을 통해 최상위 루트로 접속하는 request에 대해 response로 Hello World 출력
첫 번째 인자로 접속 경로, 두 번째 인자로 Callback 함수를 호출하도록 약속되어 있음
app.get('/', (req, res) => res.send('Hello World'));
*/
// express가 제공하는 route 기능을 활용하면 코드가 Express 사용 전보다 간소화됨
// get메소드는 express 모듈의 Router 객체가 갖고있는 함수임.
// get, post, send 메소드 등이 존재함.
var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
var auth = require('../lib/auth.js');

router.get('/', function(request, response) {
    /* Passport 0.6부터는 지원을 안하는 코드인 것으로 보임
    var fmsgsuc = request.flash();
    var feedback = '';
    if(fmsgsuc.success){
      feedback = fmsgsuc.success[0];
    }
    console.log(feedback);
    <div style="color:blue;">${feedback}</div>
    */
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
    <h2>${title}</h2>
    <p>${description}</p>
    <img src="/images/hello.jpg" style="width:300px; display:block margin-top:10px;">
    `, `
    <a href="/topic/create">Create</a>`, auth.StatusUI(request, response));
    response.send(html);
  });

module.exports = router;