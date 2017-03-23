
var initNavigation = function(duration,callback){
    var animation = new TimelineMax()
    animation.to(
        ".left-wrap .loader", 
        duration/2,
        {css:{rotation: 180},ease:Linear.easeNone
    }).to(
        ".right-wrap .loader", 
        duration/2,
        {css:{rotation: 180},ease:Linear.easeNone,onComplete:function(){ActivateNavigation(callback)}
    })
}


var ActivateNavigation = function(callback){
    console.log(callback)
    callback.call(this);;
}



