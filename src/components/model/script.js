/**
 * CONFIG
 */

var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, renderer, container, shadowLight;
var church, level0,level1,level2, front;
var levelOpen,levelFocusAnim, levelFocusAnimState;
var objectsInScene = [];
var main = document.querySelector("main");
var avaiableRoomCounter = 0;
			

var objectsInScene = [];
var objectsWireFrameInScene = [];
var u = 8; // basic unit
var Settings = {
	strokeWidth: 1,
	fillObjects: true,
	init: {
		interactions: true
	},
}

var Colors = {
	primaryColor: 0xffffff,
	secondaryColor: 0xeeeeee,
	backgroundColor: 0xa9a9a9,
	strokeColor: 0x333333,
	lineColor: 0x333333,
	accentColor: 0x0078d7, //0x499333,
	unavailableColor : 0xE59400,
	availableColor : 0x499333,
	availableFillColor : 0xb6d3ad,
	selectedColor : 0x89b7dc ,
	lightColor: 0xeeeeee,
};



var matLines = new THREE.LineBasicMaterial({
	color: Colors.lineColor,
	linewidth: Settings.strokeWidth,
});

var material = new THREE.MeshBasicMaterial({
	color: Colors.primaryColor,
	transparent:true, 
	opacity:1,
	polygonOffset: true,
	polygonOffsetUnits: 1,
	polygonOffsetFactor: 1,
	
});

var matWhite = new THREE.MeshBasicMaterial({
	color: Colors.primaryColor,
	polygonOffset: true,
	polygonOffsetUnits: 1,
	polygonOffsetFactor: 1,
});

var matZone = new THREE.MeshBasicMaterial({
	color: Colors.secondaryColor,
	polygonOffset: true,
	polygonOffsetUnits: -1,
	polygonOffsetFactor: 1,
});


var matDark = new THREE.MeshBasicMaterial({
	color: Colors.lineColor,
	polygonOffset: true,
	polygonOffsetUnits: 1,
	polygonOffsetFactor: 1,
});

var matLinesInvisible = new THREE.LineBasicMaterial({
	color: Colors.lineColor,
	linewidth: Settings.strokeWidth,
	transparent:true, 
	opacity:1,
});


var matLinesAvailable = new THREE.LineBasicMaterial({
	color: Colors.accentColor,
	linewidth: Settings.strokeWidth,
});

var matLinesUnAvailable = new THREE.LineBasicMaterial({
	color: Colors.lineColor,
	linewidth: Settings.strokeWidth,
});


var matInvisible = new THREE.MeshBasicMaterial({
	color: Colors.primaryColor,
	transparent:true, 
	opacity:0,
	polygonOffset: true,
	polygonOffsetUnits: -1,
	polygonOffsetFactor: -1,
});


function initScene() {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
    scene = new THREE.Scene();
	//scene.fog = new THREE.Fog(Colors.backgroundColor, 500, 2000);

	aspectRatio = WIDTH / HEIGHT;
	fieldOfView = 45;
	nearPlane = 1;
	farPlane = 10000;
	camera = new THREE.PerspectiveCamera(fieldOfView,aspectRatio,nearPlane,farPlane);

	// Set the position of the camera
	camera.position.x = 500;
	camera.position.z = 500;
	camera.position.y = 500;
	camera.lookAt(new THREE.Vector3(0, 0, 0));

	//HELPER
	//scene.add(new THREE.CameraHelper( camera ));
	//scene.add(new THREE.AxisHelper( 85 ) );
	
	// Create the renderer
	renderer = new THREE.WebGLRenderer({
		alpha: true,
		antialias: true
	});

	// Define the size of the renderer; in this case,
	// it will fill the entire screen
	renderer.setSize(WIDTH, HEIGHT);

	// Enable shadow rendering
	renderer.shadowMap.enabled = true;

	// Add the DOM element of the renderer to the 
	// container we created in the HTML
	container = document.getElementById('canvas');
	container.appendChild(renderer.domElement);

	// Listen to the screen: if the user resizes it
	// we have to update the camera and the renderer size
	window.addEventListener('resize', handleWindowResize, false);

    var hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9)
    shadowLight = new THREE.DirectionalLight(0xffffff, .9);
	shadowLight.position.set(150, 350, 350);
	shadowLight.position.copy(camera.position);
	shadowLight.castShadow = true;

	// define the visible area of the projected shadow
	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;

	// define the resolution of the shadow; the higher the better, 
	// but also the more expensive and less performant
	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;

	// to activate the lights, just add them to the scene
	scene.add(hemisphereLight);
	scene.add(shadowLight);
	//var helper = new THREE.HemisphereLightHelper( hemisphereLight, 5 );
	//scene.add( helper );

	var controls = new THREE.OrbitControls(camera, renderer.domElement);
    //controls.target = new THREE.Vector3(0,60,0);
    controls.minPolarAngle = -Math.PI*.45; 
    controls.maxPolarAngle = Math.PI*.45;
    controls.minDistance = 500;
    controls.maxDistance = 2000;
    controls.enabled = true;
    controls.enableZoom  = true;
    controls.enablePan  = false;
    

    if (controls && controls.enabled) controls.update();
        controls.addEventListener('change', function() { 
        //render()
	});

}

function handleWindowResize() {
	// update height and width of the renderer and the camera
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
	render();
}


 function render() {
	//shadowLight.position.copy(camera.position);

	//church.mesh.position.y  +=1;
	//console.log(levelOpen)
	if(levelOpen){
		levelFocusAnim(levelOpen);
	}

	// render the scene
	renderer.render(scene, camera);

	// call the loop function again
	requestAnimationFrame(render);

	
    
	
}

function focusOnLevel(activateLevel){

	levelOpen = eval(activateLevel);

}

function buildingExplode(){
	if(levelOpen && levelFocusAnimState){return false;}

	TweenMax.to(level2.mesh.position, 1, {y : 25})
	TweenMax.to(level2.mesh.children[0].children[0].material, 2, {opacity: 0});
	TweenMax.to(level2.mesh.children[0].children[1].material, 2, {opacity: 0.25});

	TweenMax.to(level1.mesh.position, 1, {y : -25, delay : 0})
	TweenMax.to(level1.mesh.children[0].children[0].material, 2, {opacity: 0});
	TweenMax.to(level1.mesh.children[0].children[1].material, 2, {opacity: 0.25});

	TweenMax.to(level0.mesh.position, 1, {y : -75, delay : 0})

	TweenMax.to(level0.mesh.children[0].children[0].material, 2, {opacity: 0});
	TweenMax.to(level0.mesh.children[0].children[1].material, 2, {opacity: 0.25});

	TweenMax.to(front.mesh.position, 1, {z : 100, y : -50, delay : 0})
	

	levelFocusAnimState = true;

}

function buildingOpenAnim(){
	TweenMax.to(level0.mesh.children[0].children[0].material, 2, {opacity: 0});
	TweenMax.to(level1.mesh.children[0].children[0].material, 2, {opacity: 0});
	TweenMax.to(level2.mesh.children[0].children[0].material, 2, {opacity: 0});
}

function buildingReset(){
	TweenMax.to(level0.mesh.children[0].children[0].material, 2, {opacity: 1});
	TweenMax.to(level1.mesh.children[0].children[0].material, 2, {opacity: 1});
	TweenMax.to(level2.mesh.children[0].children[0].material, 2, {opacity: 1});

	TweenMax.to(level0.mesh.children[0].children[1].material, 2, {opacity: 1});
	TweenMax.to(level1.mesh.children[0].children[1].material, 2, {opacity: 1});
	TweenMax.to(level2.mesh.children[0].children[1].material, 2, {opacity: 1});

	TweenMax.to(level2.mesh.position, 1, {y : 0, delay : 0})
	TweenMax.to(level1.mesh.position, 1, {y : 0, delay : 0})
	TweenMax.to(level0.mesh.position, 1, {y : 0, delay : 0})
	TweenMax.to(front.mesh.position, 1, {z : 0, y :0, delay : 0})

	levelFocusAnimState = false;
	levelOpen = false;
}


/**
 * HELPERS
 */


function merge() {
    var obj, name, copy,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length;

    for (; i < length; i++) {
        if ((obj = arguments[i]) != null) {
            for (name in obj) {
                copy = obj[name];

                if (target === copy) {
                    continue;
                }
                else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }

    return target;
};

/**
 * BUILD CHURCH
*/

var Building = function(args){
    args = merge({
		
	}, args || {});

	this.mesh = new THREE.Object3D();

    
    level0 = new Level(args);
	populateLevel0();
    this.mesh.add(level0.mesh)

	level1 = new Level({y : 7 * u});
	populateLevel1();
	
    this.mesh.add(level1.mesh)


    level2 = new Roof();
    this.mesh.add(level2.mesh)

	front = new Front();
    this.mesh.add(front.mesh)

	
}

var Level = function(args){
    args = merge({
		id: "noId",
		width: 6 * 3 * u,
		height: 7 * u,
		depth: 15 * 3 * u,
        x : 0,
        y : 0,
        z : 0,
	}, args || {});

    this.mesh = new THREE.Object3D();

    var level = new THREE.Object3D();
	var LevelGeom = new THREE.BoxGeometry(args.width, args.height, args.depth);
   	LevelGeom.applyMatrix(new THREE.Matrix4().makeTranslation(args.x, args.y + args.height/2, args.z))

	var levelMesh = new THREE.Mesh(LevelGeom, material.clone());
	var levelFrame = new THREE.LineSegments(new THREE.EdgesGeometry(LevelGeom),  matLinesInvisible.clone());
	levelMesh.model_type = "building";
	
    level.add(levelMesh)
    level.add(levelFrame)
    
    this.mesh.add(level)
	objectsInScene.push(this.mesh);
	
}

var Roof = function(args){
    args = merge({
		id: "noId",
		width: 6 * 3 * u,
		height: 10 * u,
		depth: 15 * 3 * u,
        x : 0,
        y : 14 * u,
        z : 0,
	}, args || {});
    
    this.mesh = new THREE.Object3D();

    var level = new THREE.Object3D();
	var LevelGeom = new THREE.BoxGeometry(args.width, args.height, args.depth);
   	LevelGeom.applyMatrix(new THREE.Matrix4().makeTranslation(args.x, args.y + args.height/2, args.z))
    LevelGeom.vertices[0].x -= args.width / 2;
    LevelGeom.vertices[1].x -= args.width / 2;
    LevelGeom.vertices[4].x += args.width / 2;
    LevelGeom.vertices[5].x += args.width / 2;
	
	


    var levelMesh = new THREE.Mesh(LevelGeom, material.clone());
	var levelFrame = new THREE.LineSegments(new THREE.EdgesGeometry(LevelGeom), matLinesInvisible.clone());
	levelMesh.model_type = "building";
	
    level.add(levelMesh)
    level.add(levelFrame)

    this.mesh.add(level)
	objectsInScene.push(this.mesh);
	
}

var Front = function(args){
	args = merge({
		id: "noId",
		width: 6 * 3 * u,
		height: 10*u,
		depth: 15 * 3 * u,
        x : 0,
        y : 14*u,
        z : 0,
	}, args || {});

	this.mesh = new THREE.Object3D();
	var level = new THREE.Object3D();

	var towerHeight = args.height + 7*u + 7*u + 3*u;
    var towerGeom = new THREE.BoxGeometry(args.width/4, towerHeight, args.width/4);
    towerGeom.applyMatrix(new THREE.Matrix4().makeTranslation(args.x, towerHeight/2, args.depth/2 - args.width/12 - 1))
    
	// point

	var pointHeight = 5 * u;
	var pointGeom = new THREE.BoxGeometry(args.width/4, pointHeight, args.width/4);
	pointGeom.vertices[0].x -= args.width / 8;
    pointGeom.vertices[1].x -= args.width / 8;
    pointGeom.vertices[4].x += args.width / 8;
    pointGeom.vertices[5].x += args.width / 8;
	pointGeom.vertices[5].z -= args.width / 8;
	pointGeom.vertices[4].z += args.width / 8;
	pointGeom.vertices[1].z += args.width / 8;
	pointGeom.vertices[0].z -= args.width / 8;
	
    pointGeom.applyMatrix(new THREE.Matrix4().makeTranslation(args.x, towerHeight + pointHeight/2 , args.depth/2 - args.width/12 - 1))
    towerGeom.merge(pointGeom)

	// stairs
	var stairsGeom = new THREE.BoxGeometry(args.width/2, 5, args.width/2);
    stairsGeom.applyMatrix(new THREE.Matrix4().makeTranslation(args.x, 5/2 , (args.depth/2)+(args.width/4) + 0))
	towerGeom.merge(stairsGeom)

	var stairsGeom = new THREE.BoxGeometry(args.width/2.5, 5, args.width/2.5);
    stairsGeom.applyMatrix(new THREE.Matrix4().makeTranslation(args.x, 5+ (5/2) , (args.depth/2)+(args.width/4) + 0 - (args.width/19.5) ))
	towerGeom.merge(stairsGeom)
	var stairsGeom = new THREE.BoxGeometry(args.width/3.5, 5, args.width/3.5);
    stairsGeom.applyMatrix(new THREE.Matrix4().makeTranslation(args.x, 10+ (5/2) , (args.depth/2)+(args.width/4) + 0 - (args.width/9.5) ))
	towerGeom.merge(stairsGeom)
	

    var levelMesh = new THREE.Mesh(towerGeom, material.clone());
	var levelFrame = new THREE.LineSegments(new THREE.EdgesGeometry(towerGeom), matLinesInvisible.clone());
	levelMesh.model_type = "building";
	
    level.add(levelMesh)
    level.add(levelFrame)

    this.mesh.add(level)
	
	objectsInScene.push(this.mesh);
	
}


var populateLevel0 = function(){

	var fillipus = new room({
			id:"fillipus",
			type:"room",
			width : (3 * 3 * u), 
			depth: (3 * 3 * u),
			z : (6 * 3 * u),
			x : (1.5 * 3 * u) * -1,
	});
	var du = 15/2; // deskunit
	fillipus.mesh.add(new Desk({z : fillipus.args.z -5,x : - fillipus.args.width + 1 + du,}).mesh);
	fillipus.mesh.add(new Desk({z : fillipus.args.z +5,x : - fillipus.args.width + 1 + du,}).mesh);
	fillipus.mesh.add(new Desk({z : fillipus.args.z -5,x : - fillipus.args.width + 1 + du*3,}).mesh);
	fillipus.mesh.add(new Desk({z : fillipus.args.z +5,x : - fillipus.args.width + 1 + du*3,}).mesh);
	fillipus.mesh.add(new Desk({z : fillipus.args.z -5,x : - fillipus.args.width + 1 + du*5,}).mesh);
	fillipus.mesh.add(new Desk({z : fillipus.args.z +5,x : - fillipus.args.width + 1 + du*5,}).mesh);
	fillipus.mesh.add(new Desk({z : fillipus.args.z -5,x : - fillipus.args.width + 1 + du*7,}).mesh);
	fillipus.mesh.add(new Desk({z : fillipus.args.z +5,x : - fillipus.args.width + 1 + du*7,}).mesh);
	level0.mesh.add(fillipus.mesh);

	// jakobus
	var jakobus = new room({
			id:"Jakobus", 
			type:"room",
			width : (3 * 3 * u), 
			depth: (3 * 3 * u),
			z : (6 * 3 * u),
			x : (1.5 * 3 * u),
		});
	var du = 15/2; // deskunit
	jakobus.mesh.add(new Desk({z : jakobus.args.z -5,x :  jakobus.args.width - 1 - du,}).mesh);
	jakobus.mesh.add(new Desk({z : jakobus.args.z +5,x :  jakobus.args.width - 1 - du,}).mesh);
	jakobus.mesh.add(new Desk({z : jakobus.args.z -5,x :  jakobus.args.width - 1 - du*3,}).mesh);
	jakobus.mesh.add(new Desk({z : jakobus.args.z +5,x :  jakobus.args.width - 1 - du*3,}).mesh);
	jakobus.mesh.add(new Desk({z : jakobus.args.z -5,x :  jakobus.args.width - 1 - du*5,}).mesh);
	jakobus.mesh.add(new Desk({z : jakobus.args.z +5,x :  jakobus.args.width - 1 - du*5,}).mesh);
	jakobus.mesh.add(new Desk({z : jakobus.args.z -5,x :  jakobus.args.width - 1 - du*7,}).mesh);
	jakobus.mesh.add(new Desk({z : jakobus.args.z +5,x :  jakobus.args.width - 1 - du*7,}).mesh);
	level0.mesh.add(jakobus.mesh);

	// STANDUP workplaces
	var standup = new room({
			id:"standup", 
			depth: (3 * 3 * u),
			z : (3 * 3 * u),
		});
	var du = 15/2; // deskunit
		
	standup.mesh.add(new Desk({z : standup.args.z -5,x : - standup.args.width/2 + du*3,}).mesh);
	standup.mesh.add(new Desk({z : standup.args.z +5,x : - standup.args.width/2 + du*3,}).mesh);
	standup.mesh.add(new Desk({z : standup.args.z -5,x : - standup.args.width/2 + du*5,}).mesh);
	standup.mesh.add(new Desk({z : standup.args.z +5,x : - standup.args.width/2 + du*5,}).mesh);

	var du = 10/2; // deskunit
	standup.mesh.add(new Desk({width : 10, depth : 15, z : standup.args.z -(15/2),x : standup.args.width/2 - du*6,}).mesh)
	standup.mesh.add(new Desk({width : 10, depth : 15, z : standup.args.z +(15/2),x : standup.args.width/2 - du*6,}).mesh)
	standup.mesh.add(new Desk({width : 10, depth : 15, z : standup.args.z -(15/2),x : standup.args.width/2 - du*8,}).mesh)
	standup.mesh.add(new Desk({width : 10, depth : 15, z : standup.args.z +(15/2),x : standup.args.width/2 - du*8,}).mesh)
	level0.mesh.add(standup.mesh);

	// WORK
	var work = new room({
			id:"work", 
			depth: (3 * 3 * u),
			z : (0 * 3 * u),
		});
	var du = 15/2; // deskunit
	work.mesh.add(new Desk({z : work.args.z -5,x : - work.args.width/2 + 1 + du,}).mesh);
	work.mesh.add(new Desk({z : work.args.z +5,x : - work.args.width/2 + 1 + du,}).mesh);
	work.mesh.add(new Desk({z : work.args.z -5,x : - work.args.width/2 + 1 + du*3,}).mesh);
	work.mesh.add(new Desk({z : work.args.z +5,x : - work.args.width/2 + 1 + du*3,}).mesh);
	work.mesh.add(new Desk({z : work.args.z -5,x : - work.args.width/2 + 1 + du*5,}).mesh);
	work.mesh.add(new Desk({z : work.args.z +5,x : - work.args.width/2 + 1 + du*5,}).mesh);
	work.mesh.add(new Desk({z : work.args.z -5,x : - work.args.width/2 + 1 + du*7,}).mesh);
	work.mesh.add(new Desk({z : work.args.z +5,x : - work.args.width/2 + 1 + du*7,}).mesh);
	level0.mesh.add(work.mesh);

	// LUNCH / ALTAR
	var lunch = new room({
			id:"lunch", 
			depth: (3 * 3 * u),
			z : (-3 * 3 * u),
		});
	var altar = new Desk({
			width :  3 * 3 * u,
			depth: 10,
			z : lunch.args.z - lunch.args.depth /2 + 10,
	});
	lunch.mesh.add(altar.mesh)			
	
	var lunchtable = new Desk({
			width :  15,
			depth: 30,
			z : lunch.args.z + lunch.args.depth /2 - 20,
			x : - lunch.args.width/3,
	});
	lunch.mesh.add(lunchtable.mesh)		

	var tree = new Tree({z : lunch.args.z + 25});
	lunch.mesh.add(tree.mesh)		

	level0.mesh.add(lunch.mesh);

	// TOP
	var petrus = new room({
			id:"petrus", 
			type:"room",
			width : (3 * 3 * u), 
			depth: (3 * 3 * u),
			z : (-6 * 3 * u),
		});
	var desk = new Desk({width : 20,depth: 20,z : petrus.args.z,});
	petrus.mesh.add(desk.mesh)			
	level0.mesh.add(petrus.mesh);


	var kitchen = new room({
					id:"kitchen", 
					width : (1.5 * 3 * u), 
					depth: (3 * 3 * u),
					z : (-6 * 3 * u),
					x : ((-1.5 -0.75)  * 3 * u),
					});
	level0.mesh.add(kitchen.mesh);

	var entrance = new room({
					id:"entrance", 
					width : (1.5 * 3 * u), 
					depth: (3 * 3 * u),
					z : (-6 * 3 * u),
					x : ((1.5 + 0.75)  * 3 * u),

					});
	level0.mesh.add(entrance.mesh);

}

var populateLevel1 = function(){
	var paulus = new room({
			id:"paulus",
			type:"room",
			width : (4 * 3 * u), 
			depth: (3 * 3 * u),
			z : (6 * 3 * u),
			x : (1 * 3 * u) * -1,
			y : (7 * u),
	});
	var du = 15/2; // deskunit
	paulus.mesh.add(new Desk({width: paulus.args.width/1.5, depth : paulus.args.depth/2, z : paulus.args.z ,y: paulus.args.y ,x : -25}).mesh);

	level1.mesh.add(paulus.mesh);

	//hallway
	var hallway = new room({
			id:"hallway",
			width : (2 * 3 * u), 
			depth: (4 * 3 * u),
			z : (5.5 * 3 * u),
			x : (2 * 3 * u),
			y : (7 * u),
	});
	level1.mesh.add(hallway.mesh);

	var fishbowl = new room({
			id:"FishBowl",
			width : (3 * 3 * u), 
			depth: (5 * 3 * u),
			z : (2 * 3 * u),
			x : (0.5 * 3 * u) * -1,
			y : (7 * u),
	});
	var du = 15/2; // deskunit
	fishbowl.mesh.add(new Desk({z : fishbowl.args.z - 30, y: fishbowl.args.y ,x : fishbowl.args.x - 15,}).mesh);
	fishbowl.mesh.add(new Desk({z : fishbowl.args.z - 30 - 10, y: fishbowl.args.y ,x : fishbowl.args.x - 15,}).mesh);
	fishbowl.mesh.add(new Desk({z : fishbowl.args.z - 30, y: fishbowl.args.y ,x : fishbowl.args.x + 15,}).mesh);
	fishbowl.mesh.add(new Desk({z : fishbowl.args.z - 30 - 10, y: fishbowl.args.y ,x : fishbowl.args.x + 15,}).mesh);

	fishbowl.mesh.add(new Desk({z : fishbowl.args.z + 30, y: fishbowl.args.y ,x : fishbowl.args.x - 15,}).mesh);
	fishbowl.mesh.add(new Desk({z : fishbowl.args.z + 30 - 10, y: fishbowl.args.y ,x : fishbowl.args.x - 15,}).mesh);
	fishbowl.mesh.add(new Desk({z : fishbowl.args.z + 30, y: fishbowl.args.y ,x : fishbowl.args.x + 15,}).mesh);
	fishbowl.mesh.add(new Desk({z : fishbowl.args.z + 30 - 10, y: fishbowl.args.y ,x : fishbowl.args.x + 15,}).mesh);

	level1.mesh.add(fishbowl.mesh);

	var andreas = new room({
			id:"andreas", 
			type:"room",
			width : (3 * 3 * u), 
			depth: (2 * 3 * u),
			z : (-5.5 * 3 * u),
			y : (7 * u),
			
		});

	level1.mesh.add(andreas.mesh);


	var mattheus = new room({
			id:"mattheus", 
			type:"room",
			width : (1.5 * 3 * u), 
			depth: (3 * 3 * u),
			z : (-6 * 3 * u),
			x : ((-1.5 -0.75)  * 3 * u),
			y : (7 * u),
	});
	var desk = new Desk({width : 20,depth: 20,y: mattheus.args.y,z : mattheus.args.z, x : mattheus.args.x});
	mattheus.mesh.add(desk.mesh)		
	level1.mesh.add(mattheus.mesh);

	var johannes = new room({
			id:"johannes", 
			type:"room",
			width : (1.5 * 3 * u), 
			depth: (2 * 3 * u),
			z : (-5.5 * 3 * u),
			x : ((1.5 + 0.75)  * 3 * u),
			y : (7 * u),
	});
	var desk = new Desk({width : 20,depth: 20,y: johannes.args.y,z : johannes.args.z, x : johannes.args.x});
	johannes.mesh.add(desk.mesh)
	level1.mesh.add(johannes.mesh);

	var smallhallway = new room({
			id:"smallhallway", 
			width : (4.5 * 3 * u), 
			depth: (1 * 3 * u),
			z : (-7 * 3 * u),
			x : ((0 + 0.75)  * 3 * u),
			y : (7 * u),
	});
	level1.mesh.add(smallhallway.mesh);

}
var room = function(args){
	args = merge({
		id: "noId",
		type:"none",
		width: 6 * 3 * u,
		height: 7 * u,
		depth: 12 * 3 * u,
		x : 0,
		y : 0,
		z :  0,
		material : matWhite
	}, args || {});
	this.args = args;
	this.mesh = new THREE.Object3D();

	
	var roomGeom = new THREE.BoxGeometry(args.width, args.height, args.depth);
	roomGeom.applyMatrix(new THREE.Matrix4().makeTranslation(args.x,args.y,args.z))
	var roomMesh = new THREE.Mesh(roomGeom, matInvisible.clone());
	
	
	

	var floorGeom = new THREE.BoxGeometry(args.width, 0, args.depth);
	floorGeom.applyMatrix(new THREE.Matrix4().makeTranslation(args.x,args.y,args.z))

	var floorMaterial = (args.type == "room") ? matZone : args.material;
	var floorMesh = new THREE.Mesh(floorGeom, floorMaterial.clone());

	floorMesh.click = function(){
		//console.log("it's a room")
	}
	floorMesh.model_id = args.id;
	floorMesh.model_type = args.type;

	
	this.mesh.add(roomMesh)
	this.mesh.add(floorMesh)
	
	if(args.type == "room")
		this.mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(floorGeom), matLinesAvailable.clone()));
	
	objectsInScene.push(this.mesh);

}

var Desk = function (args) {
	args = merge({
		width: 15,
		depth: 10,
		height: 7,
		colorTableTop: Colors.primaryColor,
		colorLegs: Colors.primaryColor,
		click: null,
		over: null,
		out: null,
		x : 0,
		y : 0,
		z : 0,
	}, args || {});
	this.args = args;
	this.mesh = new THREE.Object3D();

	var geomTable = new THREE.Geometry();
	var geomTable_top = new THREE.BoxGeometry(args.width, 2, args.depth, 1, 1, 1);

	var geomLegs = new THREE.Geometry();
	var geomLeg = new THREE.BoxGeometry(2, args.height, 2, 1, 1, 1);

	geomLegs.merge(geomLeg.applyMatrix(new THREE.Matrix4().makeTranslation(-((args.width / 2) - 1), -(args.height / 2) - 1, -(args.depth / 2) + 1)));
	geomLegs.merge(geomLeg.applyMatrix(new THREE.Matrix4().makeTranslation((args.width - 2), 0, 0)));
	geomLegs.merge(geomLeg.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, (args.depth - 2))));
	geomLegs.merge(geomLeg.applyMatrix(new THREE.Matrix4().makeTranslation(-(args.width - 2), 0, 0)));


	geomTable.merge(geomTable_top);
	geomTable.merge(geomLegs);
	
	geomTable.applyMatrix(new THREE.Matrix4().makeTranslation(args.x,args.y,args.z))
	
	var table = new THREE.Mesh(geomTable, matWhite.clone());
	var geoObject = new THREE.EdgesGeometry(geomTable);
	var tableLined = new THREE.LineSegments(geoObject, matLines.clone());



	table.castShadow = true;
	table.receiveShadow = true;

	table.selected = false;
	/*
	table.click = function () {
		this.selected = !this.selected;
		if (this.selected) {
			this.material.color.set(Colors.accentColor);
		} else {
			this.material.color.set(Colors.primaryColor);
		}
		render();
		
	}
	table.over = function () {
		var color = (this.selected === true) ? Colors.primaryColor : Colors.accentColor; 
		
		var wiredSibling = this.parent.children[1]
		wiredSibling.material.color.set(color);
		render();
	}
	table.out = function () {
		var wiredSibling = this.parent.children[1]
		wiredSibling.material.color.set(Colors.lineColor);
		render();
	}
	*/

	//objectsWireFrameInScene.push(tableLined);


	this.mesh.add(table)
	this.mesh.add(tableLined)
	this.mesh.position.y += args.height + 1;
	objectsInScene.push(this.mesh);

}

var Tree = function (args) {
	args = merge({
		id : null,
		size: 15,
		height:45,
		x: 0,
		y: 0,
		z: 0,
		
	}, args || {});
	
	this.mesh = new THREE.Object3D();
	this.mesh.castShadow = true;
	this.mesh.receiveShadow = true;

	var treeGeom = new THREE.Geometry();

	// POT
	var geomPot = new THREE.CylinderGeometry((args.size), args.size / 3, args.size, 0, 1, false);
	treeGeom.merge(geomPot.applyMatrix(new THREE.Matrix4().makeTranslation(0, args.size / 2, 0)));
	// trunk
	var geomTrunk = new THREE.CylinderGeometry(2, 2, args.height, 0, 1, false);
	treeGeom.merge(geomTrunk.applyMatrix(new THREE.Matrix4().makeTranslation(0, args.height / 2, 0)));

	// bush
	var geomBush = new THREE.SphereGeometry((args.size * 1.5), 7, 7);
	treeGeom.merge(geomBush.applyMatrix(new THREE.Matrix4().makeTranslation(0, args.height + (args.size / 2), 0)));


	treeGeom.applyMatrix(new THREE.Matrix4().makeTranslation(args.x, args.y, args.z));
	


	var tree = new THREE.Mesh(treeGeom, matWhite.clone());
	var geoObject = new THREE.EdgesGeometry(treeGeom);
	var treeLined = new THREE.LineSegments(geoObject, matLines);

	tree.selected = false;
	tree.args = args;
	
	tree.click = function () {
		this.selected = !tree.selected 
		if (this.selected) {
			this.material.color.set(Colors.accentColor);
		} else {
			this.material.color.set(Colors.primaryColor);

		}
		render();
		
		showDetails(this.args.id,this.selected);
		
	}

	tree.over = function () {
		var color = (this.selected === true) ? Colors.primaryColor : Colors.accentColor; 
		var wiredSibling = this.parent.children[1]
		wiredSibling.material.color.set(color);
		render();
	}
	tree.out = function () {
		var wiredSibling = this.parent.children[1]
		wiredSibling.material.color.set(Colors.lineColor);
		render();
	}

	this.mesh.add(tree);
	this.mesh.add(treeLined);

	objectsInScene.push(this.mesh);
	



}


/**
 * 
 */
var setRoomAvailability = function(){
	scene.traverse( function( node ) {
		if ( node instanceof THREE.Mesh && node.model_type=="room") {
			var available = Math.floor((Math.random() * 2) + 1) -1;
    	    node.available = (available == 0 )? 1 : 0;
			if(available==1){
				avaiableRoomCounter++;
				
				node.parent.children[2].material.color.set(Colors.availableColor)
				node.parent.children[1].material.color.set(Colors.availableFillColor)
			}
    	}

	} );
}


/**
 * INTERACTIONS
 */
document.addEventListener('mousedown', function(){document.body.dataset.mouse = "down";}, false);
document.addEventListener('mouseup', function(){document.body.dataset.mouse = "up";}, false);

document.addEventListener('mousedown', onDocumentMouseDown, false);
var mousePosition = new THREE.Vector2(), INTERSECTED;
var raycaster = new THREE.Raycaster()
function onDocumentMouseDown(event) {
	
	if(objectsInScene.length === 0) return false;
    event.preventDefault();
    mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = - (event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mousePosition, camera);
    var intersects = raycaster.intersectObjects(objectsInScene, true);
	if (intersects.length > 0) {
		//console.log(intersects)
		for(var i=0;i<intersects.length;i++){
			var model = intersects[i].object;
			if(model.model_type == "room" && (main.dataset.state=="explode" || main.dataset.state=="opaque")){
				//console.log("it is a room "+model.model_id)
				var available =  model.available; //(model.available) ? model.available : model.available;
				showDetails(model.model_id,available);
			}

			if(model.model_type == "building" && (main.dataset.state=="reset")){
				setState("explode")
			}

			if(model.model_type == "building" && (main.dataset.state!="reset" && intersects.length==1 )){
				setState("reset");
			}
		}
		
        if(intersects[0].object.click != null){
            intersects[0].object.click();
        }
    } else {
       //console.log("unhit")
		//setState("reset")
	   
    }
}

document.addEventListener('mousemove', onDocumentMouseOver, false);
function onDocumentMouseOver(event) {
    if(objectsInScene.length === 0) return false;
    event.preventDefault();
    mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
    mousePosition.y = - (event.clientY / window.innerHeight) * 2 + 1;
    var rayContainsRoom=false;
	var rayContainseNothing=true;
    //
     

    raycaster.setFromCamera(mousePosition, camera);
    var intersects = raycaster.intersectObjects(objectsInScene, true);
    if (intersects.length > 0) {
		rayContainseNothing = false;
		for(var i=0;i<intersects.length;i++){
			var model = intersects[i].object;
			if(model.model_type == "room" && (main.dataset.state=="explode" || main.dataset.state=="opaque")){
				rayContainsRoom=true;
			}	
		}
    }
	
	if(rayContainsRoom){
		document.body.classList.add("mouseOnSelectableObject")
	}else{
		document.body.classList.remove("mouseOnSelectableObject")
	}

	//console.log(event.target.nodeName)
	if(rayContainseNothing){
		document.body.classList.add("mouseOnCanvas")
			
	}else{
		document.body.classList.remove("mouseOnCanvas")
		
	}
}



