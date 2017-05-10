var phoneNum;
var owner;
var once=0;//是否能发送验证短信
var memberStatus;
$(document).ready(function(){
    ifLogin();
    if(memberStatus==-1){
        window.location.href="/user/h5/qrcode?regsucc_tourl="+encodeURIComponent(window.location.href);
    }
    $.ajax({
        type: 'post',
        async: false,
        url: '/pay/h5/balance/info',
        dataType: 'json',
        success: function (data) {
            console.log(data);
            var availAssets=parseInt(data.data.cashBalance),//可用现金资产
                freezAssets=parseInt(data.data.cashFreeze),
                cashAssets=availAssets+freezAssets;//冻结资产
            $(".total span").html(cashAssets/100);
            $(".available span").html(availAssets/100);
            $(".freeze span").html(freezAssets/100);
            balanceData=data;
        }
    });
    $(".cashRec a").attr("href","drawRecord.html");
    $(".changeRec a").attr("href","transRecord.html");
    $(".withDraw").click(function(){
        $(".popupT").height($(window).height());
        if(/jihe/i.test(navigator.userAgent)){
            $(".openwx").show();
            $(".mask").show();
            $(".openwx button").click(function () {
                window.location.href="weixin://";
            })

        }else{
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
                            window.location.href="wxwithdraw.html";
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
        }
        $("#again").click(function(){
            timee();
        });
    });
    $(".backShadow").click(function () {
        $(".popupT").hide();
    });
    $(".mask").click(function () {
        $(".openwx").hide();
        $(".mask").hide();
    });
});
//判断是否登录
function ifLogin(){
    $.ajax({
        url:"/user/h5/info",
        type : 'post',
        async:false,
        success : function(data){
            console.log(data);
            memberStatus=data.sc;
            if(memberStatus==0){
                memberFlag=data.data.memberFlag;
                console.log(memberFlag);
            }
            console.log(memberStatus);
        }
    });
}