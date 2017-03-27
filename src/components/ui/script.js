
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
            showDetails();
    }

    //var nav = document.querySelector("nav#container");
    //nav.dataset.state = state;
}

var showDetails = function(id,available){
	if(data[id]){
        
		var title = document.getElementById("title");
		title.innerHTML = data[id].title 
		var details = document.getElementById("availableRoomCounter");
		details.innerHTML = data[id].description + "<div class='room-button'><a href='#bookroom' class='button room-available-"+available+"'><i class='room-available'></i>book room</a></div>";
	}else{
        var title = document.getElementById("title");
		title.innerHTML = "Wortell";
        var details = document.getElementById("availableRoomCounter");
        details.innerHTML = avaiableRoomCounter+" meetingsrooms available";
    }
}


var Void = function(){
    console.log("void fallback")
}





