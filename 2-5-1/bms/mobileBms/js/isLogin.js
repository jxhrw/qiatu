function isWeiXin(){
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
}
KISSY.use('io,node',function(S,io,Node){
    io({
      type:'post',
        url:'/bms/h5/business/is_login.json',
        data:{

        },
        success:function(data){
           if(data.sc==0){
           
           }
          else{
            if(isWeiXin()){
              window.location="/user/bmsh5/weixinauth"
            }
            else{
              window.location="/html/bms/mobileBms/login.html"
            }
            
           }
        }
    });
});