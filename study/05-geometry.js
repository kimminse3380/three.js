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
    camera.position.z=15;
    this._camera = camera;
    }

    _setupLight() {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this._scene.add(light);
    }

    // curve로 선 곡선 
    // _setupModel() {
		// class CustomSinCurve extends THREE.Curve { // Curve 클래스를 상속받아 customsincurve를 새롭게 정의하고 있음
        //     //customeSinCurve 클래스는 t 매개변수 방정식으로 정의
        //     constructor(scale){
        //         super();
        //         this.scale = scale;
        //     }
        //     getPoint(t) { // 0과 1사이의 t 값에 대한 커브의 구성 좌표를 계산할 수 있다. 
        //         const tx = t*3 - 1.5;
        //         const ty = Math.sin(2 * Math.PI * t);
        //         const tz = 0;
        //         return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
        //     }
        // }

        // const path = new CustomSinCurve(4);

    //     const geometry = new THREE.BufferGeometry();
    //     const points = path.getPoints(30); // 커브를 구성하는 좌표의 개수,기본값은 5, 적당한 정수값에 따라 곡선이 부드럽게 만들어짐
    //     geometry.setFromPoints(points);

    //     const material = new THREE.LineBasicMaterial({color : 0xffff00});
    //     const line = new THREE.Line(geometry, material);

    //     this._scene.add(line);
	// }
    
    // curve 개념을 사용한 튜브 만들기
    _setupModel(){
        class CustomSinCurve extends THREE.Curve {
            constructor(scale){
                super();
                this.scale = scale;
            }
            getPoint(t) {
                const tx = t*3 - 1.5;
                const ty = Math.sin(2 * Math.PI * t);
                const tz = 0;
                return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
            }
        }

        const path = new CustomSinCurve(4);
        const geometry = new THREE.TubeGeometry(path, 40, 0.8, 8, false); 

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