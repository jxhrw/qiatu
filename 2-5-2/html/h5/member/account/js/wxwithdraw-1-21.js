/**
 * Created by qianyun Yang on 2017/1/17.
 */
var phoneNum;
var owner;
var once=0;//是否能发送验证短信
$(document).ready(function () {
    if(sessionStorage.getItem("reload")==1){
        window.location.reload();
        sessionStorage.setItem("reload","0");
    }
    $.ajax({
        type: 'post',
        async: false,
        url: '/user/h5/payee',
        dataType: 'json',
        success: function (data) {
            console.log(data);
            $(".nickname").html(cutString(data.data.nickname,16));
            var imgurl=data.data.headimgurl;
            $(".headImg").prop("src",imgurl)
        }
    });
    var couldCash;
    $.ajax({
        type: 'post',
        async: false,
        url: '/pay/h5/balance/info',
        dataType: 'json',
        success: function (data) {
            console.log(data);
            couldCash=parseInt(data.data.cashBalance)/100;//可用现金资产
            $(".couldCash").html(couldCash);
            var accountName=data.data.realname;
            $(".notice span").html('('+accountName+')');
        }
    });
/*
    var tradeToken;
    $.ajax({
        type: 'post',
        async: false,
        data: {data: JSON.stringify({"tradepasswd":"111111"})},
        url: '/user/h5/checktradepasswd',
        dataType: 'json',
        success: function (data) {
            tradeToken=data.data.tradeToken;
        }
    });
*/
    $(".cashAll").click(function () {
        $(".subBtn").prop("disabled","").css("background","#000");
        if(couldCash<1){
            $(".cardInfo input").val("");
            $(".subBtn").prop("disabled","disabled").css("background","");
            $(".tip").css({'margin-top':'-11rem','display':'block'}).html("请输入大于1的提现金额");
            setTimeout(function() {
                $(".tip").css('display', 'none');
            },1500)
        }else if(couldCash>20000){
            $(".cardInfo input").val(20000);
            $(".tip").css({'margin-top':'-11rem','display':'block'}).html("每天最多可提现2万");
            setTimeout(function() {
                $(".tip").css('display', 'none');
            },1500)
        }else{
            $(".cardInfo input[type=number]").val(couldCash);
        }
    });
    $(".cardInfo input").bind('input propertychange',function () {//监听文本域内容的变化
        if($(this).val().length==0){
            $(".subBtn").prop("disabled","disabled").css("background","");
        }
        if($(this).val().length!=0){
            $(".subBtn").prop("disabled","").css("background","#000");
        }
        if($(this).val()>20000){//限制金额2万
            $(this).val(20000);
            $(".tip").css({'margin-top':'-11rem','display':'block'}).html("每天最多可提现2万");
            setTimeout(function() {
                $(".tip").css('display', 'none');
            },1500)
        }
        if($(this).val()<1&&$(this).val().length!=0){//限制金额不小于1
            $(this).val("");
            $(".tip").css({'margin-top':'-11rem','display':'block'}).html("请输入大于1的提现金额");
            setTimeout(function() {
                $(".tip").css('display', 'none');
            },1500)
        }
        if($(this).val()<1&&$(this).val().length!=0){//限制金额不小于1
            $(this).val("");
            $(".tip").css({'margin-top':'-11rem','display':'block'}).html("请输入大于1的提现金额");
            setTimeout(function() {
                $(".tip").css('display', 'none');
            },1500)
        }
        if($(this).val()>couldCash){//限制金额不小于1
            if(couldCash==0){
                $(this).val("");
                $(".subBtn").prop("disabled","disabled").css("background","");
            }else{
                $(this).val(couldCash);
            }
            $(".tip").css({'margin-top':'-11rem','display':'block'}).html("超过可提现金额 ");
            setTimeout(function() {
                $(".tip").css('display', 'none');
            },1500)
        }
    });

    $(".subBtn").click(function () {
        $(".popupT").height($(window).height());
        $.ajax({
            type: 'post',
            async: false,
            url: '/user/h5/existtradepasswd',
            dataType: 'json',
            success: function (psw) {
                console.log(psw);
                if(psw.sc==0){
                    phoneNum=psw.data.mobileAccount;
                    owner=psw.data.realName;
                    existTradePasswd=psw.data.existTradePasswd;
                    if(psw.data.existTradePasswd=="1"){//交易密码存在
                        $(".popupT,.checkPsword").show();
                        $(".backShadow").css("z-index","1");
                        inputFocus("#inputPassword");
                        digitalInputMethod("#inputPassword",".keyboard","6","table","password",".button");
                        setButton(phoneNum,owner);
                        setForget();
                        $(".bombBox").hide();
                    }else if(psw.data.existTradePasswd=="0"){//未设置交易密码
                        $(".popupT,.setPsword").show();
                        if(once==0){
                            setButton(phoneNum,owner);
                            $("#again").click(function(){
                                timee();
                            });
                            setForget();
                            once++;
                        }
                    }
                }
            }
        });
    });
    $("#checkClose").click(function () {
        $(".popupT,.checkPsword").hide();
    });
    $("#checkBtn").click(function(){
        $(this).addClass("no");
        var urlPassword='/user/h5/checktradepasswd';
        var data={'tradepasswd':getPassword("#inputPassword","table","password")};
        $.post(h5orClient(urlPassword),{data:JSON.stringify(data)},function(resul){
            console.log(resul);
            if(resul.sc==0){
                var amount=$(".cardInfo input").val(),
                    tradeToken=resul.data.tradeToken;
                console.log(amount);
                var drawData={"tradeToken":tradeToken,"transferType":'GET',"payChannel":"wx","amount":Math.round(amount*100)};console.log(drawData);
                $.ajax({
                    type: 'post',
                    async: false,
                    data: {data: JSON.stringify(drawData)},
                    url: '/pay/h5/balance/withdraw/add',
                    dataType: 'json',
                    success: function (data) {
                        console.log(data);
                        if(data.sc==0){
                            window.location.href="/html/member/drawRecord.html";
                            sessionStorage.setItem("applied","1");
                            sessionStorage.setItem("reload","1");
                        }else if(data.sc=="BASE-1004"){
                            $(".popupT").hide();
                            $(".tip").css({'margin-top':'-11rem','display':'block'}).html(data.ErrorMsg);
                            setTimeout(function() {
                                $(".tip").css('display', 'none');
                            },2000);
                            $("#inputPassword").find("td").css({"border-color":"#9b9b9b"}).html("").removeAttr("value");
                            $("#checkBtn").removeClass("no");
                        }else{
                            $(".popupT").hide();
                            $(".tip").css({'margin-top':'-11rem','display':'block'}).html("请稍后再试");
                            setTimeout(function() {
                                $(".tip").css('display', 'none');
                            },2000);
                            $("#inputPassword").find("td").css({"border-color":"#9b9b9b"}).html("").removeAttr("value");
                            $("#checkBtn").removeClass("no");
                        }
                    }
                });
            }else {
                $(".checkTitle p").html("密码错误");
                $("#inputPassword").find("td").css({"border-color":"#9b9b9b"}).html("").removeAttr("value");
            }
            $(this).removeClass("no");
        });
    });
});
window.onload=function(){
    $(".cardInfo input").val("");
};
function cutString(str, len) {
    //length属性读出来的汉字长度为1
    if(str.length*2 <= len) {
        return str;
    }
    var strlen = 0;
    var s = "";
    for(var i = 0;i < str.length; i++) {
        s = s + str.charAt(i);
        if (str.charCodeAt(i) > 128) {
            strlen = strlen + 2;
            if(strlen >= len){
                return s.substring(0,s.length-1) + "...";
            }
        } else {
            strlen = strlen + 1;
            if(strlen >= len){
                return s.substring(0,s.length-2) + "...";
            }
        }
    }
    return s;
}

