$(document).ready(function(){
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        navHeader();
        //这是微信浏览器
    }else{
        if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
            //这是iOS平台下浏览器
            if(/jihe/i.test(navigator.userAgent)){

                //这是iOS平台下app
            }
            else {
                navHeader();
            }
        }
        if(/android/i.test(navigator.userAgent)){
            navHeader();
            //这是Android平台下浏览器
        }
    }


    function navHeader(){
        var mbcenter='/user/h5/mbcenter';
        var navHtml='<div class="navigation">'
            +'<img src="http://7xio74.com1.z0.glb.clouddn.com/navLogo.png" class="jiheLogo" alt="">'
            +'<div class="navIconBox">'
            +'<div class="navIcon" id="navPerson" style="border-right:1px solid #ccc;padding-right:0.9rem;margin-right:0.9rem"><img src="http://7xio74.com1.z0.glb.clouddn.com/navPerson.png" alt=""><span>会员中心</span></div>'
            +'<div class="navIcon" id="navSearch"><img src="http://7xio74.com1.z0.glb.clouddn.com/navSearch.png" alt=""><span>找民宿</span></div>'
            +'</div>'
            +'</div>'
            +'<div style="height: 3rem;"></div>';
        $('body').prepend(navHtml);
        if(window.location.href.indexOf("bnbShare.html")>-1){
            mbcenter='/user/h5/mbcenter?member_hotelid='+GetParams().id;
        }
        $(".navigation").css({'padding':'0 4%','clear':'both','overflow':'hidden','height':'3rem','background':'#fff','font-size':'0.8rem','color':'#484848','position':'fixed','top':'0','width':'92%','z-index':'1'});
        $(".jiheLogo").css({'float':'left','width':'3rem','position':'relative','top':'50%','transform':'translateY(-50%)'}).click(function(){
            window.location.href=mbcenter;
        });
        $(".navIconBox").css({'float':'right','height':'1.8rem','line-height':'1.8rem','margin-top': '0.6rem'});
        $(".navIcon").css({'display':'inline-block'}).find("img").css({'width':'1.67rem','float':'left','margin-right':'0.4rem','position':'relative','top':'0.1rem'});
        $("#navPerson").click(function(){
            window.location.href=mbcenter;
        });
        $("#navSearch").click(function(){
            window.location.href='/html/h5/product/list/findMinsu.html';
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
});