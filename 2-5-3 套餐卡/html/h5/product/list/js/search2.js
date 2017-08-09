var scrollHeight;
$(document).ready(function() {
	var reqParams=GetParams();

	if("开心兑"==reqParams.tags){
		$(".navigation").hide();
		$(".screen").show();
	}

	var url=h5orClient("/search/h5/query");
	var pagecnt=5;
	var c=1;
	var pageCount=0;//总页数
	var dataPost={"pagecnt":pagecnt,"pageno":"1"};
	var ajaxData=[];

	dataPost.keyWords=withOrWithout(reqParams.keyWords);
	dataPost.exchFlag=withOrWithout(reqParams.ef);
	dataPost.ltporatio=withOrWithout(reqParams.lto);
	dataPost.checkin=withOrWithout(reqParams.ckn);
	dataPost.assetType=withOrWithout(reqParams.assetType);
	dataPost.priceType=withOrWithout(reqParams.priceType);

	dataPost.tags = withOrWithoutList(reqParams.tags);
	dataPost.productIds=withOrWithoutList(reqParams.ids);
	dataPost.hotelIds=withOrWithoutList(reqParams.hids);
	dataPost.objectTypes=withOrWithoutList(reqParams.ots);
	dataPost.hotelTypes=withOrWithoutList(reqParams.hts);
	dataPost.coopTypes=withOrWithoutList(reqParams.ts);
	dataPost.cities=withOrWithoutList(reqParams.cities);
	dataPost.sortFields=withOrWithoutList(reqParams.sfs);

	var parameter={
		url:url,
		data:dataPost,
		pagecnt:pagecnt,
		classId:".searchwrap",
		lengthClassId:".wrap",
		leaveState:"staticweixinMinSuLeave",
		pageNum:"staticweixinMinSuPage",
		originalHtml:"staticweixinMinSuHtml",
		originalScrollTop:"staticweixinMinSuScrollTop",
		originalRequestRata:"staticweixinMinSuAjaxData",
		originalAjaxData:ajaxData
	};

	scrollHeight=listPageReturn(parameter,ajaxRequestFunc,originalRequest);

	//本页的回调函数
	function originalRequest(originalRequestRata,pageNum,pagecnt){
		$(".load").html("正在加载");
		var data=sessionStorage.getItem(originalRequestRata);
		var res=JSON.parse(data);
		ajaxData=res;
		c = sessionStorage.getItem(pageNum);
		pageCount=Math.ceil(res[0].data.pageInfo.pageAmount);
		isLike();
		isComments();
		$(".searchwrap").removeClass('no');
	}

	$(window).scroll(function(){
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height();
		var windowHeight = $(this).height();
		if($(".load").html()=="已经加载完" || c>=pageCount){
			$(".load").html("已经加载完");
			return;
		}
		else{
			if(scrollTop + windowHeight == scrollHeight && scrollTop>0) {
				c++;
				/*var paramPage = {"pagecnt":"5","pageno":c,"keyWords":keyWords,"tags":search};*/
				dataPost.pageno=c;
				ajaxRequestFunc(url,dataPost);
			}
		}

	});

	$(".screen td").click(function(){
		c=1;
		$(".searchwrap").empty();
		$(".load").html("正在加载");
		$(".up_down").attr("src","/html/market/images/up_down.png");
		$(this).addClass("redFont").siblings("td").removeClass("redFont");
		if($(this).attr("class").indexOf("price")!=-1){
			if($.inArray("pointsprice asc",dataPost.sortFields) >= 0){
				dataPost.sortFields = ["pointsprice desc"];
				$(".up_down").attr("src","/html/market/images/down_ud.png");
			}else {
				dataPost.sortFields = ["pointsprice asc"];
				$(".up_down").attr("src","/html/market/images/up_ud.png");
			}
		}else {
			$(".up_down").attr("src","/html/market/images/up_down.png");
			if($(this).attr("class").indexOf("manual")!=-1){
				dataPost.sortFields = ["manual desc"];
			}
			if($(this).attr("class").indexOf("sell")!=-1){
				dataPost.sortFields = ["sellamount desc"];
			}
			if($(this).attr("class").indexOf("update")!=-1){
				dataPost.sortFields = ["updatetime desc"];
			}
		}
		//var paramPage = {"pagecnt":"5","pageno":c,"keyWords":keyWords,"tags":search};
		dataPost.pageno=c;
		ajaxRequestFunc(url,dataPost);
	});

	$("body").on("click",".picImg,.proImg,.tag span,.proComment,.topic",function () {
		parameter.originalAjaxData=ajaxData;
		listPageSetItem(parameter);
	}).on("click",".tag span",function(){
		sessionStorage.setItem(parameter.leaveState, "0");
		window.location.href="list2.html?tags="+$(this).html();
	}).on("click",".picImg,.proImg,.proComment,.topic",function(){
		var key = $(this).parents(".wrap").index();
		var the_page = Math.floor(key/pagecnt);
		var the_num= key%pagecnt;
		var useType=uaType();
		if(useType=="iosApp"){
			window.location.href = ajaxData[the_page].data.result[the_num].productBaseInfo.h5url;
		}else{
			window.location.href = ajaxData[the_page].data.result[the_num].productBaseInfo.wxDetailLink;
		}
	});


	//数据填进
	function ajaxRequestFunc(url,data){
		$.post(url, {data:JSON.stringify(data)}, function(result) {
			ajaxData.push(result);
			pageCount=Math.ceil(result.data.pageInfo.pageAmount);
			if(!result.data.result){
				$(".recommendWrap").removeClass('no');
				$(".load").addClass('no')
			}
			else {
				//resType=1为酒店，2为优惠
				if(!result.data.result){
					$(".load").html("已经加载完");
					return;
				}
				else if(result.data.result.length<5){
					$(".load").html("已经加载完");
				}
			}

			$.each(result.data.result,function(i){
				if(result.data.result[i].productBaseInfo.objectType==31){
					addModel2(result.data.result,i);
				}
				else {
					addModel1(result.data.result,i);
				}
			});

			isLike();
			isComments();
		});
	}

	function isLike(){
		$(".proLike").click(function(){
			var val=$(this).attr("value");
			var paramLike = {"productid":$(this).parents(".wrap").attr("id"),"favtype":"3"};
			if($(this).hasClass("liked")){
				$.post(h5orClient('/user/h5/setfavorite'),{data:JSON.stringify(paramLike)},function(res){

				});
				val--;
				$(this).attr("value",val);
				$(this).removeClass("liked").html(val>999?"999+":val);
			}
			else {
				$.post(h5orClient('/user/h5/setfavorite'),{data:JSON.stringify(paramLike)},function(res){

				});
				val++;
				$(this).attr("value",val);
				$(this).addClass("disabled").addClass("liked").html(val>999?"999+":val);
				$(".hasLike").show(300);
				setTimeout(function(){
					$(".hasLike").hide();
					$(".proLike").removeClass("disabled");
				},1200);
				return false;//阻止事件冒泡
			}
		});

		$("body").on("touchstart",function(){
			$(".hasLike").hide();
		});
	}

	function isComments(){
		$(".proComment").click(function(){
			if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && /jihe/i.test(navigator.userAgent)){
				var data1 = {"productId":$(this).parents(".wrap").attr("id"),"act":"toComment"};
				var url = "http://www.jihelife.com?data=" + JSON.stringify(data1);
				iosBridgeObjc(url);
			}
			else {
				window.location.href='../comments/comments.html?productId='+$(this).parents(".wrap").attr("id")+'&title='+$(this).parents(".wrap").find(".proName").html();
			}
		});
	}

	function addModel1(result,i){
		var picImg=result[i].productBaseInfo.imgList[0];
		var priceNum='';
		var price='';
		if(result[i].productBaseInfo.productPrice){
			priceNum=result[i].productBaseInfo.productPrice.showTotalPrice;
			price=(result[i].productBaseInfo.productPrice.priceType==0)?'￥<strong>'+priceNum/100+'</strong>':'<strong>'+priceNum+'</strong> 积分';
		}
		var jiheBusinessMemberNum=(result[i].productBaseInfo.productType==7)?0:result[i].productBaseInfo.jiheBusinessMember;
		var jiheBusinessMember=(jiheBusinessMemberNum==0)?'':'<span class="price" id="price1" style="background-color:rgb(180,139,74) ;display:inline-block;height: 2.4rem;vertical-align: middle;">会员<br>商户</span>';
		var priceStyle=(jiheBusinessMemberNum==0)?'':'style="display: inline-block; height: 2.4rem; vertical-align: middle;line-height: 2.5rem;"';
		var brandIcon=(result[i].productBaseInfo.baseHotelInfo && result[i].productBaseInfo.baseHotelInfo.brandIcon)?'<div class="icon"><img src="'+result[i].productBaseInfo.baseHotelInfo.brandIcon+'" alt=""></div>':'';
		var hotelCname=(result[i].productBaseInfo.productName)?'<div class="title">'+result[i].productBaseInfo.productName+'</div>':'';
		var tags="";
		var tagInfoList = result[i].productBaseInfo.tagInfoList;
		if(tagInfoList){
			for(var j in tagInfoList){
				if(tagInfoList[j].name!="其他"&&tagInfoList[j].name!="民宿"&&j<4){
					tags+='<span>'+ result[i].productBaseInfo.tagInfoList[j].name +'</span>';
				}
			}
			tags='<div class="tag">'+tags+'</div>';
		}

		var picStyle=(result[i].productBaseInfo.productType==7)?'style="height: 16rem;"':'';
		brandIcon=(result[i].productBaseInfo.productType==7)?'':brandIcon;
		tags=(result[i].productBaseInfo.productType==7)?'':tags;

		$(".searchwrap").removeClass('no').append('<div class="wrap">' +
				'<div class="pic" '+picStyle+'>' +
				'<div class="picImg">' +
				'<img src="'+ picImg +'" alt="">' +
				'</div>' +
				'<div class="priceWrap">' +
				'<span class="price" id="price" '+priceStyle+'>'+price+'</span>' +
				jiheBusinessMember +
				'</div>' +
				brandIcon +
				'</div>' +
				hotelCname +
				tags +
				'<div class="desc no"></div>' +
				'</div>');
	}

	function addModel2(result,i){
		var desc='';
		var descImg='';
		var effectiveTime=parseInt(result[i].productBaseInfo.saleBegintime);
		var expiredTime=parseInt(result[i].productBaseInfo.saleEndtime);
		var usCommentsNum=result[i].productBaseInfo.usCommentsNum;
		var usFavoritesNum=result[i].productBaseInfo.usFavoritesNum;
		var usCommentsNum2=usCommentsNum>999?"999+":usCommentsNum;
		var usFavoritesNum2=usFavoritesNum>999?"999+":usFavoritesNum;
		var status=result[i].favoriteInfoList[2].status;
		var proLikeClass="proLike";
		var colorStyle="";
		var briefDesc=!result[i].productBaseInfo.briefDesc?"":result[i].productBaseInfo.briefDesc;
		if(Date.parse(new Date())<effectiveTime){
			descImg='http://7xio74.com1.z0.glb.clouddn.com/virtualList/waiting.png';
			desc=((new Date(effectiveTime)).getMonth()+1)+'月'+(new Date(effectiveTime)).getDate()+'日'+(new Date(effectiveTime)).getHours()+':'+(new Date(effectiveTime)).getMinutes()+'开始';
		}else if(Date.parse(new Date())>expiredTime){
			descImg='http://7xio74.com1.z0.glb.clouddn.com/virtualList/end.png';
			desc='已结束';
			colorStyle="color:#C5C5C5;";
		}else {
			descImg='http://7xio74.com1.z0.glb.clouddn.com/virtualList/saleing.png';
			desc=((new Date(expiredTime)).getMonth()+1)+'月'+(new Date(expiredTime)).getDate()+'日'+'结束';
		}
		if(status==1){
			proLikeClass="proLike liked";
		}
		$(".searchwrap").removeClass('no').append('<div class="wrap" id="'+result[i].productBaseInfo.productId+'">'
				+'<div class="proImg" style="background-image: url('+ result[i].productBaseInfo.imgList[0] +');">'
				+'<div class="proStatus">'
				+'<div class="statusDesc" style="background-image: url('+ descImg +');'+ colorStyle +'">'+ desc +'</div>'
				+'</div>'
				+'</div>'
				+'<div class="proDetail">'
				+'<div class="proName">'+ result[i].productBaseInfo.productName +'</div>'
				+'<div class="proDesc">'+ briefDesc +'</div>'
				+'<div class="proOperate">'
				+'<div class="'+ proLikeClass +'" value="'+usFavoritesNum+'">'+usFavoritesNum2+'</div>'
				+'<div class="proComment">'+usCommentsNum2+'</div>'
				+'</div>'
				+'</div></div> ');
	}


// IOS桥接调用
	function iosBridgeObjc(url) {
		var iframe;
		iframe = document.createElement("iframe");
		iframe.setAttribute("src", url);
		iframe.setAttribute("style", "display:none;");
		document.body.appendChild(iframe);
		iframe.parentNode.removeChild(iframe);
	}
});

window.onload=function(){
	//针对ios不滚动的问题
	if(scrollHeight){
		$(window).scrollTop(scrollHeight);
	}
};

function withOrWithout($parameter){
	if($parameter && 'undefined'!=$parameter){
		return $parameter;
	}
}
function withOrWithoutList($parameter){
	if($parameter && 'undefined'!=$parameter){
		return $parameter.split(",");
	}
}
