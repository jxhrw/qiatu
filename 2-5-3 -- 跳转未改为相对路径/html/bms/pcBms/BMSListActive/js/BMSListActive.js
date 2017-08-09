    var hotelid;
	var actid;
    var order;
    var acttype;
    var listdata;
    var prize;
    var allpage;
    var groupid;
    var P;
$(document).ready(function(){
	$(".close").click(function() {
    	close();
    })
    $(".top").children().click(function () {
    	close();
    })
// -----------------------------
	
		var page = {"status":"","pageno":1,"pagecnt":5}
		$.ajax({
			type:"POST",
			url:"/activity/bms/list",
			dataType:"json",
			data: {data:JSON.stringify(page)},
			success:function (data) {
				ListData(data);
				P = 1;
				$(".btn").hide();
				$(".buttom").children("span").hide();
				$(".tcdPageCode").createPage({
			        pageCount: data.pageinfo.pageAmount,
			        current:1,
			        backFn:function(p){
			            //单击回调方法，p是当前页码
			            // console.log(p);
			            P = p;
			            $(".concent").remove();
			            var data = {
			            	"status":"",
			            	"pageno":p,
			            	"pagecnt":5
			            }
			            $.ajax({
			            	type:"POST",
			            	url:"/activity/bms/list",
			            	datatype:"json",
			            	data:{data:JSON.stringify(data)},
			            	success:function (senddata) {
			            		console.log("success");
			            		$(".concent").remove();
			            		ListData(senddata);
			            		$(".btn").hide();
			            		$(".buttom").children("span").hide();
			            	},
			            	error:function() {
			            		console.log("error");
			            	}
			            });
			            // console.log(p);
			        }
		         });
			},
			error:function () {
				console.log("error");
			}
		})
//-----------------------------------	
//赛选列表
    //即将开始
        $("#threshold").click(function () {
	    	// console.log("kk");
		  	var end = {"status":"0","pageno":1,"pagecnt":5}
		  	$.ajax({
		        type:"POST",
				url:"/activity/bms/list",
				dataType:"json",
				data: {data:JSON.stringify(end)},
				success:function (data) {
					$(".concent").remove();
					ListData(data);
					$(".btn").hide();
					$(".buttom").children("span").hide();
					$(".tcdPageCode").createPage({
					    pageCount: data.pageinfo.pageAmount,
					    current:1,
					    backFn:function(p){
					        //单击回调方法，p是当前页码
					        console.log(p);
					        $(".concent").remove();
					        var data = {
					            "status":"0",
					            "pageno":p,
					            "pagecnt":5
					        }
					     	pagingBack(data);
						}	
		  			})
		       },
		       error:function () {
		       	    console.log("error");
		       }
		    })
		    $(".list-warp").hide();
		})
	//进行中		
		 $("#ing").click(function () {
		  	var ing = {"status":"1","pageno":1,"pagecnt":5}
		  	$.ajax({
		        type:"POST",
				url:"/activity/bms/list",
				dataType:"json",
				data: {data:JSON.stringify(ing)},
				success:function (data) {
					$(".concent").remove();
					ListData(data);
					$(".btn").hide();
					$(".buttom").children("span").hide();
					$(".tcdPageCode").createPage({
					    pageCount: data.pageinfo.pageAmount,
					    current:1,
					    backFn:function(p){
					        //单击回调方法，p是当前页码
					        console.log(p);
					        $(".concent").remove();
					        var data = {
					            "status":"1",
					            "pageno":p,
					            "pagecnt":5
					        }
					     	pagingBack(data);
						}	
		  			})
		       },
		       error:function () {
		       	    console.log("error");
		       }
		    })
		    $(".list-warp").hide();
		})      
	//等待开奖	   
        $("#wait").click(function () {
		  	var wait = {"status":"4","pageno":1,"pagecnt":5}
		  	$.ajax({
		        type:"POST",
				url:"/activity/bms/list",
				dataType:"json",
				data: {data:JSON.stringify(wait)},
				success:function (data) {
					$(".concent").remove();
					ListData(data);
					$(".btn").hide();
					$(".buttom").children("span").hide();
					$(".tcdPageCode").createPage({
					    pageCount: data.pageinfo.pageAmount,
					    current:1,
					    backFn:function(p){
					        //单击回调方法，p是当前页码
					        console.log(p);
					        $(".concent").remove();
					        var data = {
					            "status":"4",
					            "pageno":p,
					            "pagecnt":5
					        }
					     	pagingBack(data);
						}	
		  			})
		       },
		       error:function () {
		       	    console.log("error");
		       }
		    })
		    $(".list-warp").hide();
		})
   //已开奖
        $("#yet").click(function () {
		  	var end = {"status":"5","pageno":1,"pagecnt":5}
		  	$.ajax({
		        type:"POST",
				url:"/activity/bms/list",
				dataType:"json",
				data: {data:JSON.stringify(end)},
				success:function (data) {
					$(".concent").remove();
					ListData(data);
					$(".btn").hide();
					$(".buttom").children("span").hide();
					$(".tcdPageCode").createPage({
					    pageCount: data.pageinfo.pageAmount,
					    current:1,
					    backFn:function(p){
					        //单击回调方法，p是当前页码
					        console.log(p);
					        $(".concent").remove();
					        var data = {
					            "status":"5",
					            "pageno":p,
					            "pagecnt":5
					        }
					     	pagingBack(data);
						}	
		  			})
		       },
		       error:function () {
		       	    console.log("error");
		       }
		    })
		    $(".list-warp").hide();
		})
	//已下线
	    $("#off").click(function () {
	    	console.log("kk");
		  	var end = {"status":"6","pageno":1,"pagecnt":5}
		  	$.ajax({
		        type:"POST",
				url:"/activity/bms/list",
				dataType:"json",
				data: {data:JSON.stringify(end)},
				success:function (data) {
					$(".concent").remove();
					ListData(data);
					$(".btn").hide();
					$(".buttom").children("span").hide();
					$(".tcdPageCode").createPage({
					    pageCount: data.pageinfo.pageAmount,
					    current:1,
					    backFn:function(p){
					        //单击回调方法，p是当前页码
					        console.log(p);
					        $(".concent").remove();
					        var data = {
					            "status":"6",
					            "pageno":p,
					            "pagecnt":5
					        }
					     	pagingBack(data);
						}	
		  			})
		       },
		       error:function () {
		       	    console.log("error");
		       }
		    })
		    $(".list-warp").hide();
		})
	//所有状态
	    $(".J-all").click(function () {
	    	var page = {"status":"","pageno":1,"pagecnt":5}
			$.ajax({
				type:"POST",
				url:"/activity/bms/list",
				dataType:"json",
				data: {data:JSON.stringify(page)},
				success:function (data) {
					$(".concent").remove();
					ListData(data);
					$(".btn").hide();
					$(".buttom").children("span").hide();
					$(".tcdPageCode").createPage({
				        pageCount: data.pageinfo.pageAmount,
				        current:1,
				        backFn:function(p){
				            //单击回调方法，p是当前页码
				            console.log(p);
				            $(".concent").remove();
				            var data = {
				            	"status":"",
				            	"pageno":p,
				            	"pagecnt":5
				            }
				            pagingBack(data);
				            console.log(p);
				        }
			         });
				},
				error:function () {
					console.log("error");
				}
			})
			$(".list-warp").hide();	
	    })
//获取中奖人信息
  $(".J-luckman").click(function () {

        	var luckman = {"actId":actid};
        	if (actid == undefined) {
				 return;
				 $(".winner-warp").hide();	
		    } else {
		    	$.ajax({
			    	type:"POST",
				    url:"/activity/bms/luckyman",
				    datatype:"json",
				    data:{data:JSON.stringify(luckman)},
				    success:function (luckdata) {

				    		console.log("success");
				    		   $(".winnerLi").remove();
				    			var a = "";
					    		$.each(luckdata.data,function (index) {

							    	var nickname =luckdata.data[index].nickname;
							    	console.log(1111);
							    	console.log(nickname);
									var phone = luckdata.data[index].phone;
									var code = luckdata.data[index].code;
									var prizesStatus;
									if (luckdata.data[index].privateIntegerprizesStatus == 0) {
                                        prizesStatus = "未发奖";
									} else {
										prizesStatus = "已发奖";
									}
									
									// window.location.reload();
									// a +="<ul><li><span class='first'>昵称:</span><span class='second'>" + nickname + "</span></li><li><span class='first'>手机号码:</span><span class='second'>"+ phone +"</span></li><li><span class='first'>中奖码:</span><span class='second'>"+ code +"</span></li></ul>"
									a +="<li class='winnerLi'>"+
   	    									"<span class='ulSpanFirst'>"+ nickname +"</span>"+
   	    									"<span class='ulSpanSecond'>"+ phone +"</span>"+
   	    									"<span class='ulSpanThrid'>"+ code +"</span>"+
   	    								"</li>";
								})
							    $("#winner ul").append(a);
								$(".winner-warp").show();
								$(".tcback").show();	
								console.log("success");
				    		
                            
				    	},
				    	error:function () {
				    		console.log("error");
				    	}
			    })
		    }	
	    	  	
        })
    	 		
//复制活动链接
    $(".J-link").click(function () {
    	
    	var copylink = {"actId":actid}
    	if (actid == undefined) {
	        	return;
	    } else {
	    	var dat;
	    	$.ajax({
				type:"POST",
				url:"/activity/bms/info/url",
				datatype:"json",
				data:{data:JSON.stringify(copylink)},
		        success:function (datalink) {
                   $(".success-warp").show();
                   $(".tcback").show();
		        	// console.log(datalink.data);
		        	$(".act-link").html(datalink.data);
		        	$(".list-link").html("http://test.jihelife.com/html/mobileBms/activity/activities.html?groupid="+ groupid +"&hotelid=" + hotelid);
		        	$(".J-actsuccess").click(function () {
		        		$("#biao1").show();
		        		$("#biao1").val(datalink.data);
						$("#biao1").select();
					    document.execCommand("Copy");//执行复制	
					    $("#biao1").hide();
					    jiHeAlert.open("复制活动链接成功");	
		        	})
		        		          
		        },
		        error:function () {
		        	console.log("error");
		        }
			});
	    }
    })

    $(".J-listsuccess").click(function () {
    	$("#biao1").show();
		$("#biao1").val("http://test.jihelife.com/html/mobileBms/activity/activities.html?groupid="+ groupid +"&hotelid=" + hotelid);
	    $("#biao1").select();
		document.execCommand("Copy");//执行复制	
		$("#biao1").hide();
		jiHeAlert.open("复制活动链接成功");
    })
//活动下线
    $(".J-offbtn").click(function () {
    	
    	if (actid != undefined){
			$(".off-warp").show();
   	    	$(".tcback").show();
    	}
    })

    $(".J-OFFbtn").click(function () {
    	var offdata = {"actId":actid,"status":"6"};
    	$.ajax({
   	    	type:"POST",
   	    	url: "/activity/bms/modify/status",
   	    	datatype:"json",
   	    	data:{data:JSON.stringify(offdata)},
   	    	success:function (data) {
   	    		// console.log("ffff");
   	    		if (data.sc == "0") {
					data = {"status":"","pageno":P,"pagecnt":5}
					$.ajax({
						type:"POST",
				   	    url: "/activity/bms/list",
				   	    datatype:"json",
				   	    data:{data:JSON.stringify(data)},
				   	    success:function (data) {
				   	    	// console.log("ii");
				   	    	$(".concent").remove();
				   	    	ListData(data);
							$(".btn").hide();
							$(".buttom").children("span").hide();
				   	    	close();
				   	    },
				   	    error:function () {
				   	    	console.log("error");
				   	    }
					})
				}
   	    	},
   	    	error:function () {
   	    		console.log("error");
   	    	}
   	    })
    })
//活动上线
    $(".J-upbtn").click(function () {
    	if (actid != undefined) {
    		$(".up-warp").show();
   	   		$(".tcback").show();
   	    }
    })

    $(".J-Upbtn").click(function () {

    	if (actid == undefined) {
    		console.log(22);
    		$(".up-warp").hide();
   	    	return ;
   	    } else {
   	    	var updata = {"actId":actid,"status":1};
   	    	$.ajax({
	   	    	type:"POST",
	   	    	url: "/activity/bms/modify/status",
	   	    	datatype:"json",
	   	    	data:{data:JSON.stringify(updata)},
	   	    	success:function (dwon) {
					console.log("success");
					if (dwon.sc == "0") {
						data = {"status":"","pageno":P,"pagecnt":5}
						$.ajax({
							type:"POST",
				   	    	url: "/activity/bms/list",
				   	    	datatype:"json",
				   	    	data:{data:JSON.stringify(data)},
				   	    	success:function (data) {
				   	    		console.log("ii");
				   	    		$(".concent").remove();
				   	    		ListData(data);
								$(".btn").hide();
								$(".buttom").children("span").hide();
				   	    		close();
				   	    	},
				   	    	error:function () {
				   	    		console.log("error");
				   	    	}
						})
					}
					
	   	    	},
	   	    	error:function () {
	   	    		console.log("error");
	   	    	}
	   	    })
   	    }
    })
//复制活动说明

    $(".J-shuoming").click(function () {
    	var copyact = {"actId":actid}
    	if (actid == undefined) {
    		$(".copy-warp").hide();
   	    	return 0;
   	    } else {
   	    	$.ajax({
	    		type:"POST",
	    		url:"/activity/bms/info",
	    		datatype:"json",
	    		data:{data:JSON.stringify(copyact)},
	    		success:function (smdata) {

                    prize = smdata;
                    
	    			var actname = smdata.data.actBaseinfo.actTitle;
	    			var eDate = new Date(parseInt(smdata.data.actBaseinfo.actEndTime));
	    			var endtshi = eDate.getHours();
	    			var endtfen = eDate.getMinutes();
	    			var pDate = new Date(parseInt(smdata.data.actBaseinfo.actPubTime));
	    			var pubtshi = pDate.getHours();
	    			var pubtfen = pDate.getMinutes();
	    			var endtime = getDate(parseInt(smdata.data.actBaseinfo.actEndTime)) + " " + TimeG(endtshi) + ":" + TimeG(endtfen);
	    			var publisht = getDate(parseInt(smdata.data.actBaseinfo.actPubTime))+ " " + TimeG(pubtshi) + ":" + TimeG(pubtfen);
	    		    var	prizename = "";
	    		    var prizecount = "";
	    		    var prizesdesc = "";
	    		    var objamount = "";
	    		    var prizeAmount = "";
	    		    if (smdata != undefined) {
	    		    	for (var i=0;i<smdata.data.actPrizeList.length;i++) {
                            if (smdata.data.actPrizeList[i].actPrizeObjects == undefined) {
                            	prizename += "";
                            } else {
                            	for (var j=0;j<prize.data.actPrizeList[i].actPrizeObjects.length;j++){
                            		objamount = prize.data.actPrizeList[i].actPrizeObjects[j].objAmount;
			                        prizename += prize.data.actPrizeList[i].actPrizeObjects[j].objName + "x" + objamount +"<br>";
			                    }
                            }
                            
                            if (!("prizeDese" in smdata.data.actPrizeList)) {
                            	console.log("aaaa")
                            	$(".text span:eq(1)").html("");
                            } else {
                            	prizesdesc = smdata.data.actPrizeList[i].prizeDese;
                            }
                            prizecount += smdata.data.actPrizeList[i].totalAmount + "份";
                            prizeAmount = smdata.data.actPrizeList[i].totalAmount;
                        }
	    		    } else {
	    		    	prizename = "";
	    		    	prizesdesc = "";
	    		    	prizecount = "";
	    		    }
	    			console.log(prizeAmount);
	    			$(".benCiaMount").html(prizeAmount);
	    			$(".lotteryText").html(smdata.data.actBaseinfo.lotteryRules);
	    		    $(".endt").html(endtime);
	    			$(".publisht").html(publisht);
	    			$(".hui").html(prizename);
	    			$(".kaijiang").html(endtime);
	    			$(".text span:eq(1)").html(prizesdesc);
	    			//为需要关注
	    			if (smdata.data.actBaseinfo.switchJoinfans == "1") {
	    				$(".baoming").html("去"+ actname + "公众号报名活动");
	    				$("#copyma").children().remove();
		                var joinfansqrcode = listdata.data[order].joinfansQrcode;
		                var attention = "http://7xio74.com2.z0.glb.clouddn.com/" + joinfansqrcode;
		                var img = "";
		                img = "<img class='ma-img' src=" + attention  + ">";
		                $("#copyma").html(img);
	    			} else {
	    				$(".baoming").html(" ");
	    				$("#copyma").children().remove();
                          var img = "";
                          var attention ="/activity/bms/qrcode?data={'actId':"+ actid +"}";
                          img = "<img class='ma-img' src=" + attention  + ">";
                          $("#copyma").html(img);
						
	    			}
	    			$(".copy-warp").show();	
	    			$(".tcback").show();
	   	    			
	    		},
	    		error:function () {
	    			console.log("error");
	    		}
	    	})
   	    }
    	
    })
    
    // $(".J-Shuoming").click(function () {
    // 	copyMes();
    // 	jiHeAlert.open("复制活动说明成功");
    // 	// $(".copy-warp").hide();	
	   //  // $(".tcback").hide();
    // })
//删除活动
    $(".J-delete").click(function () {

    	var updata = {"actId":actid,"status":-1};
    	if (actid == undefined) {
    		$(".delete-warp").hide();
   	    	return 0;
   	    } else {
   	    	$(".delete-warp").show();
   	    	$(".tcback").show();
   	    	$(".J-Delete").click(function () {
                 $.ajax({
		   	    	type:"POST",
		   	    	url: "/activity/bms/modify/status",
		   	    	datatype:"json",
		   	    	data:{data:JSON.stringify(updata)},
		   	    	success:function (deldata) {
		   	    		$(".active").remove();
						close();
		   	    	},
		   	    	error:function () {
		   	    		console.log("error");
		   	    	}
		   	    })

	   	    		
	   	    })
   	    	
   	   }
    })
//查看活动配置信息
    $(".J-cha").click(function(){
    	var chakan = {"actId":actid};
        console.log(P);
    	if (actid == undefined) {
    		    $(".cha-warp").hide();
	        	return 0;
	    } else {
	    	$.ajax({
	    		type:"POST",
				url:"/activity/bms/info",
				datatype:"json",
				data:{data:JSON.stringify(chakan)},
				success:function (prizedata) {
					prize = prizedata;
					$.ajax({
						type:"POST",
						url:"/activity/bms/info/url",
						datatype:"json",
						data:{data:JSON.stringify(chakan)},
				        success:function (chalink) {
				        	
								$("#mytxt").html(chalink.data);
		                        var actname = listdata.data[order].actTitle;
		                        var shareurl =  listdata.data[order].shareDestUrl;
		                        var sharetitle =  listdata.data[order].shareTitle;
		                        var sharedesc =  listdata.data[order].shareDesc;
		                        var prizename = "";
		                        var prizecount = "";
		                        var Lphone = "";
		                        if (prize.data.actBaseinfo.contactWay == undefined) {
		                        	$(".r-second:eq(7)").hide();
		                        	$(".r-first:eq(7)").hide();
		                        } else {
		                        	$(".r-first:eq(7)").show();
		                        	$(".r-second:eq(7)").show();
		                        	Lphone = prize.data.actBaseinfo.contactWay;
		                        }
		                         
		                        // console.log(444444);
		                        if(prize != undefined) {
		                        	for (var i=0;i<prize.data.actPrizeList.length;i++) {
			                        	// console.log(prize.data.actPrizeList[i].prizeName);
			                            if (prize.data.actPrizeList[i].actPrizeObjects.length == 0) {
			                            	prizename += "";
			                            } else {
			                            	// console.log(11111);
			                            	for (var j=0;j<prize.data.actPrizeList[i].actPrizeObjects.length;j++){
			                            		// console.log(2222);
			                            		objamount = prize.data.actPrizeList[i].actPrizeObjects[j].objAmount;
			                            		prizename += prize.data.actPrizeList[i].actPrizeObjects[j].objName +" x"+ objamount + "<br>";

			                            	}
			                            }
			                            prizecount = prize.data.actPrizeList[i].totalAmount;
			                        }
		                        } else {
		                        	console.log(3333);
		                        	prizename = "";
		                        	prizecount = "";
		                        }
		                        
		                        var actdesc = listdata.data[order].actDesc;
		                        var sDate = new Date(parseInt(listdata.data[order].actBeginTime));
		                        var eDate = new Date(parseInt(listdata.data[order].actEndTime));
		                        var pDate = new Date(parseInt(listdata.data[order].actPubTime));
		                        var Sdateshi = sDate.getHours();
		                        // console.log(typeof Sdateshi);
		                        var Sdatefen = sDate.getMinutes();
		                        var Edateshi = eDate.getHours();
		                        var Edatefen = eDate.getMinutes();
		                        var Pdateshi = pDate.getHours();
		                        var Pdatefen = pDate.getMinutes();

		                        var actBtime = getDate(parseInt(listdata.data[order].actBeginTime))+ " " + TimeG(Sdateshi) +":"+ TimeG(Sdatefen);
		                        var actEtime = getDate(parseInt(listdata.data[order].actEndTime))+ " " + TimeG(Edateshi) +":"+ TimeG(Edatefen);
		                        var publisht = getDate(parseInt(listdata.data[order].actPubTime))+ " " + TimeG(Pdateshi) +":"+TimeG(Pdatefen);
		                      	
		                       
		                        // console.log(dateshi);
		                        // console.log(datefen);
   
		                        $(".r-second:eq(0)").html(actname);
		                        $(".r-second:eq(1)").html(shareurl);
		                        $(".r-second:eq(2)").html(sharetitle);
		                        $(".r-second:eq(3)").html(sharedesc);
		                        $(".r-second:eq(4)").html(actdesc);
		                        $(".r-second:eq(5)").html(prizename);
		                        $(".r-second:eq(6)").html(prizecount);
		                        $(".r-second:eq(7)").html(Lphone);
		                        $(".startT").html(actBtime);
		                        $(".endT").html(actEtime);
		                        $(".r-second:eq(9)").html(publisht);
		                        if (listdata.data[order].allowUser == "0") {
                                     $(".r-second:eq(10)").html("所有用户");
		                        } else if (listdata.data[order].allowUser == "1") {
                                     $(".r-second:eq(10)").html("会员用户");
		                        } else {
                                     $(".r-second:eq(10)").html("几何用户");
		                        }
		                        	$("#code").children().remove();
		                        	$(".r-second:eq(11)").html("否");
		                        	var src = "/activity/bms/qrcode?data={'actId':"+ actid +"}";
		                        	img = "<img class='ma-img' src=" + src  + ">";
		                        	$("#code").html(img);
		                        //填充数据

		                        $(".cha-warp").show();
		                        $(".tcback").show();
				        },
				        error:function () {
				        	console.log("error");
				        }
					});
				},
				error:function () {
					console.log("error");
				}
	    	})
	    	
	    }
	})
//点击活动
    $("body").on("click",".concent",function () {

		order = parseInt($(".active").attr("order"));
		if ($(this).attr("class") == "concent") {
				actid = undefined;
		} else {
				hotelid = listdata.data[order].hotelId;
				actid = listdata.data[order].actId;
                groupid = listdata.data[order].groupId;
		}
	})
//活动流程介绍
    $(".creation").click(function () {
    	$(".flow-warp").show();
    	$(".tcback").show();
    })
//----------------------------
	$(".all").click(function (e) {
		e.stopPropagation();
		var w = $(".all").width()+1;
     	var x = $(".all").offset().left+1;
     	var y = $(".all").offset().top;
     	$(".list-warp").css({
			"top":y+49,
			"left":x,
			"width":w
		})
		$(".list-warp li").css({
			"width":w
		})
		$(".list-warp").toggle();
	})
	$('body').click(function(){
		$(".list-warp").hide();
	})
//---------------------------
    $(".concent").off("click");
	$(".concent").click(function () {
        var cs = $(this).children(":last-child").attr("class");
		if (cs == "J-to"||cs == "J-yet") {
			$(".btn").show().removeClass("yangshi");
		}
	})	
//已结束状态样式
	$(".J-end").parent().css({'color':'#d4d4d4'});

//点击列表中每行内容是赛选操作按钮
	$("body").on("click",".concent",function () {
		var last = $(this).children(":last-child").attr("class");
		Btnstyle(last);
	})
	



//获取创建活动弹窗type
	$(".found-active").click(function () {
		$(".set-warp").show();
		$(".tcback").show();
	})
	$(".J-setact").click(function () {
		if (acttype == "1"||acttype == "2"||acttype == "3") {
			var rl = "/html/bms/pcBms/createActivity/index.html";
	   		document.location.href = rl + "?actType=" + acttype;
		} else {
			return;
		}
	   	
	})

//编辑活动
    $(".J-bian").click(function () {
    	if (actid == undefined) {
    		return;
    	} else {
    		var rl = "/html/bms/pcBms/createActivity/index.html";
        	document.location.href = rl + "?actId=" + actid;
    	}
        
    }) 
//活动流程说动滑动窗口
    var d;
    $(".prev_page").hide();
	$(".next_page").click(function () {
		if (d == undefined) {
			d = 1;
		} else {
			d += 1;
		}
		var z = d - 1;
		var chang = d * (-550);
		chang = String(chang) + "px";
		console.log(chang);
		$(".flow_concent").animate({"left":chang},1000,function () {
			$(".flow_concent").css({"left":chang});
		});
		$(".page_yuan").children("li:eq("+z+")").removeClass("hong");
		$(".page_yuan").children("li:eq("+d+")").addClass("hong");

		if (d == 3) {
			$(".next_page").hide();
		} else {
			$(".next_page").show();
		}
			$(".prev_page").show();

	})	

	$(".prev_page").click(function () {
		console.log(d);
		d -= 1;
		var chang = d * (-550);
		chang = String(chang) + "px";
		console.log(chang);
		$(".flow_concent").animate({"left":chang},1000,function () {
			$(".flow_concent").css({"left":chang});
		});

		// console.log(d);
		var h = d + 1;
		$(".page_yuan").children("li:eq("+h+")").removeClass("hong");
		$(".page_yuan").children("li:eq("+d+")").addClass("hong");

		if (d == 0) {
			$(".prev_page").hide();
		} else {
			$(".prev_page").show();
		}
		$(".next_page").show();
	})	

	$(".J-creatact").click(function () {
		$(".set-warp").show();
		$(".flow-warp").hide();
	})

	// $(".concent").children(":last-child").css({"border-right":"none"})
    
})

function ListData(data) {
	    listdata = data;
		$.each(data.data,function (index) {
			$("tbody").append("<tr class='concent one' onclick='gouxuan(this)' order="+index+"><td class='J-first'><img src='img/gou1.jpg'></td><td></td><td></td><td></td><td><span class='start-time'></span>至<span class='end-time'></span></td><td></td><td id='last'></td></tr>")
			            
		    Tian(".one",index,data);
		    $(".concent").removeClass("one");
		    // $(".concent:eq(0)").addClass("active")

		})

}
function close() {
	$(".a").hide();
	$(".tcback").hide();
}

		
    function toUtf8(str) {
		var out, i, len, c;
		out = "";
		len = str.length;
		for(i = 0; i < len; i++) {
		    c = str.charCodeAt(i);
			if ((c >= 0x0001) && (c <= 0x007F)) {
				out += str.charAt(i);
			} else if (c > 0x07FF) {
				out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
				out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
				out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
			} else {
				out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
				out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
			}
		}
		return out;
	}



// 填充数据
    function Tian(boj,i,data) {
        
    	var Status = data.data[i].status;

		$(boj).children(":eq(1)").append(data.data[i].actTitle);

		if (data.data[i].actType == "1") {
			$(boj).children(":eq(2)").append("单人多码");
		} else if (data.data[i].actType == "2") {
			$(boj).children(":eq(2)").append("双人配对");
		} else if (data.data[i].actType == "3") {
			$(boj).children(":eq(2)").append("一元购抽奖");
		}
		$(boj).children(":eq(3)").append(data.data[i].usersCount);
		var sDate = new Date(parseInt(data.data[i].actBeginTime));
    	var eDate = new Date(parseInt(data.data[i].actEndTime));
    	var pDate = new Date(parseInt(data.data[i].actPubTime));
    	var Sdateshi = sDate.getHours();
    	var Sdatefen = sDate.getMinutes();
    	var Edateshi = eDate.getHours();
      	var Edatefen = eDate.getMinutes();
    	var Pdateshi = pDate.getHours();
    	var Pdatefen = pDate.getMinutes();

    	var actbeigintime = getDate(parseInt(data.data[i].actBeginTime))+ " " + TimeG(Sdateshi) +":"+ TimeG(Sdatefen);
    	var actendtime = getDate(parseInt(data.data[i].actEndTime))+ " " + TimeG(Edateshi) +":"+ TimeG(Edatefen);
    	var actpubtime = getDate(parseInt(data.data[i].actPubTime))+ " " + TimeG(Pdateshi) +":"+ TimeG(Pdatefen);
		$(boj).children(":eq(4)").find("span:eq(0)").append(actbeigintime);
		$(boj).children(":eq(4)").find("span:eq(1)").append(actendtime);
		$(boj).children(":eq(5)").append(actpubtime);

		if (Status == "0") {
			$(boj).children(":last-child").append("草稿");
			$(boj).children(":last-child").addClass("J-cao");
		} else if (Status == "1") {
			$(boj).children(":last-child").append("进行中");
			$(boj).children(":last-child").addClass("J-ing");
		} else if (Status == "2") {
			$(boj).children(":last-child").append("已结束");
			$(boj).children(":last-child").addClass("J-end");
		} else if (Status == "3") {
			$(boj).children(":last-child").append("即将开始");
			$(boj).children(":last-child").addClass("J-to");
		} else if (Status == "4") {
			$(boj).children(":last-child").append("等待开奖");
			$(boj).children(":last-child").addClass("J-wait");
		} else if (Status == "5") {
			$(boj).children(":last-child").append("已开奖");
			$(boj).children(":last-child").addClass("J-yet");
		} else if (Status == "6") {
			$(boj).children(":last-child").append("已下线");
			$(boj).children(":last-child").addClass("J-off");
		}


	}



//列表勾选
function gouxuan(gou) {

	var url1 = "img/gou1.jpg";
	var url2 = "img/gou2.jpg";
	var img = $(gou).children().children();
	img.addClass("xuanzhong");
	var xz =img.attr("src");
	// console.log(gou);
	// console.log(xz);
	if (xz == url1) {
		$(".concent").children().children().attr("src",url1);
		$(".concent").removeClass("active");
		$(".xuanzhong").attr("src",url2);
		img.removeClass();
		$(gou).addClass("active");
	} else {
		img.attr("src",url1);
		$(gou).removeClass("active");
		img.removeClass();
	}
    Btnstyle(gou);
}

//改变操作按钮的样式
function Btnstyle(str) {
	if (str == "J-cao") {
		if ($(".btn").is(":visible")) {
			$(".btn").hide();
		}
        $(".buttom").children("span").show();
		$(".btn:eq(0)").show().addClass("yangshi");
		$(".btn:eq(2)").show().addClass("yangshi");
		$(".btn:eq(3)").show();
		// $(".btn:eq(4)").show();
		$(".btn:eq(6)").show();
		// $(".btn:eq(7)").hide();
	} else if (str == "J-ing") {
		if ($(".btn").is(":visible")) {
			$(".btn").hide()
		}
		$(".buttom").children("span").show();
		$(".btn:eq(2)").show().addClass("yangshi");
		$(".btn:eq(3)").show();
		$(".btn:eq(4)").show();
		$(".btn:eq(5)").show();
		$(".btn:eq(7)").show();
	} else if (str == "J-wait") {
		if ($(".btn").is(":visible")) {
			$(".btn").hide()
		}
		$(".buttom").children("span").show();	
		$(".btn:eq(1)").show();
		$(".btn:eq(2)").show().addClass("yangshi");
		$(".btn:eq(4)").show();
		$(".btn:eq(5)").show();
		// $(".btn:eq(7)").hide();
	} else if (str == "J-off") {
		if ($(".btn").is(":visible")) {
			$(".btn").hide()
		}
		console.log(222);
		$(".buttom").children("span").show();
		$(".btn:eq(0)").show();
		// $(".btn:eq(1)").show().addClass("yangshi");
		$(".btn:eq(2)").show().addClass("yangshi");
		// $(".btn:eq(4)").show();
		// $(".btn:eq(5)").show();
		$(".btn:eq(6)").show();
		// $(".btn:eq(7)").hide();
	} else if (str == "J-end") {
		if ($(".btn").is(":visible")) {
			$(".btn").hide()
		}
		$(".buttom").children("span").show();
		$(".btn:eq(2)").show().addClass("yangshi");
		$(".btn:eq(6)").show();
		// $(".btn:eq(4)").show();
		// $(".btn:eq(5)").show();
		// $(".btn:eq(7)").show();
	} else if (str == "J-to") {
		if ($(".btn").is(":visible")) {
			$(".btn").hide()
		}
		$(".buttom").children("span").show();
		$(".btn:eq(2)").show().addClass("yangshi");
		$(".btn:eq(3)").show();
		$(".btn:eq(4)").show();
		$(".btn:eq(5)").show();
		$(".btn:eq(7)").show();
	} else if (str == "J-yet") {
		if ($(".btn").is(":visible")) {
			$(".btn").hide()
		}
		$(".buttom").children("span").show();
		$(".btn:eq(1)").show();
		$(".btn:eq(2)").show().addClass("yangshi");
		$(".btn:eq(6)").show();
		// $(".btn:eq(4)").show();
		// $(".btn:eq(5)").show();
		// $(".btn:eq(7)").show();
	}
}

//创建活动弹窗单选

function Tangdx(obj) {
	var url1 = "img/yuan.jpg";
	var url2 = "img/hyuan.jpg";
	var img = $(obj).children();
	var xz = img.attr("src");
	acttype = $(obj).attr("actType");
	// console.log(img);
	img.addClass("yuan");
	if (xz == url1) {
		$("#setup div").children().attr("src",url1);
		$(".yuan").attr("src",url2);
		img.removeClass("yuan");
	} else {
		img.attr("src",url1);
		img.removeClass("yuan");
		acttype = "0";
	}

}

function getDate(time) {//将时间戳转化为日期
	 var date = new Date(time);
	 y = date.getFullYear();
	 m = date.getMonth() + 1;
	 d = date.getDate();
	 return y + "." + (m < 10 ? "0" + m : m) + "." + (d < 10 ? "0" + d : d);
}

function TimeG(time) {
	if (time/10 >= 1) {

		time = time;
	} else {
		time = "0" + time;
	}
	return time;
}

function pagingBack(data) {
	$.ajax({
		type:"POST",
		url:"/activity/bms/list",
		datatype:"json",
		data:{data:JSON.stringify(data)},
		success:function (senddata) {
			console.log("success");
			$(".concent").remove();
			ListData(senddata);
			$(".btn").hide();
			$(".buttom").children("span").hide();
		},
		error:function() {
			console.log("error");
		}
	});
}
