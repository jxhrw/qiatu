var aaa;
var data1a;


$(document).ready(function() {
	$(".mask").css('height', $(window).height());
	$(".mask2").css('height', $(window).height());
	$(".maskClose").click(function(event) {
		$(this).parent().parent().parent().css('display', 'none');
	});
	$("#managementCenterTop li").eq(4).children('strong').children('i').click(function(event) {
		$(".mask").show();
	});
	$.post('/bms/h5/business/get_business_info.json', function(data) {
		console.log(data)
		if(data.sc==0){
			$("#managementCenterTop li").eq(0).children('span').html(data.data.businessName)
			$("#managementCenterTop li").eq(1).children('span').html(data.data.contact)
			$("#managementCenterTop li").eq(2).children('span').html(data.data.phone)
			$("#managementCenterTop li").eq(3).children('span').html(data.data.address)
			$("#managementCenterTop li").eq(4).children('em').children('img').attr('src', data.data.qrcode);
			$("#managementCenterTop li").eq(4).children('.tuiGuang').children('textarea').text(data.data.businessChannelUrl);
			$(".memberEqUid").html(data.data.hoteId)
			
		}
		
	})
	$.post('/bms/h5/business/get_channel.json', function(data) {
		console.log(data)
		if(data.sc==0){
			for (var i = 0; i < data.data.length; i++) {
				var a=i+1
				var biao='biao'+a
				// alert("aa")
				$("#managementCenterBottom").append('<li><strong>'+data.data[i].channelName+'<br/><i>删除</i></strong><em><img src="'+data.data[i].channelQRCodeUrl+'" alt=""></em><em class="tuiGuang"><b>推广链接：</b><br/><textarea id="'+i+'" class="hah" rows="2">'+data.data[i].channelUrl+'</textarea><br/><i class="first1">复制链接</i></em> <b class="channel" style="display:none">'+data.data[i].channel+'</b></li>')	
					
			
				}
			};
			
		
		
	})
	var d=0
	$(".xiugaimimaBtn").click(function(event) {
		d++;
		var data1={"channelName":$(".dl1 dd input").val(),"hotelId":$(".memberEqUid").html()}
		$.post('/bms/h5/business/add_channel.json', {data: JSON.stringify(data1)}, function(result) {
			if(result.sc==0){
				$(".mask").css('display', 'none');
				$("#managementCenterBottom").append('<li><strong>'+result.data.channelName+'<br/><i>删除</i></strong><em><img src="'+result.data.channelQRCodeUrl+'" alt=""></em><em class="tuiGuang"><b>推广链接：</b><br/><textarea id="jianji'+d+'" class="hah" rows="2">'+result.data.channelUrl+'</textarea><br/><i class="first1">复制链接</i></em> <b class="channel" style="display:none">'+result.data.channel+'</b></li>')	
				// $("#managementCenterBottom li").eq(0).css('display', 'block');
				// console.log(result)
				// $("#managementCenterBottom li").eq(0).children('.channel').html(result.data.channel)
				// $("#managementCenterBottom li").eq(0).children('strong').html(result.data.channelName+'：<br/><i>删除</i>')
				// $("#managementCenterBottom li").eq(0).children('em').children('img').attr('src', result.data.channelQRCodeUrl);
				// $("#managementCenterBottom li").eq(0).children('.tuiGuang').children('textarea').text(result.data.channelUrl);
			}
		})
			
			
	});
	// $(".")
	$(".mask2Btn span").eq(0).click(function(event) {
		$.post('/bms/h5/business/delete_channel.json', {data: JSON.stringify(data1a)}, function(result) {
			console.log(result)
			if(result.sc==0){
				$("#managementCenterBottom li").eq(aaa).remove();
				
				$(".mask2").css('display', 'none');
				alert("删除成功")
				
			}
			
		})
});
$(".mask2Btn span").eq(1).click(function(event) {
	$(".mask2").css('display', 'none');
});



});
$("#managementCenterBottom .first1").live('click', function(event) {
	var aa=$(this).siblings('textarea').attr('id');
	var Url3=document.getElementById(""+aa);
 	Url3.select(); // 选择对象
 	document.execCommand("Copy"); // 执行浏览器复制命令
 	alert("已复制好，可贴粘。");
});

$("#managementCenterBottom strong i").live('click', function(event) {
	aaa=$(this).parent('strong').parent('li').index();
	data1a={"bmsChannel":$("#managementCenterBottom li").eq(aaa).children('.channel').html()}
	$(".mask2").css('display', 'block');

})	




	// var aa=$(this).parent('strong').parent('li').index();
	
/*});*/













 // function copyUrl3()
 // {
 // 	var Url3=document.getElementById(""+i);
 // 	Url3.select(); // 选择对象
 // 	document.execCommand("Copy"); // 执行浏览器复制命令
 // 	alert("已复制好，可贴粘。");
 
 // }