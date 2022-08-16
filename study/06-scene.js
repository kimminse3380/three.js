import * as THREE from '../build/three.module.js';
import { OrbitControls } from '../examples/jsm/controls/OrbitControls.js'

class App {
    constructor() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const renderer = new THREE.WebGL1Renderer({antialias:true});
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);
        this._renderer = renderer;

        const scene = new THREE.Scene();
        this._scene = scene;

        this._setupCamera();
        this._setupLight();
        this._setupModel();
        this._setupControls();

        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this));
    }

    _setupControls() {
     new OrbitControls(this._camera, this._divContainer);
    }

    _setupCamera() {
    const width = this._divContainer.clientWidth;
    const height = this._divContainer.clientHeight;
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      100
    );
    camera.position.z=25;
    this._camera = camera;
    }

    _setupLight() {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this._scene.add(light);
    }

    _setupModel() {
        // Object3D 타입의 solarSystem 객체 생성
        const solarSystem = new THREE.Object3D();
        this._scene.add(solarSystem);
    
        // 구 모양 지오메트리 생성
        const radius = 1;
        const widthSegments = 100;
        const heightSegments = 100;
        const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    
        // 태양 재질 생성
        const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00, flatShading: true }); 
    
        // sunMesh
        const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
        sunMesh.scale.set(3, 3, 3);// 원래 지오메트리 크기보다 3배의 크기로 표시
        solarSystem.add(sunMesh);
    
        // Object3D 타입의 earthOrbit 객체 생성
        const earthOrbit = new THREE.Object3D();
        solarSystem.add(earthOrbit);
    
        // 지구 재질 생성
        const earthMaterial = new THREE.MeshPhongMaterial({ color: 0x2233ff, emissive: 0x112244, flatShading: true });
    
        // earthMesh 생성
        const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
        earthOrbit.position.x = 10; // 태양으로 부터 x축 기준으로 10만 떨어진 곳에 지구를 배치
        earthOrbit.add(earthMesh);
    
        // Object3D 타입의 moonOrbit 객체 생성
        const moonOrbit = new THREE.Object3D();
        
        moonOrbit.position.x = 2;
        // 생성한 moonOrbit 객체를 earthOrbit의 자식으로 추가함
        earthOrbit.add(moonOrbit);
    
        // 달 재질 생성
        const moonMaterial = new THREE.MeshPhongMaterial({ color: 0x888888, emissive: 0x222222, flatShading: true });
    
        // moonMesh 생성
        const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
        // 원래 구 반지름 절반 크기로 달이 생성됨
        moonMesh.scale.set(0.5, 0.5, 0.5);
        // moonMesh를 moonOrbit의 자식으로 추가
        moonOrbit.add(moonMesh);
    
        // 객체를 다른 메서드에서 참조할수 있도록함
        this._solarSystem = solarSystem;
        this._earthOrbit = earthOrbit;
        this._moonOrbit = moonOrbit;
    }
    
    

    resize(){
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width/height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width,  height);
    }

    render(time) {
        this._renderer.render(this._scene, this._camera);
        this.update(time);
        requestAnimationFrame(this.render.bind(this));
    }

    update(time) {
        time *= 0.001;
        // solarSystem은 y축에 대해 계속 회전
        this._solarSystem.rotation.y = time / 2;
        // 지구의 자전
        this._earthOrbit.rotation.y = time * 2;
        // 달의 자전
        this._moonOrbit.rotation.y = time * 5;
    }
}

window.onload = function() {
    new App();
}