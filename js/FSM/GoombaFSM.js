import { FiniteStateMachine, State } from './FiniteStateMachine.js';

const PI_4 = Math.PI / 4;

export class GoombaFSM extends FiniteStateMachine {
    constructor(target) {
        super(target);

        this._targetDict = {
            Foot_sx: {name: "Left_Foot_14_-_Default_0", mesh: null},
            Foot_base_sx: {name: "Left_Foot_07_-_Default_0", mesh: null},
            Foot_dx: {name: "Right_Foor_14_-_Default_0", mesh: null},
            Foot_base_dx: {name: "Right_Foor_07_-_Default_0", mesh: null},
            Hip: {name: "Body", mesh: null},
            Body: {name: "Body_07_-_Default_0", mesh: null},
            Head: {name: "Head", mesh: null},
        };
        this._prepareDict();

        this._targetDict.Foot_sx.mesh.rotation.z = 0;
        this._targetDict.Foot_base_sx.mesh.rotation.z = 0;
        this._targetDict.Foot_dx.mesh.rotation.z = 0;
        this._targetDict.Foot_base_dx.mesh.rotation.z = 0;

        this._addState('idle', IdleState);
        this._addState('walk', WalkState);
    }
}

class IdleState extends State {
    constructor(params) {
        super(params);

        this._learping = false;
        this._lerpTotSteps = 10;
        this._lerpStepVal = 1 / this._lerpTotSteps;

        this._state = 0;
    }

    enter() {
        this._lerpStep = this._lerpStepVal;
        this._learping = true;
    }

    update(velocity) {
        if (velocity >= 0.1) {
            this._parent.setState('walk');
            return;
        }

        if (this._learping){
            if(this._lerpStep <= 1){
                for(var i in this._targetDict){
                    this._targetDict[i].mesh.rotation.set( ...this.lerp(this._targetDict[i].mesh.rotation, this._targetDict[i].initValue, this._lerpStep));
                }

                this._lerpStep += this._lerpStepVal;

                return;
            } else {
                this._learping = false;
            }
        }

        var speedLow = 0.02;
        switch (this._state) {
            case 0:
                if (this._targetDict.Head.mesh.rotation.y  >= Math.PI/6) {
                    this._state = 1;
                } else {
                    this._targetDict.Head.mesh.rotation.y += speedLow;
                    this._targetDict.Body.mesh.rotation.y += speedLow;
                }
                break;
            case 1:
                if (this._targetDict.Head.mesh.rotation.y <= -Math.PI/6) {
                    this._state = 0;
                } else {
                    this._targetDict.Head.mesh.rotation.y -= speedLow;
                    this._targetDict.Body.mesh.rotation.y -= speedLow;
                }
                break;
        }
    }
}

class WalkState extends State {
    constructor(params) {
        super(params);

        this._state = 0;
    }

    update(velocity) {
        if (velocity <= 0.1) {
            this._parent.setState('idle');
            return;
        }

        var speedLow = 0.05;
        var sppedHigh = 0.1;
        switch (this._state) {
            case 0:
                if (this._targetDict.Foot_sx.mesh.rotation.x >= PI_4) {
                    this._state = 1;
                } else {
                    this._targetDict.Foot_sx.mesh.rotation.x += sppedHigh;
                    this._targetDict.Foot_dx.mesh.rotation.x -= sppedHigh;
                    this._targetDict.Foot_base_sx.mesh.rotation.x += sppedHigh;
                    this._targetDict.Foot_base_dx.mesh.rotation.x -= sppedHigh;
                    this._targetDict.Hip.mesh.rotation.y += speedLow;
                    this._targetDict.Body.mesh.rotation.y += sppedHigh;
                    this._targetDict.Head.mesh.rotation.y += speedLow;
                }
                break;
            case 1:
                if (this._targetDict.Foot_sx.mesh.rotation.x <= -PI_4) {
                    this._state = 0;
                } else {
                    this._targetDict.Foot_sx.mesh.rotation.x -= sppedHigh;
                    this._targetDict.Foot_dx.mesh.rotation.x += sppedHigh;
                    this._targetDict.Foot_base_sx.mesh.rotation.x -= sppedHigh;
                    this._targetDict.Foot_base_dx.mesh.rotation.x += sppedHigh;
                    this._targetDict.Hip.mesh.rotation.y -= speedLow;
                    this._targetDict.Body.mesh.rotation.y -= sppedHigh;
                    this._targetDict.Head.mesh.rotation.y -= speedLow;
                }
                break;
        }
    }
}