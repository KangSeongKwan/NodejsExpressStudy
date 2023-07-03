// 로그인 상태 표시를 위한 함수들을 모듈화하여 각종 페이지에 활용

module.exports = {
    IsOwner:function(request,response){
        if(request.user){
          // request.session.is_logined와 동일한 동작(없다면 로그인에 실패한 것이기 때문)
            return true;
          } else {
            return false;
          }
    },
    StatusUI:function(request,response){
        var authStatusUI = '<a href="/auth/login">login</a> | <a href="/auth/register">Register</a>';
        if(this.IsOwner(request, response)){
        authStatusUI = `${request.user.nickname} | <a href="/auth/logout">logout</a>`;
        }
    
        return authStatusUI;
    }
}
