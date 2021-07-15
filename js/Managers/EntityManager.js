
import { BasicAIGoombaController, BasicAIWhompController, BasicAIPiranhaController } from '../Controllers/BasicAIController.js';

const PI_4 = Math.PI / 4;

export class EntityManager{
    static ENTITY_BLOCK = "Block";
    static ENTITY_COIN = "Coin";
    static ENTITY_GOOMBA = "Goomba";
    static ENTITY_MARIO = "Mario";
    static ENTITY_STAR = "Star";

    static ENTITY_WHOMP = "Whomp";
    static ENTITY_TREE = "Tree";
    static ENTITY_FLOWER = "Flower";
    static ENTITY_PIRANHA = "Piranha";
    static ENTITY_BULLET = "Bullet";

    static ENTITY_WHOMPBLOCK = "WhompBlock";
    static ENTITY_TRASPORTER = "Trasporter";
    static ENTITY_ELEVATOR = "Elevator";

    constructor(params){
        this._entities = [];
        this._collectables = [];
        this._decorations = [];
        this._character = null;

        this._scene = params.scene;
        this._world = params.world;
        this._MANAGER = params.manager;
        this._scoreManager = params.scoreManager;

        this._models = {}
        for (var m in params.models){
            this._models[params.models[m].name] = {};
            this._models[params.models[m].name].name = params.models[m].name;
            this._models[params.models[m].name].model = params.models[m].model;
            this._models[params.models[m].name].count = 0;
        }
    }

    addEntityPreBuilded(name, terget, body){
        switch(name){
            case EntityManager.ENTITY_WHOMPBLOCK:
                var entity = new WhompBlockEntity({
                    manager: this._MANAGER,
                    scoreManager: this._scoreManager,
                    target: terget,
                    body: body,
                    player: this._character,
                });
                this._entities.push(entity);
                break;
            case EntityManager.ENTITY_TRASPORTER:
                var entity = new TrasporterEntity({
                    scoreManager: this._scoreManager,
                    target: terget,
                    body: body,
                });
                this._entities.push(entity);
                break;
            case EntityManager.ENTITY_ELEVATOR:
                var entity = new ElevatorEntity({
                    scoreManager: this._scoreManager,
                    target: terget,
                    body: body,
                });
                this._entities.push(entity);
                break;
        }
    }

    addEntity(params){
        switch(params.name){
            case EntityManager.ENTITY_BLOCK:
                var entity = new BlockEntity({
                    manager: this._MANAGER,
                    entityManager: this,
                    scoreManager: this._scoreManager,
                    target: this.buildMesh(params),
                    body: this.buildBody(params),
                    pos: this._decorations.length,
                    player: this._character,
                    coins: 5, score: 10,
                });
                this._decorations.push(entity);
                break;
            case EntityManager.ENTITY_COIN:
                var entity = new CoinEntity({
                    manager: this._MANAGER,
                    entityManager: this,
                    scoreManager: this._scoreManager,
                    target: this.buildMesh(params),
                    body: this.buildBody(params),
                    pos: this._collectables.length,
                    score: 10,
                });
                this._collectables.push(entity);
                break;
            case EntityManager.ENTITY_GOOMBA:
                var entity = new GoombaEntity({
                    manager: this._MANAGER,
                    entityManager: this,
                    scoreManager: this._scoreManager,
                    target: this.buildMesh(params),
                    body: this.buildBody(params),
                    pos: this._entities.length,
                    player: this._character,
                    maxDistance: params.maxDistance,
                    score: 20,
                });
                this._entities.push(entity);
                break;
            case EntityManager.ENTITY_MARIO:
                var entity = new MarioEntity({
                    manager: this._MANAGER,
                    entityManager: this,
                    scoreManager: this._scoreManager,
                    target: this.buildMesh(params),
                    body: this.buildBody(params),
                    pos: this._entities.length,
                });
                this._entities.push(entity);
                break;
            case EntityManager.ENTITY_STAR:
                var entity = new StarEntity({
                    manager: this._MANAGER,
                    entityManager: this,
                    scoreManager: this._scoreManager,
                    target: this.buildMesh(params),
                    body: this.buildBody(params),
                    pos: this._collectables.length,
                    score: 100,
                });
                this._collectables.push(entity);
                break;
            
            case EntityManager.ENTITY_WHOMP:
                var entity = new WhompEntity({
                    manager: this._MANAGER,
                    entityManager: this,
                    scoreManager: this._scoreManager,
                    target: this.buildMesh(params),
                    body: this.buildBody(params),
                    pos: this._entities.length,
                    player: this._character,
                    maxDistance: params.maxDistance,
                });
                this._entities.push(entity);
                break;
            case EntityManager.ENTITY_TREE:
                var entity = new TreeEntity({
                    manager: this._MANAGER,
                    entityManager: this,
                    scoreManager: this._scoreManager,
                    target: this.buildMesh(params),
                    body: this.buildBody(params),
                    pos: this._decorations.length,
                });
                this._decorations.push(entity);
                break;
            case EntityManager.ENTITY_FLOWER:
                var entity = new FlowerbooEntity({
                    manager: this._MANAGER,
                    entityManager: this,
                    scoreManager: this._scoreManager,
                    target: this.buildMesh(params),
                    body: this.buildBody(params),
                    pos: this._decorations.length,
                });
                this._decorations.push(entity);
                break;
            case EntityManager.ENTITY_PIRANHA:
                var entity = new PiranhaEntity({
                    manager: this._MANAGER,
                    entityManager: this,
                    scoreManager: this._scoreManager,
                    target: this.buildMesh(params),
                    body: this.buildBody(params),
                    pos: this._entities.length,
                    player: this._character,
                    maxDistance: params.maxDistance,
                });
                this._entities.push(entity);
                break;
            case EntityManager.ENTITY_BULLET:
                var entity = new BulletEntity({
                    manager: this._MANAGER,
                    entityManager: this,
                    scoreManager: this._scoreManager,
                    target: this.buildMesh(params),
                    body: this.buildBody(params),
                    pos: this._entities.length,
                    player: this._character,
                });
                this._entities.push(entity);
                break;
        }

        this._scene.add(entity._target);
        if(entity._body != null)
            this._world.add(entity._body);
    }
    addEntityAndReturn(params){
        this.addEntity(params);
        return this._entities[this._entities.length-1];
    }
    buildMesh(params){
        switch(params.name){
            case EntityManager.ENTITY_BLOCK:
            case EntityManager.ENTITY_COIN:
            case EntityManager.ENTITY_STAR:
            case EntityManager.ENTITY_TREE:
            case EntityManager.ENTITY_FLOWER:
                var elem = this._models[params.name];
                var mesh = elem.model.clone();
                break;

            case EntityManager.ENTITY_GOOMBA:
            case EntityManager.ENTITY_BULLET:
                var elem = this._models[params.name];
                var mesh = elem.model.clone();
                break;
            
            case EntityManager.ENTITY_MARIO:
            case EntityManager.ENTITY_WHOMP:
            case EntityManager.ENTITY_PIRANHA:
                var elem = this._models[params.name];
                var mesh = elem.model;
                break;
        }

        mesh.name = params.name+(++elem.count);

        mesh.position.set(...params.position);
        if(params.rotation)
            mesh.rotation.set(...params.rotation);

        return mesh;
    }
    buildBody(params){
        switch(params.name){
            case EntityManager.ENTITY_STAR:
            case EntityManager.ENTITY_COIN:
            case EntityManager.ENTITY_FLOWER:
                return null;
            
            case EntityManager.ENTITY_TREE:
                var body = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new CANNON.Vec3(1, 15, 1)), });
                break;
            case EntityManager.ENTITY_BLOCK:
                var body = new CANNON.Body({ mass: 0, shape: new CANNON.Box(new CANNON.Vec3(2, 3, 2)), });
                break;
            case EntityManager.ENTITY_WHOMP:
                var body = new CANNON.Body({ mass: 1000, shape: new CANNON.Box(new CANNON.Vec3(3, 4.5, 1.5)), });
                break;
            case EntityManager.ENTITY_PIRANHA:
                var body = new CANNON.Body({ mass: 10, shape: new CANNON.Box(new CANNON.Vec3(1.5, 4, 1.5)), });
                break;
            
            case EntityManager.ENTITY_GOOMBA:
                var body = new CANNON.Body({ mass: 1, shape: new CANNON.Sphere(2), });
                break;
            case EntityManager.ENTITY_MARIO:
                var body = new CANNON.Body({ mass: 5, shape: new CANNON.Sphere(0.9), });
                body.linearDamping = 0.9;
                break;
            case EntityManager.ENTITY_BULLET:
                var body = new CANNON.Body({ mass: 0, shape: new CANNON.Sphere(3), });
                break;
        }

        body.position.set(...params.position);
        if(params.rotation){
            if(params.rotation[0] != 0)
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), params.rotation[0]);
            if(params.rotation[1] != 0)
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), params.rotation[1]);
            if(params.rotation[2] != 0)
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), params.rotation[2]);
        }
        return body;
    }

    deleteEntity(pos){
        this._scene.remove(this._entities[pos].name);
        if(this._entities[pos].body != null)
            this._world.remove(this._entities[pos].name);
        this._entities.splice(pos, 1);
    }

    getEntity(pos){
        return this._entities[pos];
    }

    setCharacter(caracter){
        this._character = caracter;
    }

    update(timeInSeconds, collision){
        for(var i in this._collectables){
            var y_dist = this._collectables[i].position.y-this._character.position.y;
            if(collision && (this._distance(this._character.position, this._collectables[i].position) < 2)
                && -2 < y_dist && y_dist < 6 ){
                this._collectables[i].collected();
                this.eliminateThisCollectable(this._collectables[i]);
            } else {
                if(!this._MANAGER.getReducedAnimation()){
                    this._collectables[i].update(timeInSeconds);
                }
            }
        }
        
        for(var i in this._entities){
            this._entities[i].update(timeInSeconds);
        }
    }
    _distance(p1, p2){
        return Math.sqrt( Math.pow(p1.x-p2.x, 2) + Math.pow(p1.z-p2.z, 2))
    }
    eliminateThisCollectable(elem){
        var selectedObject = this._scene.getObjectByName(elem.name);
        selectedObject.parent.remove( selectedObject );
        var pos = elem.elemPos;
        this._collectables.splice(pos, 1);
        for (var i = pos; i < this._collectables.length; i++){
            this._collectables[i].decElemPos();
        }
    }
    eliminateThisEntity(elem){
        var selectedObject = this._scene.getObjectByName(elem.name);
        selectedObject.parent.remove( selectedObject );
        elem.body.position.y = -100;

        var pos = elem.elemPos;
        this._entities.splice(pos, 1);
        for (var i = pos; i < this._entities.length; i++){
            this._entities[i].decElemPos();
        }
    }
}

class Entity{
    constructor(params){
        this._MANAGER = params.manager;
        this._entityManager = params.entityManager;
        this._scoreManager = params.scoreManager;
        this._target = params.target;
        this._body = params.body;
        this._pos = params.pos;

        this._player = params.player;

        if(this._body && this._player){
            this._contactNormal = new CANNON.Vec3();
            this._upAxis = new CANNON.Vec3(0, 1, 0);
            
            this._body.addEventListener("collide", function (e){
                if ( !(e.contact.bi.id == this._player.bodyID || e.contact.bj.id == this._player.bodyID) )
                    return;

                if (e.contact.bi.id == this._body.id)
                    e.contact.ni.negate(this._contactNormal);
                else
                    this._contactNormal.copy(e.contact.ni);
                
                var direction = this._contactNormal.dot(this._upAxis)
                if (direction > 0.5){
                    this.hittedDown();
                } else if (direction < -0.5){
                    this.hittedUp();
                } else {
                    this.hitted();
                }
            }.bind(this));
        }
    }

    get elemPos(){
        return this._pos;
    }
    get position(){
        return this._target.position;
    }
    get rotation(){
        return this._target.rotation;
    }
    get name(){
        return this._target.name;
    }
    get model(){
        return this._target;
    }
    get body(){
        return this._body;
    }
    get bodyID(){
        return this._body.id;
    }

    decElemPos(){
        this._pos -= 1;
    }

    collected(){}
    hitted(){}
    hittedUp(){this.hitted()}
    hittedDown(){this.hitted()}
    update(timeInSeconds){}
}

class BlockEntity extends Entity{
    constructor(params){
        super(params);
        this._score = params.score;
        this._coins = params.coins;
    }

    hittedDown(){
        if(this._coins > 0){
            this._coins -= 1;
            this._MANAGER.audioCollectCoin();
            this._scoreManager.changeScore(this._score);
        }
    }
}
class CoinEntity extends Entity{
    constructor(params){
        super(params);
        this._score = params.score;
    }

    collected(){
        this._MANAGER.audioCollectCoin();
        this._scoreManager.changeScore(this._score);
    }

    update(timeInSeconds){
        this._target.rotation.y += 0.1;
    }
}
class GoombaEntity extends Entity{
    constructor(params){
        super(params);
        this._score = params.score;
        this._state = 0;

        this._maxDistance = params.maxDistance;

        this._controls = new BasicAIGoombaController({
            MANAGER: this._MANAGER,
            target: this._target, body: this._body,
            player: this._player,
            initRotation: this._target.rotation.y, maxDistance: this._maxDistance,
        });
    }

    hitted(){
        this._MANAGER.audioMarioGetHit();
        this._scoreManager.lose1life();
    }
    hittedUp(){
        this._scoreManager.changeScore(this._score);
        this._entityManager.eliminateThisEntity(this);
    }

    update(timeInSeconds){
        this._controls.update(timeInSeconds);

        if(this._body.position.y < -20){
            this._entityManager.eliminateThisEntity(this);
        }
    }
}
class MarioEntity extends Entity{
    constructor(params){
        super(params);
    }
}
class StarEntity extends Entity{
    constructor(params){
        super(params);
        this._score = params.score;
    }

    collected(){
        this._MANAGER.audioCollectStar();
        this._scoreManager.changeScore(this._score);
        this._scoreManager.add1Star();
    }

    update(timeInSeconds){
        this._target.rotation.y += 0.1;
    }
}

class WhompEntity extends Entity{
    constructor(params){
        super(params);

        this._maxDistance = params.maxDistance;

        this._controls = new BasicAIWhompController({
            MANAGER: this._MANAGER,
            target: this._target, body: this._body,
            player: this._player,
            initRotation: this._target.rotation.y, maxDistance: this._maxDistance,
        });
    }

    hitted(){
        this._MANAGER.audioMarioGetHit();
        this._scoreManager.lose1life();
    }

    update(timeInSeconds){
        this._controls.update(timeInSeconds);

        if(this._body.position.y < -20){
            this._entityManager.eliminateThisEntity(this);
        }
    }
}
class TreeEntity extends Entity{
    constructor(params){
        super(params);
    }
}
class FlowerbooEntity extends Entity{
    constructor(params){
        super(params);
    }
}
class PiranhaEntity extends Entity{
    constructor(params){
        super(params);

        this._maxDistance = params.maxDistance;

        this._controls = new BasicAIPiranhaController({
            MANAGER: this._MANAGER,
            target: this._target, body: this._body,
            player: this._player,
            initRotation: this._target.rotation.y, maxDistance: this._maxDistance,
        });
    }

    hitted(){
        this._MANAGER.audioMarioGetHit();
        this._scoreManager.lose1life();
    }

    update(timeInSeconds){
        this._controls.update(timeInSeconds);

        if(this._body.position.y < -20){
            this._entityManager.eliminateThisEntity(this);
        }
    }
}
class BulletEntity extends Entity{
    constructor(params){
        super(params);
        this._state = 0;
    }

    hitted(){
        this._MANAGER.audioMarioGetHit();
        this._scoreManager.lose1life();
    }

    update(timeInSeconds){
        switch (this._state) {
            case 0:
                if (this._target.position.x <= -25) {
                    this._target.rotation.y += Math.PI;
                    this._state = 1;
                } else
                    this._target.position.x -= 0.5;
                    this._body.position.x -= 0.5;
                break;

            case 1:
                if (this._target.position.x >= 2) {
                        this._target.rotation.y += Math.PI;
                    this._state = 0;
                } else
                    this._target.position.x += 0.5;
                    this._body.position.x += 0.5;
                break;
        }
    }
}

class WhompBlockEntity extends Entity{
    constructor(params){
        super(params);
        this._state = 0;
        this._offensive = true;
    }

    hittedDown(){
        if(this._offensive){
            this._MANAGER.audioMarioGetHit();
            this._scoreManager.lose1life();
        }
    }

    update(timeInSeconds){
        switch (this._state) {
            case 0:
                if (this._target.position.y <= 21.5) {
                    this._state = 1;
                    this._offensive = false;
                } else
                    this._target.position.y -= 1;
                    this._body.position.y = this._target.position.y;
                break;
            case 1:
                if (this._target.position.y >= 39) {
                    this._state = 0;
                    this._offensive = true;
                } else
                    this._target.position.y += 0.1;
                    this._body.position.y = this._target.position.y;
                break;
        }
    }
}
class TrasporterEntity extends Entity{
    constructor(params){
        super(params);
    }

    update(timeInSeconds){
        this._target.rotation.y += 0.01;
        this._body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), this._target.rotation.y);
    }
}
class ElevatorEntity extends Entity{
    constructor(params){
        super(params);
        this._state = 0;
    }

    update(timeInSeconds){
        switch (this._state) {
            case 0:
                if (this._target.position.y >= 58) {
                    this._state = 1;
                } else
                    this._target.position.y += 0.05;
                    this._body.position.y += 0.05;
                break;
            case 1:
                if (this._target.position.y <= 39) {
                    this._state = 0;
                } else
                    this._target.position.y -= 0.05;
                    this._body.position.y -= 0.05;
                break;
        }
    }
}
