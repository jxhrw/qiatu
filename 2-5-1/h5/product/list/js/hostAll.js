//url处理
var url = location.href;
host='http://'+window.location.host;
root=window.location.pathname;
h=$(window).height();
/*alert(root);*/
function getParameter(paraStr, url)
{
    var result = "";
    //获取URL中全部参数列表数据
    var str = "&" + url.split("?")[1];
    /*var stri=url.split("?")[1];
    alert(stri);*/
    var paraName = paraStr + "=";
    //判断要获取的参数是否存在
    if(str.indexOf("&"+paraName)!=-1)
    {
        //如果要获取的参数到结尾是否还包含“&”
        if(str.substring(str.indexOf(paraName),str.length).indexOf("&")!=-1)
        {
            //得到要获取的参数到结尾的字符串
            var TmpStr=str.substring(str.indexOf(paraName),str.length);
            //截取从参数开始到最近的“&”出现位置间的字符
            result=TmpStr.substr(TmpStr.indexOf(paraName),TmpStr.indexOf("&")-TmpStr.indexOf(paraName));
        }
        else
        {
            result=str.substring(str.indexOf(paraName),str.length);
        }
    }
    else
    {
        result="无此参数";
    }
    return (result.replace("&",""));
}
var r = getParameter("id",url);
id =r.substring(r.lastIndexOf('=')+1, r.length);
var r1= getParameter("act",url);
act =r1.substring(r1.lastIndexOf('=')+1, r1.length);
var r2= getParameter("actFrom",url);
actFrom =r2.substring(r2.lastIndexOf('=')+1, r2.length);
var r3 = getParameter("tags",url);
tags=r3.substring(r3.lastIndexOf('=')+1, r3.length);



//图片适配
zz=  window.screen.height+"\n";
aa= window.screen.width+"\n";
/*alert(zz+','+aa);*/
aaa=null;
zzz=null;
if(aa>=320&&aa<375){
    aaa=640;
    zzz=1136;
}
else if(aa>=375&&aa<414){
    aaa=750;
    zzz=1334;
}
else if(aa>=414){
    aaa=1242;
    zzz=2208;
}

//调andor方法
/*window.AndroidObj.getHeaderData(jsondata);*/
//判断是否是ios
 u = navigator.userAgent, app = navigator.appVersion;
 isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
 isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
 ua = window.navigator.userAgent.toLowerCase();

//全局
//h=$(window).height();




