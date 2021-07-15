import * as THREE from 'https://cdn.skypack.dev/three@v0.129.0-oVPEZFilCYUpzWgJBZqM/build/three.module.js';

export class RendererWebGLFactory{
    constructor(shadow=false, params={}){
        this._renderer = new THREE.WebGLRenderer(params);
        if (shadow){
            this._renderer.shadowMap.enabled = true;
            this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }
        
        this._renderer.setPixelRatio(window.devicePixelRatio);
        this._renderer.setSize(window.innerWidth, window.innerHeight);

        return this._renderer;
    }
}