var getCode=1;//是否可以获取验证码

$(document).ready(function(){
    $("input").val("");

    $(".pbBtn").click(function(){
        var phone=$(".name").val();
        if(phone.length==11){
            getVerifycode(phone);
        }else {
            $(".pbBtn").addClass("noUse");
        }
    });

    $(".name").keyup(function(){
        if($(this).val().length==11 && getCode==1){
            $(".pbBtn").removeClass("noUse");
        }else {
            $(".pbBtn").addClass("noUse");
        }
    });

    $(".nextBtn").click(function(){
        var phone=$(".name").val();
        var code=$(".code").val();
        checkverifycode(phone,code);
    });

});

//获取验证码，phoneNum（手机号）
function getVerifycode(phoneNum){
    var data={accountname:phoneNum};
    getCode=0;
    $.post('/user/h5/getverifycode',{data:JSON.stringify(data)},function(res) {
        if(res.sc==0){
            $(".pbBtn").html("60S").addClass("noUse");
            var time=60;
            var timeCount=setInterval(function(){
                time--;
                if(time==0){
                    clearInterval(timeCount);
                    $(".pbBtn").html("接收验证码").removeClass("noUse");
                    getCode=1;
                }else {
                    $(".pbBtn").html(time+"S");
                }
            },1000);
        }
        else if(res.sc=='BASE-1003'){
            $("#prompt").show(300).html("电话号码有误");
            $(".pbBtn").html("接收验证码").removeClass("noUse");
            getCode=1;
            setTimeout(function(){
                $("#prompt").hide().html("");
            },2000)
        }
        else{
            $("#prompt").show().html("请稍后再试");
            $(".pbBtn").html("接收验证码").removeClass("noUse");
            getCode=1;
            setTimeout(function(){
                $("#prompt").hide().html("");
            },2000)
        }
    });
}

//验证验证码，phoneNum（手机号）,code（验证码）
function checkverifycode(phoneNum,code){
    var data={mobile:phoneNum,verifycode:code};
    $.post("/coupon/h5/externalorder/list",{data:JSON.stringify(data)},function(res){
        if(res.sc==0){
            if(res.data==""){
                $("#prompt").show().html("您没有待领取的产品");
                setTimeout(function(){
                    $("#prompt").hide().html("");
                },2000)
            }
            else {
                var goWhile=2;
                for(var i=0;undefined!=res.data && i<res.data.length;i++){
                    for(var j=0;undefined!=res.data[i].productList && j<res.data[i].productList.length;j++){
                        if(undefined==res.data[i].productList[j].receiver){
                            goWhile=1;
                        }
                    }
                }
                if(goWhile==1){
                    window.location.href="/html/member/receive/checkPhone.html?tel="+phoneNum+"&code="+code;
                }else {
                    window.location.href="/html/member/receive/recResult.html?tel="+phoneNum+"&code="+code;
                }
            }
        }
        else if("BASE-1004"==res.sc){
            $("#prompt").show().html(chinese(res.ErrorMsg));
            setTimeout(function(){
                $("#prompt").hide().html("");
            },2000)
        }else {
            $("#prompt").show().html("请稍后再试");
            setTimeout(function(){
                $("#prompt").hide().html("");
            },2000)
        }
    });

}

function chinese(str){
    var ss=str.replace(/[^\u4e00-\u9fa5]/gi,"");
    return ss;
}