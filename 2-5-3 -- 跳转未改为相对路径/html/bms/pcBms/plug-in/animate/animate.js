/**
 * Created by Eccentric on 2017/4/20.
 */
var jiHeAnimate={
    load:loading,
    stopLoad:removeLoading,

};
var loadNum=0;
function loading() {
  if(loadNum==0){
    $('head').append('<link href="../plug-in/animate/load.css" rel="stylesheet"/>');
  }
    var loading=$('<div class="loadEffect"> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> <span></span> </div>');
    var loadingBg=$('<div class="loadEffectBg"></div>');

    $('body').prepend(loading);
    $('body').prepend(loadingBg);
    // 获取屏幕宽高
     var width=$(window).width();
    var height=$(window).height();
    // console.log(width,height);
    var marginTop=(height-50)/2;
    var marginLeft=(width-50)/2;
    $('.loadEffect').css(
        {
            'margin-top': marginTop + 'px',
            'margin-left': marginLeft + 'px'
        }
    );
    loadNum=1;
    // console.log(loadNum);
}

function removeLoading() {
    $('.loadEffect').remove();
    $('.loadEffectBg').remove();
}
