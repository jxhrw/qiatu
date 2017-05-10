$(document).ready(function(){
    var screenHeight=$(".screen").height();
    var jiHeHeight=$(".jiHe").height();
    if(screenHeight+jiHeHeight<=$(window).height()){
        $(".screenBox").height($(window).height());
    }else {
        $(".screenBox").height((screenHeight+jiHeHeight+40)+"px");
    }

});