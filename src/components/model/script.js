/**
 * CONFIG
 */

var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, renderer, container, shadowLight;
var church, level0,level1,level2, front;
var levelOpen,levelFocusAnim, levelFocusAnimState;

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

	TweenLite.to(level2.mesh.position, 1, {y : 25})
	TweenLite.to(level2.mesh.children[0].children[0].material, 2, {opacity: 0});
	TweenLite.to(level2.mesh.children[0].children[1].material, 2, {opacity: 0.25});

	TweenLite.to(level1.mesh.position, 1, {y : -25, delay : 0})
	TweenLite.to(level1.mesh.children[0].children[0].material, 2, {opacity: 0});
	TweenLite.to(level1.mesh.children[0].children[1].material, 2, {opacity: 0.25});

	TweenLite.to(level0.mesh.position, 1, {y : -75, delay : 0})

	TweenLite.to(level0.mesh.children[0].children[0].material, 2, {opacity: 0});
	TweenLite.to(level0.mesh.children[0].children[1].material, 2, {opacity: 0.25});

	TweenLite.to(front.mesh.position, 1, {z : 100, y : -50, delay : 0})
	

	levelFocusAnimState = true;

}

function buildingOpenAnim(){
	TweenLite.to(level0.mesh.children[0].children[0].material, 2, {opacity: 0});
	TweenLite.to(level1.mesh.children[0].children[0].material, 2, {opacity: 0});
	TweenLite.to(level2.mesh.children[0].children[0].material, 2, {opacity: 0});
}

function buildingReset(){
	TweenLite.to(level0.mesh.children[0].children[0].material, 2, {opacity: 1});
	TweenLite.to(level1.mesh.children[0].children[0].material, 2, {opacity: 1});
	TweenLite.to(level2.mesh.children[0].children[0].material, 2, {opacity: 1});

	TweenLite.to(level0.mesh.children[0].children[1].material, 2, {opacity: 1});
	TweenLite.to(level1.mesh.children[0].children[1].material, 2, {opacity: 1});
	TweenLite.to(level2.mesh.children[0].children[1].material, 2, {opacity: 1});

	TweenLite.to(level2.mesh.position, 1, {y : 0, delay : 0})
	TweenLite.to(level1.mesh.position, 1, {y : 0, delay : 0})
	TweenLite.to(level0.mesh.position, 1, {y : 0, delay : 0})
	TweenLite.to(front.mesh.position, 1, {z : 0, y :0, delay : 0})

	levelFocusAnimState = false;
	levelOpen = false;
}

function rob(){
	console.log("end transition")
	
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

    level.add(levelMesh)
    level.add(levelFrame)
    
    this.mesh.add(level)
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

    level.add(levelMesh)
    level.add(levelFrame)

    this.mesh.add(level)
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

    level.add(levelMesh)
    level.add(levelFrame)

    this.mesh.add(level)
	

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

	var jakobus = new room({
			id:"jakobus", 
			type:"room",
			width : (1.5 * 3 * u), 
			depth: (2 * 3 * u),
			z : (-5.5 * 3 * u),
			x : ((1.5 + 0.75)  * 3 * u),
			y : (7 * u),
	});
	var desk = new Desk({width : 20,depth: 20,y: jakobus.args.y,z : jakobus.args.z, x : jakobus.args.x});
	jakobus.mesh.add(desk.mesh)
	level1.mesh.add(jakobus.mesh);

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

	
	this.mesh.add(roomMesh)
	this.mesh.add(floorMesh)
	
	if(args.type == "room")
		this.mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(floorGeom), matLinesAvailable.clone()));
	
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
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author erich666 / http://erichaines.com
 */

// This set of controls performs orbiting, dollying (zooming), and panning.
// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
//
//    Orbit - left mouse / touch: one finger move
//    Zoom - middle mouse, or mousewheel / touch: two finger spread or squish
//    Pan - right mouse, or arrow keys / touch: three finter swipe

THREE.OrbitControls = function ( object, domElement ) {

	this.object = object;

	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// Set to false to disable this control
	this.enabled = true;

	// "target" sets the location of focus, where the object orbits around
	this.target = new THREE.Vector3();

	// How far you can dolly in and out ( PerspectiveCamera only )
	this.minDistance = 0;
	this.maxDistance = Infinity;

	// How far you can zoom in and out ( OrthographicCamera only )
	this.minZoom = 0;
	this.maxZoom = Infinity;

	// How far you can orbit vertically, upper and lower limits.
	// Range is 0 to Math.PI radians.
	this.minPolarAngle = 0; // radians
	this.maxPolarAngle = Math.PI; // radians

	// How far you can orbit horizontally, upper and lower limits.
	// If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
	this.minAzimuthAngle = - Infinity; // radians
	this.maxAzimuthAngle = Infinity; // radians

	// Set to true to enable damping (inertia)
	// If damping is enabled, you must call controls.update() in your animation loop
	this.enableDamping = false;
	this.dampingFactor = 0.25;

	// This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
	// Set to false to disable zooming
	this.enableZoom = true;
	this.zoomSpeed = 1.0;

	// Set to false to disable rotating
	this.enableRotate = true;
	this.rotateSpeed = 1.0;

	// Set to false to disable panning
	this.enablePan = true;
	this.keyPanSpeed = 7.0;	// pixels moved per arrow key push

	// Set to true to automatically rotate around the target
	// If auto-rotate is enabled, you must call controls.update() in your animation loop
	this.autoRotate = false;
	this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

	// Set to false to disable use of the keys
	this.enableKeys = true;

	// The four arrow keys
	this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

	// Mouse buttons
	this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };

	// for reset
	this.target0 = this.target.clone();
	this.position0 = this.object.position.clone();
	this.zoom0 = this.object.zoom;

	//
	// public methods
	//

	this.getPolarAngle = function () {

		return spherical.phi;

	};

	this.getAzimuthalAngle = function () {

		return spherical.theta;

	};

	this.reset = function () {

		scope.target.copy( scope.target0 );
		scope.object.position.copy( scope.position0 );
		scope.object.zoom = scope.zoom0;

		scope.object.updateProjectionMatrix();
		scope.dispatchEvent( changeEvent );

		scope.update();

		state = STATE.NONE;

	};

	// this method is exposed, but perhaps it would be better if we can make it private...
	this.update = function() {

		var offset = new THREE.Vector3();

		// so camera.up is the orbit axis
		var quat = new THREE.Quaternion().setFromUnitVectors( object.up, new THREE.Vector3( 0, 1, 0 ) );
		var quatInverse = quat.clone().inverse();

		var lastPosition = new THREE.Vector3();
		var lastQuaternion = new THREE.Quaternion();

		return function update () {

			var position = scope.object.position;

			offset.copy( position ).sub( scope.target );

			// rotate offset to "y-axis-is-up" space
			offset.applyQuaternion( quat );

			// angle from z-axis around y-axis
			spherical.setFromVector3( offset );

			if ( scope.autoRotate && state === STATE.NONE ) {

				rotateLeft( getAutoRotationAngle() );

			}

			spherical.theta += sphericalDelta.theta;
			spherical.phi += sphericalDelta.phi;

			// restrict theta to be between desired limits
			spherical.theta = Math.max( scope.minAzimuthAngle, Math.min( scope.maxAzimuthAngle, spherical.theta ) );

			// restrict phi to be between desired limits
			spherical.phi = Math.max( scope.minPolarAngle, Math.min( scope.maxPolarAngle, spherical.phi ) );

			spherical.makeSafe();


			spherical.radius *= scale;

			// restrict radius to be between desired limits
			spherical.radius = Math.max( scope.minDistance, Math.min( scope.maxDistance, spherical.radius ) );

			// move target to panned location
			scope.target.add( panOffset );

			offset.setFromSpherical( spherical );

			// rotate offset back to "camera-up-vector-is-up" space
			offset.applyQuaternion( quatInverse );

			position.copy( scope.target ).add( offset );

			scope.object.lookAt( scope.target );

			if ( scope.enableDamping === true ) {

				sphericalDelta.theta *= ( 1 - scope.dampingFactor );
				sphericalDelta.phi *= ( 1 - scope.dampingFactor );

			} else {

				sphericalDelta.set( 0, 0, 0 );

			}

			scale = 1;
			panOffset.set( 0, 0, 0 );

			// update condition is:
			// min(camera displacement, camera rotation in radians)^2 > EPS
			// using small-angle approximation cos(x/2) = 1 - x^2 / 8

			if ( zoomChanged ||
				lastPosition.distanceToSquared( scope.object.position ) > EPS ||
				8 * ( 1 - lastQuaternion.dot( scope.object.quaternion ) ) > EPS ) {

				scope.dispatchEvent( changeEvent );

				lastPosition.copy( scope.object.position );
				lastQuaternion.copy( scope.object.quaternion );
				zoomChanged = false;

				return true;

			}

			return false;

		};

	}();

	this.dispose = function() {

		scope.domElement.removeEventListener( 'contextmenu', onContextMenu, false );
		scope.domElement.removeEventListener( 'mousedown', onMouseDown, false );
		scope.domElement.removeEventListener( 'wheel', onMouseWheel, false );

		scope.domElement.removeEventListener( 'touchstart', onTouchStart, false );
		scope.domElement.removeEventListener( 'touchend', onTouchEnd, false );
		scope.domElement.removeEventListener( 'touchmove', onTouchMove, false );

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );

		window.removeEventListener( 'keydown', onKeyDown, false );

		//scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?

	};

	//
	// internals
	//

	var scope = this;

	var changeEvent = { type: 'change' };
	var startEvent = { type: 'start' };
	var endEvent = { type: 'end' };

	var STATE = { NONE : - 1, ROTATE : 0, DOLLY : 1, PAN : 2, TOUCH_ROTATE : 3, TOUCH_DOLLY : 4, TOUCH_PAN : 5 };

	var state = STATE.NONE;

	var EPS = 0.000001;

	// current position in spherical coordinates
	var spherical = new THREE.Spherical();
	var sphericalDelta = new THREE.Spherical();

	var scale = 1;
	var panOffset = new THREE.Vector3();
	var zoomChanged = false;

	var rotateStart = new THREE.Vector2();
	var rotateEnd = new THREE.Vector2();
	var rotateDelta = new THREE.Vector2();

	var panStart = new THREE.Vector2();
	var panEnd = new THREE.Vector2();
	var panDelta = new THREE.Vector2();

	var dollyStart = new THREE.Vector2();
	var dollyEnd = new THREE.Vector2();
	var dollyDelta = new THREE.Vector2();

	function getAutoRotationAngle() {

		return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

	}

	function getZoomScale() {

		return Math.pow( 0.95, scope.zoomSpeed );

	}

	function rotateLeft( angle ) {

		sphericalDelta.theta -= angle;

	}

	function rotateUp( angle ) {

		sphericalDelta.phi -= angle;

	}

	var panLeft = function() {

		var v = new THREE.Vector3();

		return function panLeft( distance, objectMatrix ) {

			v.setFromMatrixColumn( objectMatrix, 0 ); // get X column of objectMatrix
			v.multiplyScalar( - distance );

			panOffset.add( v );

		};

	}();

	var panUp = function() {

		var v = new THREE.Vector3();

		return function panUp( distance, objectMatrix ) {

			v.setFromMatrixColumn( objectMatrix, 1 ); // get Y column of objectMatrix
			v.multiplyScalar( distance );

			panOffset.add( v );

		};

	}();

	// deltaX and deltaY are in pixels; right and down are positive
	var pan = function() {

		var offset = new THREE.Vector3();

		return function pan ( deltaX, deltaY ) {

			var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

			if ( scope.object instanceof THREE.PerspectiveCamera ) {

				// perspective
				var position = scope.object.position;
				offset.copy( position ).sub( scope.target );
				var targetDistance = offset.length();

				// half of the fov is center to top of screen
				targetDistance *= Math.tan( ( scope.object.fov / 2 ) * Math.PI / 180.0 );

				// we actually don't use screenWidth, since perspective camera is fixed to screen height
				panLeft( 2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix );
				panUp( 2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix );

			} else if ( scope.object instanceof THREE.OrthographicCamera ) {

				// orthographic
				panLeft( deltaX * ( scope.object.right - scope.object.left ) / scope.object.zoom / element.clientWidth, scope.object.matrix );
				panUp( deltaY * ( scope.object.top - scope.object.bottom ) / scope.object.zoom / element.clientHeight, scope.object.matrix );

			} else {

				// camera neither orthographic nor perspective
				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.' );
				scope.enablePan = false;

			}

		};

	}();

	function dollyIn( dollyScale ) {

		if ( scope.object instanceof THREE.PerspectiveCamera ) {

			scale /= dollyScale;

		} else if ( scope.object instanceof THREE.OrthographicCamera ) {

			scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom * dollyScale ) );
			scope.object.updateProjectionMatrix();
			zoomChanged = true;

		} else {

			console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
			scope.enableZoom = false;

		}

	}

	function dollyOut( dollyScale ) {

		if ( scope.object instanceof THREE.PerspectiveCamera ) {

			scale *= dollyScale;

		} else if ( scope.object instanceof THREE.OrthographicCamera ) {

			scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom / dollyScale ) );
			scope.object.updateProjectionMatrix();
			zoomChanged = true;

		} else {

			console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
			scope.enableZoom = false;

		}

	}

	//
	// event callbacks - update the object state
	//

	function handleMouseDownRotate( event ) {

		//console.log( 'handleMouseDownRotate' );

		rotateStart.set( event.clientX, event.clientY );

	}

	function handleMouseDownDolly( event ) {

		//console.log( 'handleMouseDownDolly' );

		dollyStart.set( event.clientX, event.clientY );

	}

	function handleMouseDownPan( event ) {

		//console.log( 'handleMouseDownPan' );

		panStart.set( event.clientX, event.clientY );

	}

	function handleMouseMoveRotate( event ) {

		//console.log( 'handleMouseMoveRotate' );

		rotateEnd.set( event.clientX, event.clientY );
		rotateDelta.subVectors( rotateEnd, rotateStart );

		var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

		// rotating across whole screen goes 360 degrees around
		rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );

		// rotating up and down along whole screen attempts to go 360, but limited to 180
		rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );

		rotateStart.copy( rotateEnd );

		scope.update();

	}

	function handleMouseMoveDolly( event ) {

		//console.log( 'handleMouseMoveDolly' );

		dollyEnd.set( event.clientX, event.clientY );

		dollyDelta.subVectors( dollyEnd, dollyStart );

		if ( dollyDelta.y > 0 ) {

			dollyIn( getZoomScale() );

		} else if ( dollyDelta.y < 0 ) {

			dollyOut( getZoomScale() );

		}

		dollyStart.copy( dollyEnd );

		scope.update();

	}

	function handleMouseMovePan( event ) {

		//console.log( 'handleMouseMovePan' );

		panEnd.set( event.clientX, event.clientY );

		panDelta.subVectors( panEnd, panStart );

		pan( panDelta.x, panDelta.y );

		panStart.copy( panEnd );

		scope.update();

	}

	function handleMouseUp( event ) {

		//console.log( 'handleMouseUp' );

	}

	function handleMouseWheel( event ) {

		//console.log( 'handleMouseWheel' );

		if ( event.deltaY < 0 ) {

			dollyOut( getZoomScale() );

		} else if ( event.deltaY > 0 ) {

			dollyIn( getZoomScale() );

		}

		scope.update();

	}

	function handleKeyDown( event ) {

		//console.log( 'handleKeyDown' );

		switch ( event.keyCode ) {

			case scope.keys.UP:
				pan( 0, scope.keyPanSpeed );
				scope.update();
				break;

			case scope.keys.BOTTOM:
				pan( 0, - scope.keyPanSpeed );
				scope.update();
				break;

			case scope.keys.LEFT:
				pan( scope.keyPanSpeed, 0 );
				scope.update();
				break;

			case scope.keys.RIGHT:
				pan( - scope.keyPanSpeed, 0 );
				scope.update();
				break;

		}

	}

	function handleTouchStartRotate( event ) {

		//console.log( 'handleTouchStartRotate' );

		rotateStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

	}

	function handleTouchStartDolly( event ) {

		//console.log( 'handleTouchStartDolly' );

		var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
		var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

		var distance = Math.sqrt( dx * dx + dy * dy );

		dollyStart.set( 0, distance );

	}

	function handleTouchStartPan( event ) {

		//console.log( 'handleTouchStartPan' );

		panStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

	}

	function handleTouchMoveRotate( event ) {

		//console.log( 'handleTouchMoveRotate' );

		rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
		rotateDelta.subVectors( rotateEnd, rotateStart );

		var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

		// rotating across whole screen goes 360 degrees around
		rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );

		// rotating up and down along whole screen attempts to go 360, but limited to 180
		rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );

		rotateStart.copy( rotateEnd );

		scope.update();

	}

	function handleTouchMoveDolly( event ) {

		//console.log( 'handleTouchMoveDolly' );

		var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
		var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

		var distance = Math.sqrt( dx * dx + dy * dy );

		dollyEnd.set( 0, distance );

		dollyDelta.subVectors( dollyEnd, dollyStart );

		if ( dollyDelta.y > 0 ) {

			dollyOut( getZoomScale() );

		} else if ( dollyDelta.y < 0 ) {

			dollyIn( getZoomScale() );

		}

		dollyStart.copy( dollyEnd );

		scope.update();

	}

	function handleTouchMovePan( event ) {

		//console.log( 'handleTouchMovePan' );

		panEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

		panDelta.subVectors( panEnd, panStart );

		pan( panDelta.x, panDelta.y );

		panStart.copy( panEnd );

		scope.update();

	}

	function handleTouchEnd( event ) {

		//console.log( 'handleTouchEnd' );

	}

	//
	// event handlers - FSM: listen for events and reset state
	//

	function onMouseDown( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();

		if ( event.button === scope.mouseButtons.ORBIT ) {

			if ( scope.enableRotate === false ) return;

			handleMouseDownRotate( event );

			state = STATE.ROTATE;

		} else if ( event.button === scope.mouseButtons.ZOOM ) {

			if ( scope.enableZoom === false ) return;

			handleMouseDownDolly( event );

			state = STATE.DOLLY;

		} else if ( event.button === scope.mouseButtons.PAN ) {

			if ( scope.enablePan === false ) return;

			handleMouseDownPan( event );

			state = STATE.PAN;

		}

		if ( state !== STATE.NONE ) {

			document.addEventListener( 'mousemove', onMouseMove, false );
			document.addEventListener( 'mouseup', onMouseUp, false );

			scope.dispatchEvent( startEvent );

		}

	}

	function onMouseMove( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();

		if ( state === STATE.ROTATE ) {

			if ( scope.enableRotate === false ) return;

			handleMouseMoveRotate( event );

		} else if ( state === STATE.DOLLY ) {

			if ( scope.enableZoom === false ) return;

			handleMouseMoveDolly( event );

		} else if ( state === STATE.PAN ) {

			if ( scope.enablePan === false ) return;

			handleMouseMovePan( event );

		}

	}

	function onMouseUp( event ) {

		if ( scope.enabled === false ) return;

		handleMouseUp( event );

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );

		scope.dispatchEvent( endEvent );

		state = STATE.NONE;

	}

	function onMouseWheel( event ) {

		if ( scope.enabled === false || scope.enableZoom === false || ( state !== STATE.NONE && state !== STATE.ROTATE ) ) return;

		event.preventDefault();
		event.stopPropagation();

		handleMouseWheel( event );

		scope.dispatchEvent( startEvent ); // not sure why these are here...
		scope.dispatchEvent( endEvent );

	}

	function onKeyDown( event ) {

		if ( scope.enabled === false || scope.enableKeys === false || scope.enablePan === false ) return;

		handleKeyDown( event );

	}

	function onTouchStart( event ) {

		if ( scope.enabled === false ) return;

		switch ( event.touches.length ) {

			case 1:	// one-fingered touch: rotate

				if ( scope.enableRotate === false ) return;

				handleTouchStartRotate( event );

				state = STATE.TOUCH_ROTATE;

				break;

			case 2:	// two-fingered touch: dolly

				if ( scope.enableZoom === false ) return;

				handleTouchStartDolly( event );

				state = STATE.TOUCH_DOLLY;

				break;

			case 3: // three-fingered touch: pan

				if ( scope.enablePan === false ) return;

				handleTouchStartPan( event );

				state = STATE.TOUCH_PAN;

				break;

			default:

				state = STATE.NONE;

		}

		if ( state !== STATE.NONE ) {

			scope.dispatchEvent( startEvent );

		}

	}

	function onTouchMove( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		switch ( event.touches.length ) {

			case 1: // one-fingered touch: rotate

				if ( scope.enableRotate === false ) return;
				if ( state !== STATE.TOUCH_ROTATE ) return; // is this needed?...

				handleTouchMoveRotate( event );

				break;

			case 2: // two-fingered touch: dolly

				if ( scope.enableZoom === false ) return;
				if ( state !== STATE.TOUCH_DOLLY ) return; // is this needed?...

				handleTouchMoveDolly( event );

				break;

			case 3: // three-fingered touch: pan

				if ( scope.enablePan === false ) return;
				if ( state !== STATE.TOUCH_PAN ) return; // is this needed?...

				handleTouchMovePan( event );

				break;

			default:

				state = STATE.NONE;

		}

	}

	function onTouchEnd( event ) {

		if ( scope.enabled === false ) return;

		handleTouchEnd( event );

		scope.dispatchEvent( endEvent );

		state = STATE.NONE;

	}

	function onContextMenu( event ) {

		event.preventDefault();

	}

	//

	scope.domElement.addEventListener( 'contextmenu', onContextMenu, false );

	scope.domElement.addEventListener( 'mousedown', onMouseDown, false );
	scope.domElement.addEventListener( 'wheel', onMouseWheel, false );

	scope.domElement.addEventListener( 'touchstart', onTouchStart, false );
	scope.domElement.addEventListener( 'touchend', onTouchEnd, false );
	scope.domElement.addEventListener( 'touchmove', onTouchMove, false );

	window.addEventListener( 'keydown', onKeyDown, false );

	// force an update at start

	this.update();

};

THREE.OrbitControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.OrbitControls.prototype.constructor = THREE.OrbitControls;

Object.defineProperties( THREE.OrbitControls.prototype, {

	center: {

		get: function () {

			console.warn( 'THREE.OrbitControls: .center has been renamed to .target' );
			return this.target;

		}

	},

	// backward compatibility

	noZoom: {

		get: function () {

			console.warn( 'THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.' );
			return ! this.enableZoom;

		},

		set: function ( value ) {

			console.warn( 'THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.' );
			this.enableZoom = ! value;

		}

	},

	noRotate: {

		get: function () {

			console.warn( 'THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.' );
			return ! this.enableRotate;

		},

		set: function ( value ) {

			console.warn( 'THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.' );
			this.enableRotate = ! value;

		}

	},

	noPan: {

		get: function () {

			console.warn( 'THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.' );
			return ! this.enablePan;

		},

		set: function ( value ) {

			console.warn( 'THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.' );
			this.enablePan = ! value;

		}

	},

	noKeys: {

		get: function () {

			console.warn( 'THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.' );
			return ! this.enableKeys;

		},

		set: function ( value ) {

			console.warn( 'THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.' );
			this.enableKeys = ! value;

		}

	},

	staticMoving : {

		get: function () {

			console.warn( 'THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.' );
			return ! this.enableDamping;

		},

		set: function ( value ) {

			console.warn( 'THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.' );
			this.enableDamping = ! value;

		}

	},

	dynamicDampingFactor : {

		get: function () {

			console.warn( 'THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.' );
			return this.dampingFactor;

		},

		set: function ( value ) {

			console.warn( 'THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.' );
			this.dampingFactor = value;

		}

	}

} );