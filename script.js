"use strict";function initScene(){HEIGHT=window.innerHeight,WIDTH=window.innerWidth,scene=new THREE.Scene,aspectRatio=WIDTH/HEIGHT,fieldOfView=45,nearPlane=1,farPlane=1e4,camera=new THREE.PerspectiveCamera(fieldOfView,aspectRatio,nearPlane,farPlane),camera.position.x=500,camera.position.z=500,camera.position.y=500,camera.lookAt(new THREE.Vector3(0,0,0)),renderer=new THREE.WebGLRenderer({alpha:!0,antialias:!0}),renderer.setSize(WIDTH,HEIGHT),renderer.shadowMap.enabled=!0,container=document.getElementById("canvas"),container.appendChild(renderer.domElement),window.addEventListener("resize",handleWindowResize,!1);var e=new THREE.HemisphereLight(11184810,0,.9);shadowLight=new THREE.DirectionalLight(16777215,.9),shadowLight.position.set(150,350,350),shadowLight.position.copy(camera.position),shadowLight.castShadow=!0,shadowLight.shadow.camera.left=-400,shadowLight.shadow.camera.right=400,shadowLight.shadow.camera.top=400,shadowLight.shadow.camera.bottom=-400,shadowLight.shadow.camera.near=1,shadowLight.shadow.camera.far=1e3,shadowLight.shadow.mapSize.width=2048,shadowLight.shadow.mapSize.height=2048,scene.add(e),scene.add(shadowLight);var t=new THREE.OrbitControls(camera,renderer.domElement);t.minPolarAngle=.45*-Math.PI,t.maxPolarAngle=.45*Math.PI,t.minDistance=500,t.maxDistance=2e3,t.enabled=!0,t.enableZoom=!0,t.enablePan=!1,t&&t.enabled&&t.update(),t.addEventListener("change",function(){})}function handleWindowResize(){HEIGHT=window.innerHeight,WIDTH=window.innerWidth,renderer.setSize(WIDTH,HEIGHT),camera.aspect=WIDTH/HEIGHT,camera.updateProjectionMatrix(),render()}function render(){levelOpen&&levelFocusAnim(levelOpen),renderer.render(scene,camera),requestAnimationFrame(render)}function focusOnLevel(activateLevel){levelOpen=eval(activateLevel)}function buildingExplode(){if(levelOpen&&levelFocusAnimState)return!1;TweenMax.to(level2.mesh.position,1,{y:25}),TweenMax.to(level2.mesh.children[0].children[0].material,2,{opacity:0}),TweenMax.to(level2.mesh.children[0].children[1].material,2,{opacity:.25}),TweenMax.to(level1.mesh.position,1,{y:-25,delay:0}),TweenMax.to(level1.mesh.children[0].children[0].material,2,{opacity:0}),TweenMax.to(level1.mesh.children[0].children[1].material,2,{opacity:.25}),TweenMax.to(level0.mesh.position,1,{y:-75,delay:0}),TweenMax.to(level0.mesh.children[0].children[0].material,2,{opacity:0}),TweenMax.to(level0.mesh.children[0].children[1].material,2,{opacity:.25}),TweenMax.to(front.mesh.position,1,{z:100,y:-50,delay:0}),levelFocusAnimState=!0}function buildingOpenAnim(){TweenMax.to(level0.mesh.children[0].children[0].material,2,{opacity:0}),TweenMax.to(level1.mesh.children[0].children[0].material,2,{opacity:0}),TweenMax.to(level2.mesh.children[0].children[0].material,2,{opacity:0})}function buildingReset(){TweenMax.to(level0.mesh.children[0].children[0].material,2,{opacity:1}),TweenMax.to(level1.mesh.children[0].children[0].material,2,{opacity:1}),TweenMax.to(level2.mesh.children[0].children[0].material,2,{opacity:1}),TweenMax.to(level0.mesh.children[0].children[1].material,2,{opacity:1}),TweenMax.to(level1.mesh.children[0].children[1].material,2,{opacity:1}),TweenMax.to(level2.mesh.children[0].children[1].material,2,{opacity:1}),TweenMax.to(level2.mesh.position,1,{y:0,delay:0}),TweenMax.to(level1.mesh.position,1,{y:0,delay:0}),TweenMax.to(level0.mesh.position,1,{y:0,delay:0}),TweenMax.to(front.mesh.position,1,{z:0,y:0,delay:0}),levelFocusAnimState=!1,levelOpen=!1}function merge(){for(var e,t,n,a=arguments[0]||{},o=1,i=arguments.length;o<i;o++)if(null!=(e=arguments[o]))for(t in e)n=e[t],a!==n&&n!==undefined&&(a[t]=n);return a}function onDocumentMouseDown(e){if(0===objectsInScene.length)return!1;e.preventDefault(),mousePosition.x=e.clientX/window.innerWidth*2-1,mousePosition.y=2*-(e.clientY/window.innerHeight)+1,raycaster.setFromCamera(mousePosition,camera);var t=raycaster.intersectObjects(objectsInScene,!0);if(t.length>0){for(var n=0;n<t.length;n++){var a=t[n].object;if("room"==a.model_type&&("explode"==main.dataset.state||"opaque"==main.dataset.state)){var o=a.available;showDetails(a.model_id,o)}"building"==a.model_type&&"reset"==main.dataset.state&&setState("explode"),"building"==a.model_type&&"reset"!=main.dataset.state&&1==t.length&&setState("reset")}null!=t[0].object.click&&t[0].object.click()}}function onDocumentMouseOver(e){if(0===objectsInScene.length)return!1;e.preventDefault(),mousePosition.x=e.clientX/window.innerWidth*2-1,mousePosition.y=2*-(e.clientY/window.innerHeight)+1;var t=!1,n=!0;raycaster.setFromCamera(mousePosition,camera);var a=raycaster.intersectObjects(objectsInScene,!0);if(a.length>0){n=!1;for(var o=0;o<a.length;o++){"room"!=a[o].object.model_type||"explode"!=main.dataset.state&&"opaque"!=main.dataset.state||(t=!0)}}t?document.body.classList.add("mouseOnSelectableObject"):document.body.classList.remove("mouseOnSelectableObject"),n?document.body.classList.add("mouseOnCanvas"):document.body.classList.remove("mouseOnCanvas")}THREE.OrbitControls=function(e,t){function n(){return 2*Math.PI/60/60*j.autoRotateSpeed}function a(){return Math.pow(.95,j.zoomSpeed)}function o(e){B.theta-=e}function i(e){B.phi-=e}function s(e){j.object instanceof THREE.PerspectiveCamera?U/=e:j.object instanceof THREE.OrthographicCamera?(j.object.zoom=Math.max(j.minZoom,Math.min(j.maxZoom,j.object.zoom*e)),j.object.updateProjectionMatrix(),W=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),j.enableZoom=!1)}function r(e){j.object instanceof THREE.PerspectiveCamera?U*=e:j.object instanceof THREE.OrthographicCamera?(j.object.zoom=Math.max(j.minZoom,Math.min(j.maxZoom,j.object.zoom/e)),j.object.updateProjectionMatrix(),W=!0):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),j.enableZoom=!1)}function d(e){Z.set(e.clientX,e.clientY)}function l(e){J.set(e.clientX,e.clientY)}function h(e){X.set(e.clientX,e.clientY)}function m(e){Y.set(e.clientX,e.clientY),_.subVectors(Y,Z);var t=j.domElement===document?j.domElement.body:j.domElement;o(2*Math.PI*_.x/t.clientWidth*j.rotateSpeed),i(2*Math.PI*_.y/t.clientHeight*j.rotateSpeed),Z.copy(Y),j.update()}function c(e){Q.set(e.clientX,e.clientY),$.subVectors(Q,J),$.y>0?s(a()):$.y<0&&r(a()),J.copy(Q),j.update()}function u(e){q.set(e.clientX,e.clientY),K.subVectors(q,X),ne(K.x,K.y),X.copy(q),j.update()}function w(){}function p(e){e.deltaY<0?r(a()):e.deltaY>0&&s(a()),j.update()}function E(e){switch(e.keyCode){case j.keys.UP:ne(0,j.keyPanSpeed),j.update();break;case j.keys.BOTTOM:ne(0,-j.keyPanSpeed),j.update();break;case j.keys.LEFT:ne(j.keyPanSpeed,0),j.update();break;case j.keys.RIGHT:ne(-j.keyPanSpeed,0),j.update()}}function g(e){Z.set(e.touches[0].pageX,e.touches[0].pageY)}function y(e){var t=e.touches[0].pageX-e.touches[1].pageX,n=e.touches[0].pageY-e.touches[1].pageY,a=Math.sqrt(t*t+n*n);J.set(0,a)}function v(e){X.set(e.touches[0].pageX,e.touches[0].pageY)}function b(e){Y.set(e.touches[0].pageX,e.touches[0].pageY),_.subVectors(Y,Z);var t=j.domElement===document?j.domElement.body:j.domElement;o(2*Math.PI*_.x/t.clientWidth*j.rotateSpeed),i(2*Math.PI*_.y/t.clientHeight*j.rotateSpeed),Z.copy(Y),j.update()}function T(e){var t=e.touches[0].pageX-e.touches[1].pageX,n=e.touches[0].pageY-e.touches[1].pageY,o=Math.sqrt(t*t+n*n);Q.set(0,o),$.subVectors(Q,J),$.y>0?r(a()):$.y<0&&s(a()),J.copy(Q),j.update()}function f(e){q.set(e.touches[0].pageX,e.touches[0].pageY),K.subVectors(q,X),ne(K.x,K.y),X.copy(q),j.update()}function x(){}function R(e){if(j.enabled!==!1){if(e.preventDefault(),e.button===j.mouseButtons.ORBIT){if(j.enableRotate===!1)return;d(e),N=A.ROTATE}else if(e.button===j.mouseButtons.ZOOM){if(j.enableZoom===!1)return;l(e),N=A.DOLLY}else if(e.button===j.mouseButtons.PAN){if(j.enablePan===!1)return;h(e),N=A.PAN}N!==A.NONE&&(document.addEventListener("mousemove",H,!1),document.addEventListener("mouseup",z,!1),j.dispatchEvent(P))}}function H(e){if(j.enabled!==!1)if(e.preventDefault(),N===A.ROTATE){if(j.enableRotate===!1)return;m(e)}else if(N===A.DOLLY){if(j.enableZoom===!1)return;c(e)}else if(N===A.PAN){if(j.enablePan===!1)return;u(e)}}function z(e){j.enabled!==!1&&(w(e),document.removeEventListener("mousemove",H,!1),document.removeEventListener("mouseup",z,!1),j.dispatchEvent(I),N=A.NONE)}function M(e){j.enabled===!1||j.enableZoom===!1||N!==A.NONE&&N!==A.ROTATE||(e.preventDefault(),e.stopPropagation(),p(e),j.dispatchEvent(P),j.dispatchEvent(I))}function O(e){j.enabled!==!1&&j.enableKeys!==!1&&j.enablePan!==!1&&E(e)}function k(e){if(j.enabled!==!1){switch(e.touches.length){case 1:if(j.enableRotate===!1)return;g(e),N=A.TOUCH_ROTATE;break;case 2:if(j.enableZoom===!1)return;y(e),N=A.TOUCH_DOLLY;break;case 3:if(j.enablePan===!1)return;v(e),N=A.TOUCH_PAN;break;default:N=A.NONE}N!==A.NONE&&j.dispatchEvent(P)}}function D(e){if(j.enabled!==!1)switch(e.preventDefault(),e.stopPropagation(),e.touches.length){case 1:if(j.enableRotate===!1)return;if(N!==A.TOUCH_ROTATE)return;b(e);break;case 2:if(j.enableZoom===!1)return;if(N!==A.TOUCH_DOLLY)return;T(e);break;case 3:if(j.enablePan===!1)return;if(N!==A.TOUCH_PAN)return;f(e);break;default:N=A.NONE}}function C(e){j.enabled!==!1&&(x(e),j.dispatchEvent(I),N=A.NONE)}function L(e){e.preventDefault()}this.object=e,this.domElement=t!==undefined?t:document,this.enabled=!0,this.target=new THREE.Vector3,this.minDistance=0,this.maxDistance=Infinity,this.minZoom=0,this.maxZoom=Infinity,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-Infinity,this.maxAzimuthAngle=Infinity,this.enableDamping=!1,this.dampingFactor=.25,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.keyPanSpeed=7,this.autoRotate=!1,this.autoRotateSpeed=2,this.enableKeys=!0,this.keys={LEFT:37,UP:38,RIGHT:39,BOTTOM:40},this.mouseButtons={ORBIT:THREE.MOUSE.LEFT,ZOOM:THREE.MOUSE.MIDDLE,PAN:THREE.MOUSE.RIGHT},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this.getPolarAngle=function(){return G.phi},this.getAzimuthalAngle=function(){return G.theta},this.reset=function(){j.target.copy(j.target0),j.object.position.copy(j.position0),j.object.zoom=j.zoom0,j.object.updateProjectionMatrix(),j.dispatchEvent(S),j.update(),N=A.NONE},this.update=function(){var t=new THREE.Vector3,a=(new THREE.Quaternion).setFromUnitVectors(e.up,new THREE.Vector3(0,1,0)),i=a.clone().inverse(),s=new THREE.Vector3,r=new THREE.Quaternion;return function(){var e=j.object.position;return t.copy(e).sub(j.target),t.applyQuaternion(a),G.setFromVector3(t),j.autoRotate&&N===A.NONE&&o(n()),G.theta+=B.theta,G.phi+=B.phi,G.theta=Math.max(j.minAzimuthAngle,Math.min(j.maxAzimuthAngle,G.theta)),G.phi=Math.max(j.minPolarAngle,Math.min(j.maxPolarAngle,G.phi)),G.makeSafe(),G.radius*=U,G.radius=Math.max(j.minDistance,Math.min(j.maxDistance,G.radius)),j.target.add(V),t.setFromSpherical(G),t.applyQuaternion(i),e.copy(j.target).add(t),j.object.lookAt(j.target),j.enableDamping===!0?(B.theta*=1-j.dampingFactor,B.phi*=1-j.dampingFactor):B.set(0,0,0),U=1,V.set(0,0,0),!!(W||s.distanceToSquared(j.object.position)>F||8*(1-r.dot(j.object.quaternion))>F)&&(j.dispatchEvent(S),s.copy(j.object.position),r.copy(j.object.quaternion),W=!1,!0)}}(),this.dispose=function(){j.domElement.removeEventListener("contextmenu",L,!1),j.domElement.removeEventListener("mousedown",R,!1),j.domElement.removeEventListener("wheel",M,!1),j.domElement.removeEventListener("touchstart",k,!1),j.domElement.removeEventListener("touchend",C,!1),j.domElement.removeEventListener("touchmove",D,!1),document.removeEventListener("mousemove",H,!1),document.removeEventListener("mouseup",z,!1),window.removeEventListener("keydown",O,!1)};var j=this,S={type:"change"},P={type:"start"},I={type:"end"},A={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_DOLLY:4,TOUCH_PAN:5},N=A.NONE,F=1e-6,G=new THREE.Spherical,B=new THREE.Spherical,U=1,V=new THREE.Vector3,W=!1,Z=new THREE.Vector2,Y=new THREE.Vector2,_=new THREE.Vector2,X=new THREE.Vector2,q=new THREE.Vector2,K=new THREE.Vector2,J=new THREE.Vector2,Q=new THREE.Vector2,$=new THREE.Vector2,ee=function(){var e=new THREE.Vector3;return function(t,n){e.setFromMatrixColumn(n,0),e.multiplyScalar(-t),V.add(e)}}(),te=function(){var e=new THREE.Vector3;return function(t,n){e.setFromMatrixColumn(n,1),e.multiplyScalar(t),V.add(e)}}(),ne=function(){var e=new THREE.Vector3;return function(t,n){var a=j.domElement===document?j.domElement.body:j.domElement;if(j.object instanceof THREE.PerspectiveCamera){var o=j.object.position;e.copy(o).sub(j.target);var i=e.length();i*=Math.tan(j.object.fov/2*Math.PI/180),ee(2*t*i/a.clientHeight,j.object.matrix),te(2*n*i/a.clientHeight,j.object.matrix)}else j.object instanceof THREE.OrthographicCamera?(ee(t*(j.object.right-j.object.left)/j.object.zoom/a.clientWidth,j.object.matrix),te(n*(j.object.top-j.object.bottom)/j.object.zoom/a.clientHeight,j.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),j.enablePan=!1)}}();j.domElement.addEventListener("contextmenu",L,!1),j.domElement.addEventListener("mousedown",R,!1),j.domElement.addEventListener("wheel",M,!1),j.domElement.addEventListener("touchstart",k,!1),j.domElement.addEventListener("touchend",C,!1),j.domElement.addEventListener("touchmove",D,!1),window.addEventListener("keydown",O,!1),this.update()},THREE.OrbitControls.prototype=Object.create(THREE.EventDispatcher.prototype),THREE.OrbitControls.prototype.constructor=THREE.OrbitControls,Object.defineProperties(THREE.OrbitControls.prototype,{center:{get:function(){return console.warn("THREE.OrbitControls: .center has been renamed to .target"),this.target}},noZoom:{get:function(){return console.warn("THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead."),!this.enableZoom},set:function(e){console.warn("THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead."),this.enableZoom=!e}},noRotate:{get:function(){return console.warn("THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead."),!this.enableRotate},set:function(e){console.warn("THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead."),this.enableRotate=!e}},noPan:{get:function(){return console.warn("THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead."),!this.enablePan},set:function(e){console.warn("THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead."),this.enablePan=!e}},noKeys:{get:function(){return console.warn("THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead."),!this.enableKeys},set:function(e){console.warn("THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead."),this.enableKeys=!e}},staticMoving:{get:function(){return console.warn("THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead."),!this.enableDamping},set:function(e){console.warn("THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead."),this.enableDamping=!e}},dynamicDampingFactor:{get:function(){return console.warn("THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead."),this.dampingFactor},set:function(e){console.warn("THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead."),this.dampingFactor=e}}});var scene,camera,fieldOfView,aspectRatio,nearPlane,farPlane,HEIGHT,WIDTH,renderer,container,shadowLight,church,level0,level1,level2,front,levelOpen,levelFocusAnim,levelFocusAnimState,objectsInScene=[],main=document.querySelector("main"),avaiableRoomCounter=0,objectsInScene=[],objectsWireFrameInScene=[],u=8,Settings={strokeWidth:1,fillObjects:!0,init:{interactions:!0}},Colors={primaryColor:16777215,secondaryColor:15658734,backgroundColor:11119017,strokeColor:3355443,lineColor:3355443,accentColor:30935,unavailableColor:15045632,availableColor:4821811,availableFillColor:11981741,selectedColor:9025500,lightColor:15658734},matLines=new THREE.LineBasicMaterial({color:Colors.lineColor,linewidth:Settings.strokeWidth}),material=new THREE.MeshBasicMaterial({color:Colors.primaryColor,transparent:!0,opacity:1,polygonOffset:!0,polygonOffsetUnits:1,polygonOffsetFactor:1}),matWhite=new THREE.MeshBasicMaterial({color:Colors.primaryColor,polygonOffset:!0,polygonOffsetUnits:1,polygonOffsetFactor:1}),matZone=new THREE.MeshBasicMaterial({color:Colors.secondaryColor,polygonOffset:!0,polygonOffsetUnits:-1,polygonOffsetFactor:1}),matDark=new THREE.MeshBasicMaterial({color:Colors.lineColor,polygonOffset:!0,polygonOffsetUnits:1,polygonOffsetFactor:1}),matLinesInvisible=new THREE.LineBasicMaterial({color:Colors.lineColor,linewidth:Settings.strokeWidth,transparent:!0,opacity:1}),matLinesAvailable=new THREE.LineBasicMaterial({color:Colors.accentColor,linewidth:Settings.strokeWidth}),matLinesUnAvailable=new THREE.LineBasicMaterial({color:Colors.lineColor,linewidth:Settings.strokeWidth}),matInvisible=new THREE.MeshBasicMaterial({color:Colors.primaryColor,transparent:!0,opacity:0,polygonOffset:!0,polygonOffsetUnits:-1,polygonOffsetFactor:-1}),Building=function(e){e=merge({},e||{}),this.mesh=new THREE.Object3D,level0=new Level(e),populateLevel0(),this.mesh.add(level0.mesh),level1=new Level({y:7*u}),populateLevel1(),this.mesh.add(level1.mesh),level2=new Roof,this.mesh.add(level2.mesh),front=new Front,this.mesh.add(front.mesh)},Level=function(e){e=merge({id:"noId",width:18*u,height:7*u,depth:45*u,x:0,y:0,z:0},e||{}),this.mesh=new THREE.Object3D;var t=new THREE.Object3D,n=new THREE.BoxGeometry(e.width,e.height,e.depth);n.applyMatrix((new THREE.Matrix4).makeTranslation(e.x,e.y+e.height/2,e.z));var a=new THREE.Mesh(n,material.clone()),o=new THREE.LineSegments(new THREE.EdgesGeometry(n),matLinesInvisible.clone());a.model_type="building",t.add(a),t.add(o),this.mesh.add(t),objectsInScene.push(this.mesh)},Roof=function(e){e=merge({id:"noId",width:18*u,height:10*u,depth:45*u,x:0,y:14*u,z:0},e||{}),this.mesh=new THREE.Object3D;var t=new THREE.Object3D,n=new THREE.BoxGeometry(e.width,e.height,e.depth);n.applyMatrix((new THREE.Matrix4).makeTranslation(e.x,e.y+e.height/2,e.z)),n.vertices[0].x-=e.width/2,n.vertices[1].x-=e.width/2,n.vertices[4].x+=e.width/2,n.vertices[5].x+=e.width/2;var a=new THREE.Mesh(n,material.clone()),o=new THREE.LineSegments(new THREE.EdgesGeometry(n),matLinesInvisible.clone());a.model_type="building",t.add(a),t.add(o),this.mesh.add(t),objectsInScene.push(this.mesh)},Front=function(e){e=merge({id:"noId",width:18*u,height:10*u,depth:45*u,x:0,y:14*u,z:0},e||{}),this.mesh=new THREE.Object3D;var t=new THREE.Object3D,n=e.height+7*u+7*u+3*u,a=new THREE.BoxGeometry(e.width/4,n,e.width/4);a.applyMatrix((new THREE.Matrix4).makeTranslation(e.x,n/2,e.depth/2-e.width/12-1));var o=5*u,i=new THREE.BoxGeometry(e.width/4,o,e.width/4);i.vertices[0].x-=e.width/8,i.vertices[1].x-=e.width/8,i.vertices[4].x+=e.width/8,i.vertices[5].x+=e.width/8,i.vertices[5].z-=e.width/8,i.vertices[4].z+=e.width/8,i.vertices[1].z+=e.width/8,i.vertices[0].z-=e.width/8,i.applyMatrix((new THREE.Matrix4).makeTranslation(e.x,n+o/2,e.depth/2-e.width/12-1)),a.merge(i);var s=new THREE.BoxGeometry(e.width/2,5,e.width/2);s.applyMatrix((new THREE.Matrix4).makeTranslation(e.x,2.5,e.depth/2+e.width/4+0)),a.merge(s);var s=new THREE.BoxGeometry(e.width/2.5,5,e.width/2.5);s.applyMatrix((new THREE.Matrix4).makeTranslation(e.x,7.5,e.depth/2+e.width/4+0-e.width/19.5)),a.merge(s);var s=new THREE.BoxGeometry(e.width/3.5,5,e.width/3.5);s.applyMatrix((new THREE.Matrix4).makeTranslation(e.x,12.5,e.depth/2+e.width/4+0-e.width/9.5)),a.merge(s);var r=new THREE.Mesh(a,material.clone()),d=new THREE.LineSegments(new THREE.EdgesGeometry(a),matLinesInvisible.clone());r.model_type="building",t.add(r),t.add(d),this.mesh.add(t),objectsInScene.push(this.mesh)},populateLevel0=function(){var e=new room({id:"fillipus",type:"room",width:9*u,depth:9*u,z:18*u,x:4.5*u*-1}),t=7.5;e.mesh.add(new Desk({z:e.args.z-5,x:1-e.args.width+t}).mesh),e.mesh.add(new Desk({z:e.args.z+5,x:1-e.args.width+t}).mesh),e.mesh.add(new Desk({z:e.args.z-5,x:1-e.args.width+3*t}).mesh),e.mesh.add(new Desk({z:e.args.z+5,x:1-e.args.width+3*t}).mesh),e.mesh.add(new Desk({z:e.args.z-5,x:1-e.args.width+5*t}).mesh),e.mesh.add(new Desk({z:e.args.z+5,x:1-e.args.width+5*t}).mesh),e.mesh.add(new Desk({z:e.args.z-5,x:1-e.args.width+7*t}).mesh),e.mesh.add(new Desk({z:e.args.z+5,x:1-e.args.width+7*t}).mesh),level0.mesh.add(e.mesh);var n=new room({id:"Jakobus",type:"room",width:9*u,depth:9*u,z:18*u,x:4.5*u}),t=7.5;n.mesh.add(new Desk({z:n.args.z-5,x:n.args.width-1-t}).mesh),n.mesh.add(new Desk({z:n.args.z+5,x:n.args.width-1-t}).mesh),n.mesh.add(new Desk({z:n.args.z-5,x:n.args.width-1-3*t}).mesh),n.mesh.add(new Desk({z:n.args.z+5,x:n.args.width-1-3*t}).mesh),n.mesh.add(new Desk({z:n.args.z-5,x:n.args.width-1-5*t}).mesh),n.mesh.add(new Desk({z:n.args.z+5,x:n.args.width-1-5*t}).mesh),n.mesh.add(new Desk({z:n.args.z-5,x:n.args.width-1-7*t}).mesh),n.mesh.add(new Desk({z:n.args.z+5,x:n.args.width-1-7*t}).mesh),level0.mesh.add(n.mesh);var a=new room({id:"standup",depth:9*u,z:9*u}),t=7.5;a.mesh.add(new Desk({z:a.args.z-5,x:-a.args.width/2+3*t}).mesh),a.mesh.add(new Desk({z:a.args.z+5,x:-a.args.width/2+3*t}).mesh),a.mesh.add(new Desk({z:a.args.z-5,x:-a.args.width/2+5*t}).mesh),a.mesh.add(new Desk({z:a.args.z+5,x:-a.args.width/2+5*t}).mesh);var t=5;a.mesh.add(new Desk({width:10,depth:15,z:a.args.z-7.5,x:a.args.width/2-6*t}).mesh),a.mesh.add(new Desk({width:10,depth:15,z:a.args.z+7.5,x:a.args.width/2-6*t}).mesh),a.mesh.add(new Desk({width:10,depth:15,z:a.args.z-7.5,x:a.args.width/2-8*t}).mesh),a.mesh.add(new Desk({width:10,depth:15,z:a.args.z+7.5,x:a.args.width/2-8*t}).mesh),level0.mesh.add(a.mesh);var o=new room({id:"work",depth:9*u,z:0*u}),t=7.5;o.mesh.add(new Desk({z:o.args.z-5,x:-o.args.width/2+1+t}).mesh),o.mesh.add(new Desk({z:o.args.z+5,x:-o.args.width/2+1+t}).mesh),o.mesh.add(new Desk({z:o.args.z-5,x:-o.args.width/2+1+3*t}).mesh),o.mesh.add(new Desk({z:o.args.z+5,x:-o.args.width/2+1+3*t}).mesh),o.mesh.add(new Desk({z:o.args.z-5,x:-o.args.width/2+1+5*t}).mesh),o.mesh.add(new Desk({z:o.args.z+5,x:-o.args.width/2+1+5*t}).mesh),o.mesh.add(new Desk({z:o.args.z-5,x:-o.args.width/2+1+7*t}).mesh),o.mesh.add(new Desk({z:o.args.z+5,x:-o.args.width/2+1+7*t}).mesh),level0.mesh.add(o.mesh);var i=new room({id:"lunch",depth:9*u,z:-9*u}),s=new Desk({width:9*u,depth:10,z:i.args.z-i.args.depth/2+10});i.mesh.add(s.mesh);var r=new Desk({width:15,depth:30,z:i.args.z+i.args.depth/2-20,x:-i.args.width/3});i.mesh.add(r.mesh);var d=new Tree({z:i.args.z+25});i.mesh.add(d.mesh),level0.mesh.add(i.mesh);var l=new room({id:"petrus",type:"room",width:9*u,depth:9*u,z:-18*u}),h=new Desk({width:20,depth:20,z:l.args.z});l.mesh.add(h.mesh),level0.mesh.add(l.mesh);var m=new room({id:"kitchen",width:4.5*u,depth:9*u,z:-18*u,x:-6.75*u});level0.mesh.add(m.mesh);var c=new room({id:"entrance",width:4.5*u,depth:9*u,z:-18*u,x:6.75*u});level0.mesh.add(c.mesh)},populateLevel1=function(){var e=new room({id:"paulus",type:"room",width:12*u,depth:9*u,z:18*u,x:3*u*-1,y:7*u});e.mesh.add(new Desk({width:e.args.width/1.5,depth:e.args.depth/2,z:e.args.z,y:e.args.y,x:-25}).mesh),level1.mesh.add(e.mesh);var t=new room({id:"hallway",width:6*u,depth:12*u,z:16.5*u,x:6*u,y:7*u});level1.mesh.add(t.mesh);var n=new room({id:"FishBowl",width:9*u,depth:15*u,z:6*u,x:1.5*u*-1,y:7*u});n.mesh.add(new Desk({z:n.args.z-30,y:n.args.y,x:n.args.x-15}).mesh),n.mesh.add(new Desk({z:n.args.z-30-10,y:n.args.y,x:n.args.x-15}).mesh),n.mesh.add(new Desk({z:n.args.z-30,y:n.args.y,x:n.args.x+15}).mesh),n.mesh.add(new Desk({z:n.args.z-30-10,y:n.args.y,x:n.args.x+15}).mesh),n.mesh.add(new Desk({z:n.args.z+30,y:n.args.y,x:n.args.x-15}).mesh),n.mesh.add(new Desk({z:n.args.z+30-10,y:n.args.y,x:n.args.x-15}).mesh),n.mesh.add(new Desk({z:n.args.z+30,y:n.args.y,x:n.args.x+15}).mesh),n.mesh.add(new Desk({z:n.args.z+30-10,y:n.args.y,x:n.args.x+15}).mesh),level1.mesh.add(n.mesh);var a=new room({id:"andreas",type:"room",width:9*u,depth:6*u,z:-16.5*u,y:7*u});level1.mesh.add(a.mesh);var o=new room({id:"mattheus",type:"room",width:4.5*u,depth:9*u,z:-18*u,x:-6.75*u,y:7*u}),i=new Desk({width:20,depth:20,y:o.args.y,z:o.args.z,x:o.args.x});o.mesh.add(i.mesh),level1.mesh.add(o.mesh);var s=new room({id:"johannes",type:"room",width:4.5*u,depth:6*u,z:-16.5*u,x:6.75*u,y:7*u}),i=new Desk({width:20,depth:20,y:s.args.y,z:s.args.z,x:s.args.x});s.mesh.add(i.mesh),level1.mesh.add(s.mesh);var r=new room({id:"smallhallway",width:13.5*u,depth:3*u,z:-21*u,x:2.25*u,y:7*u});level1.mesh.add(r.mesh)},room=function(e){e=merge({id:"noId",type:"none",width:18*u,height:7*u,depth:36*u,x:0,y:0,z:0,material:matWhite},e||{}),this.args=e,this.mesh=new THREE.Object3D;var t=new THREE.BoxGeometry(e.width,e.height,e.depth);t.applyMatrix((new THREE.Matrix4).makeTranslation(e.x,e.y,e.z));var n=new THREE.Mesh(t,matInvisible.clone()),a=new THREE.BoxGeometry(e.width,0,e.depth);a.applyMatrix((new THREE.Matrix4).makeTranslation(e.x,e.y,e.z));var o="room"==e.type?matZone:e.material,i=new THREE.Mesh(a,o.clone());i.click=function(){},i.model_id=e.id,i.model_type=e.type,this.mesh.add(n),this.mesh.add(i),"room"==e.type&&this.mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(a),matLinesAvailable.clone())),objectsInScene.push(this.mesh)},Desk=function(e){e=merge({width:15,depth:10,height:7,colorTableTop:Colors.primaryColor,colorLegs:Colors.primaryColor,click:null,over:null,out:null,x:0,y:0,z:0},e||{}),this.args=e,this.mesh=new THREE.Object3D;var t=new THREE.Geometry,n=new THREE.BoxGeometry(e.width,2,e.depth,1,1,1),a=new THREE.Geometry,o=new THREE.BoxGeometry(2,e.height,2,1,1,1);a.merge(o.applyMatrix((new THREE.Matrix4).makeTranslation(-(e.width/2-1),-(e.height/2)-1,1-e.depth/2))),a.merge(o.applyMatrix((new THREE.Matrix4).makeTranslation(e.width-2,0,0))),a.merge(o.applyMatrix((new THREE.Matrix4).makeTranslation(0,0,e.depth-2))),a.merge(o.applyMatrix((new THREE.Matrix4).makeTranslation(-(e.width-2),0,0))),t.merge(n),t.merge(a),t.applyMatrix((new THREE.Matrix4).makeTranslation(e.x,e.y,e.z));var i=new THREE.Mesh(t,matWhite.clone()),s=new THREE.EdgesGeometry(t),r=new THREE.LineSegments(s,matLines.clone());i.castShadow=!0,i.receiveShadow=!0,i.selected=!1,this.mesh.add(i),this.mesh.add(r),this.mesh.position.y+=e.height+1,objectsInScene.push(this.mesh)},Tree=function(e){e=merge({id:null,size:15,height:45,x:0,y:0,z:0},e||{}),this.mesh=new THREE.Object3D,this.mesh.castShadow=!0,this.mesh.receiveShadow=!0;var t=new THREE.Geometry,n=new THREE.CylinderGeometry(e.size,e.size/3,e.size,0,1,!1);t.merge(n.applyMatrix((new THREE.Matrix4).makeTranslation(0,e.size/2,0)));var a=new THREE.CylinderGeometry(2,2,e.height,0,1,!1);t.merge(a.applyMatrix((new THREE.Matrix4).makeTranslation(0,e.height/2,0)));var o=new THREE.SphereGeometry(1.5*e.size,7,7);t.merge(o.applyMatrix((new THREE.Matrix4).makeTranslation(0,e.height+e.size/2,0))),t.applyMatrix((new THREE.Matrix4).makeTranslation(e.x,e.y,e.z));var i=new THREE.Mesh(t,matWhite.clone()),s=new THREE.EdgesGeometry(t),r=new THREE.LineSegments(s,matLines);i.selected=!1,i.args=e,i.click=function(){this.selected=!i.selected,this.selected?this.material.color.set(Colors.accentColor):this.material.color.set(Colors.primaryColor),render(),showDetails(this.args.id,this.selected)},i.over=function(){var e=this.selected===!0?Colors.primaryColor:Colors.accentColor;this.parent.children[1].material.color.set(e),render()},i.out=function(){this.parent.children[1].material.color.set(Colors.lineColor),render()},this.mesh.add(i),this.mesh.add(r),objectsInScene.push(this.mesh)},setRoomAvailability=function(){scene.traverse(function(e){if(e instanceof THREE.Mesh&&"room"==e.model_type){var t=Math.floor(2*Math.random()+1)-1;e.available=0==t?1:0,1==t&&(avaiableRoomCounter++,e.parent.children[2].material.color.set(Colors.availableColor),e.parent.children[1].material.color.set(Colors.availableFillColor))}})};document.addEventListener("mousedown",function(){document.body.dataset.mouse="down"},!1),document.addEventListener("mouseup",function(){document.body.dataset.mouse="up"},!1),document.addEventListener("mousedown",onDocumentMouseDown,!1);var mousePosition=new THREE.Vector2,INTERSECTED,raycaster=new THREE.Raycaster;document.addEventListener("mousemove",onDocumentMouseOver,!1);var initNavigation=function(e,t){t=t||Void,(new TimelineMax).to(".left-wrap .loader",e/2,{css:{rotation:180},ease:Linear.easeNone}).to(".right-wrap .loader",e/2,{css:{rotation:180},ease:Linear.easeNone,onComplete:function(){ActivateNavigation(t)}})},ActivateNavigation=function(e){TweenMax.to(".circle-loader-message .loading-message",.5,{css:{opacity:0}}),setState("reset"),document.querySelector("#availableRoomCounter").innerHTML=avaiableRoomCounter+" meetingrooms available",TweenMax.to("#availableRoomCounter",.5,{css:{opacity:1}}),e.call(this)},setState=function(e){switch(document.querySelector("main").dataset.state=e,e){case"explode":buildingExplode();break;case"opaque":buildingOpenAnim();break;default:buildingReset()}},showDetails=function(e,t){if(data[e]){document.getElementById("title").innerHTML=data[e].title;document.getElementById("availableRoomCounter").innerHTML=data[e].description+"<div class='room-button'><a href='#bookroom' class='button room-available-"+t+"'><i class='room-available'></i>book room</a></div>"}},Void=function(){console.log("void fallback")},data={paulus:{title:"Paulus",description:"Large meetingroom for 12 people, whiteboard and screen."},fillipus:{title:"Fillipus",description:"Project workroom for 8 people with whiteboard and screen. can be closed off with curtain."},Jakobus:{title:"Jakobus",description:"Project workroom for 8 people with whiteboard screen. can be closed off with curtain."},petrus:{title:"Petrus",description:"Demo room for 8 people with screen and small whiteboard."},mattheus:{title:"Mattheus",description:"Small meetingroom for 4 people with screen."},johannes:{title:"Johannes",description:"Small meeting room for 4 people with whiteboard but no screen."},andreas:{title:"Andreas",description:"Lounge room (no table) with screen and whiteboard."}};
//# sourceMappingURL=script.js.map