import * as THREE from 'https://cdn.skypack.dev/three@v0.129.0-oVPEZFilCYUpzWgJBZqM/build/three.module.js';

export class CameraFactory{
    constructor(params){
        this._fov = params.fov;
        this._aspect = params.aspect;
        this._near = params.near;
        this._far = params.far;

        this._camera = new THREE.PerspectiveCamera(this._fov, this._aspect, this._near, this._far);
        this._camera.position.set(75, 20, 0);

        return this._camera;
    }
}