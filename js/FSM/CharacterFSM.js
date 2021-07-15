import * as THREE from 'https://cdn.skypack.dev/three@v0.129.0-oVPEZFilCYUpzWgJBZqM/build/three.module.js';

import { FiniteStateMachine, State } from './FiniteStateMachine.js';

const PI_2 = Math.PI / 2;
const PI_4 = Math.PI / 4;
const PI_6 = Math.PI / 6;

export class CharacterFSM extends FiniteStateMachine {
    constructor(target) {
        super(target);

        this._targetDict = {
            Upper_leg_sx: { name: "LegL1_04", mesh: null },
            Lower_leg_sx: { name: "LegL2_05", mesh: null },
            Upper_leg_dx: { name: "LegR1_08", mesh: null },
            Lower_leg_dx: { name: "LegR2_09", mesh: null },

            Head: { name: "Head_014", mesh: null },
            Cap: {name: "Cap_015", mesh: null},

            Shoulder_sx: { name: "ShoulderL_016", mesh: null },
            Upper_arm_sx: { name: "ArmL1_017", mesh: null, initValue: new THREE.Vector3(0, 0, -PI_4) },
            Elbow_sx: { name: "ArmL2_018", mesh: null },

            Shoulder_dx: { name: "ShoulderR_020", mesh: null },
            Upper_arm_dx: { name: "ArmR1_021", mesh: null, initValue: new THREE.Vector3(0, 0, -PI_4) },
            Elbow_dx: { name: "ArmR2_022", mesh: null },
        };
        this._prepareDict();

        this._targetDict.Cap.mesh.scale.setScalar(1.1);

        this._addState('idle', IdleState);
        this._addState('walk', WalkState);
        this._addState('run', RunState);
        this._addState('jump', JumpState);
    }
}

class IdleState extends State {
    constructor(params) {
        super(params);

        this._learping = false;
        this._lerpTotSteps = 10;
        this._lerpStepVal = 1 / this._lerpTotSteps;

        this._stateHead = 0;
        this._stateArms = 0;
    }

    enter() {
        this._lerpStep = this._lerpStepVal;
        this._learping = true;
    }

    update(input) {
        if (input._keys.forward || input._keys.backward || input._keys.left || input._keys.right) {
            this._parent.setState('walk');
            return;
        } else if (input._keys.space) {
            this._parent.setState('jump');
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

        var speed = 0.003;
        switch (this._stateHead) {
            case 0:
                if (this._targetDict.Head.mesh.rotation.z >= 1.57) {
                    this._stateHead = 1;
                } else {
                    this._targetDict.Head.mesh.rotation.z += speed;
                }
                break;

            case 1:
                if (this._targetDict.Head.mesh.rotation.z <= 1.45) {
                    this._stateHead = 0;
                } else {
                    this._targetDict.Head.mesh.rotation.z -= speed;
                }
                break;
        }
        switch (this._stateArms) {
            case 0:
                if (this._targetDict.Upper_arm_sx.mesh.rotation.z >= -0.8) {
                    this._stateArms = 1;
                } else {
                    this._targetDict.Upper_arm_sx.mesh.rotation.z += speed;
                    this._targetDict.Upper_arm_dx.mesh.rotation.z += speed;
                }
                break;

            case 1:
                if (this._targetDict.Upper_arm_sx.mesh.rotation.z <= -0.98) {
                    this._stateArms = 0;
                } else {
                    this._targetDict.Upper_arm_sx.mesh.rotation.z -= speed;
                    this._targetDict.Upper_arm_dx.mesh.rotation.z -= speed;
                }
                break;
        }
    }
}

class WalkState extends State {
    constructor(params) {
        super(params);

        this._stateLegs = 0;
        this._stateArms = 0;
    }

    update(input) {
        if (input._keys.forward || input._keys.backward || input._keys.left || input._keys.right || input._keys.space) {
            if (input._keys.shift) {
                this._parent.setState('run');
                return;
            }
            if(input._keys.space){
                this._parent.setState('jump');
                return;
            }
        } else {
            this._parent.setState('idle');
            return;
        }

        var speed = 0.05;
        switch (this._stateLegs) {
            case 0:
                if (this._targetDict.Upper_leg_sx.mesh.rotation.z >= PI_6) {
                    this._stateLegs = 1;
                } else {
                    this._targetDict.Upper_leg_sx.mesh.rotation.z += speed;
                    if (this._targetDict.Lower_leg_sx.mesh.rotation.z <= 0) {
                        this._targetDict.Lower_leg_sx.mesh.rotation.z += speed;
                    }

                    this._targetDict.Upper_leg_dx.mesh.rotation.z -= speed;
                    if (this._targetDict.Lower_leg_dx.mesh.rotation.z >= -PI_6) {
                        this._targetDict.Lower_leg_dx.mesh.rotation.z -= speed;
                    }
                }
                break;

            case 1:
                if (this._targetDict.Upper_leg_sx.mesh.rotation.z <= -PI_6) {
                    this._stateLegs = 0;
                } else {
                    this._targetDict.Upper_leg_sx.mesh.rotation.z -= speed;
                    if (this._targetDict.Lower_leg_sx.mesh.rotation.z >= -PI_6) {
                        this._targetDict.Lower_leg_sx.mesh.rotation.z -= speed;
                    }

                    this._targetDict.Upper_leg_dx.mesh.rotation.z += speed;
                    if (this._targetDict.Lower_leg_dx.mesh.rotation.z <= 0) {
                        this._targetDict.Lower_leg_dx.mesh.rotation.z += speed;
                    }
                }
                break;
        }

        switch (this._stateArms) {
            case 0:
                if (this._targetDict.Shoulder_sx.mesh.rotation.y >= PI_6) {
                    this._stateArms = 1;
                } else {
                    this._targetDict.Shoulder_sx.mesh.rotation.y += speed;
                    if (this._targetDict.Elbow_sx.mesh.rotation.y >= -PI_6) {
                        this._targetDict.Elbow_sx.mesh.rotation.y -= speed;
                    }

                    this._targetDict.Shoulder_dx.mesh.rotation.y += speed;
                    if (this._targetDict.Elbow_dx.mesh.rotation.y >= 0) {
                        this._targetDict.Elbow_dx.mesh.rotation.y -= speed;
                    }
                }
                break;

            case 1:
                if (this._targetDict.Shoulder_sx.mesh.rotation.y <= -PI_6) {
                    this._stateArms = 0;
                } else {
                    this._targetDict.Shoulder_sx.mesh.rotation.y -= speed;
                    if (this._targetDict.Elbow_sx.mesh.rotation.y <= 0) {
                        this._targetDict.Elbow_sx.mesh.rotation.y += speed;
                    }

                    this._targetDict.Shoulder_dx.mesh.rotation.y -= speed;
                    if (this._targetDict.Elbow_dx.mesh.rotation.y <= PI_6) {
                        this._targetDict.Elbow_dx.mesh.rotation.y += speed;
                    }

                }
                break;
        }
    }
}

class JumpState extends State {
    constructor(params) {
        super(params);

        this._stateLegs = 0;
        this._stateArms = 0;
    }

    update(input) {

        var speed1 = 0.1;
        var speed2 = 0.05;
        switch (this._stateArms) {
            case 0:
                if (this._targetDict.Shoulder_sx.mesh.rotation.y >= Math.PI) {
                    this._stateArms = 1;
                } else {
                    this._targetDict.Shoulder_sx.mesh.rotation.y += speed1;
                    if(this._targetDict.Elbow_sx.mesh.rotation.z >= -Math.PI/12) {
                        this._targetDict.Elbow_sx.mesh.rotation.z -= speed1;
                    }
                    this._targetDict.Shoulder_dx.mesh.rotation.y += speed2;
                    if (this._targetDict.Shoulder_dx.mesh.rotation.y >= PI_4) {
                        this._stateArms = 1;
                    }
                }
                break;

            case 1:
                if (this._targetDict.Shoulder_sx.mesh.rotation.y <= 0) {
                    this._parent.setState('idle');
                } else {
                    this._targetDict.Shoulder_sx.mesh.rotation.y -= speed1;
                    if(this._targetDict.Elbow_sx.mesh.rotation.z <= 0){
                        this._targetDict.Elbow_sx.mesh.rotation.z += speed1;
                    }
                    this._targetDict.Shoulder_dx.mesh.rotation.y -= speed2;
                    if (this._targetDict.Shoulder_dx.mesh.rotation.y <= 0) {
                        this.state7 = 0;
                    }
                }
                break;
        }

        var speed3 = 0.05;
        var speed4 = 0.1;
        switch (this._stateLegs) {
            case 0:
                if (this._targetDict.Upper_leg_dx.mesh.rotation.z >= PI_2) {
                    this._stateLegs = 1;
                } else {
                    if(this._targetDict.Lower_leg_dx.mesh.rotation.z >= -PI_6) {
                        this._targetDict.Lower_leg_dx.mesh.rotation.z -= speed3;
                    }
                    this._targetDict.Upper_leg_dx.mesh.rotation.z += speed4;

                    if(this._targetDict.Upper_leg_sx.mesh.rotation.z >= -PI_6) {
                        this._targetDict.Upper_leg_sx.mesh.rotation.z -= speed4;
                    }
                    if(this._targetDict.Lower_leg_sx.mesh.rotation.z <= PI_4) {
                        this._targetDict.Lower_leg_sx.mesh.rotation.z -= speed3;
                    }

                }
                break;

            case 1:
                if (this._targetDict.Upper_leg_dx.mesh.rotation.z <= 0) {
                    this._stateLegs = 0;
                } else {
                    if(this._targetDict.Lower_leg_dx.mesh.rotation.z <= 0) {
                       this._targetDict.Lower_leg_dx.mesh.rotation.z += speed3;
                    }
                    this._targetDict.Upper_leg_dx.mesh.rotation.z -= speed4;

                    if(this._targetDict.Upper_leg_sx.mesh.rotation.z <= 0) {
                        this._targetDict.Upper_leg_sx.mesh.rotation.z += speed4;
                    }
                    if(this._targetDict.Lower_leg_sx.mesh.rotation.z <= 0) {
                        this._targetDict.Lower_leg_sx.mesh.rotation.z += speed3;
                    }

                }
                break;
        }
    }
}

class RunState extends State {
    constructor(params) {
        super(params);

        this._stateLegs = 0;
        this._stateArms = 0;
    }

    update(input) {
        if (input._keys.forward || input._keys.backward || input._keys.left || input._keys.right || input._keys.space) {
            if (!input._keys.shift) {
                this._parent.setState('walk');
                return;
            }
            if(input._keys.space){
                this._parent.setState('jump');
                return;
            }
        } else {
            this._parent.setState('idle');
            return;
        }

        var speed = 0.1;
        switch (this._stateLegs) {
            case 0:
                if (this._targetDict.Upper_leg_sx.mesh.rotation.z >= PI_6) {
                    this._stateLegs = 1;
                } else {
                    this._targetDict.Upper_leg_sx.mesh.rotation.z += speed;
                    if (this._targetDict.Lower_leg_sx.mesh.rotation.z <= 0) {
                        this._targetDict.Lower_leg_sx.mesh.rotation.z += speed;
                    }

                    this._targetDict.Upper_leg_dx.mesh.rotation.z -= speed;
                    if (this._targetDict.Lower_leg_dx.mesh.rotation.z >= -PI_6) {
                        this._targetDict.Lower_leg_dx.mesh.rotation.z -= speed;
                    }
                }
                break;

            case 1:
                if (this._targetDict.Upper_leg_sx.mesh.rotation.z <= -PI_6) {
                    this._stateLegs = 0;
                } else {
                    this._targetDict.Upper_leg_sx.mesh.rotation.z -= speed;
                    if (this._targetDict.Lower_leg_sx.mesh.rotation.z >= -PI_6) {
                        this._targetDict.Lower_leg_sx.mesh.rotation.z -= speed;
                    }

                    this._targetDict.Upper_leg_dx.mesh.rotation.z += speed;
                    if (this._targetDict.Lower_leg_dx.mesh.rotation.z <= 0) {
                        this._targetDict.Lower_leg_dx.mesh.rotation.z += speed;
                    }
                }
                break;
        }

        switch (this._stateArms) {
            case 0:
                if (this._targetDict.Shoulder_sx.mesh.rotation.y >= PI_6) {
                    this._stateArms = 1;
                } else {
                    this._targetDict.Shoulder_sx.mesh.rotation.y += speed;
                    if (this._targetDict.Elbow_sx.mesh.rotation.y >= -PI_6) {
                        this._targetDict.Elbow_sx.mesh.rotation.y -= speed;
                    }

                    this._targetDict.Shoulder_dx.mesh.rotation.y += speed;
                    if (this._targetDict.Elbow_dx.mesh.rotation.y >= 0) {
                        this._targetDict.Elbow_dx.mesh.rotation.y -= speed;
                    }
                }
                break;

            case 1:
                if (this._targetDict.Shoulder_sx.mesh.rotation.y <= -PI_6) {
                    this._stateArms = 0;
                } else {
                    this._targetDict.Shoulder_sx.mesh.rotation.y -= speed;
                    if (this._targetDict.Elbow_sx.mesh.rotation.y <= 0) {
                        this._targetDict.Elbow_sx.mesh.rotation.y += speed;
                    }

                    this._targetDict.Shoulder_dx.mesh.rotation.y -= speed;
                    if (this._targetDict.Elbow_dx.mesh.rotation.y <= PI_6) {
                        this._targetDict.Elbow_dx.mesh.rotation.y += speed;
                    }

                }
                break;
        }
    }
}