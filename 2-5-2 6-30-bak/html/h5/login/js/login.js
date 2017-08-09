$(document).ready(function(){
    $(".mask").height($(window).height());

    $("#code,#phone").keyup(function(){
        if($("#code").val().length=="6" && $("#phone").val().length=="11"){
            $(".loginBtn").removeClass("cannotSub");
        }else {
            $(".loginBtn").addClass("cannotSub");
        }
    });

    $("#getCode").click(function(){
        var phone=$("#phone").val();
        if(/^1[3-8][0-9]\d{4,8}$|^886[0-9]{10}$/.test(phone)){
            timee(phone);
        }else {
            errorPrompt("手机号码不正确",2000);
        }
    });

    //提交手机和验证码
    var bindtoken="";
    $(".closeBtn,.shadow").click(function(event) {
        $(".mask").hide();
    });
        //登录注册
    $("#loginBtn").click(function () {
        var data={"accountname":$("#phone").val(),"verifycode":$("#code").val()};
        $.post('/user/h5/loginbyphone' ,{data:JSON.stringify(data)},function(resu){
            console.log(resu);
            if(resu.sc==0){
                window.location.href = resu.data.jumpurl;
            }else if(resu.sc=="-99999"){
                errorPrompt("系统繁忙",2000);
            }else{
                errorPrompt(resu.ErrorMsg,2000);
            }
        });
    });
        //绑定手机号
    $("#bindPhoneBtn").click(function(event) {
        var data={"accountname":$("#phone").val(),"verifycode":$("#code").val()};
        var url='/user/h5/bindmobile';
        $("#bindPhoneBtn").addClass("cannotSub");
        $.post(url,{data: JSON.stringify(data)},function (data) {
            if(data.sc=="-99999" || data.sc=="-1"){
                errorPrompt("系统繁忙",2000);
            }
            else if(data.sc=="USER-1011"){
                $(".newweixin").html(data.data.newweixin);
                $(".oldweixin").html(data.data.oldweixin);
                $(".mask").show();
                bindtoken=data.data.bindtoken;
            }
            else if (data.sc=="0") {
                window.location.href=data.data.jumpurl;
            }
            else{
                errorPrompt(data.ErrorMsg,2000);
            }
            $("#bindPhoneBtn").removeClass("cannotSub");
        })
    });
    $(".fanPaiBtn").click(function(event) {
        $(".fanPaiBtn").addClass("no");
        var bind={"bindtoken":bindtoken};
        $.post('/user/h5/bindmobile', {data: JSON.stringify(bind)}, function(data) {
            if (data.sc=="0") {
                window.location.href=data.data.jumpurl;
            }else if(data.sc=="-99999"){
                errorPrompt("系统繁忙",2000);
            }else{
                errorPrompt(data.ErrorMsg,2000);
            }
            $(".fanPaiBtn").removeClass("no");
        })
    });
    //提交手机和验证码结束

    //其他登录方式
    var params = GetParams();
    if(params["weiboAuth"]){
        $("#weiboAuth").click(function(){
            window.location.href=decodeURIComponent(params["weiboAuth"]);
        });
    }
});

var jsTime=0;
function timee(phone){
    if(jsTime==0){
        var data={"accountname":phone,'verifycodetype':1};
        jsTime=59;
        $("#getCode").val(jsTime+"s").removeClass("red").addClass("no");
        $.post('/user/h5/getverifycode',{data:JSON.stringify(data)},function(resu){
            console.log(resu);
        });
        var timeCon=setInterval(function(){
            jsTime--;
            $("#getCode").val(jsTime+"s");
            if(jsTime==0){
                $("#getCode").val("重新发送").removeClass("no").addClass("red");
                clearInterval(timeCon);
            }
        },1000)
    }
}