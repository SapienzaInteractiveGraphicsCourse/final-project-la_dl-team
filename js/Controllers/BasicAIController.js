import * as THREE from 'https://cdn.skypack.dev/three@v0.129.0-oVPEZFilCYUpzWgJBZqM/build/three.module.js';

import { NoAnimationsFSM } from '../FSM/FiniteStateMachine.js';
import { GoombaFSM } from '../FSM/GoombaFSM.js';
import { WhompFSM } from '../FSM/WhompFSM.js';
import { PiranhaFSM } from '../FSM/PiranhaFSM.js';

const PI_4 = Math.PI/4;

class BasicAIController{
    constructor(params){
        this._MANAGER = params.MANAGER;
        this._target = params.target;
        this._body = params.body;
        this._player = params.player;

        this._oldRotationY = 0;
        this._initRotation = params.initRotation;
        this._maxDistance = params.maxDistance;
        this._horizontalRotation = new THREE.Vector3(0, 1, 0);
    }

    update(){return;}

    _distance(p1, p2){
        return Math.sqrt( Math.pow(p1.x-p2.x, 2) + Math.pow(p1.z-p2.z, 2))
    }
}

export class BasicAIGoombaController extends BasicAIController{
    constructor(params){
        super(params);

        this._CharacterHeight = 1.5;

        if(!this._MANAGER.getReducedAnimation()){
            this._stateMachine = new GoombaFSM(this._target);
        } else {
            this._stateMachine = new NoAnimationsFSM();
        }
        this._stateMachine.setState('idle');
    }

    update(){
        this._stateMachine.update(Math.abs(this._body.velocity.x)+Math.abs(this._body.velocity.z));

        const controlObject = this._target;
        const _Q = new THREE.Quaternion();
        const _R = controlObject.quaternion.clone();

        var velocity = new THREE.Vector3(0, 0, 0);

        var distance = this._distance(this._body.position, this._player.position);
        if(distance < this._maxDistance){
            var angle = Math.PI-this._initRotation+Math.atan2(this._body.position.x-this._player.position.x, this._body.position.z-this._player.position.z);
            velocity.z += 1;

            _Q.setFromAxisAngle(this._horizontalRotation, angle-this._oldRotationY);
            _R.multiply(_Q);
            this._oldRotationY = angle;

            controlObject.quaternion.copy(_R);
        } else {
            this._body.velocity.x *= 0.92;
            this._body.velocity.z *= 0.92;
        }
        velocity.y = -5;

        const forward = new THREE.Vector3(0, 0, 1);
        forward.applyQuaternion(controlObject.quaternion);
        forward.normalize();

        const upway = new THREE.Vector3(0, 1, 0);
        upway.applyQuaternion(controlObject.quaternion);
        upway.normalize();

        const sideways = new THREE.Vector3(1, 0, 0);
        sideways.applyQuaternion(controlObject.quaternion);
        sideways.normalize();

        sideways.multiplyScalar(velocity.x);
        upway.multiplyScalar(velocity.y);
        forward.multiplyScalar(velocity.z);

        this._body.velocity.x += sideways.x+forward.x;
        this._body.velocity.y += upway.y;
        this._body.velocity.z += sideways.z+forward.z;

        if (this._body.velocity.y < -60){
            this._body.velocity.y = -60;
        }
        var norm = Math.sqrt(Math.pow(this._body.velocity.x, 2) + Math.pow(this._body.velocity.z, 2));
        if(norm > 20){
            this._body.velocity.x = this._body.velocity.x/norm*20;
            this._body.velocity.z = this._body.velocity.z/norm*20;
        }

        controlObject.position.copy(this._body.position);
        controlObject.position.y -= this._CharacterHeight;
    }
}

export class BasicAIWhompController extends BasicAIController{
    constructor(params){
        super(params);

        this._CharacterHeight = 4.5;

        if(!this._MANAGER.getReducedAnimation()){
            this._stateMachine = new WhompFSM(this._target);
        } else {
            this._stateMachine = new NoAnimationsFSM();
        }
        this._stateMachine.setState('idle');
    }

    update(){
        this._stateMachine.update(Math.abs(this._body.velocity.x)+Math.abs(this._body.velocity.z));

        const controlObject = this._target;
        const _Q = new THREE.Quaternion();
        const _R = controlObject.quaternion.clone();

        var velocity = new THREE.Vector3(0, 0, 0);

        var distance = this._distance(this._body.position, this._player.position);
        if(distance < this._maxDistance){
            var angle = Math.PI-this._initRotation+Math.atan2(this._body.position.x-this._player.position.x, this._body.position.z-this._player.position.z);
            velocity.z += 1;

            _Q.setFromAxisAngle(this._horizontalRotation, angle-this._oldRotationY);
            _R.multiply(_Q);
            this._oldRotationY = angle;

            controlObject.quaternion.copy(_R);
            this._body.quaternion.copy(_R);
        } else {
            this._body.velocity.x *= 0.92;
            this._body.velocity.z *= 0.92;
        }
        velocity.y = -5;

        const forward = new THREE.Vector3(0, 0, 1);
        forward.applyQuaternion(controlObject.quaternion);
        forward.normalize();

        const upway = new THREE.Vector3(0, 1, 0);
        upway.applyQuaternion(controlObject.quaternion);
        upway.normalize();

        const sideways = new THREE.Vector3(1, 0, 0);
        sideways.applyQuaternion(controlObject.quaternion);
        sideways.normalize();

        sideways.multiplyScalar(velocity.x);
        upway.multiplyScalar(velocity.y);
        forward.multiplyScalar(velocity.z);

        this._body.velocity.x += sideways.x+forward.x;
        this._body.velocity.y += upway.y;
        this._body.velocity.z += sideways.z+forward.z;

        if (this._body.velocity.y < -60){
            this._body.velocity.y = -60;
        }
        var norm = Math.sqrt(Math.pow(this._body.velocity.x, 2) + Math.pow(this._body.velocity.z, 2));
        if(norm > 20){
            this._body.velocity.x = this._body.velocity.x/norm*20;
            this._body.velocity.z = this._body.velocity.z/norm*20;
        }

        controlObject.position.copy(this._body.position);
        controlObject.position.y -= this._CharacterHeight;
    }
}

export class BasicAIPiranhaController extends BasicAIController{
    constructor(params){
        super(params);

        this._CharacterHeight = 4;

        if(!this._MANAGER.getReducedAnimation()){
            this._stateMachine = new PiranhaFSM(this._target);
        } else {
            this._stateMachine = new NoAnimationsFSM();
        }
        this._stateMachine.setState('idle');
    }

    update(){
        this._stateMachine.update(Math.abs(this._body.velocity.x)+Math.abs(this._body.velocity.z));

        const controlObject = this._target;
        const _Q = new THREE.Quaternion();
        const _R = controlObject.quaternion.clone();
        
        var velocity = new THREE.Vector3(0, 0, 0);

        var distance = this._distance(this._body.position, this._player.position);
        if(distance < this._maxDistance){
            var angle = Math.PI-this._initRotation+Math.atan2(this._body.position.x-this._player.position.x, this._body.position.z-this._player.position.z);
            velocity.z += 1;

            _Q.setFromAxisAngle(this._horizontalRotation, angle-this._oldRotationY);
            _R.multiply(_Q);
            this._oldRotationY = angle;

            controlObject.quaternion.copy(_R);
            this._body.quaternion.copy(_R);
        } else {
            this._body.velocity.x *= 0.92;
            this._body.velocity.z *= 0.92;
        }
        velocity.y = -5;

        const forward = new THREE.Vector3(0, 0, 1);
        forward.applyQuaternion(controlObject.quaternion);
        forward.normalize();

        const upway = new THREE.Vector3(0, 1, 0);
        upway.applyQuaternion(controlObject.quaternion);
        upway.normalize();

        const sideways = new THREE.Vector3(1, 0, 0);
        sideways.applyQuaternion(controlObject.quaternion);
        sideways.normalize();

        sideways.multiplyScalar(velocity.x);
        upway.multiplyScalar(velocity.y);
        forward.multiplyScalar(velocity.z);

        this._body.velocity.x += sideways.x+forward.x;
        this._body.velocity.y += upway.y;
        this._body.velocity.z += sideways.z+forward.z;

        if (this._body.velocity.y < -60){
            this._body.velocity.y = -60;
        }
        var norm = Math.sqrt(Math.pow(this._body.velocity.x, 2) + Math.pow(this._body.velocity.z, 2));
        if(norm > 20){
            this._body.velocity.x = this._body.velocity.x/norm*20;
            this._body.velocity.z = this._body.velocity.z/norm*20;
        }

        controlObject.position.copy(this._body.position);
        controlObject.position.y -= this._CharacterHeight;
    }
}