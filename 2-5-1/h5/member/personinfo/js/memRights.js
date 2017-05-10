var needInput=0;//判断是否需要填身份证，0不用，1需要

$(document).ready(function(){
    var urlAjax;
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) != 'micromessenger' && /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && /jihe/i.test(navigator.userAgent)){
        urlAjax='/coupon/client';
    }else{
        urlAjax='/coupon/h5/member';
    }
    var data={};
    $.post((urlAjax+'/receiveinfo'),{data:JSON.stringify(data)},function(res){
        if(res.sc==0){
            //需要身份验证
            if(undefined==res.assetsListNeedAuth || 0==res.assetsListNeedAuth.length){
                $("#needAuth").hide();
            }
            else {
                needInput=1;
                var cardList="";
                for(var i=0;i<res.assetsListNeedAuth.length;i++){
                    var agreementInfo="";
                    if(undefined!=res.assetsListNeedAuth[i].agreementInfo){
                        agreementInfo='<p class="agree"><a href="'+res.assetsListNeedAuth[i].agreementInfo.h5Url+'">'+res.assetsListNeedAuth[i].agreementInfo.name+'</a></p>';
                    }
                    cardList+='<div class="cardDiv">'
                        +'<p class="cardBg"><span class="cardName">'+res.assetsListNeedAuth[i].assetsName+'</span></p>'
                        +agreementInfo
                        +'</div>';
                }
                $("#needAuth .cardList").html(cardList);
                $(".cusName").html(decodeURIComponent(GetParams().name));
            }
            //不需身份验证
            if(undefined==res.assetsListNoAuth || 0==res.assetsListNoAuth.length){
                $("#noAuth").hide();
            }
            else {
                needInput=0;
                var cardList="";
                for(var i=0;i<res.assetsListNoAuth.length;i++){
                    var agreementInfo="";
                    if(undefined!=res.assetsListNoAuth[i].agreementInfo){
                        agreementInfo='<p class="agree"><a href="'+res.assetsListNoAuth[i].agreementInfo.h5Url+'">'+res.assetsListNoAuth[i].agreementInfo.name+'</a></p>'
                    }
                    cardList+='<div class="cardDiv">'
                        +'<p class="cardBg"><span class="cardName">'+res.assetsListNoAuth[i].assetsName+'</span></p>'
                        +agreementInfo
                        +'</div>';
                }
                $("#noAuth .cardList").html(cardList);
            }

            //没有信息
            if((undefined==res.assetsListNeedAuth || 0==res.assetsListNeedAuth.length)&&(undefined==res.assetsListNoAuth || 0==res.assetsListNoAuth.length)){
                if(ua.match(/MicroMessenger/i) != 'micromessenger' && /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && /jihe/i.test(navigator.userAgent)){
                    var data1='{"act":"backToCoupon"}';
                    var url = "http://www.jihelife.com?data="+data1;
                    iosBridgeObjc(url);
                }else{
                    history.go(-1);
                }
                $(".btnBox").hide();
            }
        }
    });


    $(".btnBox").click(function(){
        $(".btnBox").addClass("no");
        if(needInput==0){
            var noData={};
            $.post((urlAjax+'/receive'),{data:JSON.stringify(noData)},function(res){
                if(res.sc==0){
                    if(ua.match(/MicroMessenger/i) != 'micromessenger' && /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && /jihe/i.test(navigator.userAgent)){
                        var data1='{"act":"backToCoupon"}';
                        var url = "http://www.jihelife.com?data="+data1;
                        iosBridgeObjc(url);
                    }else{
                        window.location.href="/html/jh-giftcard/build/index.html?member_hotelid=";
                    }
                }
                $(".btnBox").removeClass("no");
            });
        }
        else if(needInput==1){
            var numID=$(".cardID").val();
            //var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{8}$)|(^[a-zA-Z]\d{9}$)|(^\d{17}(\d|X|x)$)/;
            if(reg.test(numID) === false){
                $("#prompt").show().html("身份证号码有误");
                setTimeout(function(){
                    $("#prompt").hide().html("");
                },2000);
                $(".btnBox").removeClass("no");
            }else {
                var needData={IDNumber:numID};
                $.post((urlAjax+'/receive'),{data:JSON.stringify(needData)},function(res){
                    if(res.sc==0){
                        if(ua.match(/MicroMessenger/i) != 'micromessenger' && /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && /jihe/i.test(navigator.userAgent)){
                            var data1='{"act":"backToCoupon"}';
                            var url = "http://www.jihelife.com?data="+data1;
                            iosBridgeObjc(url);
                        }else{
                            window.location.href="/html/jh-giftcard/build/index.html?member_hotelid=";
                        }
                    }
                    $(".btnBox").removeClass("no");
                });
            }
        }
    });
});

// IOS桥接调用
function iosBridgeObjc(url) {
    var iframe;
    iframe = document.createElement("iframe");
    iframe.setAttribute("src", url);
    iframe.setAttribute("style", "display:none;");
    document.body.appendChild(iframe);
    iframe.parentNode.removeChild(iframe);
}
