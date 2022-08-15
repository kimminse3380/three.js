import * as THREE from '../build/three.module.js';
import { OrbitControls } from '../examples/jsm/controls/OrbitControls.js'
import { FontLoader } from '../examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from '../examples/jsm/geometries/TextGeometry.js'

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

    // _setupModel(){
    //     const shape = new THREE.Shape(); //x,y 좌표
        
    //     // 선으로 사각형 긋기
    //     // shape.moveTo(1, 1); //1, 1로 이동
    //     // shape.lineTo(1, -1); //1, -1까지 선을 긋기(1,1이 현제 기준)
    //     // shape.lineTo(-1, -1); //-1. -1까지 선을 긋기(1, -1이 현제 기준)
    //     // shape.lineTo(-1, 1); //-1, 1까지 선을 긋기(-1, -1이 현제 기준)
    //     // shape.closePath(); //도형을 닫기

    //     // 선으로 하트 만들기
    //     const x = -2.5, y = -5;
    //     shape.moveTo(x + 2.5, y + 2.5);
    //     shape.bezierCurveTo( x + 2.5, y + 2.5, x + 2, y, x, y); // 곡선
    //     shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3, 5);
    //     shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9, 5);
    //     shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
    //     shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
    //     shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

    //     const geometry = new THREE.BufferGeometry();
    //     const points = shape.getPoints();
    //     geometry.setFromPoints(points);

    //     const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
    //     const line = new THREE.Line(geometry, material);

    //     this._scene.add(line);
    // }


    // shape을 통해 하트 geometry 만들기
    // _setupModel() {

    //     const shape = new THREE.Shape();
    
    //     const x = -2.5, y= -5;
    //     shape.moveTo(x + 2.5, y + 2.5);
    //     shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y); // bezierCurveTo를 이해하기 위해서는 curve를 공부해야함
    //     shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
    //     shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
    //     shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
    //     shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
    //     shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);
    
    //     const geometry = new THREE.ShapeGeometry(shape);
    
    //     const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x515151 });
    //     const cube = new THREE.Mesh(geometry, fillMaterial);
    
    //     const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});

    //     const line = new THREE.LineSegments(
    //       new THREE.WireframeGeometry(geometry), lineMaterial);
        
    //     const group = new THREE.Group()
 
    //     group.add(cube);
    //     group.add(line);
        
    //     this._scene.add(group);
    //     this._cube = group;
    // }


    // 3D 하트
    // _setupModel() {
	// 	const shape = new THREE.Shape(); // Shape 클래스 생성
	// 	shape.moveTo(0, 1.5);
	// 	shape.bezierCurveTo(2, 3.5, 4, 1.5, 2, -0.5);
	// 	shape.lineTo(0, -2.5);
	// 	shape.lineTo(-2, -0.5);
	// 	shape.bezierCurveTo(-4, 1.5, -2, 3.5, 0, 1.5);
	// 	const settings = {
    //         steps: 1, //깊이 방향으로의 분할 수
    //         depth: 1, //깊이 값
    //         bevelEnabled: true, // beveling 처리 여부
    //         bevelThickness: 1.4, //beveling 두께값
    //         bevelSize: 1.3, //shape의 외곽선으로부터 얼마나 멀리 beveling 할 것인지=> 커질수록 부푸는것 같음
    //         bevelSegments: 2, //beveling 단계수
    //       };
    //       const geometry = new THREE.ExtrudeGeometry(shape, settings);

	// 	const fillMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000}); 
	// 	const cube = new THREE.Mesh(geometry, fillMaterial);

	// 	const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
	// 	const line = new THREE.LineSegments(
	// 		new THREE.WireframeGeometry(geometry),
	// 		lineMaterial
	// 	); 
  
	// 	const group = new THREE.Group();
	// 	group.add(cube);
	// 	this._scene.add(group);
	// 	this._cube = group;     
	// }

    // 글자 입체
    _setupModel() {
        const fontLoader = new FontLoader();
        // 폰트 데이터를 비동기적으로 불러오기 위한 비동기 함수
        async function loadFont(that) {
          const url = "../examples/fonts/helvetiker_regular.typeface.json";
          const font = await new Promise((resolve, reject) => {
            fontLoader.load(url, resolve, undefined, reject);
          });
    
          // TextGeometry 생성
          const geometry = new TextGeometry("kim", {
            font: font,
            size: 5,
            height: 1.5,
            curveSegments: 4,
            // setting for ExtrudeGeometry
            bevelEnabled: true,
            bevelThickness: 0.7,
            bevelSize: .7,
            bevelSegments: 2
          });
    
          // 함수 내부에서 geometry 생성하고 있기때문에 아래 코드도 비동기 함수 내에서 호출 
          const fillMaterial = new THREE.MeshPhongMaterial({ color: 0x515151 });
          const cube = new THREE.Mesh(geometry, fillMaterial);
    
          const lineMaterial = new THREE.LineBasicMaterial({color: 0xffff00});
          const line = new THREE.LineSegments(
            new THREE.WireframeGeometry(geometry), lineMaterial);
        
          const group = new THREE.Group()
          group.add(cube);
        //   group.add(line);
    
          that._scene.add(group);
          that._cube = group;
        };
        // this인자와 함께 호출
        loadFont(this);
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