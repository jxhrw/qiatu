$(document).ready(function() {
	// var hh=decodeURIComponent(obj);
	// var h=JSON.parse(hh);
	$(".BMSRightTop").css('width', $(window).width()-130);
   $.post('/bms/h5/business/is_login.json',  function(data) {
        console.log(data)
        if(data.sc==0){
            $(".BMSRightTopLeft h1").html(data.data.hotelName+"会员管理中心");
            $(".BMSRightTopLeftZhanghaoName i").html(data.data.account);
        }
        else{
            window.location="/html/bms/pcBms/BMSLogin/BMSLogin.html"
        }
   })
	$(".maskClose").click(function(event) {
		$(this).parent().parent().parent().css('display', 'none');
	});
	// $.post('/bms/h5/business/menu',function(res) {
	// 	console.log(res);
	// 	var oIcons;
	// 	var backGround0;
	// 	$.each(res.data, function (i) {
	// 		var list='<li><span></span>'+res.data[i].privilegeName+'</li>';
	// 		$(".BMSLeft ul").append(list);
	// 		oIcons=res.data[i].icon.split(",");
	// 		console.log(oIcons);
	// 		backGround0='url("http://7xio74.com1.z0.glb.clouddn.com/'+oIcons[0]+'") no-repeat left top';
	// 		$(".BMSLeft ul li").eq(i).find("span").css("background",backGround0);
	// 		$(".BMSLeft ul li").eq(i).find("span").attr("id",res.data[i].privilegeId);
	// 	});
	// 	var firstId=res.data[0].privilegeId;
	// 	$(".BMSLeft ul li:first-of-type").addClass('current');
	// 	$(".BMSLeft ul li:first-of-type span").addClass(getPic(firstId));
	// 	$(".BMSRightBottom").attr('src', res.data[0].privilegeValue);
	// 	$(".BMSLeft ul li").click(function(event) {
	// 		$(this).addClass('current').siblings('').removeClass('current');
	// 		var el=$(this).index();
	// 		$(".BMSRightBottom").attr('src', res.data[el].privilegeValue);
	// 		var getId=$(this).find("span").attr("id");
	// 		console.log(getId);
	// 		$(this).find("span").addClass(getPic(getId));
	// 		//var icons=res.data[el].icon.split(",");
	// 		//var backGround1='url("http://7xio74.com1.z0.glb.clouddn.com/'+icons[1]+'") no-repeat left top';
	// 		//var backGround2='url("http://7xio74.com1.z0.glb.clouddn.com/'+oIcons[0]+'") no-repeat left top';
	// 		//$(this).find("span").css("background",backGround1);
	// 		/*
  //                       if(el==1){
  //                           $(".BMSRightBottom").attr('src', '/html/bms/integralPayment.html?member_hotelid=');
  //                       }
  //                       else if(el==0){
  //                           $(".BMSRightBottom").attr('src', '/html/bms/BMSRecord.html?member_hotelid=');
  //                       }
  //                       else if(el==3){
  //                           $(".BMSRightBottom").attr('src', '/html/bms/managementCenter.html?member_hotelid=');
  //                       }
  //                       else if(el==2){
  //                           $(".BMSRightBottom").attr('src', '/html/bms/mentoringProgram.html?member_hotelid=');
  //                       }
  //                       else if(el==4){
  //                           $(".BMSRightBottom").attr('src', '/html/bms/BMSSettlement.html');
  //                       }
  //                       // $(".BMSRightBottom").attr('src', '/html/bms/integralPayment.html?member_hotelid=5');
  //           */
	// 	}).hover(function() {
	// 		$(this).addClass('current1');
	// 	}, function() {
	// 		$(this).removeClass('current1');
	// 	});
	//
	//
	// 	if($(".BMSLeft ul").height()>$(window).height()-110){
	// 		$(".BMSLeft ul").css({'height':$(window).height()-110,'width':'147px'});
	// 	}else {
	// 		$(".BMSLeft ul").css({'height': 'auto','width':'100%'});
	// 	}
	// });

	//登录
	$(".BMSWrap").css('height', $(window).height());
	$(".mask").css('height', $(window).height());
    $(".BMSRightBottom").css('width', $(window).width()-130);
    $(".BMSRightBottom").css('height', $(window).height()-90);
	$(".BMSRightTopLeftZhanghao").hover(function() {
		$(".BMSRightTopLeftZhanghaoName").addClass('BMSRightTopLeftZhanghaoNameCurrent');
		$(".BMSRightTopLeftZhanghaoKan").css('display', 'block');
	}, function() {
		$(".BMSRightTopLeftZhanghaoName").removeClass('BMSRightTopLeftZhanghaoNameCurrent');
		$(".BMSRightTopLeftZhanghaoKan").css('display', 'none');
	});
	$(".BMSRightTopLeftZhanghaoKan li").eq(0).click(function(event) {
		$.post('/bms/h5/business/logout.json', function(data) {
            // console.log(data)
            window.location="/html/bms/pcBms/BMSLogin/BMSLogin.html"
        })
	});
    //$(".BMSRightBottom").attr('src', '/html/bms/pcBms/BMSRecord/BMSRecord.html?member_hotelid=5');



    //失去焦点
    $(".BMSRightTopRight input").blur(function (event) {
        if (!$(this).val().match(/^[1][3,4,5,7,8][0-9]{9}$/)) {
            $(this).val("");
            return;
        }
        else{
            $(".BMSRightTopRight i").click(function(event) {
                $(".BMSRightBottom").attr('src', '/html/bms/pcBms/enquiry/enquiry.html?member_hotelid='+$(".BMSRightTopRight input").val());
            });
        }
    });

	$(".BMSRightTopLeftZhanghaoKan li").eq(1).click(function(event) {
		$(".mask").css('display', 'block');
	});
	  //失去焦点
	$(".dl1 dd input").blur(function (event) {
    	if ($(this).val() != "") {
    		var data={"oldPassword":$(this).val()}
    	   $.post('/bms/h5/business/edit-password.json', {data: JSON.stringify(data)},  function(data) {
            	// console.log(data)
            	if(data.sc=="0"){
            		$(".mask .dl1 .errTip1").css('display', 'none').removeAttr('id');
            		$(".mask .dl1 input").css('border', '1px solid #bfbfbf');
            	}
            	else{
            		$(".mask .dl1 .errTip1").css('display', 'block').attr('id', 'errCur');;
            		$(".mask .dl1 input").css('border', '1px solid #fe4f40');
            	}


        	})

    	}

	});
	$(".dl3 dd input").blur(function (event) {
    	if ($(this).val() != $(".dl2 dd input").val()) {
    		$(".mask .dl3 .errTip2").css('display', 'block');
            $(".mask .dl3 input").css('border', '1px solid #fe4f40');

    	}
    	else {
    		$(".mask .dl3 .errTip2").css('display', 'none');
    		$(".mask .dl3 input").css('border', '1px solid #bfbfbf');
    	}

	});
	$(".xiugaimimaBtn").click(function(event) {
		if ($(".dl3 dd input").val() != $(".dl2 dd input").val()) {
    		$(".mask .dl3 .errTip2").css('display', 'block');
            $(".mask .dl3 input").css('border', '1px solid #fe4f40');
            return;
    	}
    	else if($(".dl1 dd span").attr("id")=="errCur"){
    		return;
    	}
    	else {
    	   var data={"oldPassword":$(".dl1 dd input").val(),"newPassword":$(".dl3 dd input").val()}
    	   $.post('/bms/h5/business/edit-password.json', {data: JSON.stringify(data)},  function(data) {
            	// console.log(data)
            	if(data.sc=="0"){
            		window.location="/html/bms/pcBms/BMSLogin/BMSLogin.html"
            	}
            	else{
            		alert("网络错误")
            	}

        	})
    	}
	});

	//左边栏
	$.ajax({
	 url: '/bms/h5/business/menu',
	 type: 'post',
	 success:function(resp) {
		 if(resp.sc=='0'){
			 var data=resp.data;
			 for(v in data){
				 //没有隐藏下拉框
				 if(data[v].privilegeValue!=undefined){
					 var div=$('<div></div>');
					 var p=$('<p class="noHide"></p>');
					 var a=$('<a href="javascript:void(0)" class="menuA">'+data[v].privilegeName+'</a>');
					 p.append(a);
					 div.append(p);
					 $('.BMSLeftContent').append(div);
					 //防阻塞添加点击事件
					 (function(v){
						 p.click(function(event) {
							 $(".BMSRightBottom").attr('src', data[v].privilegeValue);
							 $('.afterClick').removeClass('afterClick');
							 $(this).parent().addClass('afterClick');
						 });
					 })(v)
				 }
				 //有隐藏下拉框
				 else{
						 var div=$('<div></div>');
						var p=$('<p class="hasHide"></p>');
						var a=$('<a href="javascript:void(0)" class="menuA">'+data[v].privilegeName+'</a>');
						 var hideDiv=$('<div class="divHide"><div>');
						 (function(v){
							 p.click(function(event) {
								 //记录现在我的hide的display;
								 var display=$(this).siblings('.divHide').css('display');
                 //如果我这边display为关闭时，点击是打开，则关闭其他打开项
								 if(display=='none'){
									 $('.divHide').css('display', 'none');
									 $('.divHide').siblings('p').removeClass('hasHideOpen');
								 }
								 $(this).siblings('.divHide').toggle();
								 $(this).toggleClass('hasHideOpen');
								 // if ($(this).attr("class") == "hasHide hasHideOpen") {
         //                             $(".BMSRightBottom").attr('src',data[v].privilegeValue);
								 // }
							 });
						 })(v);
						 var submenu=data[v].submenu;
						 for(i in submenu){
							 var hideDiv2=$('<div></div>');
							 var hideP=$('<p class="pHide"></p>');
							 var hideA=$('<a href="javascript:void(0)" class="menuA">'+submenu[i].privilegeName+'</a>');
							 hideDiv2.append(hideP);
							 hideP.append(hideA);
								 (function(i){
									 hideP.click(function(event) {
										 $(".BMSRightBottom").attr('src',submenu[i].privilegeValue);
										 $('.afterClick').removeClass('afterClick');
										 $(this).parent().addClass('afterClick');
									 });
								 })(i)
							 hideDiv.append(hideDiv2);
						 };

						 p.append(a);
						 div.append(p);
						 div.append(hideDiv);
						 $('.BMSLeftContent').append(div);
				 }
			 }
			 $('.BMSLeftContent').append('<div style="height:30px;"></div>');
			 //第一个添加选中框
			 $('.BMSLeftContent div').first().addClass('afterClick');
			 if(data && data.length>0 && data[0].privilegeValue){
				 $(".BMSRightBottom").attr('src',data[0].privilegeValue);
			 }else {
				 $(".BMSRightBottom").attr('src', '/html/bms/pcBms/BMSRecord/BMSRecord.html?member_hotelid=5');
			 }
		 }
	 }
	});
  //设置侧边栏高度
  var BMSLeftHeight=$('.BMSLeft').css('height');
	var imgHeight=$('.BMSLeft img').css('height');
	var BMSLeftContentHeight=parseInt(BMSLeftHeight)-parseInt(imgHeight)-96;
	console.log(BMSLeftContentHeight);
	$('.BMSLeftContent').css('height', BMSLeftContentHeight+'px');



});
/*
function getIframeUrl(id){
	switch (id){
		case "1":
			$(".BMSRightBottom").attr('src', '/html/bms/BMSRecord.html?member_hotelid=');
			break
	}
}*/
function getPic(id){
	switch (id){
		case "1":
			return "backGround1";
			break;
		case "2":
			return "backGround2";
			break;
		case "3":
			return "backGround3";
			break;
		case "4":
			return "backGround4";
			break;
		case "5":
			return "backGround5";
			break;
		case "6":
			return "backGround6";
			break;
		case "7":
			return "backGround7";
			break;
	}
};
