(function(doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            //固定宽度750px 基准像素30px
            docEl.style.fontSize = 30 * (clientWidth / 750) + 'px';
        };

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

var ajaxUrlAll={
    "cardList":"/coupon/h5/cardList",
    "couponList":"/coupon/h5/couponList",
    "couponCardDetail":'/coupon/h5/info'
};
function ajaxPost(url,data,successFunc,errorFunc){
    $.post(url,{data:JSON.stringify(data)},function(res){
        if(res.sc=='0'){
            successFunc(res);
        }else if(res.sc=="-99999"){
            errorPrompt("请稍后再试",2000);
        }else {
            if(errorFunc){
                errorFunc(res);
            }
        }
    });
}

//获取url的参数
function GetParams() {
    var queryString = window.location.search; //获取url中"?"符后的字串
    var params = {};
    if (queryString.indexOf("?") != -1) {
        queryString = queryString.substr(1);
        paramArray = queryString.split("&");
        for(var i = 0; i < paramArray.length; i ++) {
            kv = paramArray[i].split("=");
            params[kv[0]] = kv[1]
        }
    }
    return params;
}

function formatNum(num){//补0
    return num.toString().replace(/^(\d)$/, "0$1");
}

function formatStrDate(vArg){//格式化日期0-0-0
    switch(typeof vArg) {
        case "string":
            vArg = vArg.split(/-|\//g);
            return vArg[0] + "-" + formatNum(vArg[1]) + "-" + formatNum(vArg[2]);
            break;
        case "object":
            return vArg.getFullYear() + "-" + formatNum(vArg.getMonth() + 1) + "-" + formatNum(vArg.getDate());
            break;
    }
}

function formatStrDateNoYear(vArg){//格式化日期0-0
    switch(typeof vArg) {
        case "string":
            vArg = vArg.split(/-|\//g);
            return formatNum(vArg[1]) + "-" + formatNum(vArg[2]);
            break;
        case "object":
            return formatNum(vArg.getMonth() + 1) + "-" + formatNum(vArg.getDate());
            break;
    }
}

function newFormatStrDate(vArg,format){//格式化日期0-0-0,format 格式 - 或/
    switch(typeof vArg) {
        case "string":
            vArg = vArg.split(/-|\//g);
            return vArg[0] + format + formatNum(vArg[1]) + format + formatNum(vArg[2]);
            break;
        case "object":
            return vArg.getFullYear() + format + formatNum(vArg.getMonth() + 1) + format + formatNum(vArg.getDate());
            break;
    }
}
function newFormatStrDateNoYear(vArg,format){//格式化日期0-0,format 格式 - 或 /
    switch(typeof vArg) {
        case "string":
            vArg = vArg.split(/-|\//g);
            return formatNum(vArg[1]) + format + formatNum(vArg[2]);
            break;
        case "object":
            return formatNum(vArg.getMonth() + 1) + format + formatNum(vArg.getDate());
            break;
    }
}

function timeFormatSecond(vArg,format){//格式化时间0：0：0
    switch(typeof vArg) {
        case "object":
            return formatNum(vArg.getHours()) + format + formatNum(vArg.getMinutes()) + format + formatNum(vArg.getSeconds());
            break;
    }
}

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

//微信和app 接口区分
function h5orClient(url){
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        //这是微信浏览器
    }else{
        if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
            //这是iOS平台下浏览器
            if(/jihe/i.test(navigator.userAgent)){
                if(-1!=url.indexOf("/h5/")){
                    url=url.split("/h5/")[0]+"/client/"+url.split("/h5/")[1];
                }
                //这是iOS平台下浏览器
            }
        }
        if(/android/i.test(navigator.userAgent)){
            //这是Android平台下浏览器
        }
    }
    return url;
}

//列表页背景图
function hasBackground(reminder,top){
    var html='<div id="hasBackground"><div style="text-align:center;margin-top:'+top+';background:url(http://7xio74.com1.z0.glb.clouddn.com/blankPage.png) no-repeat center top/contain;height: 12rem;"></div><p style="text-align: center;margin-top: 2rem;color: #000;">'+reminder+'</p></div>';
    return html;
}

//start-分页页面返回到原先位置
/*参数 object={
    url:url,//分页请求接口的url
    data:data,//分页请求接口的data
    pagecnt:pagecnt,//分页每页个数
    classId:".searchwrap",//离开时页码所在容器
    lengthClassId:".wrap", //分页单个元素的class
    leaveState:"Leave",//离开的状态名称，每个分页要求不同
    pageNum:"Page",//离开时页码名称，每个分页要求不同
    originalHtml:"Html",//离开时html名称，每个分页要求不同
    originalScrollTop:"ScrollTop",//离开时移动高度名称，每个分页要求不同
    originalRequestRata:"AjaxData",//离开时保存已有请求数据的名称，每个分页要求不同
    originalAjaxData:ajaxData //离开时保存已有请求数据
};*/

//页面加载时执行；ajaxRequest当前页的ajax请求；callback回调函数（参数originalRequestRata,pageNum,pagecnt）
function listPageReturn(object,ajaxRequest,callback){
    if (sessionStorage.getItem(object.leaveState) == 1) {//检测到离开过页面则重新加载页面，并将状态归零
        var html = sessionStorage.getItem(object.originalHtml);
        var scrollTop = sessionStorage.getItem(object.originalScrollTop);
        $(object.classId).html(html);
        //$(window).scrollTop(scrollTop);
        sessionStorage.setItem(object.leaveState, "0");
        callback(object.originalRequestRata,object.pageNum,object.pagecnt);
        return scrollTop;
    }
    else {
        ajaxRequest(object.url,object.data);
    }
}

//页面链接离开时执行；object.originalAjaxData离开时要更新
function listPageSetItem(object){
    sessionStorage.setItem(object.leaveState, "1");
    sessionStorage.setItem(object.pageNum,Math.ceil($(object.lengthClassId).length/object.pagecnt));
    sessionStorage.setItem(object.originalHtml, $(object.classId).html());
    sessionStorage.setItem(object.originalScrollTop, $(window).scrollTop());
    sessionStorage.setItem(object.originalRequestRata,JSON.stringify(object.originalAjaxData));
}
//end-分页页面返回到原先位置

//错误提示
function errorPrompt(tishi,time){
    $("body").append('<div id="promptFun"></div>');
    $("#promptFun").css({"max-width":"18rem",
        "line-height": "1.3rem",
        "text-align": "center",
        "background": "#000",
        "color": "#fff",
        "border-radius": "0.7rem",
        "position": "fixed",
        "top": "40%",
        "left": "50%",
        "transform": "translate(-50%,-50%)",
        "z-index": "100",
        "padding": "0.5rem 1rem",
        "font-size": "1rem"}).html(tishi);
    setTimeout(function(){
        $("#promptFun").remove();
    },time);
}
function chinese(str){
    var ss=str.replace(/[^\u4e00-\u9fa5]/gi,"");
    return ss;
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

//把数字用，分隔开；s：数值；n保留小数位
function fmoney(s, n){
    n = n >= 0 && n <= 20 ? n : 2;
    s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    console.log(s);
    var l = s.split(".")[0].split("").reverse(),
        r = s.split(".")[1];
    t = "";
    for(i = 0; i < l.length; i ++ )
    {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    if(undefined==r){
        return t.split("").reverse().join("");
    }else{
        return t.split("").reverse().join("") + "." + r;
    }
}

//去掉时间的秒钟
function secondIsNon(time){
    if(time.split(":").length>=3){
        time=time.split(":")[0]+":"+time.split(":")[1];
    }
    return time;
}

//判断设备类型
function uaType() {
    var device = "";
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        device = 'weixin';
    }
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent) && /jihe/i.test(navigator.userAgent)) {
        device = 'iosApp';
    }
    if (ua.match(/WeiBo/i) == "weibo") {
        device = 'weibo';
    }
    if (ua.match(/AliPay/i) == "alipay") {
        device = 'alipay';
    }
    return device;
}