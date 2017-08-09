/**
 * Created by qianyun Yang on 2017/1/17.
 */
$(document).ready(function () {
    if(sessionStorage.getItem("applied")==1){
        $(".mask").show();
        $(".hasdrawed").show();
        setTimeout(function() {
            $(".mask").hide();
            $(".hasdrawed").hide();
        },2000);
        sessionStorage.setItem("applied","0");
    }
    var pageData1={"pagecnt":"10","pageno":1};
    getList(pageData1);
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
                getList(pageDatan);
            }
        }
    });
/*
    $.ajax({
        type: 'post',
        async: false,
        url: '/pay/h5/balance/withdraw/list',
        dataType: 'json',
        success: function (data) {
            console.log(data);
            var result=data.data.result;
            $.each(result, function (i) {
                //$(".amount span").html(floatFixed2(1000));
                var amount=floatFixed2(result[i].amount/100),
                    date=getDate(Number(result[i].createTime)),
                    time=getTime(Number(result[i].createTime)),
                    transferId=result[i].id,
                    status=result[i].status;
                if(result[i].channel=="wx"){
                    var wxItem='<div class="item wx">'
                        +     '<ul class="item_t">'
                        +           '<li>提现到微信钱包</li>'
                        +           '<li class="amount">&yen;<span>'+amount+'</span></li>'
                        +      '</ul>'
                        +      '<ul class="item_b">'
                        +           '<li class="date">'+date+'</li>'
                        +           '<li class="time">'+time+'</li>'
                        +           '<li class="status">'+getStatus(status)+'</li>'
                        +      '</ul>'
                        + '</div>';
                    $(".drawRecord").append(wxItem);
                }else{
                    var inBank=result[i].inBank,
                        inAccountNumber=result[i].inAccountNumber;
                    var bankItem='<div class="item">'
                        +     '<ul class="item_t">'
                        +           '<li>'+inBank+'(<span>'+inAccountNumber+'</span>)</li>'
                        +           '<li class="amount">&yen;<span>'+amount+'</span></li>'
                        +      '</ul>'
                        +      '<ul class="item_b">'
                        +           '<li class="date">'+date+'</li>'
                        +           '<li class="time">'+time+'</li>'
                        +           '<li class="status">'+getStatus(status)+'</li>'
                        +      '</ul>'
                        + '</div>';
                    $(".drawRecord").append(bankItem);
                }
            })
        }
    });
*/
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
function getStatus(status){
    if(status==0){
        return "申请中"
    }else if(status==1){
        return "处理中"
    }else if(status==2){
        return "提现成功"
    }else if(status==3){
        return "提现失败"
    }else if(status==4){
        return "拒绝"
    }else if(status==5){
        return "取消"
    }
}
//超出两位保留两位有效数字
function floatFixed2(res){
    if(res.toString().indexOf(".")) {
        if (res.toString().split(".")[1]) {
            if(res.toString().split(".")[1].length>2){
                if (res.toString().split(".")[1] / 1 == 0) {
                    return res*1;
                }else {
                    return res.toFixed(2);
                }
            }else {
                return res;
            }
        }else {
            return res;
        }
    }else {
        return res;
    }
}
//获取提现信息列表
function getList(param){
    $.ajax({
        type: 'POST',
        url: '/pay/h5/balance/withdraw/list',
        data: {data:JSON.stringify(param)},
        dataType: 'json',
        success: function (data) {
            console.log(data);
            var result=data.data.result;
            if(result.length<10){
                $(".scrollBot").html("－ 加载完毕 －");
            }
            if(data.data.totalCnt=="0"){
                $("body").html('<div class="hasNone">暂时还没有提现记录</div>');
            }
            $.each(result, function (i) {
                var amount=floatFixed2(result[i].amount/100),
                    date=getDate(Number(result[i].createTime)),
                    time=getTime(Number(result[i].createTime)),
                    status=result[i].status;
                if(result[i].channel=="wx"){
                    var wxItem='<div class="item wx">'
                        +     '<ul class="item_t">'
                        +           '<li>提现到微信钱包</li>'
                        +           '<li class="amount">-&yen;<span>'+amount+'</span></li>'
                        +      '</ul>'
                        +      '<ul class="item_b">'
                        +           '<li class="date">'+date+'</li>'
                        +           '<li class="time">'+time+'</li>'
                        +           '<li class="status">'+getStatus(status)+'</li>'
                        +      '</ul>'
                        + '</div>';
                    $(".drawRecord").append(wxItem);
                }else{
                    var inBank=result[i].inBank,
                        inAccountNumber=result[i].inAccountNumber;
                    var bankItem='<div class="item">'
                        +     '<ul class="item_t">'
                        +           '<li>'+inBank+'(<span>'+inAccountNumber.substring(inAccountNumber.length-4)+'</span>)</li>'
                        +           '<li class="amount">&yen;<span>'+amount+'</span></li>'
                        +      '</ul>'
                        +      '<ul class="item_b">'
                        +           '<li class="date">'+date+'</li>'
                        +           '<li class="time">'+time+'</li>'
                        +           '<li class="status">'+getStatus(status)+'</li>'
                        +      '</ul>'
                        + '</div>';
                    $(".drawRecord").append(bankItem);
                }
            })
        }
    });
}


