//使用: 
//var device = new Device(); 
//device.requestCommit(url, andrData);

function Device() {
    var requestData = "";
    this.setRequestData = function (_requestData) {
        requestData = _requestData;
    };
    this.getRequestData = function () {
        return requestData;
    }

//酒店/优惠内容骨架
//民宿结构
var bnbContent="<div class=pic><div class=\"picImg\"><img class=\"listImage\" src=\"\" /></div><p class=\"priceWrap\"><span class=\"plusPrice no\"></span><span class='price'>￥<strong></strong></span></p><div class=\"icon\"><img class=\"brand\" id=\"bnbIcon\" src=\"\"></div></div><p class=\"bnbName name\"></p><div class=tag></div></div>"
//会员商户
var memberContent="<div class=pic><div class=\"picImg\"><img class=\"listImage\" src=\"\" /></div><p class=\"priceWrap\"><span class=\"plusPrice no\"></span><span class='price'>￥<strong></strong></span><span class=\"no price\" id=\"unit\">会员<br>商户</span></p><div class=\"icon\"><img class=\"brand\" id=\"bnbIcon\" src=\"\"></div></div><p class=\"bnbName name\"></p><div class=tag></div></div>"
//酒店结构
var hotelContent = "<a class=\"hotelh5url\" href=\"#\"><img class=\"listImage\" src=\"\" /></a><img class=\"tips\" src=\"../h5_2.0/images/酒店.png\" /><a class=\"brandh5url\" href=\"#\"><img class=\"brand\" src=\"\"></a><span class=\"plusPrice no\"></span><p class='price otherPrice'>￥<strong></strong></p><p class=\"distant\"> </p><p class=\"hotelName name\"></p><div class=\"introHotel\"><p></p></div>"
//优惠结构
var productContent = "<img class=\"statusMark\" src=\"\" /><a class=\"discounth5url\" href=\"#\"><img class=\"listImage\" src=\"\" /></a><img class=\"tips\" src=\"../h5_2.0/images/优惠.png\" /><a class=\"brandh5url\" href=\"#\"><img class=\"brand\" src=\"\"></a><img class=\"nojihePlus\" src=\"\"/><img class=\"jihePlus\" src=\"\"/><p class=\"pricePlus\"><span class=\"unit\"></span></p><p class='price otherPrice'>￥<strong></strong><span class=\"unit\"></span></p><p class=\"distant\"> </p><p class=\"introDiscount name\"> </p><img class=\"rank\" src=\"\" /><p class=\"discountStatus\"></p>"

    this.requestCommit = function (allUrl, allData) {
        //var yon = window.hasOwnProperty("AndroidObj");
        var yon = jihe.hasOwnProperty("getHeaderData");
        // if START--------
        if(yon == false) {//若为false 则不在APP中...

            //-------------操作逻辑-------------

        }else {
        //若为true 在APP中...
            // var testHeader = jihe.getHeaderData(allData);
            //var testHeader = window.AndroidObj.getHeaderData(allData);
            var testHeader = jihe.getHeaderData(allData);
            var testHeaderdecoded = decodeURIComponent(testHeader);
            var obj = eval("(" + testHeaderdecoded + ")");
            $.ajax({
                type: 'POST',
                url: allUrl,
                async: false,
                data: {data:allData},
                beforeSend: function (XMLHttpRequest) {
                    XMLHttpRequest.setRequestHeader('apiversion', ''+obj.apiversion )
                    XMLHttpRequest.setRequestHeader('channel', ''+obj.channel)
                    XMLHttpRequest.setRequestHeader('location', ''+obj.location)
                    XMLHttpRequest.setRequestHeader('userid', ''+obj.userid)
                    XMLHttpRequest.setRequestHeader('uuid', ''+obj.uuid)
                    XMLHttpRequest.setRequestHeader('sign', ''+obj.sign)
                },
                success: function (data) {
                    document.title = JSON.stringify(data.data.shareInfo);
                    requestData = (data);
                    var str1 = JSON.stringify(data);
                    //-------------操作逻辑-------------
       $(document).ready(function(){
                $("#imgsAndText").prepend(data.data.topicBaseInfo.h5body);
                $("[name='picked']").removeAttr("style");
                for(var i=0;i<data.data.topicList.length;i++){
                    //判断为酒店
                    if(data.data.topicList[i].objectType == 1){
                        var $listAdd = $("<div class='list'></div>");
                        $("#listPlace").append($listAdd);
                        //判断是否为民宿
                        if(data.data.topicList[i].bnb){
                        	if(data.data.topicList[i].jiheBusinessMember==1){
                        		$("div.list:last").append(memberContent);
                        	}else{
                        		$("div.list:last").append(bnbContent);
                        	} 	    
	                        $("div.list:last").find(".listImage").attr("src",""+data.data.topicList[i].imageUrl);
	                        $("div.list:last").find(".price strong").prepend(data.data.topicList[i].price);
	                        $("div.list:last").find(".brand").attr("src",""+data.data.topicList[i].brandIcon);
	                        $("div.list:last").find(".bnbName").append(data.data.topicList[i].productName);
	                        $("div.list:last").find(".pic").click(function(){
                        	var index=$(this).parent().index();
                        	window.location=data.data.topicList[index].h5url;
                        	});
                        var ddl;
						if(data.data.topicList[i].tagInfoList.length>4){
							ddl=4;
						}
						else{
							var ddl=data.data.topicList[i].tagInfoList.length;
						}
						for(var j=0; j<ddl;j++){
							$("div.list:last").find(".tag").append('<span>'+data.data.topicList[i].tagInfoList[j].name+'</span>');
						}
						$(".tag span").click(function(event) {
							var ee=$(this).html()
							window.location="/static/weixinMinSu/list.html?tags="+ee
						});
                        }else{
                        	$("div.list:last").append(hotelContent); //判断是否为酒店
	                        //插入各项内容
	                        $("div.list:last").find(".hotelh5url").attr("href",""+data.data.topicList[i].h5url);
	                        $("div.list:last").find(".listImage").attr("src",""+data.data.topicList[i].imageUrl);
	                        $("div.list:last").find(".brand").attr("src",""+data.data.topicList[i].brandIcon);
	                        if(data.data.topicList[i].price == -1){
	                            $("div.list:last").find(".price").remove();		                                   
	                        }else{
	                            $("div.list:last").find(".price strong").prepend(data.data.topicList[i].price);
	                            if(data.data.topicList[i].pieces == 1){
	                                $("div.list:last").find("span.unit").prepend("&nbsp;"+"起"+"/"+"晚");
	                            }else{
	                                $("div.list:last").find("span.unit").prepend("&nbsp;"+"起"+"/"+data.data.topicList[i].pieces+"晚");
	                            }
	                            }
	                        $("div.list:last").find(".distant").append(data.data.topicList[i].distanceDesc);
	                        $("div.list:last").find(".hotelName").append(data.data.topicList[i].productName);
	                        if(data.data.topicList[i].productDesc){
	                            $("div.list:last").find(".introHotel p").append(data.data.topicList[i].productDesc);
	                        }else{
	                            $("div.list:last").find(".hotelName").addClass("movedown")
	                        }
                        }
                    }
                    //判断为优惠
                    else if(data.data.topicList[i].objectType == 2){
                        //插入优惠盒子
                        var $listAdd = $("<div class='list'></div>");
                        $("#listPlace").append($listAdd);
                        $("div.list:last").append(productContent);
                        //插入各项内容
                        $("div.list:last").find(".discounth5url").attr("href",""+data.data.topicList[i].h5url);
                        $("div.list:last").find(".listImage").attr("src",""+data.data.topicList[i].imageUrl);
                        //$("div.list:last").find(".brandh5url").attr("href",data.data.topicList[i].);
                        $("div.list:last").find(".brand").attr("src",""+data.data.topicList[i].brandIcon);
                        //判断几何PLUS状态
                        if(!data.data.topicList[i].plusPrice){
                            $("div.list:last").find(".nojihePlus").remove();
                            $("div.list:last").find(".jihePlus").remove();
                            $("div.list:last").find(".pricePlus").remove();
                        }else if(data.data.topicList[i].plusPrice == -1){
                            $("div.list:last").find(".jihePlus").remove();
                            $("div.list:last").find(".pricePlus").remove();
                            $("div.list:last").find(".nojihePlus").attr("src","../h5_2.0/images/几何PLUS用户享受更低价.png");
                        }else{
                            $("div.list:last").find(".nojihePlus").remove();
                            $("div.list:last").find(".jihePlus").attr("src","../h5_2.0/images/几何PLUS价%20.png");
                            $("div.list:last").find(".pricePlus").prepend(data.data.topicList[i].plusPrice);
                            if(data.data.topicList[i].pieces == 1){
                                $("div.list:last").find(".pricePlus span.unit").prepend("&nbsp;&nbsp;"+"起"+"/"+data.data.topicList[i].piecesUnit);
                            }else{
                                $("div.list:last").find(".pricePlus span.unit").prepend("&nbsp;&nbsp;"+"起"+"/"+data.data.topicList[i].pieces+data.data.topicList[i].piecesUnit);
                            }
                        }
                        //普通优惠价格
                        $("div.list:last").find(".price strong").prepend(data.data.topicList[i].price);
                        if(data.data.topicList[i].pieces == 1){
                            $("div.list:last").find(".price span.unit").prepend("&nbsp;"+"起"+"/"+data.data.topicList[i].piecesUnit);
                        }else{
                            $("div.list:last").find(".price span.unit").prepend("&nbsp;"+"起"+"/"+data.data.topicList[i].pieces+data.data.topicList[i].piecesUnit);
                        }
                        $("div.list:last").find(".distant").append(data.data.topicList[i].distanceDesc);
                        $("div.list:last").find(".introDiscount").append(data.data.topicList[i].productName);
                        //判断优惠等级
                        if(data.data.topicList[i].grade == 1){
                            $("div.list:last").find(".rank").attr("src","../h5_2.0/images/1.png");
                        }else if(data.data.topicList[i].grade == 2){
                            $("div.list:last").find(".rank").attr("src","../h5_2.0/images/2.png");
                        }else{
                            $("div.list:last").find(".rank").attr("src","../h5_2.0/images/3.png");
                        }
                        if(data.data.topicList[i].status == 1){
                            $("div.list:last").find(".statusMark").remove();
                            $("div.list:last").find(".discountStatus").append("活动进行中");
                        }else if(data.data.topicList[i].status == 2){
                            $("div.list:last").find(".statusMark").attr("src","../h5_2.0/images/优惠已结束.png");
                            $("div.list:last").find(".discountStatus").append("优惠已结束");
                        }else {
                            $("div.list:last").find(".statusMark").attr("src","../h5_2.0/images/优惠已售罄.png");
                            $("div.list:last").find(".discountStatus").append("优惠已售罄");
                        }

                    };

                };
            })

                  },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest.status+"/"+XMLHttpRequest.readyState);
                    alert("网络有点儿问题~~");
                    alert(allUrl);
                }

            })

        }
        // if END--------

    }
    //this.setRequestData  END-------

}
