$(document).ready(function(){
    var usersCount=$("#enrollment").html();
    $("#enrollment").html(fmoney(usersCount,0));

    $(".screenFull").height($(window).height());

    $("#shareFri").click(function(){
        $("#shareFriend").show();
    });

    $(".shadow,.close,.close2").click(function(){
        $(".screenFull").hide();
    });

    $("#moreCode").click(function(){
        $(".codeUl li:nth-child(n+4)").show();
    });

    $("#newPhone").keyup(function(){
        var thisVal=$(this).val();
        if(thisVal.length==11){
            $("#changeSubmit").removeClass("cannotSub");
        }else {
            $("#changeSubmit").addClass("cannotSub");
        }
    });

    $(".changeBtn").click(function(){
        $("#modifyPhone").show();
    });
});

var actType;
var activity={
    winResults:function(actid,obj){
        //请求中奖结果，与我的中奖码页面通用
        var result='/act/h5/'+actid+'/lotteryresults';
        $.get(result,{data:JSON.stringify(obj)},function(res){
            console.log(res);
            if(res.sc==0){
                var html="";
                $.each(res.data,function(i){
                    html+='<li>'
                        +'<img src="'+ +'" alt="" class="winnerHead">'
                        +'<table>'
                        +'<tr>'
                        +'<td>昵称：</td>'
                        +'<td>'+res.data[i].nickname+'</td>'
                        +'</tr>'
                        +'<tr>'
                        +'<td>电话：</td>'
                        +'<td>'+res.data[i].phone+'</td>'
                        +'</tr>'
                        +'<tr>'
                        +'<td>中奖码：</td>'
                        +'<td>'+res.data[i].code+'</td>'
                        +'</tr>'
                        +'</table>'
                        +'</li>';
                });
                $(".winnerUl").html(html);
            }
        })
    },
    modifyPhone:function(actid,obj){
        //修改手机号码
        var modifyUrl='/act/h5/'+actid+'/user/info';
        $.post(modifyUrl,{data:JSON.stringify(obj)},function(res){
            if(res.sc==0){
                $(".myPhone").html(obj.phone);
                $(".screenFull").hide();
            }
        });
    },
    init:function(params){
        var actId=params['actid'];
        actType=params['acttype'];
        var codeLength=$(".codeUl li").length;
        if(codeLength==0){
            if(actType==2){
                $("#myCodes").html("尚未邀请好友一起参与");
            }else {
                $("#myCodes").html("您还没有抽奖码");
            }
            $(".codeUl").hide();
        }else if(codeLength>3){
            $(".codeUl li:nth-child(n+4)").hide();
            $("#moreCode").show().find("#codeNum").html(codeLength);
        }
        //开奖结果
        $("html").on("click","#winResults",function(){
            var resData={};
            activity.winResults(actId,resData);
            $("#winningList").show();
        });
        $("html").on("click","#changeSubmit",function(){
            var modifyData={phone:$("#newPhone").val()};
            if(!(/^\d+$/).test(modifyData.phone) || modifyData.phone.length<11){
                errorPrompt("手机号码错误",2000);
                return;
            }
            activity.modifyPhone(actId,modifyData);
        });
    }
};