var Listdata;
var Statusdata;
var HomeLdata;
var HomeSdata;
var PayLdata;
var PaySdata;
var order;
var coupontype = '5';
var couponid;
var sendData = {};
var couponName;
$(document).ready(function () {


	//请求优惠券列表数据
	var page = { "pageno": 1, "pagecnt": 6, "couponType": "5" };
	$.ajax({
		type: "POST",
		datatype: "json",
		url: "/pay/bms/coupon/summeryInfo",
		data: { data: JSON.stringify(page) },
		success: function (ztdata) {
			$(".concent").remove();
			ListD(ztdata, ".F-title");
			// show_btn();
			// $(".buttom").children("span").hide();
			HideBtn();
			$(".CFavotable").createPage({
				pageCount: ztdata.pageinfo.pageAmount,
				current: 1,
				backFn: function (p) {
					var pageztdata = { "pageno": p, "pagecnt": 6, "couponType": "5" };
					$(".concent").remove();
					$.ajax({
						type: "POST",
						datatype: "json",
						data: { data: JSON.stringify(pageztdata) },
						url: "/pay/bms/coupon/summeryInfo",
						success: function (ztpagedata) {
							ListD(ztpagedata, ".F-title");
							// show_btn();
							$(".buttom").children("span").hide();
							HideBtn();
						},
						error: function () {

						}
					})
				}
			})
		},
		error: function () {

		}
	});





	//查看券信息弹窗

	$("body").on("click", ".cha_btn", function (e) {
		e.stopPropagation();
		if ($(".zhong").attr("coutype") == "1") {
			$(".top").children().html("查看房券信息");
		} else if ($(".zhong").attr("coutype") == "5") {
			$(".top").children().html("查看折扣券信息");
		} else {
			$(".top").children().html("查看消费金信息");
		}

		var minutedata = { "couponId": couponid };
		$.ajax({
			type: "POST",
			datatype: "json",
			data: { data: JSON.stringify(minutedata) },
			url: "/coupon/bms/termDetail",
			success: function (Mtedata) {
				var hotelname = "";
				var datetxt = "";
				var tiaotxt = "";
				$(".quanname").html(Mtedata.data.couponName);
				for (var i = 0; i < Mtedata.data.productUsable.length; i++) {
					hotelname += Mtedata.data.productUsable[i].hotelName + "、";
				}
				$(".keyong").html(hotelname);
				$(".usagetype").html(Mtedata.data.productUsable[0].productUsableDesc);
				if (Mtedata.data.usageCount == undefined) {
					$(".cishuli").hide();
				} else {
					if (Mtedata.data.usageCount == "-1") {
						$(".cishuli").show();
						$(".cishu").html("有效期内均可使用");
					} else {
						$(".cishuli").show();
						$(".cishu").html(Mtedata.data.usageCount);
					}
				}

				if (Mtedata.data.remark == undefined) {
					$(".beizhuli").hide();
				} else {
					$(".beizhuli").show();
					$(".beizhu").html(Mtedata.data.remark);
				}

				if (Mtedata.data.faceValue == undefined) {
					$(".yhj_ul").children("li:eq(1)").hide();
				} else {
					$(".yhj_ul").children("li:eq(1)").show();
					$(".zhekou").html(parseInt(Mtedata.data.faceValue) / 10 + "折");
				}

				if (("bookCondition" in Mtedata.data)) {
					$(".yhj_concent:eq(7)").show();
					for (var i = 0; i < Mtedata.data.bookCondition.length; i++) {
						tiaotxt += Mtedata.data.bookCondition[i] + "、";
					}
				} else {
					$(".yhj_concent:eq(7)").hide();
				}
				if (Mtedata.data.dateUsable == undefined) {
					$(".usagedateli").hide();
				} else {
					$(".usagedateli").show();
					// if(Mtedata.data.useConditionList[i].conditionValue == "weekend") {
					// 	datetxt += "周末、";
					// } else if (Mtedata.data.useConditionList[i].conditionValue == "Christmas") {
					// 	datetxt += "圣诞节、";
					// } else if (Mtedata.data.useConditionList[i].conditionValue == "Valentinesday") {
					//           datetxt += "情人节、";
					// } else if (Mtedata.data.useConditionList[i].conditionValue == "holiday") {
					// 	datetxt += "节假日、";
					// }else {
					// 	var date = Mtedata.data.useConditionList[i].conditionValue.split(",");
					// 	console.log(date);
					// 	for (var j=0;j<date.length;j++) {
					// 		var Usedate = getDate(parseInt(date[j]));
					//              	datetxt += Usedate + "、";
					// 	}
					// }
					$(".usagedate").html("除“" + Mtedata.data.dateUsable + "”以外均可使用");
				}
				if (Mtedata.data.useConditionList.length < 0) {
					return;
				} else {
					for (var i = 0; i < Mtedata.data.useConditionList.length; i++) {
						if (Mtedata.data.useConditionList[i].conditionType == "cond-aheadoftime") {
							$(".yhj_concent:eq(7)").show();
							var daycount = Mtedata.data.useConditionList[i].conditionValue;
							$(".tiaojian").html("提前" + daycount + "天预订");
						}
					}
				}
				$(".tiaojian").html(tiaotxt);


			},
			error: function () {

			}

		})
		if (couponid == undefined) {
			return;
		} else {
			$(".cha_yhj").show();
			$(".tcback").show();
			var effDate = new Date(parseInt(Listdata.data[order].effectiveTime));
			var efftshi = effDate.getHours();
			var efftfen = effDate.getMinutes();
			var expDate = new Date(parseInt(Listdata.data[order].expireTime));
			var exptshi = expDate.getHours();
			var exptfen = expDate.getMinutes();
			var effectivet = getDate(parseInt(Listdata.data[order].effectiveTime)) + " " + TimeG(efftshi) + ":" + TimeG(efftfen);
			var expiret = getDate(parseInt(Listdata.data[order].expireTime)) + " " + TimeG(exptshi) + ":" + TimeG(exptfen);
			$(".youxiaoqi").html(effectivet + "-" + expiret);
		}
	})
	//发布券
	// $("body").on("click",".fa_btn",function (e) {
	// 	e.stopPropagation();
	// 	if (couponid == undefined) {
	// 		return 0;
	// 	} else {
	// 		$(".grant_fj").show();
	// 		$(".tcback").show();
	// 	}
	// })

	//获取数量值
	var a;
	$(".add").click(function () {
		a = $("input[name='fj_count']").val();
		if (a == "") {
			a = 0;
		} else {
			a = parseInt($("input[name='fj_count']").val());
		}
		a += 1;
		$("input[name='fj_count']").val(a);
	})
	$(".sub").click(function () {
		a = $("input[name='fj_count']").val();
		if (a == "" || a <= 0) {
			a = 1;
		} else {
			a = parseInt($("input[name='fj_count']").val());
		}
		a -= 1;
		$("input[name='fj_count']").val(a);
	})

	//删除券
	$("body").on("click", ".shan_btn", function (e) {
		e.stopPropagation();
		var data = { couponId: couponid };
		$.ajax({
			type: "POST",
			datatype: "json",
			url: "/coupon/bms/delBaseInfo",
			data: { data: JSON.stringify(data) },
			success: function () {
				$(".active").remove();
			},
			error: function () {

			}

		})
	})
	//持有人
	$(".chi_btn").click(function () {
		if (couponid == undefined) {
			return;
		} else {
			window.location.href = "/html/bms/pcBms/holderList/index.html?couponId=" + couponid;
		}

	})

	//发放券
	$('.send_btn').click(function () {
		if (couponid != undefined) {
			//折扣券
			if (coupontype == '5') {
				modalService.open({
					width: '550',
					height: '394',
					content: 'sendCoupon',
					title: '发放折扣券'
				})
			}
			//房券
			else if (coupontype == '1') {
				modalService.open({
					width: '550',
					height: '394',
					content: 'sendCoupon',
					title: '发放房券'
				})
			}
		}
		//消费金
		else if (coupontype == '2') {
			modalService.open({
				width: '550',
				height: '394',
				content: 'sendMoney',
				title: '发放消费金'
			})
		}
	})
	//编辑
	$("body").on("click", ".bian_btn", function (e) {
		e.stopPropagation();
		if (couponid == undefined) {
			return 0;
		} else {
			if ($(".new-btn").children().attr("coupontype") == "5") {
				window.location.href = "createCoupon.html?couponType=5&couponId=" + couponid;
			} else if ($(".new-btn").children().attr("coupontype") == "1") {
				window.location.href = "createCoupon.html?couponType=1&couponId=" + couponid;
			} else {
				window.location.href = "createCoupon.html?couponType=2&couponId=" + couponid;
			}
		}
	})
	//-----------------------
	//导航栏按钮效果
	$(".top-btn").click(function () {
		$(".top-btn").removeClass("zhong");
		$(".top-btn").removeClass("zhong");
		$(this).addClass("zhong");
	})

	//列表单选
	$("body").on("click", ".concent", function () {
		$(".buttom").children("span").show();
		show_btn($(this).children('.J-last').text());
		var url1 = "image/gou1.jpg";
		var url2 = "image/gou2.jpg";
		var url3 = "image/gou3.jpg";
		var img = $(this).children().children();
		img.addClass("xuanzhong");
		var xz = img.attr("src");
		// console.log(gou);
		// console.log(xz);

		if (xz == url3) {
			$(".concent").children().children().attr("src", url1);
			$(".concent").removeClass("active");
			$(".xuanzhong").attr("src", url2);
			img.removeClass("xuanzhong");
			$(this).addClass("active");
		} else {
			img.attr("src", url1);
			$(this).removeClass("active");
			img.removeClass("xuanzhong");
		}

		order = $(".active").attr("order");
		order = parseInt(order);


		if ($(this).attr("class") == "concent") {
			couponid = undefined;
		} else {
			couponid = Listdata.data[order].couponId;
			couponName = $(this).children('td:eq(1)').text();
		}
	})

	$(".state").click(function () {
		// Tisy();
		//获取需要表现的列表项并显示
		var a = $(this).attr("id");
		var t = "J-" + a;
		$(".J-" + a).parent().addClass("xian");
		$(".concent").hide();
		//将需要的列表显示出来
		$(".xian").show();
		$(".xian").removeClass("xian");


	})
//--------------------悬浮列表改变gou样式
    $("body").on("mouseover mouseout",".concent",function (event) {
    	 var imgAttr = $(this).children(".J-first").children().attr("src");
    	 if(event.type == "mouseover"&&imgAttr == "image/gou1.jpg"){
    		$(this).children(".J-first").children().attr("src","image/gou3.jpg");
		 }else if(event.type == "mouseover"&&imgAttr == "image/gou2.jpg"){
		  	$(this).children(".J-first").children().attr("src","image/gou2.jpg");
		 }else if(event.type == "mouseout"&&imgAttr == "image/gou3.jpg"){
		  	$(this).children(".J-first").children().attr("src","image/gou1.jpg");
		 }else if(event.type == "mouseout"&&imgAttr == "image/gou2.jpg"){
		  	$(this).children(".J-first").children().attr("src","image/gou2.jpg");
		 }
    })

	//显示全部
	$(".J-all").click(function () {
		HideBtn();
		// Tisy();
	})

	//全部状态按钮
	// $(".all").click(function (e) {
	// 	e.stopPropagation();
	// 	$(".li-warp").toggle();
	// })
	// $("body").click(function () {
	// 	$(".li-warp").hide();
	// })



	//房卷 优惠券 消费金切换
	$(".house").click(function () {
		coupontype = "1";
		$(".li-warp").hide();
		$(".CFavotable").hide();
		$("#Pay").hide();
		$("#Favotable").hide();
		$("#House").show();
		$("#J-Favotable").hide();
		$("#J-House").show();
		$("#J-Pay").hide();

		var fjdata = { "pageno": 1, "pagecnt": 6, "couponType": "1" };

		$.ajax({
			type: "POST",
			datatype: "json",
			url: "/pay/bms/coupon/summeryInfo",
			data: { data: JSON.stringify(fjdata) },
			success: function (fjztdata) {
				$(".concent").remove();
				ListD(fjztdata, ".H-title");
				// show_btn();
				HideBtn();
				$("#House").createPage({
					pageCount: fjztdata.pageinfo.pageAmount,
					current: 1,
					backFn: function (p) {
						var pageztdata = { "pageno": p, "pagecnt": 6, "couponType": "1" };
						$(".concent").remove();
						$.ajax({
							type: "POST",
							datatype: "json",
							data: { data: JSON.stringify(pageztdata) },
							url: "/pay/bms/coupon/summeryInfo",
							success: function (ztpagedata) {
								ListD(ztpagedata, ".H-title");
								// show_btn();
								HideBtn();
							},
							error: function () {

							}
						})
					}
				})
			},
			error: function () {

			}
		});



		$(".concent").remove();
		$(".new-btn").show();
		$(".new-btn").children().val("新建房券");
		$(".new-btn").children().attr("coupontype", "1");
		$(".wu").children(":last-child").html("新建房券");
		$(".wu").children("span").html("暂无房券");
		if (Listdata.data == undefined) {
			$(".wu").show();
		} else {
			$.each(Listdata.data, function (index) {
				if (Listdata.data[index].couponType == "1") {
					$(".list-title").after("<tr class='concent one' order=" + index + "><td class='J-first'><img src='image/gou1.jpg'></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>");
					TianSj(".one", index, Listdata);
					TianZt(".one", index, Listdata);
					$(".concent").removeClass("one");
					$(".wu").hide();
				}
			})
		}

	});

	$(".pay").click(function () {
		coupontype = "2";
		$(".li-warp").hide();
		$(".CFavotable").hide();
		$("#Pay").show();
		$("#House").hide();
		$("#Favotable").hide();
		$("#J-Favotable").hide();
		$("#J-House").hide();
		$("#J-Pay").show();
		$("#House" + "#Favotable").hide();
		$("#J-Pay .list-title td").eq(4).html("流通量（元）");
		$("#J-Pay .list-title td").eq(5).html("核销量（元）");

		var paydata = { "pageno": 1, "pagecnt": 6, "couponType": "2" };
		$.ajax({
			type: "POST",
			datatype: "json",
			url: "/pay/bms/coupon/summeryInfo",
			data: { data: JSON.stringify(paydata) },
			success: function (payztdata) {
				$(".concent").remove();
				ListD(payztdata, ".P-title");
				// $(".btn").hide();
				HideBtn();
				$(".wu").hide();
				$("#Pay").createPage({
					pageCount: payztdata.pageinfo.pageAmount,
					current: 1,
					backFn: function (p) {
						var pageztdata = { "pageno": p, "pagecnt": 6, "couponType": "2" };
						$(".concent").remove();
						$.ajax({
							type: "POST",
							datatype: "json",
							data: { data: JSON.stringify(pageztdata) },
							url: "/pay/bms/coupon/summeryInfo",
							success: function (ztpagedata) {
								ListD(ztpagedata, ".P-title");
								// $(".btn").hide();
								HideBtn();
							},
							error: function () {

							}
						})
					}
				})

			},
			error: function () {

			}
		})

		$(".concent").remove();
		$(".new-btn").children().attr("coupontype", "2");
		$(".new-btn").hide();
		$(".wu").children(":last-child").html("新建消费金");
		$(".wu").children("span").html("暂无消费金");
		$.each(Listdata.data, function (index) {
			if (Listdata.data[index].couponType == "2") {
				$(".list-title").after("<tr class='concent one' order=" + index + "><td class='J-first'><img src='image/gou1.jpg'></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>");
				TianSj(".one", index, Listdata);
				TianZt(".one", index, Listdata);
				$(".concent").removeClass("one");

			}
		})
	})

	$(".favotable").click(function () {
		coupontype = "5";
		$(".li-warp").hide();
		$(".CFavotable").hide();
		$("#Pay").hide();
		$("#House").hide();
		$("#Favotable").show();
		$("#J-Favotable").show();
		$("#J-House").hide();
		$("#J-Pay").hide();
		var page = { "pageno": 1, "pagecnt": 6, "couponType": "5" };
		$.ajax({
			type: "POST",
			datatype: "json",
			url: "/pay/bms/coupon/summeryInfo",
			data: { data: JSON.stringify(page) },
			success: function (ztdata) {
				$(".concent").remove();
				ListD(ztdata, ".F-title");
				// show_btn();
				HideBtn();
				$("#Favotable").createPage({
					pageCount: ztdata.pageinfo.pageAmount,
					current: 1,
					backFn: function (p) {
						var pageztdata = { "pageno": p, "pagecnt": 6, "couponType": "5" };
						$(".concent").remove();
						$.ajax({
							type: "POST",
							datatype: "json",
							data: { data: JSON.stringify(pageztdata) },
							url: "/pay/bms/coupon/summeryInfo",
							success: function (ztpagedata) {
								ListD(ztpagedata, ".F-title");
								// show_btn();
								HideBtn();
							},
							error: function () {

							}
						})
					}
				})
			}
		})

		$(".concent").remove();
		$(".new-btn").show();
		$(".new-btn").children().val("新建折扣券");
		$(".wu").children(":last-child").html("新建折扣券");
		$(".wu").children("span").html("暂无折扣券");
		$(".new-btn").children().attr("coupontype", "5");
		$.each(Listdata.data, function (index) {
			if (Listdata.data[index].couponType == "5") {
				$(".list-title").after("<tr class='concent one' order=" + index + "><td class='J-first'><img src='image/gou1.jpg'></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>");
				TianSj(".one", index, Listdata);
				TianZt(".one", index, Statusdata, Listdata);
				$(".concent").removeClass("one");
			}
		})
	})

	//新建卷
	$(".new-btn").children().click(function () {
		if ($(".new-btn").children().attr("coupontype") == "5") {
			window.location.href = "createCoupon.html?couponType=5";
		} else if ($(".new-btn").children().attr("coupontype") == "1") {
			window.location.href = "createCoupon.html?couponType=1";
		} else {
			window.location.href = "createCoupon.html?couponType=2";
		}
	})

	$(".new_a").click(function () {
		if ($(".new-btn").children().attr("coupontype") == "5") {
			window.location.href = "createCoupon.html?couponType=5";
		} else if ($(".new-btn").children().attr("coupontype") == "1") {
			window.location.href = "createCoupon.html?couponType=1";
		} else {
			window.location.href = "createCoupon.html?couponType=2";
		}
	})
	//关闭弹窗
	$(".top").children().click(function () {
		close();

		$(".a").hide();
		$(".tcback").hide();
	})
	$(".close").click(function () {

		close();

		$(".a").hide();
		$(".tcback").hide();
	})
})
//填充数据
function ListD(ztdata, tabtitle) {
	Listdata = ztdata;
	if (ztdata.data == undefined) {
		$(".wu").show();
	} else {
		$.each(ztdata.data, function (index) {
			$(tabtitle).before("<tr class='concent one' order=" + index + "><td class='J-first'><img src='image/gou1.jpg'></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>");

			TianSj(".one", index, ztdata);
			TianZt(".one", index, ztdata);
			$(".concent").removeClass("one");
			$(".wu").hide();

		})
	}
}

function TianSj(obj, i, ztdata) {
	var effDate = new Date(parseInt(ztdata.data[i].effectiveTime));
	var efftshi = effDate.getHours();
	var efftfen = effDate.getMinutes();
	var expDate = new Date(parseInt(ztdata.data[i].expireTime));
	var exptshi = expDate.getHours();
	var exptfen = expDate.getMinutes();
	var effectivet = getDate(parseInt(ztdata.data[i].effectiveTime));
	var expiret = getDate(parseInt(ztdata.data[i].expireTime));
	$(obj).children("td:eq(1)").append(ztdata.data[i].couponName);
	if (coupontype == "2") {
		$(obj).children("td:eq(4)").append(parseInt(ztdata.data[i].circulatingAmount) / 100);
		$(obj).children("td:eq(6)").append(parseInt(ztdata.data[i].overdueAmount) / 100);
		$(obj).children("td:eq(7)").append(parseInt(ztdata.data[i].undeliveredAmount) / 100);
	} else {
		$(obj).children("td:eq(4)").append(ztdata.data[i].circulatingCount);
		$(obj).children("td:eq(6)").append(ztdata.data[i].overdueCount);
		$(obj).children("td:eq(7)").append(ztdata.data[i].undeliveredCount);
	}
	$(obj).children("td:eq(2)").append(effectivet + "-" + expiret);
}

function TianZt(obj, i, ztdata) {
	if (ztdata.data[i].publishCount == undefined) {
		$(obj).children("td:eq(3)").html("0");

	} else {

		if (coupontype == "2") {
			$(obj).children("td:eq(3)").html(parseInt(ztdata.data[i].publishAmount) / 100);
			$(obj).children("td:eq(5)").html(parseInt(ztdata.data[i].checkoffAmount) / 100);
		} else {
			$(obj).children("td:eq(3)").html(ztdata.data[i].publishCount);
			$(obj).children("td:eq(5)").html(ztdata.data[i].checkoffCount);

		}
	}
	if (ztdata.data[i].publishCount == "0") {
		$(obj).children("td:eq(8)").addClass("J-wait J-last");
		$(obj).children("td:eq(8)").append("待发放");
		$(obj).children(":last-child").children("a:eq(0)").hide();
		$(obj).children(":last-child").children("a:eq(3)").hide();

	} else {
		var timestamp = Date.parse(new Date());
		var expireT = getDate(parseInt(ztdata.data[i].expireTime));
		if (timestamp <= parseInt(ztdata.data[i].expireTime)) {
			$(obj).children("td:eq(8)").addClass("J-ing J-last");
			$(obj).children("td:eq(8)").append("使用中");
			$(obj).children(":last-child").children("a:eq(1)").show();
			$(obj).children(":last-child").children("a:eq(0)").hide();
			$(obj).children(":last-child").children("a:eq(3)").hide();
		} else {
			$(obj).children("td:eq(8)").addClass("J-end J-last");
			$(obj).children("td:eq(8)").append("已过期");
			$(obj).children(":last-child").children("a:eq(0)").show();
			$(obj).children(":last-child").children("a:eq(1)").show();
			$(obj).children(":last-child").children("a:eq(0)").hide();
			$(obj).children(":last-child").children("a:eq(3)").hide();
		}
	}

}

//格式化时间戳
function  getDate(time)  {//将时间戳转化为日期
	var  date  =  new  Date(time);
	y  =  date.getFullYear();
	m  =  date.getMonth()  +  1;
	d  =  date.getDate();
	return  y  +  "."  +  (m  <  10  ?  "0"  +  m  :  m)  +  "."  +  (d  <  10  ?  "0"  +  d  :  d);
}
//关闭弹窗
function close() {
	$(".a").hide();
	$(".tcback").hide();
}
//show btn
function show_btn(t) {
	if (t == '已过期') {
		$(".shu_btn").hide();
		$(".fa_btn").hide();
		$('.send_btn').hide();
		$(".bian_btn").hide();
		$(".chi_btn").hide();
		$('.cha_btn').show();
		$('.shan_btn').show();
	} else if (t == '使用中') {
		$(".shu_btn").hide();
		$(".fa_btn").hide();
		$('.send_btn').show();
		$(".bian_btn").show();
		$(".chi_btn").hide();
		$('.cha_btn').show();
		$('.shan_btn').hide();
	} else if (t == '待发放') {
		$(".shu_btn").hide();
		$(".fa_btn").hide();
		$('.send_btn').show();
		$(".bian_btn").show();
		$(".chi_btn").hide();
		$('.cha_btn').show();
		$('.shan_btn').hide();
	}
	if (coupontype == '2') {
		$('.chi_btn').show();
		$('.send_btn').hide();
	}

}
//hide btn
function HideBtn() {
	$(".buttom").children().hide();
}

//---------------
function TimeG(time) {
	if (time / 10 > 1) {

		time = time;
	} else {
		time = "0" + time;
	}
	return time;
}
//点击发放后，跳转其他弹窗
function sendCouponClick() {
	var sendCouponSelect = $('.sendCouponSelect:eq(1)').val();
	var sendCouponTextarea = $('.yhx_textarea:eq(1)').val();
	var mobile = sendCouponTextarea.split(';');
	sendData = {};
	sendData.grantList = [];
	for (v in mobile) {
		if (mobile[v] != '') {
			var grantListContent = {};
			grantListContent.mobile = mobile[v];
			grantListContent.grantPieces = sendCouponSelect;
			grantListContent.couponId = couponid;
			sendData.grantList.push(grantListContent);
		}
	};
	if (mobile.length > 0 && mobile[0] != '') {
		modalService.close();
		$('.sendCouponTrueContent').empty();
		for (v in sendData.grantList) {
			var p = $('<p class="yhx_span" style="margin-left:30px;font-size:14px;"></p>')
			var span1 = $('<span>' + sendData.grantList[v].mobile + '</span>');
			var span2 = $('<span>' + sendData.grantList[v].grantPieces + '</span>');
			p.append(span1);
			p.append('*');
			p.append(span2);
			$('.sendCouponTrueContent').append(p);
		}
		$('.sendCouponTrueName').text(couponName);
		modalService.open({
			width: '450',
			height: '350',
			title: '确认发放',
			content: 'sendCouponTrue'
		});
	} else {
		jiHeAlert.open('请输入至少一个手机号');
	}
}

//确认发放券
function sendCouponClickTrue() {
	$.ajax({
		url: '/coupon/bms/grant',
		type: 'post',
		data: { data: JSON.stringify(sendData) },
		success: function (resp) {
			if (resp.sc == '0') {
				modalService.close();
				jiHeAlert.open('发放成功');
			} else {
				jiHeAlert.open(resp.ErrorMsg);
			}
		}
	})


}
