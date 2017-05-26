/**
 * create by Eccentric
 */

var jiHeSelect={
  addSelect:addSelect,
}

 $('head').append(' <link rel="stylesheet" href="http://at.alicdn.com/t/font_f7yytc4c5t2csor.css"/>');

/**
 * class:td类
 * array：hash表[{key:'',value:''}]
 * [addSelect description]
 * @param {[type]} class [description]
 * @param {[type]} array [description]
 */
function addSelect(id,array,bacKFn){
      var _hash={};
      for(v in array){
        _hash[array[v].key]=array[v].value;
      }
      $('#'+id).append('<span class="iconfont icon-shangxia"></span>');
      $('.iconfont').css('font-size','12px');
      // $('.iconfont').css('font-size', '12px');
      // $('#'+id).append('<img src="../setCoupons/image/icon.jpg"/>')
      $('#'+id).click(function(e){
          e.stopImmediatePropagation();
        var _this=$(this);
      var selectId=id+'Menu';
      if($('#'+selectId).length){
        $('#'+selectId).animate({height:'0'}, '100',function(){
           $('#'+selectId).remove();
        });
        // $('#'+selectId).remove();
      }else{
        var width=$(this).css('width');
        var X=$(this).offset().left;
        var Y=$(this).offset().top;
          var height=$(this).outerHeight(true);
          // console.log($(this).outerHeight(true));
        var div=$('<div id="'+selectId+'"></div>');
        div.css({
          'position':'absolute',
          'margin-left':X+1,
          'margin-top':Y+parseInt(height),
          'width':width,
          'background-color':'white',
          'border':'1px solid #d8d8d8',
          'text-align':'center',
          '-webkit-box-shadow': '0 0 1px black',
          '-moz-box-shadow':'0 0 1px black',
          'box-shadow':'0 0 1px black',
          'overflow':'hidden'
        }).click(function(e){
          e.stopImmediatePropagation();
        });
        for(v in array){
          div.append('<p>'+array[v].key+'</p>');
        }
        div.children('p').css({
          'padding':'20px',
          'margin':'0'
        }).hover(function() {
          $(this).css('background-color','#f2f2f2');
        }, function() {
          $(this).css('background-color','white');
        }).click(function(){
          // _this.addClass('iconfontyyy');
          _this.text($(this).text());
          _this.append('<span class="iconfont icon-shangxia"></span>');
          $('.iconfont').css('font-size', '12px');
          // _this.append('<img src="../setCoupons/image/icon.jpg"/>')
           bacKFn(_hash[$(this).text()]);  
              $('#'+selectId).remove();
        })
          $('body').prepend(div);
          var height=div.css('height');
          div.css('height','0');
          div.animate({height:height}, '100');
          $(document).click(function(event) {
            $('#'+selectId).animate({height:'0'}, '100',function(){
               $('#'+selectId).remove();
            });
          });

      }
})
}
