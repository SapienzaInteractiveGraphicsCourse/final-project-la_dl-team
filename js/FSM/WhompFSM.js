import { FiniteStateMachine, State } from './FiniteStateMachine.js';

const PI_2 = Math.PI/2;
const PI_3_4 = PI_2+Math.PI/4;


export class WhompFSM extends FiniteStateMachine {
    constructor(target) {
        super(target);

        this._targetDict = {
            Leg_sx: {name: "leg_l", mesh: null},
            Leg_dx: {name: "leg_r", mesh: null},
            Arm_sx: {name: "arm_l", mesh: null},
            Arm_dx: {name: "arm_r", mesh: null},
            Body: {name: "skl_root", mesh: null},
        };
        this._prepareDict();

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

        var speedHigh = 0.003;
        switch (this._state) {
            case 0:
                if (this._targetDict.Arm_sx.mesh.rotation.z <= -2.70){
                    this._state = 1;
                } else {
                    this._targetDict.Arm_sx.mesh.rotation.z -= speedHigh;
                    this._targetDict.Arm_dx.mesh.rotation.z += speedHigh;
                }
                break;
            case 1:
                if (this._targetDict.Arm_sx.mesh.rotation.z >= (-PI_3_4)){
                    this._state = 0;
                } else {
                    this._targetDict.Arm_sx.mesh.rotation.z += speedHigh;
                    this._targetDict.Arm_dx.mesh.rotation.z -= speedHigh;
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

        var speedLow = 0.02;
        var speedHigh = 0.1;
        switch (this._state) {
            case 0:
                if (this._targetDict.Leg_sx.mesh.rotation.z >= -Math.PI/3){
                    this._state = 1;
                } else {
                    this._targetDict.Leg_sx.mesh.rotation.z += speedHigh;
                    this._targetDict.Leg_dx.mesh.rotation.z -= speedHigh;
                    this._targetDict.Arm_sx.mesh.rotation.y -= speedHigh;
                    this._targetDict.Arm_dx.mesh.rotation.y += speedHigh;
                    this._targetDict.Body.mesh.rotation.y += speedLow;
                }
                break;
            case 1:
                if (this._targetDict.Leg_sx.mesh.rotation.z <= -2.35){
                    this._state = 0;
                } else {
                    this._targetDict.Leg_sx.mesh.rotation.z -= speedHigh;
                    this._targetDict.Leg_dx.mesh.rotation.z += speedHigh;
                    this._targetDict.Arm_sx.mesh.rotation.y += speedHigh;
                    this._targetDict.Arm_dx.mesh.rotation.y -= speedHigh;
                    this._targetDict.Body.mesh.rotation.y -= speedLow;
                }
                break;
        }
    }
}