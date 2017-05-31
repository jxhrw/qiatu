
$(document).ready(function() {

    var pageCon=15;   //目前显示数据条数
    var pageEve=15;   //滑到底部每次加载条数
    var totalPages=1;//总页数
    var res={pagecnt:10,pageno:1};
    download(res);  //加载10条

    function month(date){     //获取单独的年月日，变量date要是字符串
        var obj={};
        var $date=new Date(date);
        var year=$date.getFullYear();
        var month=$date.getMonth()+1;
        var day=$date.getDate();
        var hour=$date.getHours();
        var minute=$date.getMinutes();
        obj={'years':year,'months':month,'days':day,'hours':hour,'minutes':minute};
        return obj;
    }

    function addData(data){    //将数据一条条插入
        //for(var i=0;i<data.data.length;i++){
        if(data.sc!=0){
            //window.location.href="/html/mobileBms/login.html?title=";
        }else {
            for(var i=0;i<data.data.length;i++){
                var orderId=data.data[i].orderid;
                var classNum;
                var statedesc;
                var status=data.data[i].status;
                if(status==9){     //状态值的三种颜色
                    classNum=3;
                    statedesc=data.data[i].closereson;
                }else {
                    if(status==8|| status==11 || status==12){
                        classNum=2;
                        statedesc="确认有房";
                    }
                    if(status==1|| status==2 || status==3 || status==4 || status==5 || status==6) {
                        classNum=1;
                        statedesc="等待确认";
                    }
                }
                var orderName=data.data[i].ordername;
                var dateIn=parseInt(data.data[i].checkin);
                var checkIn=month(dateIn);
                var dateOut=parseInt(data.data[i].checkout);
                var checkOut=month(dateOut);
                var nights=data.data[i].nights;
                var quantity=data.data[i].quantity;
                var customerName=data.data[i].customerName;
                var customerMobile=data.data[i].customerMobile;
                var dateCreate=parseInt(data.data[i].createtime);
                var createTime=month(dateCreate);
                var html;
                if(data.data[i].ordertype==2){
                    html='<li class="bookingOrderLi">'+
                        '<a href="/html/bms/mobileBms/orderDetail.html?orderid='+orderId+'" class="orderDetail">'+
                        '<div class="triangle"></div>'+
                        '<div class="clearfix nameBox">'+
                        '<div class="fl state state'+ classNum +'">'+ statedesc +'</div>'+
                        '<div class="fl proName">'+orderName+'</div>'+
                        '</div>'+
                        '<div class="information">'+
                        '入住：'+ formatNum(parseInt(checkIn.months)) +'/'+ formatNum(parseInt(checkIn.days)) +'，离店：'+ formatNum(parseInt(checkOut.months)) +'/'+ formatNum(parseInt(checkOut.days)) +'，'+ nights +'晚，预订'+ quantity +'间房'+
                        '<br>'+ customerName +' <span class="phoneNum">'+ customerMobile +'</span>'+
                        '</div>'+
                        '</a>'+
                        '</li>';
                }
                if(data.data[i].ordertype==6){
                    html='<li class="bookingOrderLi">'+
                        '<a href="/html/bms/mobileBms/inStoreDetail.html?orderid='+ orderId  +'" class="orderDetail">'+
                        '<div class="triangle"></div>'+
                        '<div class="clearfix nameBox">'+
                        '<div class="fl state state'+ classNum +'">'+ data.data[i].statedesc +'</div>'+
                        '<div class="fl proName">'+formatNum(parseInt(createTime.years)) +'/'+formatNum(parseInt(createTime.months)) +'/'+ formatNum(parseInt(createTime.days))+'&nbsp;&nbsp;&nbsp;&nbsp;'+formatNum(parseInt(createTime.hours)) +':'+formatNum(parseInt(createTime.minutes))+'</div>'+
                        '</div>'+
                        '<div class="information">'+ data.data[i].bookerName +' <span class="phoneNum">'+ data.data[i].bookerMobile +'</span>'+ '</div>'+
                        '</a>'+
                        '</li>';
                }
                $(".bookingOrderBox").append(html);
            }
            $(".bookingOrderBox .bookingOrderLi:first-child").css({'border-top':'none'});
        }
    }

    $(window).scroll(function(){
        var $this =$(this),
            viewH =$(window).height(),//可见高度
            contentH =$('.bookingOrderBox').get(0).scrollHeight,//内容高度
            scrollTop =$(window).scrollTop();//滚动高度
        if(contentH - viewH == scrollTop ) { //到达底部时,加载新内容
            // 这里加载数据..
            res.pageno++;
            if(res.pageno>totalPages){
                return false;
            }
            download(res);
        }
    });

    function download(res){  //加载数据
        $.ajax({
            url:"/order/bmsh5/list",
            type:"POST",
            dataType:'json',
            data:{data:JSON.stringify(res)},
            success: function(data) {
                totalPages=data.pageinfo.pageAmount;
                addData(data);
            },
            error: function(error){
                console.log(error.status);
            }
        });
    }
});

function formatNum(num){
    if(num<10&&num>0){
        num="0"+num;
    }
    return num;
}

window.onload = function() {
    setTimeout(function(){
        var len=$(".bookingOrderBox .bookingOrderLi").length;
        if(len==0){
            $("body").append("<div style='text-align: center;padding: 0.3rem;color: #555;font-size: 0.3rem;'>您还没有订单</div>");
        }
    },300);
};