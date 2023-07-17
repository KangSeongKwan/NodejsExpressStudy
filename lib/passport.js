var db = require('./db.js');

module.exports = function(app){
    var authData = {
        email:'kang2222@gmail.com',
        passowrd:'111111',
        nickname:'kangsk'
    }
    // passport는 내부적으로 발생되는 session을 사용하기 때문에 반드시 세션 생성 코드 아래에 passport 동작을 명시해야 한다.
    // 모듈 import는 여기에 해도 상관이 없음
    var passport = require('passport'), 
    LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize());
    app.use(passport.session());

    // 로그인이 성공하면 해당 객체의 함수를 호출하여 이벤트를 처리하도록 약속되어 있음(로그인 성공 기록을 세션 스토어에 저장하는 것)
    // 딱 한번 호출되는 메소드(성공 후 성공 기록을 저장하기 때문)
    passport.serializeUser(function(user, done){
        console.log('serializeUser', user);
        done(null, user.id);
        // 더미데이터 전용 done(null, user.email);
    });

    // 로그인 성공 후 각각 아무 페이지를 탈 때 마다 로그인 사용자가 맞는지 아닌지 체크할 때 호출됨
    // 호출될 때 마다 id값을 함수의 인자에 주입함
    passport.deserializeUser(function(id, done){
        var user = db.get('users').find({id:id}).value();
        done(null, user);
        /* User.findById(id, function(err, user){
            done(err, user);
        });
        */
    });

    // 이게없으면 로그인 작업을 수행을 안함(local 로그인 전략 구성)
    passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'pwd'
    },
    function(username, password, done){
        console.log('LocalStrategy', username, password);
        if(username === authData.email){
            if(password === authData.passowrd){
                return done(null, authData, {
                message: 'Welcome!'
            });
        } else {   
            return done(null, false, {
            message: 'Incorrect password'
            });
        }
        } else{
            return done(null, false, {
                message: 'Incorrect username'
            });
            }
        }
    ));
    
    return passport;
}




