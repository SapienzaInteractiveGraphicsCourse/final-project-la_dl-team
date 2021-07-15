
export class FiniteStateMachine {
    constructor(target) {
        this._states = {};
        this._currentState = null;
        this._target = target;
    }

    _prepareDict(){
        for (var i in this._targetDict) {
            this._targetDict[i].mesh = this._target.getObjectByName(this._targetDict[i].name);
            if(this._targetDict[i].initValue == null)
                this._targetDict[i].initValue = this._targetDict[i].mesh.rotation.clone();
        }
    }

    _addState(name, type) {
        this._states[name] = type;
    }

    setState(name) {
        const prevState = this._currentState;

        if (prevState) {
            if (prevState.Name == name) {
                return;
            }
            prevState.exit();
        }

        const state = new this._states[name]({
            parent: this,
            targetDict: this._targetDict, name: name, 
        });

        this._currentState = state;
        state.enter(prevState);
    }

    update(input) {
        if (this._currentState) {
            this._currentState.update(input);
        }
    }
}

export class State {
    constructor(params) {
        this._parent = params.parent;
        this._targetDict = params.targetDict;
        this._name = params.name;
    }

    get Name() {
        return this._name;
    }

    lerp (start, end, amt){
        return [
            (1-amt)*start.x+amt*end.x,
            (1-amt)*start.y+amt*end.y,
            (1-amt)*start.z+amt*end.z,
        ]
    }

    enter() {return;}
    exit() {return;}
    update() {return;}
}

export class NoAnimationsFSM{
    constructor(target) {
    }

    _prepareDict(){}
    _addState(name, type) {}
    setState(name) {}
    update(input) {}
}