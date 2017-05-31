$(document).ready(function() {
	var type2Name=[];//现金抵用券券名
	var type2Code=[],testArr=[];//现金抵用券code
	var type5Code=[];//优惠券code
	var type5Name=[];//优惠券券名
	var type5Remark=[];
    var remark2Arr=[];
    var paymentsArr=[];
    var arr=[];
    var arr0=[];
    var arr2=[];
    var arr3=[];
    var arr4=[];
    var data={"orderid":orderid};
    var winHeight=$(window).height();
    var ordername,quantity,nights,amount; //房型，数量，几晚，总价
    $(".orderDetailPopup").css("height",winHeight);
    $.post('/order/bmsh5/info', {data: JSON.stringify(data)},  function(data) {
        console.log(data)
        ordername=data.data.ordername;
        quantity=data.data.quantity;
        nights=data.data.nights;
        amount=data.data.amount/100;
        if(data.sc==0){
            $(".memberinfo li").eq(0).children("span").eq(0).html(data.data.customerName)
            $(".memberinfo li").eq(0).children("span").eq(1).html(data.data.customerMobile)
            if(data.data.memberGrade==0){
                $(".memberinfo li").eq(0).children("span").eq(2).html("金卡会员")
            }
            else if(data.data.memberGrade==1){
                $(".memberinfo li").eq(0).children("span").eq(2).html("白金会员")
            }
            else if(data.data.memberGrade==2){
                $(".memberinfo li").eq(0).children("span").eq(2).html("黑卡会员")
            }

            if(data.data.comments){
                $(".memberinfo li").eq(1).html(data.data.comments)
            }
            $(".productinfo li").eq(0).html(data.data.ordername)
            $(".productinfo li").eq(2).children("strong").html(data.data.orderid)
            if(data.data.paidTime){

                // var createtime=formatStrDate(new Date(parseInt(data.data.paidTime)))
                var createtime=getDate(parseInt(data.data.paidTime/1000))
                $(".productinfo li").eq(3).children("strong").html(createtime)


            }
            $(".productinfo li").eq(4).children("strong").html(formatStrDate(new Date(parseInt(data.data.checkin))))
            $(".productinfo li").eq(5).children("strong").html(formatStrDate(new Date(parseInt(data.data.checkout))))
            $(".productinfo li").eq(6).children("strong").html(data.data.quantity+"间")
            $(".priceinfo li").eq(0).children("strong").html("￥"+data.data.amount/100)

            for (var i =0; i < data.data.settlePayments.length; i++) {
                //1是房券，2是现金抵用券，3是积分兑房，4是积分抵现，5是优惠券
                if(data.data.settlePayments[i].payType==1){//房券
                    arr.push(data.data.settlePayments[i].amount/100);
                    testArr.push([data.data.settlePayments[i].couponCode,data.data.settlePayments[i].couponName,data.data.settlePayments[i].amount/100,data.data.settlePayments[i].couponRemark]);
					//type2Name.push(data.data.settlePayments[i].couponName);
                    //type2Code.push(data.data.settlePayments[i].couponCode);
                   //$(".voucher").eq(1).append("<li><div><span>"+data.data.settlePayments[i].couponName+"</span><strong>"+"-￥"+data.data.settlePayments[i].amount/100+"</strong></div></li>");                    // $(".priceinfo li").eq(1).children("strong").html("-￥"+data.data.settlePayments[i].amount/100)
                    //alert(arr)
                }
                else if(data.data.settlePayments[i].payType==2){                 	
                    arr.push(data.data.settlePayments[i].amount/100);
                    //type2Code.push(data.data.settlePayments[i].couponCode);
					//type2Name.push(data.data.settlePayments[i].couponName);
                    //remark2Arr.push(data.data.settlePayments[i].couponRemark);
                    testArr.push([data.data.settlePayments[i].couponCode,data.data.settlePayments[i].couponName,data.data.settlePayments[i].amount/100,data.data.settlePayments[i].couponRemark]);
                    //codeArr.push(data.data.settlePayments[i].couponCode);
                    //$(".priceinfo li").eq(1).children("strong").html("-￥"+data.data.settlePayments[i].amount/100)                              	
                }
                else if(data.data.settlePayments[i].payType==0){
                    arr0.push(data.data.settlePayments[i].amount/100)
                    // $(".priceinfo li").eq(4).children("strong").html("￥"+data.data.settlePayments[i].amount/100)
                }
                else if(data.data.settlePayments[i].payType==3){
                    arr2.push(data.data.settlePayments[i].amount/100)
                    // $(".priceinfo li").eq(2).children("strong").html("-￥"+data.data.settlePayments[i].amount/100)
                }
                else if(data.data.settlePayments[i].payType==4){
                    arr3.push(data.data.settlePayments[i].amount/100)
                    // $(".priceinfo li").eq(3).children("strong").html("-￥"+res.data.settlePayments[i].amount/100)
                }
                else if(data.data.settlePayments[i].payType==5 || data.data.settlePayments[i].payType==7){//折扣券
                    arr4.push(data.data.settlePayments[i].amount/100);
                    type5Code.push(data.data.settlePayments[i].couponCode); 
					type5Name.push(data.data.settlePayments[i].couponName);
                    type5Remark.push(data.data.settlePayments[i].couponRemark);  
                   
                    //$(".voucher").eq(0).append("<li><div><span>"+data.data.settlePayments[i].couponName+"</span><strong>"+"-￥"+data.data.settlePayments[i].amount/100+"</strong></div></li>");                  
                    // $(".priceinfo li").eq(3).children("strong").html("-￥"+res.data.settlePayments[i].amount/100)
                }
                
            }
            //console.log(type2Code);
            console.log(type5Code);
            console.log(type5Remark)
            console.log(paymentsArr);
            console.log(remark2Arr);
            var xarr=[],values=[];
            xarr.sort();
            testArr.sort();
            for(var s=0;s<testArr.length;s++){
                xarr.push(testArr[s][0]);
                type2Name.push(testArr[s][1]);
                values.push(testArr[s][2]);
                remark2Arr.push(testArr[s][3]);
            }
            console.log(xarr);
            type2Code=xarr;
            console.log(testArr);
            console.log(type2Code);
/*            var arrsb=xarr/!*estArr*!/;
            var xxnewArr = [],
                xxtempArr = [];
            var newValues=[];
            for(var i=0,j=arrsb.length;i<j;i++){
                if(arrsb[i] == arrsb[i+1]){
                    xxtempArr.push(testArr[i][1]);
                    xxtempArr.push(testArr[i][1]);
                } else {
                    xxtempArr.push(testArr[i][1]);
                    xxnewArr.push(xxtempArr.slice(0));
                    xxtempArr.length = 0;
                }
            }
            console.log(xxnewArr);
            for(var sb=0;sb<xxnewArr.length;sb++){
                    console.log(newValues[sb]);
            }*/
/*
            for(var sb=0;sb<xxnewArr.length;sb++){
                $(".voucher2").append("<li><div><span>"+couponNames[sb]+"</span>&nbsp;<strong>"+"-￥"+floatFixed2(newValues[sb])+"</strong></div><p>"+couponRemarks[sb]+"</p></li>");
            }
*/
            /*
                        type2Code.sort();
                        for(var i=0;i<type2Code.length-1;i++)
                        {if (type2Code[i]==type2Code[i+1])
                        {console.log("重复内容："+type2Code[i]);}
                        }
            */
            function unique(array){
                var r = [];
                for(var i = 0, l = array.length; i < l; i++) {
                    for(var j = i + 1; j < l; j++)
                        if (array[i] === array[j]) j = ++i;
                    r.push(array[i]);
                }
                return r;
            }
            console.log(unique(remark2Arr));
            /*console.log(type2Code);
            //console.log(type2Name);
            console.log(type5Code);
            console.log(arr);
            console.log(arr0);
            console.log(arr2);
            console.log(arr3);
            console.log(arr4);*/

			var as=values/*arr*/;
			var as2=type2Name;
			var newa = [],
			newa2=[],
			tempArr = [],
			tempArr2=[];
            //type2Code.sort();
            //console.log(type2Code);
            for(var i=0,j=as.length;i<j;i++){//通过券码（couponCode）得到同一张券优惠的价格
			    if(type2Code[i] == type2Code[i+1]){
			        tempArr.push(as[i]);
			        tempArr2.push(as2[i]);
			    } else {
			        tempArr.push(as[i]);
			        tempArr2.push(as2[i]);
			        newa.push(tempArr.slice(0));
			        newa2.push(tempArr2.slice(0));
			        tempArr.length = 0;
			        tempArr2.length = 0;
			    }
			}
			console.log(newa.length);
            console.log(tempArr);
			var price;
			var prices=[];
			var cpname=[];
			var cpnames=[];
			var cpPrices=[];
			for(var i=0;i<newa.length;i++){
				//console.log(newa[i]);
				//console.log(newa2[i]);
				cpname=newa2[i][0];
				price=floatFixed2(eval(newa[i].join('+')));
				//console.log(price);
				//console.log(cpname);
				prices.push(price);
				cpnames.push(cpname);
			}
			console.log(prices);
			console.log(cpnames);

			 var newPrices = [],
			     tempArr = [];
			 for(var i=0,j=cpnames.length;i<j;i++){
			    if(cpnames[i] == cpnames[i+1]){
			        tempArr.push(prices[i]);
			    } else {
			        tempArr.push(prices[i]);
			        newPrices.push(tempArr.slice(0));
			        tempArr.length = 0;
			    }
			}
			//console.log(newPrices);
			for(var i=0;i<newPrices.length;i++){
			 	cpPrices.push(eval(newPrices[i].join('+')));
			}
			console.log(cpPrices);
			var array = cpnames;
	        var count = 1;
	        var yuansu= new Array();//存放数组array的不重复的元素比如{4,5,7,8,2,67,89,}
	        var sum = new Array(); //存放数组array中每个不同元素的出现的次数
	        for (var i = 0; i < array.length; i++) { 
	            for(var j=i+1;j<array.length;j++)
	            {
	                if (array[i] == array[j]) {
	                    count++;//用来计算与当前这个元素相同的个数
	                    array.splice(j, 1); //没找到一个相同的元素，就要把它移除掉，
	                    j--; 
	                }
	            }
	            yuansu[i] = array[i];//将当前的元素存入到yuansu数组中
	            sum[i] = count;  //并且将有多少个当前这样的元素的个数存入sum数组中
	            count =1;  //再将count重新赋值，进入下一个元素的判断
	        }
	        var str = '';
        //算出array数组中不同的元素出现的次数
	        for (var i = 0; i < yuansu.length; i++) {//礼券的动态添加 
	            str+=yuansu[i]+"出现的次数为："+sum[i]+"<br/>";
                var ride;
                if(data.data.settlePayments[i].payType==2){
                    ride="";
                }
                else {
                    ride="x"+sum[i];
                }

                $(".voucher2").append("<li><div><span>"+cpnames[i]+"</span>&nbsp;<span id=number>"+ride+"</span><strong>"+"-￥"+floatFixed2(cpPrices[i])+"</strong></div><p>"+unique(remark2Arr)[i]+"</p></li>");

	        }
	        //console.log(str);
	        
            for(var j=0;j<data.data.settlePayments.length;j++){//优惠券的动态添加
            	if(data.data.settlePayments[j].payType==5 || data.data.settlePayments[j].payType==7){
            		$(".priceinfo>li").eq(1).append("<span>优惠券</span>");
					$(".voucher1").append("<li><div><span>"+type5Name[0]+"</span><span id=bnumber>"+"x1"+"</span><strong>"+"-￥"+eval(arr4.join('+'))+"</strong></div><p>"+type5Remark[0]+"</p></li>");
					break;
            	}
            }
			for(var i=0;i<data.data.settlePayments.length;i++){
            	if(data.data.settlePayments[i].payType==2||data.data.settlePayments[i].payType==1){
					$(".priceinfo>li").eq(2).append("<span>礼券</span>");
					break;
            	}
 			}
    		function remark(mark){//获取礼券详情
	        	if(mark in data.data.settlePayments[0]){
	        		return data.data.settlePayments[0].couponRemark;
	        	}else{
	        		return "";
	        	}
	        }

            amountDi=0
            for (var a= 0; a< arr.length; a++) {
                amountDi += arr[a];
            }
            amountDi0=0
            for (var a= 0; a< arr0.length; a++) {
                amountDi0 += arr0[a];
            }
            amountDi2=0
            for (var a= 0; a< arr2.length; a++) {
                amountDi2 += arr2[a];
            }
            amountDi3=0
            for (var a= 0; a< arr3.length; a++) {
                amountDi3 += arr3[a];
            }
            amountDi4=0
            for (var a= 0; a< arr4.length; a++) {
                amountDi4 += arr4[a];
            }
/*            if (arr.length!=0) {
                $(".priceinfo li").eq(2).children("strong").html("-￥"+floatFixed2(amountDi));
            }
*/            if (arr0.length!=0) {
                $(".priceinfo>li").eq(5).children("strong").html("￥"+floatFixed2(amountDi0));
            }
            if (arr2.length!=0) {
                $(".priceinfo>li").eq(3).children("strong").html("-￥"+floatFixed2(amountDi2));
            }else{$(".priceinfo>li").eq(3).hide();}
            if (arr3.length!=0) {
                $(".priceinfo>li").eq(4).children("strong").html("-￥"+floatFixed2(amountDi3));
            }else{$(".priceinfo>li").eq(4).hide();}
/*            if (arr4.length!=0) {
                $(".priceinfo li").eq(1).children("strong").html("-￥"+floatFixed2(amountDi4));
            }
*/
//判断订单状态 -1未创建 0待提交 1代确认房态 2房态确认处理中 3待支付 4支付中 5已支付 6预定处理中 8已确认【预订】11已发货 12交易完成 9 已取消


            if(data.data.status==9||data.data.status==11||data.data.status==12||data.data.status==8){
                $(".footer").hide();
                $(".header").show();
            }
            else{
                $(".footer").show();
                $(".header").hide();
            }
            // $(".header h1").html()
            if(data.data.closereson){
                $(".header h1").html(data.data.statedesc+"("+data.data.closereson+")")
            }
            else{
                $(".header h1").html(data.data.statedesc)
            }
            if(data.data.cancelFrom){
                $(".header").show()
                if(data.data.cancelFrom==1){
                    // alert("aaa")

                    $(".header p").html("请及时去PMS更新您的房态信息")
                }
            }
            // if(data.data.status==9||data.data.status==11||data.data.status==12){
            //      $(".header").show()
            //  }
            //  else{
            //      $(".header").hide()
            //  }



            // $(".priceinfo li").eq(1).children("strong").html("￥"+data.data.amount)


        }
    });

    $(".footer .noRoom").click(function(){
        $(".popup1").show();
    });

    $(".orderDetailPopup .popupTitle i").click(function(){
        $(".orderDetailPopup").hide();
    });

    $(".footer .hasRoom").click(function(){
        $(".orderDetailPopup .sure .name").html(ordername);
        $(".orderDetailPopup .sure .number").html(quantity+"间");
        $(".orderDetailPopup .sure .night").html(nights+"晚");
        $(".orderDetailPopup .sure .price").html(amount);
        $(".popup2").show();
    });

    //bookresult  0:无房拒绝,2:价格错误原因拒绝,3:其他原因拒绝,1:预定成功
    $(".orderDetailPopup .confirm").click(function(){
        var data1={"orderid":orderid,'bookresult':1};
        $.post('/order/bmsh5/bookresult', {data: JSON.stringify(data1)},  function(data) {
            console.log(data);
            if(data.sc==0){
                // alert("aaa12")
                location.reload()
            }
        })
    });

    $(".orderDetailPopup .noneRoom").click(function(){
        var data1={"orderid":orderid,'bookresult':0};
        $.post('/order/bmsh5/bookresult', {data: JSON.stringify(data1)},  function(data) {
            console.log(data);
            if(data.sc==0){
                // alert("aaa12")
                location.reload()
            }
        })
    });

    $(".orderDetailPopup .errorPrice").click(function(){
        var data1={"orderid":orderid,'bookresult':2};
        $.post('/order/bmsh5/bookresult', {data: JSON.stringify(data1)},  function(data) {
            console.log(data);
            if(data.sc==0){
                // alert("aaa12")
                location.reload()
            }
        })
    });

    $(".orderDetailPopup .otherReason").click(function(){
        var data1={"orderid":orderid,'bookresult':3};
        $.post('/order/bmsh5/bookresult', {data: JSON.stringify(data1)},  function(data) {
            console.log(data);
            if(data.sc==0){
                // alert("aaa12")
                location.reload()
            }
        })
    });

    //点击阴影关闭弹窗
    $(".kong").css("height",$(".orderDetailPopup").height()-$(".popupBox").height()).click(function(){
        $(".orderDetailPopup").hide();
    });
});
function getDate(nS) {
    var Begin= new Date(parseInt(nS)* 1000);
    var Beginy = Begin.getFullYear(); //获取完整的年份(4位,1970-????)
    var Beginm = Begin.getMonth() + 1; //获取当前月份(0-11,0代表1月)
    var Begind = Begin.getDate();
    var hour=Begin.getHours();
    var minute=Begin.getMinutes();
    var second=Begin.getSeconds();
    return Beginy+"/"+Beginm+"/"+Begind +" &nbsp;&nbsp;&nbsp;&nbsp; "+hour+":"+ minute +":"+ second;
    // return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "/").replace(/日/g, " ");
}
function formatNum(num){//补0
    return num.toString().replace(/^(\d)$/, "0$1");
}
function formatStrDate(vArg){//格式化日期
    switch(typeof vArg) {
        case "string":
            vArg = vArg.split(/-|\//g);
            return vArg[0] + "-" + formatNum(vArg[1]) + "-" + formatNum(vArg[2]);
            break;
        case "object":
            return vArg.getFullYear() + "/" + formatNum(vArg.getMonth() + 1) + "/" + formatNum(vArg.getDate());
            break;
    }
}
//超出两位保留两位有效数字
function floatFixed2(res){
    if(res.toString().indexOf(".")) {
        if (res.toString().split(".")[1]) {
            if(res.toString().split(".")[1].length>2){
                if (res.toString().split(".")[1] / 1 == 0) {
                    return res*1;
                }else {
                    return res.toFixed(2);
                }
            }else {
                return res;
            }
        }else {
            return res;
        }
    }else {
        return res;
    }
}