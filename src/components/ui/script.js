var initApp = function(){
    console.log("go")
}
var initNavigation = function(duration,callback){
    callback = callback || initApp;
    var animation = new TimelineMax()
    animation.to(
        ".left-wrap .loader", 
        duration/2,
        {css:{rotation: 180},ease:Linear.easeNone
    }).to(
        ".right-wrap .loader", 
        duration/2,
        {css:{rotation: 180},ease:Linear.easeNone,onComplete:eval(callback)
    })
}




