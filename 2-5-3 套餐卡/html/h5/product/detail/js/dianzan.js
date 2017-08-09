//点赞接口1是去过 2是想去 3是喜欢
function iOSChangLikeCount(urlLike,dataLike) {
    $.post(urlLike, {
        data: dataLike
    }, function (result) {
        if (result.data.likeStatus> 0) {
            $(".want i").addClass("likeCurrent");
        } else {
            $(".want i").removeClass("likeCurrent");
        }
    });
}
function androidChangLikeCount( urlLike,dataLike) {
    var Device = new Device();
    Device.requestCommit(urlLike, dataLike);
    if (Device.getRequestData().data.likeStatus> 0) {
        $(".proLike i").addClass("likeCurrent");
    } else {
        $(".proLike i").removeClass("likeCurrent");
    }
}
function androidToGo(urlHotelWant,paramHotelWant){
    var device = new Device();
    device.requestCommit(urlHotelWant, paramHotelWant);
    $("#like .togo span").html(device.getRequestData().data.goToCount);
    if(device.getRequestData().data.goToStatus==0){
        $("#like .togo img").attr("src","../h5_2.0/images/ungone.png");
    }
    else
    {
        $("#like .togo img").attr("src","../h5_2.0/images/gone.png");
    }
}
function iOSToGo(urlHotelWant,paramHotelWant) {
    $.post(urlHotelWant, {
        data: paramHotelWant
    }, function (result) {
        $("#like .togo span").html(result.data.goToCount);
        if(result.data.goToStatus==1){
            //$(".togo i").removeClass("togoCurrent");
            $("#like .togo img").attr("src","../h5_2.0/images/gone.png");
        }
        else
        {
            //$(".togo i").addClass("togoCurrent");
            $("#like .togo img").attr("src","../h5_2.0/images/ungone.png");
        }
    });
}

function androidWantTo(urlHotelLike,paramHotelLike){
    var device = new Device();
    device.requestCommit(urlHotelLike, paramHotelLike)
    $("#like .want span").html(device.getRequestData().data.wantCount);
    if(Device.getRequestData().data.wantStatus==1){
        $("#like .want img").attr("src","../h5_2.0/images/unstar.png");
    }
    else
    {
        $("#like .want img").attr("src","../h5_2.0/images/star.png");
    }
}

function iOSWantTo(urlHotelLike,paramHotelLike){
    $.post(urlHotelLike, {
        data: paramHotelLike
    }, function (result) {
        $("#like .want span").html(result.data.wantCount);
        if(result.data.wantStatus==0){
            $("#like .want img").attr("src","../h5_2.0/images/unstar.png");
        }
        else
        {
            $("#like .want img").attr("src","../h5_2.0/images/star.png");
        }
    });
}
//自己跳先判断是否登录
function comment(){
    var urlInfo ="/leapp/le.user.info";
    var paramInfo = '{}';
    var device = new Device();
    device.requestCommit(urlInfo, paramInfo);
    if(device.getRequestData().data.user.loginstatus==1){
        window.location="comment.html?id="+id;
    }
    else{
        jihe.toLogin()
    }
}
