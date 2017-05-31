var houseStart;
var houseEnd;
var selectecdlog = [];
var allroompid;
var roompid;
var touid;
var roomChangePrice;
var roomCheckin;
var roomCheckout;
var resultLen = 0;
var resultBegin = 0;
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
//房价信息
    fStart =  Date.parse(new Date());
    fEnd = ((Date.parse(new Date())/1000) + 60*60*24*14)*1000;
    $(".start").html(getDate(Date.parse(new Date())));
    $(".end").html(getFutureDate(getDate(fStart)).m+"-"+getFutureDate(getDate(fStart)).d);
    var nowDate = {"checkin":fStart,"checkout":fEnd}
    gainData(nowDate);
//悬停于列表中
    $("body").on("mouseover",".canselected",function () {
        // console.log(111);
        $(".xuan").removeClass("xuan");
        $(".xuan1").removeClass("xuan1");
        $(".xuan2").removeClass("xuan2");
        $(this).addClass("xuan");
        var Sname = $(this).parent().attr("serail");
        // console.log(Sname);
        var date = $(this).attr("serail");
        $(".b-shang").children("tr:eq("+Sname+")").addClass("xuan1");
        $(".b-tou").children("th:eq("+date+")").addClass("xuan2");
    })

    $("div").not(".canselected").on("mouseover",function () {
        $(".xuan").removeClass("xuan");
        $(".xuan1").removeClass("xuan1");
        $(".xuan2").removeClass("xuan2");
    })
    
//选择时间段
    $(".start").bind('DOMNodeInserted', function() {
        // console.log(11111);
        var Stime = $(".start").html();
        // console.log(typeof Stime);
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
//关闭弹窗
    $(".close").click(function () {
        Close();
    })
    $(".top").children().click(function () {
        Close();
        $('.move').removeClass("move");

    })
//单击选框修改房价

    $(".J-setSave").click(function () {
        var setSavePrice = $(".price").val();
        // if (setSavePrice )
        var reg=/^[1-9]\d*$|^0$/;// 注意：故意限制了 0321 这种格式，如不需要，直接reg=/^\d+$/;
        if (reg.test(setSavePrice)==true) {
             var clickChange = {
                    "checkin":roomCheckin,
                    "checkout":roomCheckout,
                    "weekDays":[],
                    "roomPriceList":[
                        {"roomPid":roompid,"price":parseInt($(".price").val())*100}
                    ]
                }
                $.ajax({
                    type:"POST",
                    datatype:"json",
                    data:{data:JSON.stringify(clickChange)},
                    url:"/product/bms/room/price/special/update",
                    success:function () {
                        console.log("success");
                        houseStart = Date.parse(new Date($(".start").html()));
                        houseEnd = ((houseStart/1000) + 60*60*24*14)*1000;
                        var nowDate = {"checkin":houseStart,"checkout": houseEnd}
                        gainData(nowDate);
                        $(".move").removeClass("move");
                    },
                    error:function () {
                        console.log("error");
                    }
                })
        } else {
            jiHeAlert.open("重新输入");
            $(".set-warp").show();
            $(".tcback").show();
        }
        $(".price").val("");
        
    });

//批量修改房价
  //跟换日期
    
    laydate({
        elem:"#J-batchStartDate",
        formats:"YYY-MM-DD",
        festival:true
    });
    laydate({
        elem:"#J-batchEndDate",
        formats:"YYY-MM-DD",
        festival:true
    });
    //勾选星期
    $(".batchWeek").children().children().click(function () {
        var url1 = "image/gou1.jpg";
        var url2 = "image/gou2.jpg";
        if ($(this).children("img").attr("src") == "image/gou2.jpg") {
            $(this).children("img").attr("src",url1);
            $(this).removeClass("gou");
        } else {
            $(this).children("img").attr("src",url2);
            $(this).addClass("gou");
        }
    })
    $(".J-changeprice").click(function () {
        
        bulkEditingPrice(".batchWarp");
    })
    //修改保存
    $(".J-batchSave").click(function () {
        roomCheckin = Date.parse(new Date($(".batchStartDate").val()));
        //roomCheckout = ((roomCheckin/1000) + 60*60*24*13)*1000;
        roomCheckout = Date.parse(new Date($(".batchEndDate").val()));
        var weekDays = [];

        $(".batchWeek").children().children(".gou").each(function (index) {
            var week = $(".batchWeek").children().children(".gou").eq(index).children("span").html();
            switch (week) {
                case "周一":
                x=1;
                    break;
                case "周二":
                x=2;
                    break;
                case "周三":
                x=3;
                    break;
                case "周四":
                x=4;
                    break;
                case "周五":
                x=5;
                    break;
                case "周六":
                x=6;
                    break;
                case "周日":
                x=0;
                    break;
            }  
            weekDays.push(x);
        });
        var bathChangePrice = {
                "checkin":roomCheckin,
                "checkout":roomCheckout,
                "weekDays":weekDays,
                "roomPriceList":[]
        };
        for (var i=0;i<$(".batchBedTypeLi").length;i++) {
            if ($(".batchBedTypeLi").eq(i).children("input").val() != "") {
                bathChangePrice.roomPriceList.push({
                    "roomPid":allroompid[i],
                    "price":parseInt($(".batchBedPrice").eq(i).val())*100
                })
            }
        }
        console.log(bathChangePrice);

        var reg=/^[1-9]\d*$|^0$/;// 注意：故意限制了 0321 这种格式，如不需要，直接reg=/^\d+$/;
        var a = 1;
        // $(".batchBedPrice").each(function (index) {
        //     if (reg.test($(this).val())!=true) {
        //         a = 0;
        //     }
        // })

        if ($(".batchStartDate").val() == "" || $(".batchEndDate").val() == "" ) {
            // console.log("bb");
            a = 2;
        }

        if (a == 2) {
            jiHeAlert.open("请选择时间段");
            bulkEditingPrice(".batchWarp");
            return;
        } else if (a == 0) {
            jiHeAlert.open("重新输入");
            bulkEditingPrice(".batchWarp");
            return;
        } else if (a == 1) {
            $.ajax({
                type:"POST",
                datatype:"json",
                data:{data:JSON.stringify(bathChangePrice)},
                url:"/product/bms/room/price/special/update",
                success:function () {
                    console.log("success");
                    houseStart = Date.parse(new Date($(".start").html()));
                    houseEnd = ((houseStart/1000) + 60*60*24*14)*1000;
                    var nowDate = {"checkin":houseStart,"checkout": houseEnd};
                    gainData(nowDate);
                },
                error:function () {
                    console.log("error");
                }
            })
        }
    })
    
//默认房价
    $(".J-defaultprice").click(function () {
        $(".defaultWarp").show();
        $(".tcback").show();
        $.ajax({
            type:"GET",
            datatype:"json",
            url:"/product/bms/room/price/default",
                success:function (price) {
                console.log("success");
                        $(".concentWarp").children().remove();
                        console.log("success");
                            var defaulDate = ""
                            for(var i=2;i<8;i++) {
                                switch (i) {
                                    case 2:
                                      x="二";
                                      break;
                                    case 3:
                                      x="三";
                                      break;
                                    case 4:
                                      x="四";
                                      break;
                                    case 5:
                                      x="五";
                                      break;
                                    case 6:
                                      x="六";
                                      break;
                                    case 7:
                                      x="日";
                                      break;
                                }   
                                defaulDate += "<li class='bedTypeLi'><p>周"+ x +"</p><input type='text' name='bedTypePrice' class='bedTypePrice'></li>"  
                            }
                        $.each(price.data,function (index) {
                            $(".concentWarp").append("<div class='setPrice'><p class='bedType'>"+ price.data[index].roomName +"</p><ul><li class='bedTypeLi'><p>周一</p><input type='text' name='bedTypePrice' class='bedTypePrice Monday'></li>"+defaulDate+"</ul></div>");
                            for (var i=0;i<price.data[index].roomStatus.length;i++){
                                $(".setPrice ul").eq(index).children().children("input:eq("+i+")").val(parseInt(price.data[index].roomStatus[i].price)/100);
                                // console.log(price.data[index].roomStatus[i].price);
                            }
                            $(".Monday").eq(index).bind('input propertychange',function() {
                                // console.log("kkk");
                                var val = $(this).val();
                                $(this).parent().nextAll("li").children("input").val(val);
                            });

                        })
                                   
                        // console.log(allroompid);
            },
            error:function () {
                console.log("error");
            }
        })  
    })
   
    $(".J-defaultSave").click(function () {
        var reg=/^[1-9]\d*$|^0$/;// 注意：故意限制了 0321 这种格式，如不需要，直接reg=/^\d+$/;
        var a = 1;
        $(".bedTypePrice").each(function (index) {
            if (reg.test($(this).val())!=true) {
                a = 0;
            }
        })
           
        var allprice = {
            roomStatusList:[]
        }
        for(var i=0;i<$(".setPrice").length;i++){
            allprice.roomStatusList.push({
                "roomPid": allroompid[i],
                roomStatus:[]
               })
            for (var j=1;j<7;j++) {
                var x = j-1;
                allprice.roomStatusList[i].roomStatus.push(
                    {"weekDay":j,"price":parseInt($(".setPrice ul").eq(i).children().children("input:eq("+x+")").val())*100}
                )
            }
            allprice.roomStatusList[i].roomStatus.push(
                {"weekDay":0,"price":parseInt($(".setPrice ul").eq(i).children().children("input:eq("+6+")").val())*100}
            )
        }
       // console.log(allprice);

          if (a == 0) {
            jiHeAlert.open("重新输入");
            bulkEditingPrice(".defaultWarp");
            return;
          } else if (a == 1) {
             $.ajax({
              type:"POST",
              datatype:"json",
              data:{data:JSON.stringify(allprice)},
              url:"/product/bms/room/price/default/update",
              success:function () {
                console.log("success");
                    houseStart = Date.parse(new Date($(".start").html()));
                    houseEnd = ((houseStart/1000) + 60*60*24*14)*1000;
                    var nowDate = {"checkin":houseStart,"checkout": houseEnd}
                    gainData(nowDate);
                },
                error:function () {
                    console.log("error");
                }
            })
          }
         
       
    })
   
//鼠标拖动选取时，鼠标放下
     $(".housePrice").on("mousedown",".canselected",function () {
            selectecdlog = []

            selectecdlog.push($(this).attr('id'));
            touid = $(this).attr('id').substr(1,1);
           
            $(this).addClass("move");
            $(".canselected").off("mouseup");
            $(".canselected").mouseup(onMouseUp);
            $(".canselected").mouseover(onMouseOver);

     })


   
})
//关闭弹窗
    function Close() {
        $(".tcback").hide();
        $(".template").hide();
        // $('.canselected').removeAttr('style');
    }

//格式化时间戳  
    function getDate(time,year) {//将时间戳转化为日期
        var date = new Date(time);
        y = date.getFullYear();
        m = date.getMonth() + 1;
        d = date.getDate();
            if(year && year=="1"){
                return (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
            }else{
                return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
            }   
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
//拖动鼠标选取
    function onMouseUp(){
        /* Act on the event */
        for(var i =0; i<resultLen;i++)
        {   
            selectecdlog.push(selectecdlog[0].substr(0,2)+"c"+(resultBegin+i+1));       
        }
        if (touid != $(this).attr('id').substr(0,2)) {
            var a = $(this).attr('id').split("");
            a.splice(1,1,touid);
            last = a.join("");
            $("#"+last).addClass("move");
        } else {
            $(this).addClass("move");
        }
        $(".canselected").unbind('mouseover',onMouseOver);

        var id = $(".move").parent().attr("id");
        var first = $("#"+id).find(".move:first").attr("serail");
        var last =  $("#"+id).find(".move:last").attr("serail");

        houseStart = Date.parse(new Date($(".start").html()));
        houseEnd = ((houseStart/1000) + 60*60*24*14)*1000;
        
        var currentDate = {"checkin":houseStart,"checkout":houseEnd}
            $.ajax({
                type:"GET",
                datatype:"json",
                data:{data:JSON.stringify(currentDate)},
                url:"/product/bms/room/price/calendar",
                success:function (priceData) {
                    console.log("success");
                    roompid = priceData.data[touid-1].roomPid;
                    // console.log(roompid);
                    roomCheckin = Date.parse(new Date(priceData.data[touid-1].roomStatus[first].checkin));
                    roomCheckout = Date.parse(new Date(priceData.data[touid-1].roomStatus[last].checkin));
                    if (roomCheckin == roomCheckout) {
                        $(".setDate").html(getDate(Date.parse(new Date(roomCheckin))));
                    } else {
                        $(".setDate").html(getDate(roomCheckin)+"~"+getDate(roomCheckout));
                    }
                    // console.log(roompid);

                    $(".set-warp").show();
                    $(".tcback").show();
                },
                error:function () {
                    console.log("error");
                }
            })

    }
    function onMouseOver (argument) {
                // console.log(parseInt($(this).attr('id').substr(($(this).attr('id').indexOf('c'))+1)));
        var len =resultLen= Math.abs(parseInt(selectecdlog[0].substr(selectecdlog[0].indexOf('c')+1)) - parseInt($(this).attr('id').substr(($(this).attr('id').indexOf('c'))+1)));
            // console.log(len);
        var count = parseInt(selectecdlog[0].substr(selectecdlog[0].indexOf('c')+1)) - parseInt($(this).attr('id').substr(($(this).attr('id').indexOf('c'))+1));
            // console.log(parseInt(selectecdlog[0].substr(selectecdlog[0].indexOf('c')+1)) - parseInt($(this).attr('id').substr(($(this).attr('id').indexOf('c'))+1)));
        var begin =resultBegin= parseInt(selectecdlog[0].substr(selectecdlog[0].indexOf('c')+1)) >parseInt($(this).attr('id').substr(($(this).attr('id').indexOf('c'))+1)) ? parseInt($(this).attr('id').substr(($(this).attr('id').indexOf('c'))+1)):parseInt(selectecdlog[0].substr(selectecdlog[0].indexOf('c')+1));
        $('.canselected').removeClass('move');
        for(var i =0; i<len;i++)
        {    
            // $('#'+selectecdlog[0].substr(0,2)+"c"+(begin+i+1)).css('background-color', 'green');
            if (count < 0) {
                $('#'+selectecdlog[0].substr(0,2)+"c"+(begin+i)).addClass("move");
            } else if (count >= 0) {
                $('#'+selectecdlog[0].substr(0,2)+"c"+(begin+i+1)).addClass("move");
            }
        }
            //alert( $(this).attr('id').substr(($(this).attr('id').indexOf('c'))+1));
            //$('#'+tdId).css('background-color', 'red');
    }
         
        // set id attr for each td
//控制日期且加载房价数据
    function gainData(gaindata) {
        // console.log("zzz");
        $.ajax({
            type:"GET",
            datatype:"json",
            url:"/product/bms/room/price/calendar",
            data:{data:JSON.stringify(gaindata)},
            success:function (pricedata) {

                console.log("success");
                //改变表格顶部日期
                $.each(pricedata.data[0].roomStatus,function (index) {
                    $(".b-tou th").eq(index).children(".month").html(pricedata.data[0].roomStatus[index].checkin.substr(5));
                    var myDate = new Date(Date.parse(pricedata.data[0].roomStatus[index].checkin.replace(/-/g, "/")));
                    if (pricedata.data[0].roomStatus[index].checkin == getDate(Date.parse(new Date()))) {
                        // console.log(1111);
                        $(".b-tou th").eq(index).children(":eq(1)").html("今天");
                    } else {
                        $(".b-tou th").eq(index).children(":eq(1)").html(weekDay[myDate.getDay()]);
                    }
                })

                $(".housePrice").children(".Tr").remove();
                var allRoomPid = [];
                $.each(pricedata.data,function (index) {
                    // console.log(111);
                    var num = parseInt(index)+1;
                    $(".housePrice").append("<tr serail='"+num+"' class='tr"+num+" Tr' id='r"+num+"'></tr>");
                    var houseCountTd = "";
                    for(var i=0;i<14;i++) {
                        if (pricedata.data[index].roomStatus[i].isDefault == "0") {
                            // console.log("hyk");
                            $(".housePrice .Tr").eq(index).append("<td class='canselected youhui' serail='"+i+"' id='r"+num+"c"+i+"'>￥"+parseInt(pricedata.data[index].roomStatus[i].price)/100+"</td>");  
                        }else if (pricedata.data[index].roomStatus[i].isDefault == "1") {
                            // console.log("zm");
                             $(".housePrice .Tr").eq(index).append("<td class='canselected' serail='"+i+"' id='r"+num+"c"+i+"'>￥"+parseInt(pricedata.data[index].roomStatus[i].price)/100+"</td>");
                        }
                    }
                    allRoomPid.push(pricedata.data[index].roomPid);
                })
                allroompid = allRoomPid;
            },
            error:function () {
                console.log("error");
            }
        })
    }
//批量修改价格
    function bulkEditingPrice(pop) {
        $(".batchStartDate").val(getDate(Date.parse(new Date())));
        var Y = getFutureDate($(".batchStartDate").val()).y;
        var M = getFutureDate($(".batchStartDate").val()).m;
        var D = getFutureDate($(".batchStartDate").val()).d;
        var date = Y+"-"+M+"-"+D;
        $(".batchEndDate").val(date);
        $(pop).show();
        $(".tcback").show();
        $.ajax({
            type:"GET",
            typeof:"json",
            url:"/content/bms/room/list",
            success:function (data) {
                $(".batchChangePriceUl").children().remove();
                console.log("success");
                $.each(data.data,function (index) {
                    $(".batchChangePriceUl").append("<li class='batchBedTypeLi'><p>"+data.data[index].name+"</p><input type='text' name='' class='batchBedPrice'></li>")
                })
            },
            error:function () {
                console.log("error");
            }
        })
    }