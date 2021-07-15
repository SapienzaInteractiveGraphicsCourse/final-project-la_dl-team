import * as THREE from 'https://cdn.skypack.dev/three@v0.129.0-oVPEZFilCYUpzWgJBZqM/build/three.module.js';

export class SceneFactory{
    static DAY_SKYBOX = "daySkyBox"
    static SUNSET_SKYBOX = "sunsetSkyBox"
    static NIGHT_SKYBOX = "nightSkyBox"

    constructor(skyBox = SceneFactory.DAY_SKYBOX){
        this._scene = new THREE.Scene();

        switch(skyBox){
            case SceneFactory.SUNSET_SKYBOX:
                this._loader = new THREE.CubeTextureLoader();
                this._loader.setPath('./resources/skyboxs/'+SceneFactory.SUNSET_SKYBOX+'/');
                this._texture = this._loader.load([
                    'posx.jpg', 'negx.jpg', 'posy.jpg',
                    'negy.jpg', 'posz.jpg', 'negz.jpg',
                ]);
                this._texture.encoding = THREE.sRGBEncoding;
                this._scene.background = this._texture;
                break;
            
            case SceneFactory.NIGHT_SKYBOX:
                this._loader = new THREE.CubeTextureLoader();
                this._loader.setPath('./resources/skyboxs/'+SceneFactory.NIGHT_SKYBOX+'/');
                this._texture = this._loader.load([
                    'posx.jpg', 'negx.jpg', 'posy.jpg',
                    'negy.jpg', 'posz.jpg', 'negz.jpg',
                ]);
                this._texture.encoding = THREE.sRGBEncoding;
                this._scene.background = this._texture;
                break;
                
            case SceneFactory.DAY_SKYBOX:
            default:
                this._loader = new THREE.CubeTextureLoader();
                this._loader.setPath('./resources/skyboxs/'+SceneFactory.DAY_SKYBOX+'/');
                this._texture = this._loader.load([
                    'posx.jpg', 'negx.jpg', 'posy.jpg',
                    'negy.jpg', 'posz.jpg', 'negz.jpg',
                ]);
                this._texture.encoding = THREE.sRGBEncoding;
                this._scene.background = this._texture;
                break;
        }

        return this._scene;
    }
}