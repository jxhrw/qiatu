/*
*作者：yhx
* 弹窗插件
* 使用前需先引入jquery，在引入此文件
* 打开弹窗
*modalService.open(
* {width:...;height:....;title:.....;content:......;close:......; })
* 弹窗content内html模板写法<div id='??' class='template'>内容</div>
*content:??(id)
* 可以将此模板写入弹窗内
* 关闭弹窗
* modalService.close();
*/

var modalService={
    open:open,
    close:close
};
//在dom树加载完成后对.template操作
$(function () {
    $('.template').css({'display':'none'});
});

function open(obj) {
    var content=$('#'+obj.content).html();
    function tanchuang(obj) {
        $('body').append('<div id="mry-opo"><div id="mry-opo-title"></div><div  id="mry-opo-content"></div></div>');
        var div = $('#mry-opo');
        div.css({
            'position': 'fixed',
            'z-index': '7000',
            'left': '50%',
            'top': '50%'
            });

        $('#mry-opo-title').text(obj.title).css({
            'height': '35px',
        'font-size': '14px',
        'padding-left': '10px',
        'line-height': '30px',
        'background-color': 'rgb(51,63,75)',
        'color': '#FFFFFF',
        'font-weight': 'bold',
        'text-align': 'center',
        'padding-top': '5px'
        });
        //传入模板
        $('#mry-opo-content').html(content).css({
             'padding': '0'
        });
        div.css('width', obj.width + 'px');
        div.css('height', obj.height + 'px');
        div.css('margin-left', -(parseInt(obj.width) / 2) + 'px');
        div.css('margin-top', -(parseInt(obj.height) / 2) + 'px');
        div.css('background', obj.backgorund);
        $('#mry-mask').css('display', 'block');
    }

    function del() {
        $('#mry-opo').append('<a href="javascript:void(0)" deletes="mry-opo" style="position:absolute;right:10px;top:6px;color:#fff;font-size:12px;"><img src="../plug-in/ModalService/x.png" width="18" height="18" style="margin-top:5px;margin-right:8px;"/></a>');
        $('#mry-mask').attr('deletes','');
        $('[deletes=mry-opo]').click(function () {
            $('#mry-opo,#mry-mask').remove();
            if("undefined" != typeof(obj.close)){
            obj.close();
          }
        });
        //console.log($('[deletes=mry-opo]'));
    }

    $('body').append('<div id="mry-mask" deletes="mry-opo"></div>');
    $("#mry-mask").css(
        {
            'width': '100%',
            'height': '100%',
            'position': 'fixed',
            'top': '0px',
            'left': '0px',
            'background-color': 'rgba(0,0,0,.7)',
            'z-index': '100',
            'display': 'none',
            'background-position': 'initial initial',
            'background-repeat': 'initial initial',
        }
    )
    var ject = obj;
    ject.width = parseInt(obj.width) || 300;
    ject.height = parseInt(obj.height) || 300;
    ject.title = obj.title || '来自提示信息';
    ject.content = obj.content || '这是一个提示信息';
    ject.backgorund = obj.backgorund || '#fff';
    tanchuang(ject);
    del();
}


function close() {
    $('#mry-opo,#mry-mask').remove();
}

//将css传入js前 modalService弹窗插件css文件
// #mry-mask {
//     width: 100%;
//     height: 100%;
//     position: fixed;
//     top: 0px;
//     left: 0px;
//     background-color: rgba(0,0,0,.7);
//     z-index: 100;
//     background-position: initial initial;
//     background-repeat: initial initial;
// }
//
// #mry-opo {
//     position: fixed;
//     z-index: 7000;
//     left: 50%;
//     top: 35%;
//     /*-webkit-box-shadow: 1px 1px 2px 2px #C1C1C1;*/
//     /*box-shadow: 1px 1px 2px 2px #C1C1C1;*/
//
// }
//
// #mry-opo-title {
//     height: 35px;
//     font-size: 14px;
//     padding-left: 10px;
//     line-height: 30px;
//     background-color: rgb(51,63,75);
//     color: #FFFFFF;
//     font-weight: bold;
//     text-align: center;
//     padding-top: 5px;
// }
//
// #mry-opo-content {
//     padding: 10px;
// }
// .template{
//     display: none;
// }
