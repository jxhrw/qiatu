var houseStart;
var houseEnd;
var houseCount;
var roomid;
var roomLiCheckin;
var roomLiCheckout;
var aMount;
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
    $(".end").html(getFutureDate(getDate(fStart)).m+"-"+getFutureDate(getDate(fStart)).d);
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
                   if (y + ulHeight > htmlHeight) {
                      $(".state").css({
                            "top":y - ulHeight-40,
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
    	if ($(this).attr("count") != "shut") {
    		var changeStatus = {
	        	"id":roomid,
			    "isClosed":0,
			    "amount":amount,
			    "checkin":roomLiCheckin,
			    "checkout":roomLiCheckin
	        }
    	} else{
    		var changeStatus = {
	        	"id":roomid,
			    "isClosed":1,
			    "amount":aMount,
			    "checkin":roomLiCheckin,
			    "checkout":roomLiCheckin
	        }
    	}
        

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

        var Agoyear = Stime.split("-");
        if (Syear == Agoyear[0]) {
        	$(".range").children("p:eq(1)").html(Syear);
        } else {
            $(".range").children("p:eq(1)").html(Agoyear[0] + "-" + Syear);
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
        houseStart = Date.parse(new Date($(".start").html()));
        houseEnd = ((houseStart/1000) + 60*60*24*14)*1000;
        var backDate = {"checkin":houseStart,"checkout": houseEnd}
        $(".start").html(year + "-" + month + "-" +day);
        gainData(backDate);
    })

})
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
	    		$.each(nextdate.data,function (index) {
	    			// console.log(111);
	    			var num = parseInt(index)+1;
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
            },
            error:function () {
            	console.log("error");
            }
        })
    }
