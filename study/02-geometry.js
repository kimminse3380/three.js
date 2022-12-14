import * as THREE from '../build/three.module.js';
import { OrbitControls } from '../examples/jsm/controls/OrbitControls.js' // 마우스로 회전시키게 하는 모듈 호출

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
        this._setupControls(); // 회전 시키는 함수 호출

        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this));
    }

    _setupControls() {
     new OrbitControls(this._camera, this._divContainer); // 회전 시키게 하는 코드
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
        const geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);//정육면체
        const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x515151 });
        const cube = new THREE.Mesh(geometry, fillMaterial);
    
        const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00}); //라인 색깔
        const line = new THREE.LineSegments(
          new THREE.WireframeGeometry(geometry), lineMaterial); // 도형에 라인 만들기
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
        //this._cube.rotation.x = time; // 자동 회전 하게 만들던 코드를 지우기
        //this._cube.rotation.y = time;
    }
}

window.onload = function() {
    new App();
}