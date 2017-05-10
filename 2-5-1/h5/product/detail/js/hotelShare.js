
	var data='{"id":"' + id + '"}';
	var url="/content/client/hotel/detail";
	$.post(url, {data: data}, function(data) {
       console.debug(data);
			 var img=data.data.productBaseInfo.imgList;
		     var hotelName=data.data.hotelBaseInfo.hotelCname;
		     var description=data.data.hotelBaseInfo.prmtDesc;
		     document.title=JSON.stringify(data.data.shareInfo.title);

			$.each(img,function(i){
        		$("#focus .bd ul").append('<li><a href="javascript:;"><img _src="'+img[i]+'?imageView2/1/w/'+aa*2+'/h/'+h+'" /></a></li>');
        		TouchSlide({ 
					slideCell:"#focus",
					titCell:".hd ul",
					mainCell:".bd ul", 
					effect:"left",
					autoPage:true,
					switchLoad:"_src"
				});	
            })

		h=$(window).height();
		$(".focus .bd li ").css("height",h*0.525);
		$(".content h1").html(hotelName);
		$(".detail").html(description);
		var latitude=data.data.hotelBaseInfo.locLat;
		var longitude=data.data.hotelBaseInfo.locLon;
		var address=data.data.hotelBaseInfo.address;
		var phone=data.data.hotelBaseInfo.phone;
		var price=data.data.hotelBaseInfo.price;
		$(".footerLeft .origin").html(data.data.hotelBaseInfo.originName+"7日最优惠价格");
		$(".map .mapPic img").attr("src","http://restapi.amap.com/v3/staticmap?location="+longitude+","+latitude+"&zoom=10&size=800*400&markers=mid,,A:"+longitude+","+latitude+"&key=ee95e52bf08006f63fd29bcfbcf21df0");
		$(".address").html("地址："+address);
		$(".phone").html("电话："+phone);
		if(price==-1){
			$(".hotelPrice").html("可能有房").css("color","#d13f4c");
		}
		else {
			
				$(".hotelPrice").html(price+" 起/晚");
			

		}
		$(document).ready(function() {
			$(".icon").click(function(event) {
           window.location="brandShare.html?id="+data.data.hotelBaseInfo.brandId
        });
		});
		
		var goToCount=data.data.hotelBaseInfo.userFavorites[0].count;
		var wantCount=data.data.hotelBaseInfo.userFavorites[1].count;;
		$("header .icon").css({"background":"url("+data.data.hotelBaseInfo.brandIcon+") 0 0 no-repeat","background-size":w*0.13,"-webkit-background-size":w*0.13})
		if(data.data.hotelBaseInfo.recommendPromotions==undefined){
			$(".Promotion").css("display","none");
			$(".proFooterTop").css("display","none");
			$(".phone").css("margin-bottom","0");
		}
		else{
			$.each(data.data.hotelBaseInfo.recommendPromotions,function(i){
				$(".Promotion ").append('<dl><dt class="itemLeft"></dt><dd class="itemRight"><span class="itemRightTop">'+data.data.hotelBaseInfo.recommendPromotions[i].productName+'</span><span class="itemRightBottom"></span></dd></dl>');
			})
			for (var g = $(".Promotion dl").length; g > 0; g--) {
				$(".Promotion dl").eq(g-1).children("dt").css({"background":'url('+data.data.hotelBaseInfo.recommendPromotions[g-1].imgUri+') center center no-repeat',"background-size":"cover","-webkit-background-size":"cover"})
				
				if(data.data.hotelBaseInfo.recommendPromotions[g-1].pieces==1){
					$(".Promotion dl").eq(g-1).children("dd").children(".itemRightBottom").html(data.data.hotelBaseInfo.recommendPromotions[g-1].price+'起/ '+data.data.hotelBaseInfo.recommendPromotions[g-1].piecesUnit);
				}
				else{
					$(".Promotion dl").eq(g-1).children("dd").children(".itemRightBottom").html(data.data.hotelBaseInfo.recommendPromotions[g-1].price+'起/ '+data.data.hotelBaseInfo.recommendPromotions[g-1].pieces+data.data.hotelBaseInfo.recommendPromotions[g-1].piecesUnit);
				}
			}
			$(document).ready(function() {
				$(".Promotion dl").click(function(event) {
                   window.location="activeDetail.html?id="+data.data.hotelBaseInfo.recommendPromotions[$(this).index()].productId
                });
			});
			


		}
		$(".want b").html(wantCount);
		$(".togo b").html(goToCount);
		if(goToCount>0){
			$(".togo i").addClass("togoCurrent");
		}
		if(wantCount>0){
			$(".want i").addClass("wantCurrent");
		}
//唤醒
	/*$(document).ready(function() {
		$(".hotelFooter .footerRight").click(function(event) {
			var ua = window.navigator.userAgent.toLowerCase();
        	substr = "weibo";

        	function isContains(ua, substr) {
            	return ua.indexOf(substr) >= 0;
        	}
        	if(isContains(ua, substr)==true){

        	}
        	alert(isContains(ua, substr))
		});
	});*/


    });