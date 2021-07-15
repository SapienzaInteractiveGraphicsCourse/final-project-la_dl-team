import * as THREE from 'https://cdn.skypack.dev/three@v0.129.0-oVPEZFilCYUpzWgJBZqM/build/three.module.js';

export class LightFactory{
    static DAY_DAYTIME = "dayDayTime";
    static SUNSET_DAYTIME = "sunsetDayTime";
    static NIGHT_DAYTIME = "nightDayTime";

    constructor(shadow=false, daytime=LightFactory.DAY_DAYTIME){
        this._lights = [];
        switch(daytime){
            case LightFactory.NIGHT_DAYTIME:
                this._lights.push(this._addBlockLight([-39, 12, -45], shadow))
                this._lights.push(this._addBlockLight([-14, 12, 15], shadow))
                this._lights.push(this._addBlockLight([15, 45, -68], shadow))

                this._lights.push(this._addBlockLight([75, 16, -10.75], shadow))
                this._lights.push(this._addBlockLight([52.5, 72.3, -31], shadow))

                var ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.0);
                this._lights.push(ambientLight);
                break;
            case LightFactory.SUNSET_DAYTIME:
                var sun = new THREE.DirectionalLight(0xFFFFFF, 1.5);
                sun.position.set(-50, 100, 50);
                sun.target.position.set(0, 0, 0);

                if(shadow){
                    sun.castShadow = true;
                    sun.shadow.bias = -0.001;
                    sun.shadow.mapSize.width = 4096;
                    sun.shadow.mapSize.height = 4096;
                    sun.shadow.camera.near = 0.1;
                    sun.shadow.camera.far = 1000.0;
                    sun.shadow.camera.left = 100;
                    sun.shadow.camera.right = -100;
                    sun.shadow.camera.top = 100;
                    sun.shadow.camera.bottom = -100;
                }

                this._lights.push(sun);

                var ambientLight = new THREE.AmbientLight(0xfbd9ac, 1.0);
                this._lights.push(ambientLight);
                break;
            case LightFactory.DAY_DAYTIME:
            default:
                var sun = new THREE.DirectionalLight(0xFFFFFF, 1.0);
                sun.position.set(-35, 100, 35);
                sun.target.position.set(0, 0, 0);

                if(shadow){
                    sun.castShadow = true;
                    sun.shadow.bias = -0.001;
                    sun.shadow.mapSize.width = 4096;
                    sun.shadow.mapSize.height = 4096;
                    sun.shadow.camera.near = 0.1;
                    sun.shadow.camera.far = 1000.0;
                    sun.shadow.camera.left = 100;
                    sun.shadow.camera.right = -100;
                    sun.shadow.camera.top = 100;
                    sun.shadow.camera.bottom = -100;
                }

                this._lights.push(sun);

                var ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.2);
                this._lights.push(ambientLight);
                break;
        }
        
        return this._lights;
    }

    _addBlockLight(posVec, shadow){
        var B = new THREE.PointLight( 0xFFFFFF, 1, 100 );
        B.position.set(...posVec);
        if (shadow) B.castShadow = true;
        return B;
    }
}