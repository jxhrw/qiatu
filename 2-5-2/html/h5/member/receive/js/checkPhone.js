$(document).ready(function(){

    externalorder();

    $(".checkBtnBox").click(function(){
        var str=[];
        var transmit=[];
        var memberCard=$(".memberCard");
        for(var i=0;i<memberCard.length;i++){
            for(var j=0;j<memberCard.eq(i).find(".pbDiv").length;j++){
                var cardId=memberCard.eq(i).find(".pbDiv").eq(j).attr("id");
                var phone=memberCard.eq(i).find(".pbDiv").eq(j).find("input").val();
                var cardName=memberCard.eq(i).find(".cardName").html();
                if((""!=phone && undefined!=phone) && (/^1[34578]\d{9}$/.test(phone))){
                    var all=1;
                    if(memberCard.eq(i).find(".chDiv").html()!=""){
                        memberCard.eq(i).find(".isChoose").each(function(){
                            if(!$(this).hasClass("hasChoose")){
                                all=0;
                            }
                        });
                    }
                    if(memberCard.eq(i).find(".chDiv").html()=="" || all==1){
                        var info={id:cardId,receiver:phone};
                        var transInfo={id:cardId,receiver:phone,cardName:cardName};
                        str.push(info);
                        transmit.push(transInfo);
                    }
                }else if((""!=phone && undefined!=phone) && !(/^1[34578]\d{9}$/.test(phone))){
                    $("#prompt").show().html("手机号码有误");
                    setTimeout(function(){
                        $("#prompt").hide().html("");
                    },2000);
                    return false;
                }
            }
        }
        if(str!=""){
            var go=0;
            $("isChoose").each(function(){
                if(!$(this).hasClass("hasChoose")){
                    go++;
                }
            });
            if(go==0 && str.length==$(".memberCard").find("input").length){
                receive(str,transmit);
            }else {
                $("#prompt").show().html("请阅读协议并全部领取");
                setTimeout(function(){
                    $("#prompt").hide().html("");
                },2000);
            }
        }
        else {
            $("#prompt").show().html("信息不充分");
            setTimeout(function(){
                $("#prompt").hide().html("");
            },2000);
        }
    });

});

//领取数据请求
function externalorder(){
    //参数：mobile,verifycode
    var data={mobile:GetParams().tel,verifycode:GetParams().code};
    $.post("/coupon/h5/externalorder/list",{data:JSON.stringify(data)},function(res){
        if(res.sc==0){
            var cardsHtml="";
            if(undefined!=res.data && undefined!=res.data[0].productList && undefined!=res.data[0].productList[0].orderOperator){
                $("#cusName").html(res.data[0].productList[0].orderOperator);
            }
            for(var i=0;undefined!=res.data && i<res.data.length;i++){
                var cards="";
                var agreements="";
                var agreed=0;
                for(var j=0;undefined!=res.data[i].productList && j<res.data[i].productList.length;j++){
                    if(undefined==res.data[i].productList[j].receiver){
                        cards+='<p class="cardName">'+ res.data[i].productList[j].productName +'</p>'
                            +'<div class="pbDiv" id="'+ res.data[i].productList[j].id +'"><span>使用人手机号：</span><input class="tel" maxlength="11" type="tel" value="'+GetParams().tel+'"></div>';
                        agreed=1;
                    }
                   else {
                        cards+='<p class="cardName">'+ res.data[i].productList[j].productName +'</p>'
                            +'<div class="pbDiv" id="'+ res.data[i].productList[j].id +'"><span>使用人手机号：</span><span>'+res.data[i].productList[j].receiver+'</span></div>';
                    }
                }
                if(agreed==1){
                    if(undefined!=res.data[i].agreementList){
                        for(var k=0;k<res.data[i].agreementList.length;k++){
                            agreements+='<div class="chDiv"><span class="isChoose hasChoose">√</span> 同意 <a href="'+res.data[i].agreementList[k].h5Url+'">'+res.data[i].agreementList[k].name+'</a></div>';
                        }
                    }else {
                        agreements='<div class="chDiv"></div>';
                    }
                }else {
                    agreements='<div class="chDiv"></div>';
                }
                cardsHtml='<div class="memberCard">'+cards+agreements+'</div>';
                $(".checkCards").append(cardsHtml);
            }
            $(".isChoose").on("click",function(){
                $(this).toggleClass("hasChoose");
            });
        }
        else{
            $("#prompt").show().html("请重试");
            setTimeout(function(){
                $("#prompt").hide().html("");
            },2000);
        }
    });
}

//订单领取
function receive(str,transmit){
    var data={mobile:GetParams().tel,verifycode:GetParams().code,externalOrders:str};
    $.post("/coupon/h5/externalorder/receive",{data:JSON.stringify(data)},function(res){
        if(res.sc==0){
            window.location.href="/html/member/receive/recResult.html?tel="+GetParams().tel+"&code="+GetParams().code;
        }
        else {
            $("#prompt").show().html(chinese(res.ErrorMsg));
            setTimeout(function(){
                $("#prompt").hide().html("");
            },2000);
        }
    });
}

function chinese(str){
    var ss=str.replace(/[^\u4e00-\u9fa5]/gi,"");
    return ss;
}