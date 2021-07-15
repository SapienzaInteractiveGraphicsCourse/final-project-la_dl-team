import { FiniteStateMachine, State } from './FiniteStateMachine.js';

const PI = Math.PI;
const PI_4 = Math.PI / 4;

export class PiranhaFSM extends FiniteStateMachine {
    constructor(target) {
        super(target);

        this._targetDict = {
            Shoulder_sx: {name: "Mesh_PiranhaPlantJNT_Shoulder_L_021", mesh: null},
            Elbow_sx: {name: "Mesh_PiranhaPlantJNT_Elbow_L_022", mesh: null},
            Jaw_sx: {name: "Mesh_PiranhaPlantJNT_Jaw_L_010", mesh: null},
            Shoulder_dx: {name: "Mesh_PiranhaPlantJNT_Shoulder_R_018", mesh: null},
            Elbow_dx: {name: "Mesh_PiranhaPlantJNT_Elbow_R_019", mesh: null},
            Jaw_dx: {name: "Mesh_PiranhaPlantJNT_Jaw_R_08", mesh: null},

            Plant_02: {name: "Mesh_PiranhaPlantJNT_Plant_02_05", mesh: null},
            Plant_03: {name: "Mesh_PiranhaPlantJNT_Plant_03_00", mesh: null},
            Plant_04: {name: "Mesh_PiranhaPlantJNT_Plant_04_06", mesh: null},

            Chest: {name: "Mesh_PiranhaPlantJNT_Chest_02", mesh: null},

            Leaf_sx: {name: "Mesh_PiranhaPlantJNT_Leaf_02_L_016", mesh: null},
            Leaf_dx: {name: "Mesh_PiranhaPlantJNT_Leaf_02_R_013", mesh: null},

            Hip_sx: {name: "Mesh_PiranhaPlantJNT_Hip_L_027", mesh: null},
            Hip_dx: {name: "Mesh_PiranhaPlantJNT_Hip_R_024", mesh: null},
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

        this._stateBody = 0;
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

        switch (this._stateBody) {
            case 0:
                if (this._targetDict.Leaf_sx.mesh.rotation.y >= PI_4) {
                    this._stateBody = 1;
                } else {
                    this._targetDict.Jaw_dx.mesh.rotation.z += 0.05;
                    this._targetDict.Jaw_sx.mesh.rotation.z += 0.05;

                    this._targetDict.Plant_02.mesh.rotation.y += 0.015;
                    this._targetDict.Plant_03.mesh.rotation.y += 0.03;
                    this._targetDict.Plant_02.mesh.rotation.z += 0.015;
                    this._targetDict.Plant_03.mesh.rotation.z += 0.015;

                    this._targetDict.Leaf_sx.mesh.rotation.y += 0.05;
                    this._targetDict.Leaf_dx.mesh.rotation.y += 0.05;
                }
                break;

            case 1:
                if (this._targetDict.Leaf_sx.mesh.rotation.y <= -PI_4) {
                    this._stateBody = 0;
                } else {
                    this._targetDict.Jaw_dx.mesh.rotation.z -= 0.05;
                    this._targetDict.Jaw_sx.mesh.rotation.z -= 0.05;

                    this._targetDict.Plant_02.mesh.rotation.y -= 0.015;
                    this._targetDict.Plant_03.mesh.rotation.y -= 0.03;
                    this._targetDict.Plant_02.mesh.rotation.z -= 0.015;
                    this._targetDict.Plant_03.mesh.rotation.z -= 0.015;

                    this._targetDict.Leaf_sx.mesh.rotation.y -= 0.05;
                    this._targetDict.Leaf_dx.mesh.rotation.y -= 0.05;
                }
                break;
        }
    }
}

class WalkState extends State {
    constructor(params) {
        super(params);

        this._stateBody = 0;
        this._stateHead = 0;
    }

    update(velocity) {
        if (velocity <= 0.1) {
            this._parent.setState('idle');
            return;
        }

        switch (this._stateBody) {
            case 0:
                if (this._targetDict.Shoulder_dx.mesh.rotation.y >= Math.PI/4) {
                    this._stateBody = 1;
                } else {
                    this._targetDict.Shoulder_dx.mesh.rotation.y += 0.2;
                    this._targetDict.Elbow_dx.mesh.rotation.y += 0.2;
                    this._targetDict.Shoulder_sx.mesh.rotation.y += 0.2;
                    this._targetDict.Elbow_sx.mesh.rotation.y += 0.2;

                    this._targetDict.Jaw_dx.mesh.rotation.z += 0.1;
                    this._targetDict.Jaw_sx.mesh.rotation.z += 0.1;

                    this._targetDict.Plant_02.mesh.rotation.y += 0.05;
                    this._targetDict.Plant_03.mesh.rotation.y += 0.1;
                    this._targetDict.Chest.mesh.rotation.y += 0.02;
                    this._targetDict.Plant_02.mesh.rotation.z += 0.05;
                    this._targetDict.Plant_03.mesh.rotation.z += 0.05;
                }
                break;
        
            case 1:
                if (this._targetDict.Shoulder_dx.mesh.rotation.y <= -Math.PI/4) {
                    this._stateBody = 0;
                } else {
                    this._targetDict.Shoulder_dx.mesh.rotation.y -= 0.2;
                    this._targetDict.Elbow_dx.mesh.rotation.y -= 0.2;
                    this._targetDict.Shoulder_sx.mesh.rotation.y -= 0.2;
                    this._targetDict.Elbow_sx.mesh.rotation.y -= 0.2;

                    this._targetDict.Jaw_dx.mesh.rotation.z -= 0.1;
                    this._targetDict.Jaw_sx.mesh.rotation.z -= 0.1;

                    this._targetDict.Plant_02.mesh.rotation.y -= 0.05;
                    this._targetDict.Plant_03.mesh.rotation.y -= 0.1;
                    this._targetDict.Chest.mesh.rotation.y -= 0.02;
                    this._targetDict.Plant_02.mesh.rotation.z -= 0.05;
                    this._targetDict.Plant_03.mesh.rotation.z -= 0.05;
        
                }
                break;
        }
        switch (this._stateHead) {
            case 0:
                if (this._targetDict.Leaf_sx.mesh.rotation.y >= Math.PI/4 ) {
                    this._stateHead = 1;
                } else {
                    this._targetDict.Leaf_sx.mesh.rotation.y += 0.5;
                    this._targetDict.Leaf_dx.mesh.rotation.y += 0.5;
                }
                break;
        
            case 1:
                if (this._targetDict.Leaf_sx.mesh.rotation.y <= -Math.PI/4 ) {
                    this._stateHead = 0;
                } else {
                    this._targetDict.Leaf_sx.mesh.rotation.y -= 0.5;
                    this._targetDict.Leaf_dx.mesh.rotation.y -= 0.5;
                }
                break;
        }

    }
}