import * as THREE from '../build/three.module.js';
import { OrbitControls } from "../examples/jsm/controls/OrbitControls.js"
import { GLTFLoader } from "../examples/jsm/loaders/GLTFLoader.js"
import Stats from "../examples/jsm/libs/stats.module.js";

class App {
    constructor() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.VSMShadowMap; //그림자 설정

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
        this._controls = new OrbitControls(this._camera, this._divContainer);
        this._controls.target.set(0, 100, 0);
        
        const stats = new Stats();
        this._divContainer.appendChild(stats.dom);
        this._fps = stats; 
        
        this._pressedKeys = {};

        document.addEventListener("keydown", (event) => {
            this._pressedKeys[event.key.toLowerCase()] = true;
            this._processAnimation();
        }); // 키 event 확인 뒤 processAnimation 함수 호출

        document.addEventListener("keyup", (event) => {
            this._pressedKeys[event.key.toLowerCase()] = false;
            this._processAnimation();
        });
    }
    
    _processAnimation() {
        const previousAnimationAction = this._currentAnimationAction;

        if(this._pressedKeys["w"] || this._pressedKeys["a"] || this._pressedKeys["s"] || this._pressedKeys["d"]) {
            if(this._pressedKeys["shift"]) {
                this._currentAnimationAction = this._animationMap["Run"];
                this._maxSpeed=450;
                this._accelration = 8;
            } else { //shift와 함께 w, a, s, d를 누르면 뜀
                this._currentAnimationAction = this._animationMap["Walk"];
                this._maxSpeed = 120;
                this._accelration = 3;                
            } // w, a, s, d를 누르면 걷기
        } else {
            this._currentAnimationAction = this._animationMap["Idle"];
            this._speed = 0;
            this._maxSpeed = 0;
            this._acceleration = 0;
        } // 어떤한 키도 누르지 않으면 Idle이라는 행동을 취함
        if(this._pressedKeys["c"]) {
            this._currentAnimationAction = this._animationMap["Capoeira"];
            this._speed = 0;
            this._maxSpeed = 0;
            this._accelration = 0;
        }
        if(this._pressedKeys["g"]) {
            this._currentAnimationAction = this._animationMap["GangnamStyle"];
            this._speed = 0;
            this._maxSpeed = 0;
            this._accelration = 0;
        }

        if(previousAnimationAction !== this._currentAnimationAction) {
            previousAnimationAction.fadeOut(0.5);
            this._currentAnimationAction.reset().fadeIn(0.5).play();
        }
    }

    _setupModel() {
        const planeGeometry = new THREE.PlaneGeometry(1000, 1000); // 바닥 설정
        const planeMaterial = new THREE.MeshPhongMaterial({color: 0x878787 });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI/2;
        this._scene.add(plane);
        plane.receiveShadow=true; // 바닥은 그림자가 생기지 않는다 

        new GLTFLoader().load("./data/character.glb", (gltf) => { //data 파일 안에 있는 캐릭터를 불러옴
            const model = gltf.scene;
            this._scene.add(model);

            model.traverse(child => { 
                if(child instanceof THREE.Mesh) {
                    child.castShadow = true; //캐릭터 그림자
                }
            });

            const animationClips = gltf.animations;
            const mixer = new THREE.AnimationMixer(model);
            const animationsMap ={};
            animationClips.forEach(clip => {
                const name=clip.name;
                console.log(name);
                animationsMap[name] = mixer.clipAction(clip);
            }); // 캐릭터가 할 수 있는 행동 consoledp 뛰오고 animationsMap에 저장

            this._mixer = mixer;
            this._animationMap=animationsMap;
            this._currentAnimationAction = this._animationMap["Idle"];
            this._currentAnimationAction.play();

            const box=(new THREE.Box3).setFromObject(model);
            model.position.y=(box.max.y-box.min.y)/2;

            const axisHelper = new THREE.AxesHelper(1000);
            this._scene.add(axisHelper);

            const boxHelper = new THREE.BoxHelper(model);
            this._scene.add(boxHelper);
            this._boxHelper = boxHelper;
            this._model = model;
        });
    }

    _setupCamera() {
        const camera = new THREE.PerspectiveCamera(
            60, 
            window.innerWidth / window.innerHeight, 
            1, 
            5000
        );

        camera.position.set(0, 100, 500);
        this._camera = camera;
    }

    _addPointLight(x, y, z, helperColor) { // 빛을 여러개 만들기 위한 함수
        const color = 0xffffff;
        const intensity = 1.5;

        const pointLight = new THREE.PointLight(color, intensity, 2000);
        pointLight.position.set(x, y, z);

        this._scene.add(pointLight);

        const pointLightHelper = new THREE.PointLightHelper(pointLight, 10, helperColor);
        this._scene.add(pointLightHelper);
    }

    _setupLight() {
        const ambientLight = new THREE.AmbientLight(0xffffff, .5);
        this._scene.add(ambientLight);

        this._addPointLight(500, 150, 500, 0xff0000); //_addPointLight를 불러와 빛 설정
        this._addPointLight(-500, 150, 500, 0xffff00);
        this._addPointLight(-500, 150, -500, 0x00ff00);
        this._addPointLight(500, 150, -500, 0x0000ff);

        // 빛에 따른 그림자 설정
        const shadowLight = new THREE.DirectionalLight(0xffffff, 0.2);
        shadowLight.position.set(200, 500, 200);
        shadowLight.target.position.set(0, 0, 0);
        const directionalLightHelper = new THREE.DirectionalLightHelper(shadowLight, 10);
        this._scene.add(directionalLightHelper);
        
        this._scene.add(shadowLight);
        this._scene.add(shadowLight.target);

        shadowLight.castShadow = true;
        shadowLight.shadow.mapSize.width = 1024;
        shadowLight.shadow.mapSize.height = 1024;
        shadowLight.shadow.camera.top = shadowLight.shadow.camera.right = 700;
        shadowLight.shadow.camera.bottom = shadowLight.shadow.camera.left = -700;
        shadowLight.shadow.camera.near = 100;
        shadowLight.shadow.camera.far = 900;
        shadowLight.shadow.radius = 5;
        const shadowCameraHelper = new THREE.CameraHelper(shadowLight.shadow.camera);
        this._scene.add(shadowCameraHelper);
    }

    _previousDirectionOffset = 0;

    _directionOffset() {
        const pressedKeys = this._pressedKeys;
        let directionOffset = 0 // w

        if (pressedKeys['w']) {
            if (pressedKeys['a']) {
                directionOffset = Math.PI / 4 // w+a (45도)
            } else if (pressedKeys['d']) {
                directionOffset = - Math.PI / 4 // w+d (-45도)
            }
        } else if (pressedKeys['s']) {
            if (pressedKeys['a']) {
                directionOffset = Math.PI / 4 + Math.PI / 2 // s+a (135도)
            } else if (pressedKeys['d']) {
                directionOffset = -Math.PI / 4 - Math.PI / 2 // s+d (-135도)
            } else {
                directionOffset = Math.PI // s (180도)
            }
        } else if (pressedKeys['a']) {
            directionOffset = Math.PI / 2 // a (90도)
        } else if (pressedKeys['d']) {
            directionOffset = - Math.PI / 2 // d (-90도)
        } else {
            directionOffset = this._previousDirectionOffset;
        }

        this._previousDirectionOffset = directionOffset;

        return directionOffset;        
    }

    _speed = 0;
    _maxSpeed = 0; //최대 속도
    _accelration = 0; //점점 속도 빨라지게 확인 위한 변수

    update(time) {
        time *= 0.001; // second unit

        this._controls.update();

        if(this._boxHelper){
            this._boxHelper.update();
        }

        this._fps.update();

        if(this._mixer){
            const deltaTime = time - this._previousTime;
            this._mixer.update(deltaTime);

            // 사용자가 바라보고 있는 화면 쪽을 캐릭터가 바라 보고 있도록 설정
            const angleCameraDirectionAxisY = Math.atan2(
                (this._camera.position.x - this._model.position.x),
                (this._camera.position.z - this._model.position.z)
            )  + Math.PI;

            const rotateQuarternion = new THREE.Quaternion();
            rotateQuarternion.setFromAxisAngle(
                new THREE.Vector3(0,1,0),
                angleCameraDirectionAxisY + this._directionOffset()
            );

            this._model.quaternion.rotateTowards(rotateQuarternion, THREE.MathUtils.degToRad(5));

            const walkDirection = new THREE.Vector3();
            this._camera.getWorldDirection(walkDirection);

            walkDirection.y = 0;
            walkDirection.normalize();

            if(this._speed < this._maxSpeed) this._speed += this._accelration;
            else this._speed -= this._accelration;

            walkDirection.applyAxisAngle(new THREE.Vector3(0, 1, 0), this._directionOffset());

            const moveX = walkDirection.x * (this._speed * deltaTime); //이동 시키 위한 코드
            const movez = walkDirection.z * (this._speed * deltaTime);

            this._model.position.x += moveX; // 지속적인 위치 변경
            this._model.position.z += movez;

            this._controls.target.set(
                this._model.position.x,
                this._model.position.y,
                this._model.position.z,
            );
        }
        this._previousTime = time;
    }

    render(time) {
        this._renderer.render(this._scene, this._camera);   
        this.update(time);

        requestAnimationFrame(this.render.bind(this));
    }

    resize() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();
        
        this._renderer.setSize(width, height);
    }
}

window.onload = function () {
    new App();
}