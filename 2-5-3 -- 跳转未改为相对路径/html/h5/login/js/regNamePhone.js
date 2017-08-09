$(document).ready(function() {
    var windowHeight=$(window).height();
    $('body').height(windowHeight);
    $(".weibo").css("top",$(window).height()-$(".content").height()-150);
    if($(window).height()<400){
        $('.weibo').css({"position":"relative","top":"0rem"});
    }

    //手机号
    //获取焦点
    $(".phone1").focus(function (event) {
        if ($(".phone").val() == "请输入手机号码") {
            $(".phone").val("");
            $(this).val("").css({"color": "#fff","font-size":"1.2rem"});
            $("#btn").removeAttr("disabled");
        }
    });
    if($(".phone1").val()==""){
        $("#btn").attr("disabled", true);
    }
    $(".closeBtn").click(function(event) {
        $(this).parent().parent().css('display', 'none');
    });
    $(".jiheCon").click(function(event) {
        window.location="/html/h5/member/other/memberIntroduction.html";
    });
    //失去焦点
    $(".phone1").blur(function (event) {
        if ($(this).val() == "") {
            //alert("aab1")
            $(".phone").val("请输入手机号码").css({"color":"#d0d0d0","font-size":"1rem"});
            $(this).val("").css({"color": "#fff","font-size":"1.2rem"});
            $("#btn").attr("disabled", true);
            return;
        }
        if (!$(".phone1").val().match(/^^[1][34578][0-9]{9}$|^886[0-9]{10}$/)) {
            $(".phone").val("请输入手机号码").css({"color":"#d0d0d0","font-size":"1rem"});
            $(this).val("").css({"color": "#fff","font-size":"1.2rem"});
            $("#btn").attr("disabled", true);
            return;
        }
    });
    //获取焦点
    $(".phoneNum1").focus(function (event) {
        if ($(".phoneNum").val() == "请输入短信验证码") {
            $(".phoneNum").val("");
            $(this).val("").css({"color": "#fff","font-size":"1.2rem"});
        }
    });
    //失去焦点
    $(".phoneNum1").blur(function (event) {
        if ($(this).val() == "") {
            // alert("aab1")
            $(".phoneNum").val("请输入短信验证码").css({"color":"#d0d0d0","font-size":"1rem"});
            $(this).val("").css({"color": "#fff","font-size":"1.2rem"});
            return;
        }

    });
    //获取焦点
    $(".name").focus(function (event) {
        if ($(this).val() == "请输入您的真实姓名") {
            $(this).val("").css({"color": "#fff","font-size":"1.2rem"});
        }
        $("#submitBtn1").css({"background-color":"#bb8e4b"}).removeAttr("disabled");
    });

    //失去焦点
    $(".name").blur(function (event) {
        if ($(this).val() == "") {
            $(this).val("请输入您的真实姓名").css({"color":"#d0d0d0","font-size":"1rem"});
            return;
        }

    });

//倒计时
    var wait=59;
    function time(o) {
        if (wait == 0) {
            o.removeAttribute("disabled");
            o.value="发送验证码";
            wait = 59;
            $("#btn").css({"background-color":"#bb8e4b","font-size":"12px"});
        } else {
            o.setAttribute("disabled", true);
            o.value=wait+"s";
            wait--;
            $("#btn").css({"background-color":"#666","color":"#fff","font-size":"1.2rem"});
            setTimeout(function() {
                time(o)
            },1000)
        }
    }
    //获取验证码
    $("#btn").click(function(event) {
        if($(".phone1").val()==""){
            return;
        }
        else{
            var data={"accountname":$(".phone1").val(),"verifycodetype":"1"};
            $.post('/user/h5/getverifycode', {data: JSON.stringify(data)}, function(data) {
                if(data.sc=="0"){
                    time(document.getElementById("btn"));
                    $(".tip").css('display', 'block');
                    setTimeout(function() {
                        $(".tip").css('display', 'none');
                    },2000)
                }
                else {
                    $(".tip").html(data.ErrorMsg).css('display', 'block');
                    setTimeout(function() {
                        $(".tip").css('display', 'none');
                    },2000)
                }
            })
        }

    });
    //提交手机和验证码
    $("#submitBtn").click(function(event) {
        $("#submitBtn").attr("disabled", true);
        if($(".phoneNum1").val()==""){
            $("#submitBtn").removeAttr("disabled");
            return;
        }
        else if($(".phone1").val()==""){
            $("#submitBtn").removeAttr("disabled");
            return;
        }
        else{
            var data={"accountname":$(".phone1").val(),"verifycode":$(".phoneNum1").val()};
            var url='/user/h5/bindmobile';
            $.ajax({
                type: 'POST',
                url: url,
                data: {data: JSON.stringify(data)},
                success: function (data) {
                    if(data.sc=="-99999"){
                        $("#submitBtn").removeAttr("disabled");
                        alert("系统繁忙");
                    }
                    else if(data.sc=="-1"){
                        $("#submitBtn").removeAttr("disabled");
                        alert("系统繁忙");
                    }
                    else if(data.sc=="USER-1011"){
                        $("#submitBtn").removeAttr("disabled");
                        $(".newweixin").html(data.data.newweixin);
                        $(".oldweixin").html(data.data.oldweixin);
                        $(".mask1").css('display', 'block');
                        $(".fanPaiBtn").click(function(event) {
                            var bind={"bindtoken":data.data.bindtoken};
                            $.post('/user/h5/bindmobile', {data: JSON.stringify(bind)}, function(data) {
                                if (data.sc=="0") {
                                    window.location=data.data.jumpurl;
                                }
                            })
                        });
                    }
                    else if (data.sc=="0") {
                        $("#submitBtn").removeAttr("disabled");
                        window.location=data.data.jumpurl
                    }
                    else{
                        $("#submitBtn").removeAttr("disabled");
                        alert(data.ErrorMsg)
                    }
                },
                error: function(res){
                    $("#submitBtn").removeAttr("disabled");
                }
            })
        }

    });
    //提交姓名
    $("#submitBtn1").click(function(event) {
        $("#submitBtn1").attr("disabled", true);
        if($(".name").val()=="请输入您的真实姓名"){
            return;
        }
        else{
            var data={"realname":$(".name").val()};
            var url='/user/h5/registermember';
            $.ajax({
                type: 'POST',
                url: url,
                data: {data: JSON.stringify(data)},
                success: function (data) {
                    console.log(data);
                    if(data.sc==0){
                        $("#submitBtn1").removeAttr("disabled");
                        window.location=data.data.jumpurl
                    }

                },
                error: function(res){
                    $("#submitBtn1").removeAttr("disabled");
                }
            });
        }

    });

    //登录方式
    var uatype=uaType();
    var params = GetParams();
    if(uatype=="weixin"){
        $(".loginMode").hide();
    }
    if(params["weiboAuth"]){
        $("#weiboAuth").click(function(){
            window.location.href=decodeURIComponent(params["weiboAuth"]);
        });
    }
    //电话号码登录
    $("#phoneAuth").click(function () {
        var phoneNumber=$(".phone1").val(),verifycode=$(".phoneNum1").val();
        $("#submitBtn").attr("disabled", true);
        if(phoneNumber==""){
            $("#submitBtn").removeAttr("disabled");
            return;
        }
        else if(verifycode==""){
            $("#submitBtn").removeAttr("disabled");
            return;
        }
        else{
            $.post('/user/h5/loginbyphone' ,{data:JSON.stringify({"accountname":phoneNumber,"verifycode":verifycode})},function(resu){
                console.log(resu);
                if(resu.sc==0){
                    window.location='/user/h5/mbcenter';
                }
                $("#submitBtn").removeAttr("disabled");
            });
        }
    });
});
