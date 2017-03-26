
var initNavigation = function(duration,callback){
    callback = callback || Void;

    var animation = new TimelineMax();
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
    
    TweenMax.to(".circle-loader-message .loading-message",0.5,{css:{opacity:0}});
    
    
    setState("reset")
    var avaiableRoomCounterContainer = document.querySelector("#availableRoomCounter");
    avaiableRoomCounterContainer.innerHTML = avaiableRoomCounter + " meetingrooms available";
    TweenMax.to("#availableRoomCounter",0.5,{css:{opacity:1}});

    callback.call(this);;
}

var setState = function(state){
    var main = document.querySelector("main");
    main.dataset.state = state;
    switch (state){
        case "explode":
            buildingExplode();
            break;
        case "opaque":
            buildingOpenAnim();
            break;
        default:
            buildingReset();
    }

    //var nav = document.querySelector("nav#container");
    //nav.dataset.state = state;
}

var showDetails = function(id){
	if(data[id]){
		var title = document.getElementById("title");
		title.innerHTML = data[id].title
		var details = document.getElementById("availableRoomCounter");
		details.innerHTML = data[id].description
	}
}


var Void = function(){
    console.log("void fallback")
}





