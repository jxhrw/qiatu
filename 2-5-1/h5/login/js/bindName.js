$(document).ready(function(){
    $("#name").keyup(function(){
        var reg=/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;//只含有汉字、数字、字母、下划线，下划线
        var val=$("#name").val();
        if(undefined!=val && ""!=val && $("#check").attr("value")=="checked"){
            $("#nameSubBtn").removeClass("cannotSub");
        }else {
            $("#nameSubBtn").addClass("cannotSub");
        }
    });

    //需要同意会员协议
    $("#check").click(function(){
        if($(this).attr("value")=="checked"){
            $(this).attr("value","unCheck").attr("src","images/unCheck.png");
            $("#nameSubBtn").addClass("cannotSub");
        }else if($(this).attr("value")=="unCheck"){
            $(this).attr("value","checked").attr("src","images/checked.png");
            var val=$("#name").val();
            if(undefined!=val && ""!=val && $("#check").attr("value")=="checked"){
                $("#nameSubBtn").removeClass("cannotSub");
            }
        }
    });

//提交姓名
    $("#nameSubBtn").click(function(event) {
        $("#nameSubBtn").addClass("cannotSub");
        var data={"realname":$("#name").val()};
        var url='/user/h5/registermember';
        $.post(url,{data:JSON.stringify(data)},function(res){
            if(res.sc==0){
                window.location.href=res.data.jumpurl;
            }else if(res.sc=="USER-1016"){
                window.location.href='/user/h5/mbcenter';
            }
            else if(res.sc=="-99999"){
                errorPrompt("系统繁忙",2000);
            }else{
                errorPrompt(res.ErrorMsg,2000);
            }
            $("#nameSubBtn").removeClass("cannotSub");
        });
    });
});