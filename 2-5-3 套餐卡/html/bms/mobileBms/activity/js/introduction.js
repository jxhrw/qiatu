$(document).ready(function(){
    var weekday=new Array(7);
    weekday[0]=" (周日) ";
    weekday[1]=" (周一) ";
    weekday[2]=" (周二) ";
    weekday[3]=" (周三) ";
    weekday[4]=" (周四) ";
    weekday[5]=" (周五) ";
    weekday[6]=" (周六) ";

    var this_id=GetParams().id;
    var actDetailUrl='/act/h5/'+this_id+'/detail';
    var actDate={};

    actDetail(actDate);

    function actDetail(obj){
        $.get(actDetailUrl,{data:JSON.stringify(obj)},function(res){
            if(res.sc==0){
                var prizeHtml='';
                var actEndTime=new Date(parseInt(res.data.actEndTime));
                var actPubTime=new Date(parseInt(res.data.actPubTime));
                $(".bannerBgp").css("background-image",'url('+res.data.actImgs+')');
                $("#activityName").html(res.data.actTitle);
                $("#codeQR").attr("src",res.data.joinfansQrcode);
                $("#lotteryRules").html(res.data.lotteryRules);
                $("#actEndTime").html(secondIsNon(newFormatStrDate(actEndTime,"/") + weekday[actEndTime.getDay()] +'&nbsp;&nbsp;'+timeFormatSecond(actEndTime," : ")));
                $("#actPubTime").html(secondIsNon(newFormatStrDate(actPubTime,"/") + weekday[actPubTime.getDay()] +'&nbsp;&nbsp;'+timeFormatSecond(actPubTime," : ")));

                if(res.data.prizenameList){
                    $.each(res.data.prizenameList,function(i){
                        prizeHtml+=res.data.prizenameList[i]+'<br/>';
                    });
                }
                $("#prize").html(prizeHtml);
            }
        });
    }
});