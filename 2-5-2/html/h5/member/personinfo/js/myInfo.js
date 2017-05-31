$(document).ready(function() {
    var type;//类型，1-设置，2-忘记，3-修改，4-校验
    var jsTime=0;
    var winHeight=$(window).height();
    $(".verification,.null,.null2").height(winHeight);

    $(".SMSVer input").val("");

	$.post('/user/h5/info', function(data) {
        console.log(data);
        if(data.sc=="0"){
            $(".memberIcon span img").attr("src",data.data.headimgurl);
            $(".memberName span").html(data.data.realname);
            $(".memberNick span").html(data.data.nickname);
            // for(a=0;a<data.data.accoutList.length;a++){
            $(".memberPhone span").html(data.data.mobileAccount.accountName);
            // }
        }
    });

    $(".null2").click(function(){
        $(".null2,.psChoose").hide();
    });
    $(".null").click(function(){
        $(".verification").hide();
    });

    $("#set,#forgot").click(function(){
        if($(this).attr("id")=="set"){
            type=1;
            $.post('/user/h5/existtradepasswd', function(res) {
                //console.log(res);
                //existTradePasswd=1已设置，0未设置
                if(res.sc=="0" && res.data.existTradePasswd=="0"){
                    var mobileAccount=res.data.mobileAccount;
                    timee();
                    $("#owner").html(res.data.realName);
                    $("#phoneNum").html(mobileAccount.substr(0,3)+"****"+mobileAccount.substr(7,4));
                    $(".verification").show();
                }else if(res.sc=="0" && res.data.existTradePasswd=="1"){
                    $(".null2,.psChoose").show();
                }
            });
        }
        if($(this).attr("id")=="forgot"){
            type=2;
            $.post('/user/h5/existtradepasswd', function(res) {
                //console.log(res);
                //existTradePasswd=1已设置，0未设置
                if(res.sc=="0" && res.data.existTradePasswd=="1") {
                    var mobileAccount = res.data.mobileAccount;
                    timee();
                    $("#owner").html(res.data.realName);
                    $("#phoneNum").html(mobileAccount.substr(0, 3) + "****" + mobileAccount.substr(7, 4));
                    $(".null2,.psChoose").hide();
                    $(".verification").show();
                }
            });
        }
    });

    $("#again").click(function(){
        timee();
    });

    $("#sure").click(function(){
        var verifycode=$(".SMSVer input").val();
        var url="/user/h5/checkverifycode";
        var data={verifycode:verifycode};
        $.post(url,{data:JSON.stringify(data)},function(res){
            console.log(res);
            if(res.sc=="0"){
                window.location.href="password.html?type="+type+"&verifycode="+verifycode;
            }else {
                $("#prompt").show();
                setTimeout(function(){
                    $("#prompt").hide();
                },2000);
            }
        });
    });

    $("#change").click(function(){
        window.location.href="password.html?type=3";
    });

    function timee(){
        if(jsTime==0){
            var data={'verifycodetype':2};
            $("#again").addClass("no");
            $.post('/user/h5/getverifycode',{data:JSON.stringify(data)},function(resu){
                console.log(resu);
            });
            jsTime=60;
            var timeCon=setInterval(function(){
                jsTime--;
                $("#again").html(jsTime+"S");
                if(jsTime==0){
                    $("#again").html("重新发送").removeClass("no");
                    clearInterval(timeCon);
                }
            },1000)
        }
    }
});