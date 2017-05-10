/**
 * Created by Eccentric on 2017/3/27.
 */
/**
 * creator：yhx
 * 调用方式
 * jiHeAlert.open(text);
 * @type {{open: jiHeAlertOpen}}
 */
  var jiHeAlert={
    open:jiHeAlertOpen,
    prompt:jiHePrompt,
};

function jiHeAlertOpen(text) {
    var myAlert=$('<div id="myAlert"></div>');
    $('body').append(myAlert);
    myAlert.css({
        'position':'fixed',
        'width':'30%',
        'height':'50px',
         // 'background':'black',
        'top':'40%',
        'left':'35%',
        'border-radius':'8px',
        'z-index':'7001',
    });
    var myAlertBackGround=$('<div id="myAlertBg"></div>');
    myAlert.append(myAlertBackGround);
    myAlertBackGround.css({
        'background':'black',
        'width':'100%',
        'height':'50px',
        'border-radius':'5px',
        'opacity':'0.6'
    });

    var myAlertContent=$('<span id="myAlertContent"></span>');
    myAlert.append(myAlertContent);
    myAlertContent.css({
        // 'background':'trans',
        // 'width':'100%',
        // 'height':'50px',
        'margin-top':'-50px',
        'color':'white',
        'display':'block',
        'position':'relative',
        'text-align':'center',
        'font-size':'16px',
        'padding-top':'13px'
    });
    myAlertContent.text(text);


    setTimeout(function () {
        myAlert.animate({opacity:0},'slow',function () {
            myAlert.remove();
        });
    },1000);
}

function jiHePrompt(text,type) {
    var color='';
    if(!type){
         color='blue';
    }
    else if(type=='warn'){
        color='rgb(208,2,25)';
    }
    else if(type=='prompt'){
        color='blue';
    }
    var myPrompt=$('<div id="myPrompt"></div>');
    $('body').append(myPrompt);
    myPrompt.css({
        'position':'fixed',
        'background':color,
        'width':'100%',
        'height':'50px',
        'z-index':'7002'
    });
    
    var myPromptContent=$('<p></p>');
    myPrompt.append(myPromptContent);
    myPromptContent.css({
        'color':'white',
        'font-size':'18px',
        'text-align':'center',
        'margin-top':'11px'
    });
    myPromptContent.text(text);
    setTimeout(function () {
        myPrompt.animate({opacity:0},'slow',function () {
            myPrompt.remove();
        });
    },1000);
}

