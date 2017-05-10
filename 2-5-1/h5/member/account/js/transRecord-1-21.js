/**
 * Created by qianyun Yang on 2017/1/17.
 */
$(document).ready(function () {
    var pageData1={"pagecnt":"10","pageno":1};
    getList(pageData1,1);
    var c=1;
    $(window).scroll(function() {
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if ($(".scrollBot").html() == "－ 加载完毕 －") {
            return;
        } else {
            if (scrollTop + windowHeight == scrollHeight) {
                $(".scrollBot").html('<span></span>正在加载');
                c++;
                var pageDatan={"pagecnt":"10","pageno":c};
                getList(pageDatan,c);
            }
        }
    });
});
//可调用的方法
function getDate(time) {//将时间戳转化为日期
    var date = new Date(time);
    y = date.getFullYear();
    m = date.getMonth() + 1;
    d = date.getDate();
    return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
}
function getTime(time) {//将时间戳转化为时刻
    var date = new Date(time);
    h = date.getHours();
    m = date.getMinutes();
    s = date.getSeconds();
    return (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
}
//获取余额账户变动记录
function getList(param,page){
    $.ajax({
        type: 'POST',
        url: '/pay/h5/balance/record',
        data: {data:JSON.stringify(param)},
        dataType: 'json',
        success : function(data){
            console.log(data);
            if(data.data.length<10){
                $(".scrollBot").html("－ 加载完毕 －");
            }
            if(data.data.length=="0"){
                $("body").html('<div class="hasNone">暂时还没有变动记录</div>');
            }
            $.each(data.data,function(i){
                var amount=(data.data[i].amount/100).toString(),
                    recordDesc=data.data[i].recordDesc,
                    date=data.data[i].createTime,
                    time=data.data[i].createTime,
                    recordType=data.data[i].recordType;
                var item='<div class="item"><div class="amount"><span></span>'+amount.replace(/-/g, "-&nbsp;&yen;&nbsp;")+'</div><div class="recordInfo"><p class="recordDesc" >'+recordDesc+'</precordDesc><p class="createTime"><span class="date">'+getDate(Number(date))+'</span><span class="time">'+getTime(Number(time))+'</span></p></div></div>';
                $(".transRecord").append(item);
                if(amount<0){
                    $(".item .amount").eq(i+10*(page-1)).css("color","#d13f4c");
                }else if(amount>0){
                    $(".item .amount").eq(i+10*(page-1)).css("color","#72ac1e").find("span").html("+&nbsp;&yen;");
                }
            });
        }
    });
}
