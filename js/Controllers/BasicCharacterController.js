import * as THREE from 'https://cdn.skypack.dev/three@v0.129.0-oVPEZFilCYUpzWgJBZqM/build/three.module.js';

import { NoAnimationsFSM } from '../FSM/FiniteStateMachine.js';
import { CharacterFSM } from '../FSM/CharacterFSM.js';
import { CharacterFlyFSM } from '../FSM/CharacterFlyFSM.js';


export class BasicCharacterController{
    constructor(params) {
        this._MANAGER = params.MANAGER;
        this._camera = params.camera;
        this._target = params.target;
        this._body = params.body;

        if(!this._MANAGER.getReducedAnimation()){
            this._stateMachine = new CharacterFSM(this._target);
        } else {
            this._stateMachine = new NoAnimationsFSM();
        }
        this._stateMachine.setState('idle');

        this._CharacterHeight = 1.0;

        this._acceleration = new THREE.Vector3(1.0, 5.0, 1.0);
        this._jumpVelocity = 100;
        this._canJump = false;

        this._oldRotationY = 0;
        this._horizontalRotation = new THREE.Vector3(0, 1, 0);

        this._input = new BasicCharacterControllerInput({_MANAGER: this._MANAGER});

        this._currentPosition = new THREE.Vector3();
        this._currentLookat = new THREE.Vector3();

        this._contactNormal = new CANNON.Vec3();
        this._upAxis = new CANNON.Vec3(0, 1, 0);
        this._body.addEventListener("collide", function (e){
            if (e.contact.bi.id == this._body.id)
                e.contact.ni.negate(this._contactNormal);
            else
                this._contactNormal.copy(e.contact.ni);

            if (this._contactNormal.dot(this._upAxis) > 0.5){
               this._canJump = true;
            }
        }.bind(this));



        this._decay = 2;
    }

    _CalculateIdealOffset(rotation, position) {
        const idealOffset = new THREE.Vector3(0, 8, -16);
        idealOffset.applyQuaternion(rotation);
        idealOffset.add(position);
        return idealOffset;
    }
    _CalculateIdealLookat(rotation, position) {
        const idealLookat = new THREE.Vector3(0, 0, 10);
        idealLookat.applyQuaternion(rotation);
        idealLookat.add(position);
        return idealLookat;
    }

    update() {
        this._stateMachine.update(this._input);

        var velocity = new THREE.Vector3(0, 0, 0);

        const controlObject = this._target;
        const _Q = new THREE.Quaternion();
        const _R = controlObject.quaternion.clone();

        const acc = this._acceleration.clone();

        if (this._input._keys.forward) {
            if(this._input._keys.shift)
                velocity.z += acc.z * 2;
            else
                velocity.z += acc.z;
        }
        if (this._input._keys.backward) {
            velocity.z -= acc.z;
        }

        if (this._input._keys.left) {
            velocity.x += acc.x;
        }
        if (this._input._keys.right) {
            velocity.x -= acc.x;
        }

        if (this._input._keys.space && this._canJump) {
            velocity.y += this._jumpVelocity;
            this._MANAGER.audioMarioJump();
            this._input._keys.space = false;
            this._canJump = false;
        } else{
            velocity.y = -acc.y;
        }

        if( !(this._input._keys.forward || this._input._keys.backward || this._input._keys.left || this._input._keys.right) ){
            this._body.velocity.x *= 0.92;
            this._body.velocity.z *= 0.92;
        }

        if (this._input._rotationY) {
            _Q.setFromAxisAngle(this._horizontalRotation, this._input._rotationY - this._oldRotationY);
            _R.multiply(_Q);
            this._oldRotationY = this._input._rotationY;
        }

        const idealOffset = this._CalculateIdealOffset(controlObject.quaternion, controlObject.position);
        this._currentPosition.lerp(idealOffset, 1.5);
        this._camera.position.copy(idealOffset);

        const idealLookat = this._CalculateIdealLookat(controlObject.quaternion, controlObject.position);
        this._currentLookat.lerp(idealLookat, 1.5);
        this._camera.lookAt(idealLookat);

        controlObject.quaternion.copy(_R);

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
            this._canJump = false;
        }
        var norm = Math.sqrt(Math.pow(this._body.velocity.x, 2) + Math.pow(this._body.velocity.z, 2));
        if (this._input._keys.forward && this._input._keys.shift) {
            if(norm > 120){
                this._body.velocity.x = this._body.velocity.x/norm*120;
                this._body.velocity.z = this._body.velocity.z/norm*120;
            }
        } else if(norm > 60){
            this._body.velocity.x = this._body.velocity.x/norm*60;
            this._body.velocity.z = this._body.velocity.z/norm*60;
        }

        controlObject.position.copy(this._body.position);
        controlObject.position.y -= this._CharacterHeight;
    }
}

export class BasicCharacterControllerFly{
    constructor(params) {
        this._MANAGER = params.MANAGER;
        this._camera = params.camera;
        this._target = params.target;

        if(!this._MANAGER.getReducedAnimation()){
            this._stateMachine = new CharacterFlyFSM(this._target);
        } else {
            this._stateMachine = new NoAnimationsFSM();
        }
        this._stateMachine.setState('idle');

        this._acceleration = new THREE.Vector3(0.5, 0.5, 0.5);

        this._oldRotationY = 0;
        this._horizontalRotation = new THREE.Vector3(0, 1, 0);

        this._input = new BasicCharacterControllerInput({_MANAGER: this._MANAGER});

        this._currentPosition = new THREE.Vector3();
        this._currentLookat = new THREE.Vector3();
    }

    _CalculateIdealOffset(rotation, position) {
        const idealOffset = new THREE.Vector3(0, 6, -16);
        idealOffset.applyQuaternion(rotation);
        idealOffset.add(position);
        return idealOffset;
    }
    _CalculateIdealLookat(rotation, position) {
        const idealLookat = new THREE.Vector3(0, 0, 10);
        idealLookat.applyQuaternion(rotation);
        idealLookat.add(position);
        return idealLookat;
    }

    update() {
        this._stateMachine.update(this._input);

        var velocity = new THREE.Vector3(0, 0, 0);

        const controlObject = this._target;
        const _Q = new THREE.Quaternion();
        const _R = controlObject.quaternion.clone();

        const acc = this._acceleration.clone();
        
        if (this._input._keys.forward) {
            velocity.z += acc.z;
        }
        if (this._input._keys.backward) {
            velocity.z -= acc.z;
        }

        if (this._input._keys.left) {
            velocity.x += acc.x;
        }
        if (this._input._keys.right) {
            velocity.x -= acc.x;
        }

        if (this._input._keys.space){
            velocity.y += acc.y;
        }
        if (this._input._keys.shift) {
            velocity.y -= acc.y;
        }

        if (this._input._rotationY) {
            _Q.setFromAxisAngle(this._horizontalRotation, this._input._rotationY - this._oldRotationY);
            _R.multiply(_Q);
            this._oldRotationY = this._input._rotationY;
        }

        const idealOffset = this._CalculateIdealOffset(controlObject.quaternion, controlObject.position);
        this._currentPosition.lerp(idealOffset, 1.5);
        this._camera.position.copy(idealOffset);

        const idealLookat = this._CalculateIdealLookat(controlObject.quaternion, controlObject.position);
        this._currentLookat.lerp(idealLookat, 1.5);
        this._camera.lookAt(idealLookat);

        controlObject.quaternion.copy(_R);

        const oldPosition = new THREE.Vector3();
        oldPosition.copy(controlObject.position);

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

        controlObject.position.x += sideways.x+forward.x;
        controlObject.position.y += upway.y;
        controlObject.position.z += sideways.z+forward.z;

        oldPosition.copy(controlObject.position);
    }
}

class BasicCharacterControllerInput {
    constructor(params) {
        this._keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            space: false,
            shift: false,
        };

        this._MANAGER = params._MANAGER;
        this._mouseVelocity = 0.002 * this._MANAGER.gemMouseVel();
        this._rotationX = 0;
        this._rotationY = 0;

        this._scopeEnabled = true;

        document.addEventListener( 'mousemove', (e) => this._onMouseMove(e), false );
        document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
        document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
    }

    _onMouseMove(event) {
        if ( this._scopeEnabled === false ) return;
        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        this._rotationY -= movementX * this._mouseVelocity;
        this._rotationX -= movementY * this._mouseVelocity;
    }
    _onKeyDown(event) {
        switch (event.keyCode) {
            case 87: // w
                this._keys.forward = true;
                break;
            case 65: // a
                this._keys.left = true;
                break;
            case 83: // s
                this._keys.backward = true;
                break;
            case 68: // d
                this._keys.right = true;
                break;
            case 32: // SPACE
                this._keys.space = true;
                break;
            case 16: // SHIFT
                this._keys.shift = true;
                break;
        }
    }
    _onKeyUp(event) {
        switch (event.keyCode) {
            case 87: // w
                this._keys.forward = false;
                break;
            case 65: // a
                this._keys.left = false;
                break;
            case 83: // s
                this._keys.backward = false;
                break;
            case 68: // d
                this._keys.right = false;
                break;
            case 32: // SPACE
                this._keys.space = false;
                break;
            case 16: // SHIFT
                this._keys.shift = false;
                break;
        }
    }
}