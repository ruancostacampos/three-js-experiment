import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {gsap} from "gsap";


var scene = new THREE.Scene();
        
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

var hoveredObjects = [];

camera.position.set(0, 4, 5)

var renderer = new THREE.WebGLRenderer({antialias: true});     

renderer.setClearColor("#e5e5e5");

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
})

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2()


var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshLambertMaterial({color: 0xFFCC00});
var firstCube = new THREE.Mesh(geometry, material);
var secondCube = new THREE.Mesh(geometry, material);
var thirdCube = new THREE.Mesh(geometry, material);

var planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 32, 32),
    new THREE.MeshStandardMaterial()
)

planeMesh.rotateX(-Math.PI / 2)
firstCube.position.y = 0.6;
secondCube.position.x = 2;
secondCube.position.y = 0.6;
thirdCube.position.y = 0.6;
thirdCube.position.x = -2;

var light = new THREE.PointLight(0xFFFFFF, 1, 500);
light.position.set(0, 5, 5);

scene.add(planeMesh);
scene.add(firstCube);
scene.add(secondCube)
scene.add(thirdCube)
scene.add(light)

var orbit = new OrbitControls(camera, renderer.domElement);
//orbit.update()

renderer.render(scene, camera)

const render = () => {
    requestAnimationFrame(render)
    renderer.render(scene, camera)
}

var rotationtl;

const onMouseMove = (e) => {
    
    e.preventDefault();
    mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    var intersects = raycaster.intersectObjects(scene.children, true);


    for(var i = 0; i < intersects.length; i++){

        // If the object isnt in the hovered objects array
        if(hoveredObjects.indexOf(intersects[i].object) < 0 && intersects[i].object.geometry.type !== "PlaneGeometry"){
            
            hoveredObjects.push(intersects[i].object);
            rotationtl = gsap.timeline({repeat: -1})

            gsap.to(intersects[i].object.position, 1, {y: 1.6, ease: "Ease"})
            gsap.to(intersects[i].object.scale, 1, {x: 1.2, y: 1.2, z: 1.2, ease: "Ease"})
            rotationtl.to(intersects[i].object.rotation, 1, {y: intersects[i].object.rotation.y +  (Math.PI / 2), ease: "none"})
        
        }

    }

    if(intersects.length <= 1 && hoveredObjects.length > 0){
        rotationtl.kill();
        gsap.to(hoveredObjects[0].position, 1, {y: 0.6, ease: "Ease"})
        gsap.to(hoveredObjects[0].rotation, 0.2, {y: 0, ease: "easeIn"})
        gsap.to(hoveredObjects[0].scale, 1, {x: 1.0, y: 1.0, z: 1.0, ease: "Ease", duration: 0.3})
        hoveredObjects.shift()
    }
}

render();


window.addEventListener("mousemove", onMouseMove);

