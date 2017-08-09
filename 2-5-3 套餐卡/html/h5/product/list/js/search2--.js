var scrollHeight;
$(document).ready(function() {
	var reqParams=GetParams();

	if("开心兑"==reqParams.tags){
		$(".navigation").hide();
		$(".screen").show();
	}

	var url="/search/h5search";
	var pagecnt=5;
	var c=1;
	var pageCount=0;//总页数
	var dataPost={"pagecnt":"5","pageno":"1"};
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

	scrollHeight=listPageReturn(parameter,ajaxRequest,originalRequest);

	//本页的回调函数
	function originalRequest(originalRequestRata,pageNum,pagecnt){
		$(".load").html("加载更多");
		var data=sessionStorage.getItem(originalRequestRata);
		var res=JSON.parse(data);
		ajaxData=res;
		c = sessionStorage.getItem(pageNum);
		pageCount=Math.ceil(res[0].data.totalCount/pagecnt);
		isLike();
		isComments();
		$(".searchwrap").removeClass('no');
		$(".tag span").click(function (event) {
			var ee = $(this).html();
			$(window).scrollTop(0);
			window.location.href = "list2.html?tags=" + ee;
		});
		$(".topic").click(function(event) {
			var ee=$(this).parents(".wrap").index();
			var nowPage=parseInt(ee/5);
			window.location.href=ajaxData[nowPage].data.searchList[ee-nowPage*5].object.wxDetailLink
		});
		var ua = window.navigator.userAgent.toLowerCase();
		if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && /jihe/i.test(navigator.userAgent)) {
			$(".picImg,.proImg").click(function (event) {
				var ee = $(this).parents('.wrap').index();
				var nowPage=parseInt(ee/5);
				window.location.href = ajaxData[nowPage].data.searchList[ee-nowPage*5].h5url
			});//这是iOS平台下浏览器
		} else {
			$(".picImg,.proImg").click(function (event) {
				var ee = $(this).parents('.wrap').index();
				var nowPage=parseInt(ee/5);
				window.location.href = ajaxData[nowPage].data.searchList[ee-nowPage*5].object.wxDetailLink
			});
		}
	}

	$(window).scroll(function(){
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height();
		var windowHeight = $(this).height();
		if($(".load").html()=="已经加载完" || c>=pageCount){
			$(".load").html("已经加载完")
			return;
		}
		else{
			if(scrollTop + windowHeight == scrollHeight && scrollTop>0) {
				c++;
				/*var paramPage = {"pagecnt":"5","pageno":c,"keyWords":keyWords,"tags":search};*/
				dataPost.pageno=c;
				ajaxRequest(url,dataPost);
			}
		}

	});

	$(".screen td").click(function(){
		c=1;
		$(".searchwrap").empty();
		$(".load").html("加载更多");
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
		ajaxRequest(url,dataPost);
	});

	$("body").on("click",".picImg,.proImg,.tag span,.proComment,.topic",function () {
		parameter.originalAjaxData=ajaxData;
		listPageSetItem(parameter);
	});

	function ajaxRequest(url,data){
		$.post(url, {data:JSON.stringify(data)}, function(result) {
			console.debug(result)
			ajaxData.push(result);
			pageCount=Math.ceil(result.data.totalCount/pagecnt);
			if(result.data.searchList==undefined){
				$(".recommendWrap").removeClass('no');
				$(".load").addClass('no')
			}
			else{
				//search app里是5条以内是搜索几条加上推荐总共5条，5条以上就不要推荐
				//resType=1为酒店，2为优惠
				if(undefined==result.data.searchList){
					$(".load").html("已经加载完");
					return;
				}
				else if(result.data.searchList.length<5){
					$(".load").html("已经加载完");
				}

				$.each(result.data.searchList,function(i){
					var topicDesc;
					var brandIcon;
					var statusInfo;
					if(result.data.searchList[i].object==undefined){
						topicDesc="";
					}
					else{
						if(result.data.searchList[i].object.topicDesc!=undefined){
							topicDesc=result.data.searchList[i].object.topicDesc
						}
						else if(result.data.searchList[i].object.brandIcon!=undefined){
							brandIcon=result.data.searchList[i].object.brandIcon
						}
						else if(result.data.searchList[i].object.statusInfo!=undefined){
							statusInfo=result.data.searchList[i].object.statusInfo
						}
						else{
							topicDesc="";
							brandIcon="";
							statusInfo="";
						}
					}

					if(result.data.searchList[i].resType==31){
						addModel2(result,i);
					}
					else {
						addModel1(result,i,topicDesc,brandIcon,statusInfo);
					}
				});
				var d = c - 1;
				for(var a=0; a<result.data.searchList.length;a++){
					if(result.data.searchList[a].resType==2){
						$(".wrap").eq(a+d*5).children('.promotion').removeClass('no');
						$(".wrap").eq(a+d*5).children('.pic').children('.topic').remove();
						$(".wrap").eq(a+d*5).children('.tag').remove();
						$(".wrap").eq(a+d*5).children('.desc').remove();
						if(result.data.searchList[a].object.gradeLevel==1){
							$(".wrap").eq(a+d*5).children('.promotion').children('.promotionLeft').children('.promotionLeftCon').children('i').addClass('huasuan');
						}
						else if(result.data.searchList[a].object.gradeLevel==2){
							$(".wrap").eq(a+d*5).children('.promotion').children('.promotionLeft').children('.promotionLeftCon').children('i').addClass('chaozhi');
						}
						else{
							$(".wrap").eq(a+d*5).children('.promotion').children('.promotionLeft').children('.promotionLeftCon').children('i').addClass('zhenhan');
						}
						if(result.data.searchList[a].object.promPriceDays==1){
							$(".wrap").eq(a+d*5).children('.pic').children('.priceWrap').children('#price').append('￥<strong>'+result.data.searchList[a].price+'</strong>');
						}
						else{
							$(".wrap").eq(a+d*5).children('.pic').children('.priceWrap').children('#price').append('￥<strong>'+result.data.searchList[a].price+'</strong>/'+result.data.searchList[a].object.promPriceDays+result.data.searchList[a].object.priceUnit)
						}
						if(undefined==result.data.searchList[a].price){
							$(".wrap").eq(a).children('.pic').children('.priceWrap').children('.price').remove();
						}
						if(result.data.searchList[a].object.status!=1){
							$(".wrap").eq(a+d*5).children('.promotion').children('.promotionRight').children('.time').css('background', 'none');
						}
						if(result.data.searchList[a].object.statusInfo==undefined){
							$(".wrap").eq(a+d*5).children('.promotion').children('.promotionRight').children('.time').css('display', 'none');
						}
						//会员价还没弄

					}
					else if(result.data.searchList[a].resType==3){
						//主题
						$(".wrap").eq(a+d*5).children('.pic').children('.topic').removeClass('no');
						$(".wrap").eq(a+d*5).children('.pic').children('.priceWrap').remove();
						$(".wrap").eq(a+d*5).children('.pic').children('.icon').remove();
						$(".wrap").eq(a+d*5).children('.promotion').remove();
						$(".wrap").eq(a+d*5).children('.title').remove();
						$(".wrap").eq(a+d*5).children('.tag').remove();
						$(".wrap").eq(a+d*5).children('.desc').remove();
						$(".topic").click(function(event) {
							var ee=$(this).parents(".wrap").index();
							window.location.href=result.data.searchList[ee-d*5].object.wxDetailLink;
						});
					}
					else if(result.data.searchList[a].resType==30 || result.data.searchList[a].resType==40){
						$(".wrap").eq(a+d*5).children('.pic').children('.topic').remove();
						$(".wrap").eq(a+d*5).children('.pic').children('.icon').remove();
						$(".wrap").eq(a+d*5).children('.tag').remove();
						$(".wrap").eq(a+d*5).children('.desc').remove();
						$(".wrap").eq(a+d*5).children('.pic').css("height","16rem");
						if(result.data.searchList[a].object.productPrice.priceType==1){
							$(".wrap").eq(a+d*5).children('.pic').children('.priceWrap').children('#price').html('<strong>'+result.data.searchList[a].object.productPrice.totalPointPrice+'</strong> 积分');
						}
						else if(result.data.searchList[a].object.productPrice.priceType==0){
							$(".wrap").eq(a+d*5).children('.pic').children('.priceWrap').children('#price').html('￥<strong>'+result.data.searchList[a].price+'</strong>');
						}
						if(undefined==$(".wrap").eq(a+d*5).find('.priceWrap').find("strong").html()){
							$(".wrap").eq(a+d*5).children('.pic').children('.priceWrap').children('.price').remove();
						}
					}
					else {
						//有民宿和酒店
						var html='￥<strong>'+result.data.searchList[a].price+'</strong>';
						if(result.data.searchList[a].price<=0){
							html=result.data.searchList[a].priceDesc;
						}
						$(".wrap").eq(a+d*5).children('.pic').children('.priceWrap').children('#price').html(html);
						if(undefined==result.data.searchList[a].price){
							$(".wrap").eq(a+d*5).children('.pic').children('.priceWrap').children('.price').remove();
						}
						//直接展示一句话
						$(".wrap").eq(a+d*5).children('.pic').children('.topic').remove();
						$(".wrap").eq(a+d*5).children('.promotion').remove();
						if(result.data.searchList[a].sellerType==1){
							$(".wrap").eq(a+d*5).children('.tag').removeClass('no');
							if(result.data.searchList[a].inUnion==1){
								$(".wrap").eq(a+d*5).children('.pic').children('.priceWrap').children('#price1').removeClass('no');
								$(".wrap").eq(a+d*5).children('.pic').children('.priceWrap').children('#price').css({
									'display': 'inline-block',
									'height': '2.4rem',
									'vertical-align': 'middle'
								});
							}

						}
						else{
							/*	$(".wrap").eq(a+d*5).children('.desc').removeClass('no').html(result.data.searchList[a].object.brief);*/
							$(".wrap").eq(a+d*5).children('.tag').removeClass('no');
							if(result.data.searchList[a].sellerType==2){
								$(".wrap").eq(a+d*5).children('.pic').children('.priceWrap').children('#price').remove();
								if(result.data.searchList[a].inUnion==1){
									$(".wrap").eq(a+d*5).children('.pic').children('.priceWrap').children('#price1').removeClass('no');
								}
							}
						}
					}
					var ddl;
					if(undefined!=result.data.searchList[a].tags && result.data.searchList[a].tags.length>4){
						ddl=4;
					}
					else if(undefined!=result.data.searchList[a].tags){
						ddl=result.data.searchList[a].tags.length;
					}
					else {
						ddl=0;
					}
					for(var b=0; b<ddl;b++){
						if(result.data.searchList[a].tags[b]!="其他"&&result.data.searchList[a].tags[b]!="民宿"){
							$(".wrap").eq(a+d*5).children('.tag').append('<span>'+result.data.searchList[a].tags[b]+'</span>')
						}
					}
					$(".tag span").click(function(event) {
						$(window).scrollTop(0);
						var ee=$(this).html();
						window.location.href="list2.html?tags="+ee;
					});
				}

				var ua = window.navigator.userAgent.toLowerCase();
				if(ua.match(/MicroMessenger/i) != 'micromessenger' && /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)  && /jihe/i.test(navigator.userAgent)){
					$(".picImg,.proImg").click(function(event) {
						var ee=$(this).parents('.wrap').index();
						window.location.href=result.data.searchList[ee-d*5].h5url
					});//这是iOS平台下浏览器
				}
				else{
					$(".picImg,.proImg").click(function(event) {
						var ee=$(this).parents('.wrap').index();
						window.location.href=result.data.searchList[ee-d*5].object.wxDetailLink
					});
				}
				isLike();
				isComments();
			}
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
				window.location.href='/html/comments/comments.html?productId='+$(this).parents(".wrap").attr("id")+'&title='+$(this).parents(".wrap").find(".proName").html();
			}
		});
	}

	function addModel1(result,i,topicDesc,brandIcon,statusInfo){
		$(".searchwrap").removeClass('no').append('<div class="wrap"><div class="pic"><div class="picImg"><img src="'+result.data.searchList[i].imageLink+'" alt=""></div><div class="topic no"><p class="topicTitle">'+result.data.searchList[i].title+'</p><span class="topicdesc">'+topicDesc+'</span></div><div class="priceWrap"><span class="plusPrice no">几何PLUS价<em>￥<strong>1200</strong>/2晚</em></span><span class="price" id="price"></span><span class="price no" id="price1" style="background-color:rgb(180,139,74) ;display:inline-block;height: 2.4rem;vertical-align: middle;">会员<br/>商户</span><span class="noPlus no"><em>几何PLUS用户</em>享受更低价</span></div><div class="icon"><img src="'+brandIcon+'" alt=""></div></div><div class="promotion no"><div class="promotionLeft"><div class="promotionLeftCon"><span>优惠</span><i></i></div></div><div class="promotionRight"><span class="time">'+statusInfo+'</span></div></div><div class="title">'+result.data.searchList[i].title+'</div><div class="tag no"></div><div class="desc no"></div></div> ');
	}

	function addModel2(result,i){
		var desc='';
		var descImg='';
		var effectiveTime=parseInt(result.data.searchList[i].object.saleBegintime);
		var expiredTime=parseInt(result.data.searchList[i].object.saleEndtime);
		var usCommentsNum=result.data.searchList[i].object.usCommentsNum;
		var usFavoritesNum=result.data.searchList[i].object.usFavoritesNum;
		var usCommentsNum2=usCommentsNum>999?"999+":usCommentsNum;
		var usFavoritesNum2=usFavoritesNum>999?"999+":usFavoritesNum;
		var status=result.data.searchList[i].object.favoriteInfoList[2].status;
		var proLikeClass="proLike";
		var colorStyle="";
		var briefDesc=!result.data.searchList[i].object.briefDesc?"":result.data.searchList[i].object.briefDesc;
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
		$(".searchwrap").removeClass('no').append('<div class="wrap" id="'+result.data.searchList[i].id+'">'
				+'<div class="proImg" style="background-image: url('+ result.data.searchList[i].imageLink +');">'
				+'<div class="proStatus">'
				+'<div class="statusDesc" style="background-image: url('+ descImg +');'+ colorStyle +'">'+ desc +'</div>'
				+'</div>'
				+'</div>'
				+'<div class="proDetail">'
				+'<div class="proName">'+ result.data.searchList[i].title +'</div>'
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
})

window.onload=function(){
	//针对ios不滚动的问题
	if(scrollHeight){
		$(window).scrollTop(scrollHeight);
	}
}
//获取url的参数
function getRequest() {
	var url = window.location.search; //获取url中"?"符后的字串
	var theRequest = new Object();
	if (url.indexOf("?") != -1) {
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i ++) {
			theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
		}
	}
	return theRequest;
}


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
