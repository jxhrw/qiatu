var scrollHeight;
$(document).ready(function() {
	var url = "/search/h5search";
// var add=decodeURIComponent(tags)
// var string=add
// var search = string.split(",");
	var c = 1;
	var pageCount=0;//总页数
	var ajaxData=[];
	var data = {"pagecnt": "5", "pageno": c,"defaultQuery":"2"};
	var pagecnt=5;//每页的个数

	//参数说明在/html/member/js/general.js
	var parameter={
		url:url,
		data:data,
		pagecnt:pagecnt,
		classId:".searchwrap",
		lengthClassId:".wrap",
		leaveState:"weixinMinSuLeave",
		pageNum:"weixinMinSuPage",
		originalHtml:"weixinMinSuHtml",
		originalScrollTop:"weixinMinSuScrollTop",
		originalRequestRata:"weixinMinSuAjaxData",
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
		sessionImg(res);
		isLike();
		isComments();
		$(".searchwrap").removeClass('no');
		$(".tag span").click(function (event) {
			var ee = $(this).html()
			window.location.href = "list2.html?tags=" + ee;
		});
		$(".topic").click(function(event) {
			var ee=$(this).parents(".wrap").index();
			var nowPage=parseInt(ee/5);
			window.location.href=ajaxData[nowPage].data.searchList[ee-nowPage*5].object.wxDetailLink
		});
	}

	$(window).scroll(function () {
		var scrollTop = $(this).scrollTop();
		var scrollHeight = $(document).height();
		var windowHeight = $(this).height();
		if ($(".load").html() == "已经加载完" || c>=pageCount) {
			$(".load").html("已经加载完")
			return;
		}
		else {
			if (scrollTop + windowHeight == scrollHeight) {
				c++;
				var paramPage = {"pagecnt": "5", "pageno": c,"defaultQuery":"2"};
				ajaxRequest(url,paramPage);
			}
		}

	});

	$(".wrap,.picImg,.proImg,.tag span,.proComment,.topic").live("click", function () {
		parameter.originalAjaxData=ajaxData;
		listPageSetItem(parameter)
	});

	function isLike() {
		$(".proLike").click(function () {
			var val = $(this).attr("value");
			var paramLike = {"productid": $(this).parents(".wrap").attr("id"), "favtype": "3"};
			if ($(this).hasClass("liked")) {
				$.post(h5orClient('/user/h5/setfavorite'), {data: JSON.stringify(paramLike)}, function (res) {

				});
				val--;
				$(this).attr("value", val);
				$(this).removeClass("liked").html(val > 999 ? "999+" : val);
			}
			else {
				$.post(h5orClient('/user/h5/setfavorite'), {data: JSON.stringify(paramLike)}, function (res) {

				});
				val++;
				$(this).attr("value", val);
				$(this).addClass("disabled").addClass("liked").html(val > 999 ? "999+" : val);
				$(".hasLike").show(300);
				setTimeout(function () {
					$(".hasLike").hide();
					$(".proLike").removeClass("disabled");
				}, 1200);
				return false;//阻止事件冒泡
			}
		});

		$("body").live("touchstart", function () {
			$(".hasLike").hide();
		});
	}

	function isComments() {
		$(".proComment").click(function () {
			if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && /jihe/i.test(navigator.userAgent)) {
				var data1 = {"productId": $(this).parents(".wrap").attr("id"), "act": "toComment"};
				var url = "http://www.jihelife.com?data=" + JSON.stringify(data1);
				iosBridgeObjc(url);
			}
			else {
				window.location.href = '/html/comments/comments.html?productId=' + $(this).parents(".wrap").attr("id") + '&title=' + $(this).parents(".wrap").find(".proName").html();
			}
		});
	}

	function addModel1(result, i, topicDesc, brandIcon, statusInfo) {
		if(undefined==brandIcon){
			brandIcon="";
		}
		$(".searchwrap").removeClass('no').append('<div class="wrap"><div class="pic"><div class="picImg"><img src="' + result.data.searchList[i].imageLink + '" alt=""></div><div class="topic no"><p class="topicTitle">' + result.data.searchList[i].title + '</p><span class="topicdesc">' + topicDesc + '</span></div><div class="priceWrap"><span class="plusPrice no">几何PLUS价<em>￥<strong>1200</strong>/2晚</em></span><span class="price" id="price"></span><span class="price no" id="price1" style="background-color:rgb(180,139,74) ;display:inline-block;height: 2.4rem;vertical-align: middle;">会员<br/>商户</span><span class="noPlus no"><em>几何PLUS用户</em>享受更低价</span></div><div class="icon"><img src="' + brandIcon + '" alt=""></div></div><div class="promotion no"><div class="promotionLeft"><div class="promotionLeftCon"><span>优惠</span><i></i></div></div><div class="promotionRight"><span class="time">' + statusInfo + '</span></div></div><div class="title">' + result.data.searchList[i].title + '</div><div class="tag no"></div><div class="desc no"></div></div> ');
	}

	function addModel2(result, i) {
		var desc = '';
		var descImg = '';
		var effectiveTime = parseInt(result.data.searchList[i].object.saleBegintime);
		var expiredTime = parseInt(result.data.searchList[i].object.saleEndtime);
		var usCommentsNum = result.data.searchList[i].object.usCommentsNum;
		var usFavoritesNum = result.data.searchList[i].object.usFavoritesNum;
		var usCommentsNum2 = usCommentsNum > 999 ? "999+" : usCommentsNum;
		var usFavoritesNum2 = usFavoritesNum > 999 ? "999+" : usFavoritesNum;
		var status = result.data.searchList[i].object.favoriteInfoList[2].status;
		var proLikeClass = "proLike";
		var colorStyle = "";
		var briefDesc = !result.data.searchList[i].object.briefDesc ? "" : result.data.searchList[i].object.briefDesc;
		if (Date.parse(new Date()) < effectiveTime) {
			descImg = 'http://7xio74.com1.z0.glb.clouddn.com/virtualList/waiting.png';
			desc = ((new Date(effectiveTime)).getMonth() + 1) + '月' + (new Date(effectiveTime)).getDate() + '日' + (new Date(effectiveTime)).getHours() + ':' + (new Date(effectiveTime)).getMinutes() + '开始';
		} else if (Date.parse(new Date()) > expiredTime) {
			descImg = 'http://7xio74.com1.z0.glb.clouddn.com/virtualList/end.png';
			desc = '已结束';
		} else {
			descImg = 'http://7xio74.com1.z0.glb.clouddn.com/virtualList/saleing.png';
			desc = ((new Date(expiredTime)).getMonth() + 1) + '月' + (new Date(expiredTime)).getDate() + '日' + '结束';
		}
		if (status == 1) {
			proLikeClass = "proLike liked";
		}
		$(".searchwrap").removeClass('no').append('<div class="wrap" id="' + result.data.searchList[i].id + '">'
				+ '<div class="proImg" style="background-image: url(' + result.data.searchList[i].imageLink + ');">'
				+ '<div class="proStatus">'
				+ '<div class="statusDesc" style="background-image: url(' + descImg + ');' + colorStyle + '">' + desc + '</div>'
				+ '</div>'
				+ '</div>'
				+ '<div class="proDetail">'
				+ '<div class="proName">' + result.data.searchList[i].title + '</div>'
				+ '<div class="proDesc">' + briefDesc + '</div>'
				+ '<div class="proOperate">'
				+ '<div class="' + proLikeClass + '" value="' + usFavoritesNum + '">' + usFavoritesNum2 + '</div>'
				+ '<div class="proComment">' + usCommentsNum2 + '</div>'
				+ '</div>'
				+ '</div></div> ');
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

	function ajaxRequest(url,paramPage){
		$.post(url,{data: JSON.stringify(paramPage)},function (result) {
			console.debug(result);
			if(result.sc==0){
				pageCount=Math.ceil(result.data.totalCount/5);
				ajaxData.push(result);
			}
			if (result.data.searchList == undefined) {
				//recommend appl里最多显示5条推荐
				$(".recommendWrap").removeClass('no');
				$(".load").addClass('no')
			}
			else {
				listEach(result);
				if (result.data.searchList.length < 5) {
					$(".load").html("已经加载完");
				}
				listSingle(result,c);
				isLike();
				isComments();
			}
		})
	}

	function listEach(result){
		$.each(result.data.searchList, function (i) {
			var topicDesc;
			var brandIcon;
			var statusInfo;
			if (result.data.searchList[i].object == undefined) {
				topicDesc = "";
			}
			else {
				if (result.data.searchList[i].object.topicDesc != undefined) {
					topicDesc = result.data.searchList[i].object.topicDesc
				}
				else if (result.data.searchList[i].object.brandIcon != undefined) {
					brandIcon = result.data.searchList[i].object.brandIcon
				}
				else if (result.data.searchList[i].object.statusInfo != undefined) {
					statusInfo = result.data.searchList[i].object.statusInfo
				}
				else {
					topicDesc = "";
					brandIcon = "";
					statusInfo = "";
				}
			}
			if (result.data.searchList[i].resType == 31) {
				addModel2(result, i);
			}
			else {
				addModel1(result, i, topicDesc, brandIcon, statusInfo);
			}
		});
	}

	function listSingle(result,c,session){
		var d = c - 1;
		for (var a = 0; a < result.data.searchList.length; a++) {
			if (result.data.searchList[a].resType == 2) {
				$(".wrap").eq(a + d * 5).children('.promotion').removeClass('no');
				$(".wrap").eq(a + d * 5).children('.pic').children('.topic').remove();
				$(".wrap").eq(a + d * 5).children('.tag').remove();
				$(".wrap").eq(a + d * 5).children('.desc').remove();
				if (result.data.searchList[a].object.gradeLevel == 1) {
					$(".wrap").eq(a + d * 5).children('.promotion').children('.promotionLeft').children('.promotionLeftCon').children('i').addClass('huasuan');
				}
				else if (result.data.searchList[a].object.gradeLevel == 2) {
					$(".wrap").eq(a + d * 5).children('.promotion').children('.promotionLeft').children('.promotionLeftCon').children('i').addClass('chaozhi');
				}
				else {
					$(".wrap").eq(a + d * 5).children('.promotion').children('.promotionLeft').children('.promotionLeftCon').children('i').addClass('zhenhan');
				}
				if (result.data.searchList[a].object.promPriceDays == 1) {
					$(".wrap").eq(a + d * 5).children('.pic').children('.priceWrap').children('#price').html('￥<strong>' + result.data.searchList[a].price + '</strong>');
				}
				else {
					$(".wrap").eq(a + d * 5).children('.pic').children('.priceWrap').children('#price').html('￥<strong>' + result.data.searchList[a].price + '</strong>/' + result.data.searchList[a].object.promPriceDays + result.data.searchList[a].object.priceUnit)
				}
				if (result.data.searchList[a].object.status != 1) {
					$(".wrap").eq(a + d * 5).children('.promotion').children('.promotionRight').children('.time').css('background', 'none');
				}
				if (result.data.searchList[a].object.statusInfo == undefined) {
					$(".wrap").eq(a + d * 5).children('.promotion').children('.promotionRight').children('.time').css('display', 'none');
				}
				//会员价还没弄

			}

			else if (result.data.searchList[a].resType == 3) {
				//主题
				$(".wrap").eq(a + d * 5).children('.pic').children('.topic').removeClass('no');
				$(".wrap").eq(a + d * 5).children('.pic').children('.priceWrap').remove();
				$(".wrap").eq(a + d * 5).children('.pic').children('.icon').remove();
				$(".wrap").eq(a + d * 5).children('.promotion').remove();
				$(".wrap").eq(a + d * 5).children('.title').remove();
				$(".wrap").eq(a + d * 5).children('.tag').remove();
				$(".wrap").eq(a + d * 5).children('.desc').remove();
				$(".topic").click(function(event) {
					var ee=$(this).parents(".wrap").index();
					window.location.href=result.data.searchList[ee-d*5].object.wxDetailLink;
				});
			}
			else if (result.data.searchList[a].resType == 30) {
				//虚拟产品
				$(".wrap").eq(a + d * 5).find('.topic').removeClass('no');
				$(".wrap").eq(a + d * 5).find('.icon').remove();
				$(".wrap").eq(a + d * 5).find('.promotion').remove();
				$(".wrap").eq(a + d * 5).find('.title').remove();
				$(".wrap").eq(a + d * 5).find('.tag').remove();
				$(".wrap").eq(a + d * 5).find('.desc').remove();
				$(".wrap").eq(a + d * 5).find('.topic').remove();
				if (result.data.searchList[a].object.productPrice.priceType == 1) {
					$(".wrap").eq(a + d * 5).children('.pic').children('.priceWrap').children('#price').html('<strong>' + result.data.searchList[a].object.productPrice.totalPointPrice + '</strong> 积分');
				}
				else if (result.data.searchList[a].object.productPrice.priceType == 0) {
					$(".wrap").eq(a + d * 5).children('.pic').children('.priceWrap').children('#price').html('￥<strong>' + result.data.searchList[a].price + '</strong>');
				}
				if (undefined == $(".wrap").eq(a + d * 5).find('.priceWrap').find("strong").html()) {
					$(".wrap").eq(a + d * 5).children('.pic').children('.priceWrap').children('.price').remove();
				}
			}
			else {
				//有民宿和酒店
				$(".wrap").eq(a + d * 5).children('.pic').children('.priceWrap').children('#price').html('￥<strong>' + result.data.searchList[a].price + '</strong>');
				//直接展示一句话
				$(".wrap").eq(a + d * 5).children('.pic').children('.topic').remove();
				$(".wrap").eq(a + d * 5).children('.promotion').remove();
				if (result.data.searchList[a].sellerType == 1) {
					$(".wrap").eq(a + d * 5).children('.tag').removeClass('no');
					if (result.data.searchList[a].inUnion == 1) {
						$(".wrap").eq(a + d * 5).children('.pic').children('.priceWrap').children('#price1').removeClass('no');
						$(".wrap").eq(a + d * 5).children('.pic').children('.priceWrap').children('#price').css({
							'display': 'inline-block',
							'height': '2.4rem',
							'vertical-align': 'middle'
						});
					}

				}
				else {
					/*		$(".wrap").eq(a+d*5).children('.desc').removeClass('no').html(result.data.searchList[a].object.brief);				*/
					if (result.data.searchList[a].sellerType == 2) {
						$(".wrap").eq(a + d * 5).children('.tag').removeClass('no');
						$(".wrap").eq(a + d * 5).children('.pic').children('.priceWrap').children('#price').remove();
						if (result.data.searchList[a].inUnion == 1) {
							$(".wrap").eq(a + d * 5).children('.pic').children('.priceWrap').children('#price1').removeClass('no');

						}
					}

				}
			}

			if (result.data.searchList[a].object.productPrice && result.data.searchList[a].object.productPrice.priceType==1) {
				$(".wrap").eq(a + d * 5).children('.pic').children('.priceWrap').children('#price').html('<strong>' + result.data.searchList[a].object.productPrice.showAvgPrice + '</strong>积分');
			}

			var ddl;
			if (undefined!=result.data.searchList[a].tags && result.data.searchList[a].tags.length > 4) {
				ddl = 4;
			}
			else if (undefined!=result.data.searchList[a].tags){
				ddl = result.data.searchList[a].tags.length;
			}
			else {
				ddl=0;
			}
			var tagHtml="";
			for (var b = 0; b < ddl; b++) {
				if (result.data.searchList[a].tags[b] != "其他" && result.data.searchList[a].tags[b] != "民宿") {
					tagHtml+='<span>' + result.data.searchList[a].tags[b] + '</span>';
				}
			}
			$(".wrap").eq(a + d * 5).children('.tag').html(tagHtml);
			$(".tag span").click(function (event) {
				var ee = $(this).html()
				window.location.href = "list2.html?tags=" + ee;
				//return false;
			});
		}
		if(session=="1"){
			sessionImg(result);
		}else {
			ajaxImg(result,d);
		}
	}

	function ajaxImg(result,d){
		var ua = window.navigator.userAgent.toLowerCase();
		if (/jihe/i.test(navigator.userAgent) && /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
			$(".picImg,.proImg").click(function (event) {
				var ee = $(this).parents('.wrap').index();
				window.location.href = result.data.searchList[ee - d * 5].h5url
			});//这是iOS平台下浏览器
		}
		else {
			$(".picImg,.proImg").click(function (event) {
				var ee = $(this).parents('.wrap').index();
				window.location.href = result.data.searchList[ee - d * 5].object.wxDetailLink
			});
		}
	}

	function sessionImg(ajaxData){
		var ua = window.navigator.userAgent.toLowerCase();
		if (/jihe/i.test(navigator.userAgent) && /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
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
});

window.onload=function(){
	//针对ios不滚动的问题
	if(scrollHeight){
		$(window).scrollTop(scrollHeight);
	}
}