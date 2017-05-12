$(document).ready(function(){
    $(".screenBox,.screenFull").height($(window).height());

    $("#winResults").click(function(){
        $("#winningList").show();
    });

    $(".shadow,.close").click(function(){
        $(".screenFull").hide();
    });

    $(".plus:last-child").css("display","none");


});

var activity={
    register:function(actid){
        //发起报名注册请求
        var url='/act/h5/'+actid+'/user/register';
        var phoneNum=$(".phoneNum").val();
        var data={phone:phoneNum};
        if(!(/^\d+$/).test(phoneNum) || phoneNum.length<11){
            errorPrompt("手机号码错误",2000);
            return;
        }
        $.post(url,{data:JSON.stringify(data)},function(res){
            if(res.sc==0){
                window.location.href=res.data.nexturl;
            }
            else if(res.sc=="ACT-1004"){
                $("#publicName").html('「'+ res.data.publicName +'」');
                $("#qrcode").attr("src",res.data.qrcode);
                $("#erweima").show();
            }
            else if(res.sc=="-99999"){
                errorPrompt("请稍后再试",2000);
            }
            else {
                errorPrompt(res.ErrorMsg,2000);
            }
        });
    },
    payment:function(obj){
        $.post('/order/h5/createandpay',{data:JSON.stringify(obj)},function(data){
            if(data.sc==0){
                var orderid=data.data.orderid,
                    hotelid=data.data.hotelId;
                if(data.data.payTicketInfo!=null){
                    pingpp.createPayment(data.data.payTicketInfo, function (result, err) {
                        console.log(result);
                        if(result=="cancel"){
                            $.post('/order/h5/breakpay/'+orderid,function(data){
                                console.log(data);
                                if(data.sc==0){
                                    var order={"orderid":orderid};
                                    $.post('/order/h5/cancel',{data:JSON.stringify(order)},function(res){
                                        console.log(res);
                                        if(res.sc==0){

                                        }
                                    })
                                }
                            })
                        }
                        else if(result=="success"){
                            window.location.href=res.data.nexturl;
                        }
                    });
                }
            }
        })
    },
    winResults:function(actid,obj){
        //请求中奖结果，与我的中奖码页面通用
        var result='/act/h5/'+actid+'/lotteryresults';
        $.get(result,{data:JSON.stringify(obj)},function(res){
            console.log(res);
            if(res.sc==0){
                var html="";
                $.each(res.data,function(i){
                    html+='<li>'
                        +'<img src="'+ res.data[i].headimg +'" alt="" class="winnerHead">'
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
    init:function(params){
        var actId=params['actid'];
        var registerUrl=params['registerurl'];
        //绑定
        $('html').on("click","#signUp",function(){
            activity.register(actId);
        });

        //开奖结果
        $("html").on("click","#winResults",function(){
            var resData={};
            activity.winResults(actId,resData);
        });

        //注册会员
        $('html').on("click","#register",function(){
            window.location.href = registerUrl;
        });
    }
};