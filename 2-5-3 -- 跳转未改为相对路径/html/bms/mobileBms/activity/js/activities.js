$(document).ready(function(){
    var groupId=GetParams().groupid;
    var hotelId=GetParams().hotelid;
    var this_page=1;
    var rqDate={"pagecnt":6,"pageno":this_page};
    var rqUrl='/act/h5/list/'+ groupId +'/'+ hotelId + '/';

    request(rqDate);

    $(window).scroll(function () {//滚动加载
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if ($(".flipTips").html() == "已经加载完") {
            return;
        } else {
            if (scrollTop + windowHeight == scrollHeight) {
                this_page++;
                rqDate.pageno=this_page;
                request(rqDate);
            }
        }
    });

    //发期数据请求
    function request(obj){
        $.post(rqUrl,{data:JSON.stringify(obj)},function(res){
            if(0==res.sc && undefined!=res.data && res.data.length>0){
                var activityUlHtml='';
                if(res.data.length<obj.pagecnt){
                    $(".flipTips").html('已经加载完');
                }
                $.each(res.data,function(i){
                    var status=res.data[i].status;
                    var li_class='';
                    var actStatus='';
                    var isImg='';
                    var usStatus=res.data[i].usStatus;
                    var usStatusHtml='';
                    var usStatusDesc='';
                    var usStatusClass='';
                    var isWinner=res.data[i].isWinner;
                    var isWinnerHtml='';
                    var isWinnerDesc='';
                    var isWinnerClass='';
                    var actBeginTime=new Date(parseInt(res.data[i].actBeginTime));
                    var actEndTime=new Date(parseInt(res.data[i].actEndTime));
                    var actPubTime=new Date(parseInt(res.data[i].actPubTime));

                    if(status=="3"){
                        actStatus='活动未开始';
                    }
                    if(status=="1" ){
                        actStatus='活动进行中';
                        if(usStatus=="2"){
                            usStatusDesc='已参与';
                        }else {
                            usStatusDesc='立即参与';
                            usStatusClass='goJoin';
                            isImg='<img src="/html/mobileBms/activity/images/whiteArrow.png" alt="" class="whiteArrow">'
                        }
                        usStatusHtml='<span class="'+usStatusClass+'">'+usStatusDesc+isImg+'</span>';
                    }
                    if(status=="2" || status=="5" || status=="4"){
                        li_class='whiteNon';
                        actStatus='活动已结束';
                        if(usStatus=="2"){
                            usStatusDesc='已参与';
                        }else {
                            usStatusDesc='未参与';
                        }
                        if(isWinner=="1"){
                            isWinnerDesc='中奖啦';
                            isWinnerClass='wined';
                        }else {
                            isWinnerDesc='未中奖';
                        }
                        if(status=="4"){
                            isWinnerDesc='未开奖';
                        }
                        usStatusHtml='<span class="'+usStatusClass+'">'+usStatusDesc+'</span>';
                        isWinnerHtml='<span class="'+isWinnerClass+'">'+isWinnerDesc+'</span>';
                    }
                    activityUlHtml+='<li class="'+li_class+'">'
                        +'<a class="lia" href="'+res.data[i].h5url+'">'
                        +'<img src="'+res.data[i].actImgs+'" alt="" class="activityImg">'
                        +'<div class="activitySig">'
                        +'<div class="activityName">'+res.data[i].actTitle+'</div>'
                        +'<div class="statesBox">'
                        +'<span class="">'+actStatus+'</span>'
                        + usStatusHtml
                        + isWinnerHtml
                        +'</div>'
                        +'<div class="timeVarious">'
                        +'<p class="">活动时间：<span>'+secondIsNon(newFormatStrDate(actBeginTime,"/") +'&nbsp;&nbsp;'+timeFormatSecond(actBeginTime,":"))+'</span></p>'
                        +'<p class="">结束时间：<span>'+secondIsNon(newFormatStrDate(actEndTime,"/") +'&nbsp;&nbsp;'+timeFormatSecond(actEndTime,":"))+'</span></p>'
                        +'<p class="">开奖时间：<span>'+secondIsNon(newFormatStrDate(actPubTime,"/") +'&nbsp;&nbsp;'+timeFormatSecond(actPubTime,":"))+'</span></p>'
                        +'</div>'
                        +'</div>'
                        +'</a>'
                        +'</li>';
                });
                $(".activityUl").append(activityUlHtml);
            }else {
                if($(".activityUl li").length==0){
                    var noneHtml=hasBackground("暂时还没有活动","40%");
                    $(".noneActivity").html(noneHtml);
                    $(".flipTips").hide();
                }else {
                    $(".flipTips").html('已经加载完');
                }
            }
        });
    }


});

