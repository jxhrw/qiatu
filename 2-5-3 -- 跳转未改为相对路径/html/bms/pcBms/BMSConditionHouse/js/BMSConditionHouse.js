var houseStart;
var houseEnd;
var houseCount;
var roomid;
var allRoomId;
var allHouseCount;
var roomLiCheckin;
var roomLiCheckout;
var aMount;
var roomnum;
var roomPidArr = [];
var roomNumMin;
var houseSelectLiCount = [];
var saveInvertory;
var weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
$(document).ready(function () {
//房型信息
    $.ajax({
    	type:"GET",
    	datatype:"json",
    	url:"/content/bms/room/list",
    	success:function (data) {
    		console.log("success");
    		$.each(data.data,function (index) {
    			$(".b-shang").append("<tr><td><div class='num'>"+ data.data[index].name +"</div></td></tr>");
                
    		})
    	},
    	error:function () {
    		console.log("error");
    	}
    })
//房态数据
    fStart =  Date.parse(new Date());
    fEnd = ((Date.parse(new Date())/1000) + 60*60*24*14)*1000;
    $(".start").html(getDate(Date.parse(new Date())));
    $(".startshow").html(getDate(Date.parse(new Date())).substr(5));
    $(".end").html(getFutureDate(getDate(fStart)).m+"-"+getFutureDate(getDate(fStart)).d);
    $(".endshow").html(getFutureDate(getDate(fStart)).m+"-"+getFutureDate(getDate(fStart)).d);
    var nowDate = {"checkin":fStart,"checkout":fEnd}
    gainData(nowDate);
//列表	
    $(".houseStatus").on("click",".canselected",function (e) {
    	e.stopPropagation();
        $(".state").hide();
        $(".change").removeClass("change");
    	$(this).addClass("change");
    	// houseCount = parseInt($(this).html().split('')[0]);
    	// console.log(houseCount);
     	$(this).addClass("active");
     	var w = $(".active").width()+1;
     	var x = $(".active").offset().left+1;
     	var y = $(".active").offset().top+40;
     	// console.log(y);
     	// console.log(x);
        
        houseStart = Date.parse(new Date($(".start").html()));
        houseEnd = ((houseStart/1000) + 60*60*24*14)*1000;
        var nowLiDate = {"checkin":houseStart,"checkout": houseEnd}
        
        // console.log($(".change").attr("serail"));
        $(this).off("mouseover");
        $("td").not(this).on("mouseover",function () {
            // console.log(11);
            $(".state").hide();
            $(".change").removeClass("change");
        })

        $.ajax({
        	type:"GET",
        	datatype:"json",
            url:"/product/bms/room/stock/calendar",
            data:{data:JSON.stringify(nowLiDate)},
            success:function (Lidata) {
                   console.log("success");
                   var i = parseInt($(".xuan").parent().attr("serail"));
                   var j = parseInt($(".xuan").attr("serail"));
                   var count = Lidata.data[i-1].roomNum;
                   Condition(y,x,w,count);
                   var htmlHeight = $("html").height();
                   var ulHeight = $(".state").height();
                   // console.log(ulHeight);
                   // console.log(htmlHeight);
                   if (y + ulHeight > htmlHeight&&y - ulHeight-40 >= 0) {
                      $(".state").css({
                            "top":y - ulHeight-40,
                            "left":x,
                            "width":w
                        })
                   } else {
                     $(".state").css({
                            "top":y,
                            "left":x,
                            "width":w
                        })
                   }
                   $(".state").show();
                   if ($(".state").is(":hidden")) {
                        $(".change").removeClass("change");
                    }
                    $(".active").removeClass("active");
                   roomid = parseInt(Lidata.data[i-1].roomPid);
                   roomLiCheckin = Date.parse(new Date(Lidata.data[i-1].roomStatus[j].checkin));
                   aMount = parseInt(Lidata.data[i-1].roomStatus[j].stock);
                   roomLiCheckout = ((Date.parse(new Date(Lidata.data[i-1].roomStatus[j].checkin)))/1000+ 60*60*24*14)*1000;
            },
            error:function () {
            	   console.log("error");
            }
        })
    })
//悬停于列表中
    $("body").on("mouseover",".canselected",function () {
        // console.log(4);
    	$(".xuan").removeClass("xuan");
    	$(".xuan1").removeClass("xuan1");
    	$(".xuan2").removeClass("xuan2");
    	$(this).addClass("xuan");
    	var Sname = $(this).parent().attr("serail");
    	var date = $(this).attr("serail");
    	$(".b-shang").children("tr:eq("+Sname+")").addClass("xuan1");
    	$(".bTou").children("th:eq("+date+")").addClass("xuan2");
    })

    $("div").on("mouseover",function () {
        // console.log(3);
        $(".xuan").removeClass("xuan");
        $(".xuan1").removeClass("xuan1");
        $(".xuan2").removeClass("xuan2");
    })
//修改房态
    $(".state").on("click","li",function () {
    	var amount = parseInt($(this).attr("count"));
        console.log(roomid);
    	if ($(this).attr("count") != "shut") {
    		var changeStatus = {
	        	"productIds":[roomid],
			    "isClosed":0,
			    "amount":amount,
			    "checkin":roomLiCheckin,
			    "checkout":roomLiCheckin
	        }
    	} else{
    		var changeStatus = {
	        	"productIds":[roomid],
			    "isClosed":1,
			    "amount":aMount,
			    "checkin":roomLiCheckin,
			    "checkout":roomLiCheckin
	        }
    	}
        // console.log(changeStatus);

    	$.ajax({
    		type:"POST",
    		datatype:"json",
    		url:"/product/bms/stock/update",
    		data:{data:JSON.stringify(changeStatus)},
    		success:function (fullHouse) {
    			console.log("success");
                if (fullHouse.sc == "0") {
                    houseStart = Date.parse(new Date($(".start").html()));
                    houseEnd = ((houseStart/1000) + 60*60*24*14)*1000;
                    var successChange = {"checkin":houseStart,"checkout": houseEnd};
                    gainData(successChange);
                    $(".state").hide();
                }
    		},
    		error:function () {
    			console.log("error");
    		}
    	})
    })
  
//选择时间段
    $(".start").bind('DOMNodeInserted', function() {
    	var Stime = $(".start").html();
    	var Syear = getFutureDate(Stime).y;
        var month = getFutureDate(Stime).m;
        var day = getFutureDate(Stime).d;
        $(".end").html(month + "-" + day);
        $(".endshow").html(month + "-" + day);
        var Agoyear = Stime.split("-");
        if (Syear == Agoyear[0]) {
        	$(".range").children("p:eq(2)").html(Syear);
        } else {
            $(".range").children("p:eq(2)").html(Agoyear[0] + "-" + Syear);
        }
    

        houseStart = Date.parse(new Date($(".start").html()));
        houseEnd = ((houseStart/1000) + 60*60*24*14)*1000;
        var monitorDate = {"checkin":houseStart,"checkout": houseEnd};
        gainData(monitorDate);
	});
//下一个14天
    $(".J-next").click(function () {
    	var Stime = $(".start").html();
    	var year = getFutureDate(Stime).y;
        
        var month = getFutureDate(Stime).m;
        var day = getFutureDate(Stime).d;
        $(".start").html(year + "-" + month + "-" +day);
        $(".startshow").html(month + "-" +day);
        houseStart = Date.parse(new Date($(".start").html()));
        houseEnd = ((houseStart/1000) + 60*60*24*14)*1000;
        var nextDate = {"checkin":houseStart,"checkout": houseEnd}
        gainData(nextDate);
    })
//上一个14天
    $(".J-back").click(function () {
    	var Stime = $(".start").html();
    	var year = getAgoeDate(Stime).y;
        
        var month = getAgoeDate(Stime).m;
        var day = getAgoeDate(Stime).d;
        $(".start").html(year + "-" + month + "-" +day);
        $(".startshow").html(month + "-" +day);
        houseStart = Date.parse(new Date($(".start").html()));
        houseEnd = ((houseStart/1000) + 60*60*24*14)*1000;
        var backDate = {"checkin":houseStart,"checkout": houseEnd}
        $(".start").html(year + "-" + month + "-" +day);
        $(".startshow").html(month + "-" +day);
        gainData(backDate);
    })
//批量修改房态
    $(".J-defaultState").click(function () {
        $(".batchStatusWarp").show();
        $(".tcback").show();
    })
    $(".J-batchSave").click(function () {
        console.log(saveInvertory);
        if (saveInvertory != "shut") {
            var changeStatus = {
                "productIds":roomPidArr,
                "isClosed":0,
                "amount":saveInvertory,
                "checkin":roomLiCheckin,
                "checkout":roomLiCheckout
            }
        } else{
            var changeStatus = {
                "productIds":roomPidArr,
                "isClosed":1,
                "amount":1,
                "checkin":roomLiCheckin,
                "checkout":roomLiCheckout
            }
        }
        if (roomPidArr.length == 0) {
            jiHeAlert.open('请选择房型');
            $(".batchStatusWarp").show();
            $(".tcback").show();
        } else if (roomPidArr.length != 0) {
            if (roomLiCheckin == undefined||roomLiCheckout == undefined) {
                jiHeAlert.open('请选择日期');
                $(".batchStatusWarp").show();
                $(".tcback").show();
            } else if (roomLiCheckin != undefined&&roomLiCheckout != undefined) {
                if(saveInvertory == undefined) {
                    jiHeAlert.open('请选择库存');
                    $(".batchStatusWarp").show();
                    $(".tcback").show();
                } else if (saveInvertory != undefined) {
                    $.ajax({
                        type:"POST",
                        datatype:"json",
                        url:"/product/bms/stock/update",
                        data:{data:JSON.stringify(changeStatus)},
                        success:function (fullHouse) {
                            console.log("success");
                            if (fullHouse.sc == "0") {
                                start.max = "2099-06-16";
                                houseStart = Date.parse(new Date($(".start").html()));
                                houseEnd = ((houseStart/1000) + 60*60*24*14)*1000;
                                var successChange = {"checkin":houseStart,"checkout": houseEnd};
                                gainData(successChange);
                                Close();
                            }
                        },
                        error:function () {
                            console.log("error");
                        }
                    })
                }
            }
        }
        
        

        // console.log(changeStatus);
    })
//勾选房型及显示库存
    $(".houseSelectWarp").on("click",".houseSelectLi",function () {
        $(".invertoryLiCount").remove();
        var url1 = "image/gou1.jpg";
        var url2 = "image/gou2.jpg";
        var countMin = 1000;
        saveInvertory = undefined;
        $(".gouInvertory").children("img").attr("src","image/gou1.jpg");
        if ($(this).children("img").attr("src") == "image/gou2.jpg") {
            $(this).children("img").attr("src", url1);
            $(this).removeClass("gouHouse");
            $(".allSelect").children("img").attr("src","image/gou1.jpg");
            houseSelectLiCount.splice(jQuery.inArray($(this).attr("houseselectlicount"),houseSelectLiCount),1);
            roomPidArr.splice(jQuery.inArray($(this).attr("roomid"),roomPidArr),1);
        } else {
            $(this).children("img").attr("src", url2);
            $(this).addClass("gouHouse");
            houseSelectLiCount.push($(this).attr("houseselectlicount"));
            roomPidArr.push($(this).attr("roomid"));
        }
        // console.log(roomPidArr);
        for(var i=0;i<houseSelectLiCount.length;i++) {
            if (countMin > houseSelectLiCount[i]) {
                countMin = houseSelectLiCount[i];
            }
        }
        // console.log(countMin);
        if (countMin != 1000) {
            for (var i=1;i<=countMin;i++) {
                // console.log(22);
                $(".shutHouse").before("<li class='houseLi invertoryLi invertoryLiCount' count='"+i+"'><img src='image/gou1.jpg'><span>"+i+"间</span></li>")
            }
        } else {
            for (var i=1;i<=roomnum;i++) {
                $(".shutHouse").before("<li class='houseLi invertoryLi invertoryLiCount' count='"+i+"'><img src='image/gou1.jpg'><span>"+i+"间</span></li>")
            }
        }

    })
//全选房型及显示库存
    $(".allSelect").click(function () {
        $(".invertoryLiCount").remove();
        var url1 = "image/gou1.jpg";
        var url2 = "image/gou2.jpg";
        $(".gouInvertory").children("img").attr("src","image/gou1.jpg");
        saveInvertory = undefined;
        if ($(".allSelect").children("img").attr("src") == "image/gou2.jpg") {
            $(".houseSelectLi").children("img").attr("src",url1);
            $(this).children("img").attr("src",url1);
            $(".houseSelectLi").removeClass("gouHouse");
            roomPidArr = [];
            houseSelectLiCount = [roomnum];
            for (var i=1;i<=roomnum;i++) {
                $(".shutHouse").before("<li class='houseLi invertoryLi invertoryLiCount' count='"+i+"'><img src='image/gou1.jpg'><span>"+i+"间</span></li>")
            }
        } else {
            $(".houseSelectLi").children("img").attr("src",url2);
            $(this).children("img").attr("src",url2);
            $(".houseSelectLi").addClass("gouHouse");
            roomPidArr = allRoomId;
            houseSelectLiCount = allHouseCount
            for (var i=1;i<=roomNumMin;i++) {
                $(".shutHouse").before("<li class='houseLi invertoryLi invertoryLiCount' count='"+i+"'><img src='image/gou1.jpg'><span>"+i+"间</span></li>")
            }
        }
        console.log(roomPidArr);
    })
//勾选房间库存
    $(".invertorySelectWarp").on("click",".invertoryLi",function () {
        var url1 = "image/gou1.jpg";
        var url2 = "image/gou2.jpg";
        if ($(this).children("img").attr("src") == "image/gou2.jpg") {
            $(".invertoryLi").children("img").attr("src", url1);
            $(".invertoryLi").removeClass("gouInvertory");
            saveInvertory = "null";
        } else {
            $(".invertoryLi").children("img").attr("src", url1);
            $(".invertoryLi").removeClass("gouInvertory");
            $(this).children("img").attr("src", url2);
            $(this).addClass("gouInvertory");
            saveInvertory = $(".gouInvertory").attr("count");

        }
    })

//批量修改房态更换日期
    var start = {  
        elem: '#J-batchStartDate', //选择ID为START的input  
        format: 'YYYY-MM-DD', //自动生成的时间格式  
        min: laydate.now(), //设定最小日期为当前日期  
        max: '2099-06-16', //最大日期  
        istime: true, //必须填入时间  
        istoday: false,  //是否是当天  
        start: laydate.now(0,"YYYY-MM-DD"),  //设置开始时间为当前时间  
        choose: function(datas){  
             roomLiCheckin = Date.parse(new Date($(".batchStartDate").val()));
             console.log(roomLiCheckin);
             end.min = datas; //开始日选好后，重置结束日的最小日期  
             end.start = datas; //将结束日的初始值设定为开始日  
        }  
    };  
    var end = {  
        elem: '#J-batchEndDate',  
        format: 'YYYY-MM-DD',  
        min: laydate.now(),  
        max: '2099-06-16',  
        istime: true,  
        istoday: false,  
        start: laydate.now(0,"YYYY-MM-DD"),  
        choose: function(datas){  
            roomLiCheckout = ((Date.parse(new Date($(".batchEndDate").val())))/1000)*1000;
            console.log(roomLiCheckout);
            start.max = datas; //结束日选好后，重置开始日的最大日期  
            console.log(datas);
        }  
    };  
    laydate(start);  
    laydate(end);
    $("body").on("click",".laydate_void",function () {
        console.log("xx");
        jiHeAlert.open('请选择正确的日期');
    })
//批量修改房态弹窗
//关闭弹窗
    $(".top").children().click(function () {
        Close();
        $('.move').removeClass("move");
    })

})
//关闭弹窗
function Close() {
    $(".tcback").hide();
    $(".template").hide();
    // $('.canselected').removeAttr('style');
}
//生成下拉列表
	function Condition(top,left,width,count) {
		var list = "";
        // console.log(222);
		for (var i=1;i<=count;i++) {
			list += "<li count='"+i+"' onclick='HouseChange(this)'>"+i+"间</li>"
		}
		$(".state").children().remove();
		$(".state").append(list+"<li class='J-full' count='0'>满房</li><li class='J-shut' count='shut'>关房</li>");
		$(".state").css({
			"top":top,
			"left":left,
			"width":width
		})
		$(".state li").css({
			"width":width
		})
	}

//格式化时间戳  
    function getDate(time) {//将时间戳转化为日期
	    var date = new Date(time);
	    y = date.getFullYear();
	    m = date.getMonth() + 1;
	    d = date.getDate();
	    return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
	}
//得到后14天的日期
    function getFutureDate(date) {
    	var timestamp = Date.parse(new Date(date));
    	timestamp = ((timestamp/1000) + 60*60*24*13)*1000;
    	date = new Date(timestamp);
	    y = date.getFullYear();
	    m = date.getMonth() + 1;
	    d = date.getDate();
	    return  riqi = {
                  y: y,
				  m: m < 10 ? "0" + m : m,
				  d: d < 10 ? "0" + d : d
			}
    }
//得到前14天日期
    function getAgoeDate(date) {
    	var timestamp = Date.parse(new Date(date));
    	timestamp = ((timestamp/1000) - 60*60*24*13)*1000;
    	date = new Date(timestamp);
	    y = date.getFullYear();
	    m = date.getMonth() + 1;
	    d = date.getDate();
	    return  riqi = {
                  y: y,
				  m: m < 10 ? "0" + m : m,
				  d: d < 10 ? "0" + d : d
			}
    }
//修改房态
    function HouseChange(obj) {
    	// console.log(222);
    	var count = $(obj).attr("count");
    	// console.log(count);
    	$(".change").html(count+"间");
    	$(".change").removeClass("change");
    }
//控制日期且加载房态数据
    function gainData(gaindata) {

        $(".batchStartDate").val("");
        $(".batchEndDate").val("");
        saveInvertory = undefined;
        roomLiCheckin = undefined;
        roomLiCheckout = undefined;
        roomPidArr = [];

    	$.ajax({
        	type:"GET",
        	datatype:"json",
            url:"/product/bms/room/stock/calendar",
            data:{data:JSON.stringify(gaindata)},
            success:function (nextdate) {
            	console.log("success");
            	$.each(nextdate.data[0].roomStatus,function (index) {
	    			$(".bTou th").eq(index).children(".month").html(nextdate.data[0].roomStatus[index].checkin.substr(5));
	    			var myDate = new Date(Date.parse(nextdate.data[0].roomStatus[index].checkin.replace(/-/g, "/")));
                  
	    			if (nextdate.data[0].roomStatus[index].checkin == getDate(Date.parse(new Date()))) {
	    				// console.log(1111);
	    				$(".bTou th").eq(index).children(":eq(1)").html("今天");
	    			} else {
	    				$(".bTou th").eq(index).children(":eq(1)").html(weekDay[myDate.getDay()]);
	    			}
	    		})
                $(".houseStatus").children(".Tr").remove();
                roomnum = 0;
                roomNumMin = 1000;
                allRoomId = [];
                allHouseCount = [];
                $(".houseSelectLi").remove();
                $(".gouInvertory").children("img").attr("src","image/gou1.jpg");
                $(".gouInvertory").removeClass("gouInvertory");
	    		$.each(nextdate.data,function (index) {
	    			// console.log(111);
                    allRoomId.push(nextdate.data[index].roomPid);
                    allHouseCount.push(nextdate.data[index].roomNum);
                    $(".houseSelectWarp ul").append("<li class='houseLi houseSelectLi' houseSelectLiCount='"+ nextdate.data[index].roomNum +"' roomid='"+ nextdate.data[index].roomPid +"'><img src='image/gou1.jpg'><p>"+ nextdate.data[index].roomName +"</p></li>")
	    			var num = parseInt(index)+1;
                    if (roomnum < parseInt(nextdate.data[index].roomNum)) {
                        roomnum = parseInt(nextdate.data[index].roomNum);
                    }
                    if (roomNumMin > parseInt(nextdate.data[index].roomNum)) {
                        roomNumMin = parseInt(nextdate.data[index].roomNum);
                    }
	    			$(".houseStatus").append("<tr serail='"+num+"' class='tr"+num+" Tr'></tr>");
	    			var houseCountTd = "";
		    		for(var i=0;i<nextdate.data[index].roomStatus.length;i++) {

		    			if (nextdate.data[index].roomStatus[i].isClosed == "1") {
		    				$(".houseStatus .Tr").eq(index).append("<td class='canselected shut' serail='"+i+"'>关房</td>");
		    			} else {
		    				if (nextdate.data[index].roomStatus[i].stock == "0") {
		    					$(".houseStatus .Tr").eq(index).append("<td class='canselected full' serail='"+i+"'>满房</td>");
		    				} else {
		    					$(".houseStatus .Tr").eq(index).append("<td class='canselected' serail='"+i+"'>"+nextdate.data[index].roomStatus[i].stock+"间</td>");  
		    				}
		    			}
		                
		    		}
	    		})
                $(".invertoryLiCount").remove();
                $(".allSelect").children("img").attr("src","image/gou1.jpg");
                $(".gouHouse").removeClass("gouHouse");
                for (var i=1;i<=roomnum;i++) {
                    $(".shutHouse").before("<li class='houseLi invertoryLi invertoryLiCount' count='"+i+"'><img src='image/gou1.jpg'><span>"+i+"间</span></li>")
                }
            },
            error:function () {
            	console.log("error");
            }
        })
    }
