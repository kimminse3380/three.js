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
    camera.position.z=2;
    this._camera = camera;
    }

    _setupLight() {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this._scene.add(light);
    }

    _setupModel(){
        //const geometry = new THREE.CircleGeometry(1,16, 0, Math.PI*2); // 원
        //const geometry = new THREE.ConeGeometry(1, 1, 16, 9, false, 0, Math.PI*2); //원뿔
        //const geometry = new THREE.CylinderGeometry(0.9, 1, 1, 32, 12, false, 0, Math.PI*2); //기둥
        //const geometry = new THREE.SphereGeometry(1, 109, 100, 0, Math.PI*2, 0, Math.PI); //구
        //const geometry = new THREE.RingGeometry(0.5, 1, 6, 2, 0, Math.PI*2); //2차원 링
        //const geometry = new THREE.PlaneGeometry(1, 1, 2, 1); //2차원 사각형
        //const geometry = new THREE.TorusGeometry(0.9, 0.4, 24, 100, Math.PI*2); //3차원 링
        const geometry = new THREE.TorusKnotGeometry(0.6, 0.1, 64, 32, 3, 4); //TorusKnot 복잡한 무언가 쓸 일이 거의 없음
        const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x515151 });
        const cube = new THREE.Mesh(geometry, fillMaterial);
    
        const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
        const line = new THREE.LineSegments(
          new THREE.WireframeGeometry(geometry), lineMaterial);
        const group = new THREE.Group()
    
        group.add(cube);
        group.add(line);
        
        this._scene.add(group);
        this._cube = group;
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

    update(time){
        time*=0.001;
        //this._cube.rotation.x = time;
        //this._cube.rotation.y = time;
    }
}

window.onload = function() {
    new App();
}