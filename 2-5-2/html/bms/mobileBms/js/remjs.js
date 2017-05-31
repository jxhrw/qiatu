/**
 * Created by Spr on 2016/7/7.
 */
//rem单位
new function (){
    var _self = this;
    _self.width = 750;//设置默认最大宽度
    _self.fontSize = 100;//默认字体大小
    _self.widthProportion = function(){
        var p = (document.body&&document.body.clientWidth||document.getElementsByTagName("html")[0].offsetWidth)/_self.width;
        return p>1?1:p<0.4?0.5:p;
    };//判断当前屏幕尺寸，设置的最大屏幕宽度之间的比例
    _self.changePage = function(){
        document.getElementsByTagName("html")[0].setAttribute("style","font-size:"+_self.widthProportion()*_self.fontSize+"px !important");
    }//修改根元素html的font-size的植
    _self.changePage();
    window.addEventListener('resize',function(){
        _self.changePage();
    },false);//侦听屏幕宽度变化
};