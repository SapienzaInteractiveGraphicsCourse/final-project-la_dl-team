import * as THREE from 'https://cdn.skypack.dev/three@v0.129.0-oVPEZFilCYUpzWgJBZqM/build/three.module.js';

import { GLTFLoader } from 'https://cdn.skypack.dev/three@v0.129.0-oVPEZFilCYUpzWgJBZqM/examples/jsm/loaders/GLTFLoader.js';

import { RendererWebGLFactory } from './Factories/RendererWebGLFactory.js';
import { CameraFactory } from './Factories/CameraFactory.js';
import { WorldCannonFactory } from './Factories/WorldCannonFactory.js';
import { SceneFactory } from './Factories/SceneFactory.js';
import { LightFactory } from './Factories/LightFactory.js';

import { EntityManager } from './Managers/EntityManager.js';
import { ScoreManager } from './Managers/ScoreManager.js';
import { BasicCharacterController, BasicCharacterControllerFly } from './Controllers/BasicCharacterController.js'

const PI_2 = Math.PI / 2;
const PI_4 = Math.PI / 4;

class generalManager {
    constructor() {
        this._gameStarted = false;
        this._gameMode;

        this.selMode = null;
        this._curParamMode = {
            mode: "",
            lifes: 0, time: 0, stars: 0,
            score: 0,
        };

        this.selDayTime = null;
        this._curParamDayTime = {
            DayTime: "",
            lights: "",
            skybox: "",
        };

        this._curOtherSettings = {
            Fov: 60,
            Far: 1000,
            MouseVel: 1,
            MusicVolume: 0.1,
            MarioVolume: 0.2,
            EnviromentVolume: 0.2,
            Shadow: true,
            ReducedAnimation: false,
            UseNormalMap: true,
        };

        this._audioMenu = new Audio('./resources/sounds/05 Super Mario 64 Main Theme.mp3');
        this._audioMenu.loop = true;
        this._audioGame = new Audio('./resources/sounds/06 Slider.mp3');
        this._audioGame.loop = true;
        this._audioStart = new Audio('./resources/sounds/sm64_mario_here_we_go.wav');
        this._audioSettings = new Audio('./resources/sounds/sm64_mario_mamma-mia.wav');
        this._audioSettingsClose = new Audio('./resources/sounds/sm64_mario_okey-dokey.wav');

        this._audioGameoverWin = new Audio('./resources/sounds/super_mario_gameover_win.mp3');
        this._audioGameoverLose = new Audio('./resources/sounds/super_mario_gameover_lose.mp3');

        this._audioCoin = new Audio('./resources/sounds/mario-coin-sound-effect.mp3');
        this._audioStar = new Audio('./resources/sounds/mario-star-sound-effect.wav');
        this._marioJump = new Audio('./resources/sounds/maro-jump-sound-effect.mp3');
        this._audioDamage = new Audio('./resources/sounds/sm64_mario_damage.mp3');
    }

    _setAudioVolume(MusicVolume, MarioVolume, EnviromentVolume) {
        this._audioMenu.volume = MusicVolume;
        this._audioGame.volume = MusicVolume;
        this._audioStart.volume = MarioVolume;
        this._audioSettings.volume = MarioVolume;
        this._audioSettingsClose.volume = MarioVolume;

        this._audioGameoverWin.volume = MusicVolume;
        this._audioGameoverLose.volume = MusicVolume;

        this._audioCoin.volume = EnviromentVolume;
        this._audioStar.volume = EnviromentVolume;
        this._marioJump.volume = MarioVolume * 0.25;
        this._audioDamage.volume = MarioVolume;
    }
    updateAudio() {
        this._setAudioVolume(this._curOtherSettings.MusicVolume, this._curOtherSettings.MarioVolume, this._curOtherSettings.EnviromentVolume);
    }

    startGame(mode){
        _APP = new MapEnviroment();
    }
    terminateGame(params){
        _APP = new GameOverEnviroment(params);
    }

    getSelMode(){return this._selMode;}
    getModeParams(){return this._curParamMode;}
    getMode(){return this._curParamMode.mode;}
    getLifes(){return this._curParamMode.lifes;}
    getTime(){return this._curParamMode.time;}
    getStars(){return this._curParamMode.stars;}
    getScore(){return this._curParamMode.score;}

    getDayTime(){return this._curParamDayTime.DayTime;}
    getLightsType(){return this._curParamDayTime.lights;}
    getSkyBoxType(){return this._curParamDayTime.skybox;}

    getOtherSettings(){return this._curOtherSettings;}
    getFov(){return this._curOtherSettings.Fov;}
    getFar(){return this._curOtherSettings.Far;}
    gemMouseVel(){return this._curOtherSettings.MouseVel;}
    getShadow(){return this._curOtherSettings.Shadow;}
    getReducedAnimation(){return this._curOtherSettings.ReducedAnimation;}
    getUseNormalMap(){return this._curOtherSettings.UseNormalMap;}

    getGameMode(){return this._gameMode;}

    setModeAndParams(mode, params){
        this._selMode = mode;
        this._curParamMode = params;
    }

    setDayTimeAndParams(dayTime, params){
        this._selDayTime = dayTime;
        this._curParamDayTime = params;
    }

    setOtherSettings(params){
        this._curOtherSettings = params;
    }
    setOneOtherSetting(key, elem){
        if (key == "Shadow" || key == "ReducedAnimation" || key == "UseNormalMap")
            _MANAGER._curOtherSettings[key] = elem.checked;
        else
            _MANAGER._curOtherSettings[key] = parseFloat(elem.value);
    }

    isGameStarted(){return this._gameStarted;}
    gameIsStarted(mode){
        this._gameMode = mode;
        this._gameStarted = true;
        this._audioStart.play();
        this.startGame();
    }

    playAudioMenu(){
        this._audioMenu.play();
    }
    stopAudioMenu(){
        this._audioMenu.pause();
        this._audioMenu.currentTime = 0;
    }
    playAudioGame(){
        this._audioGame.play();
    }
    stopAudioGame(){
        this._audioGame.pause();
        this._audioGame.currentTime = 0;
    }

    playAudioGameoverWin(){
        this._audioGameoverWin.play();
    }
    playAudioGameoverLose(){
        this._audioGameoverLose.play();
    }

    audioSettingsOpen(){
        this._audioSettings.play();
    }
    audioSettingsClose(){
        this._audioSettingsClose.play();
    }
    audioCollectCoin(){
        var audio = document.createElement("audio");
        audio.src = this._audioCoin.src;
        audio.volume = this._curOtherSettings.EnviromentVolume;
        document.body.appendChild(audio);
        audio.addEventListener("ended", function () {
            this.parentNode.removeChild(this);
        }, false);
        audio.play();
    }
    audioCollectStar(){
        this._audioStar.play();
    }
    audioMarioJump(){
        var audio = document.createElement("audio");
        audio.src = this._marioJump.src;
        audio.volume = this._curOtherSettings.EnviromentVolume * 0.25;
        document.body.appendChild(audio);
        audio.addEventListener("ended", function () {
            this.parentNode.removeChild(this);
        }, false);
        audio.play();
    }
    audioMarioGetHit(){
        var hitTime = Date.now();
        if (this._lastHit == null || hitTime-this._lastHit > 500){
            this._lastHit = hitTime;
            var audio = document.createElement("audio");
            audio.src = this._audioDamage.src;
            audio.volume = this._curOtherSettings.EnviromentVolume;
            document.body.appendChild(audio);
            audio.addEventListener("ended", function () {
                this.parentNode.removeChild(this);
            }, false);
            audio.play();
        }
    }
}

class MenuEnviroment {
    constructor() {
        this._game = document.getElementById("game");
        this._settings = document.getElementById("settings");

        window.addEventListener('resize', () => { this._OnWindowResize(); }, false);
        this._OnWindowResize();

        this._commandsStart = document.getElementById("commandsStart");
        this._commandsFlyMode = document.getElementById("commandsFlyMode");

        this._imgSMF = document.getElementById("SMF");
        this._imgSMFF = document.getElementById("SMFF");
        this._imgSMMF = document.getElementById("SMMF");

        this._startBTN = document.getElementById("startBTN");
        this._flyBTN = document.getElementById("flyBTN");
        this._settingsBTN = document.getElementById("settingsBTN");
        this._exitSettings = document.getElementById("exitSettings");

        this._easyMode = document.getElementById("easyMode");
        this._easyModeParams = {
            mode: "easy",
            lifes: 5, time: 300, stars: 1,
            score: 0,
        };
        this._normalMode = document.getElementById("normalMode");
        this._normalModeParams = {
            mode: "normal",
            lifes: 3, time: 210, stars: 2,
            score: 0,
        };
        this._hardMode = document.getElementById("hardMode");
        this._hardModeParams = {
            mode: "hard",
            lifes: 1, time: 90, stars: 3,
            score: 0,
        };

        this._lifesSpan = document.getElementById("lifesSpan");
        this._timeSpan = document.getElementById("timeSpan");
        this._starsSpan = document.getElementById("starsSpan");

        this._dayDayTime = document.getElementById("dayDayTime");
        this._dayDayTimeParams = {
            DayTime: "day",
            lights: LightFactory.DAY_DAYTIME,
            skybox: SceneFactory.DAY_SKYBOX,
        };
        this._sunsetDayTime = document.getElementById("sunsetDayTime");
        this._sunsetDayTimeParams = {
            DayTime: "sunSet",
            lights: LightFactory.SUNSET_DAYTIME,
            skybox: SceneFactory.SUNSET_SKYBOX,
        };
        this._nightDayTime = document.getElementById("nightDayTime");
        this._nightDayTimeParams = {
            DayTime: "night",
            lights: LightFactory.NIGHT_DAYTIME,
            skybox: SceneFactory.NIGHT_SKYBOX,
        };

        this._sliderFov = document.getElementById("sliderFov");
        this._sliderFar = document.getElementById("sliderFar");
        this._sliderMouseVel = document.getElementById("sliderMouseVel");
        this._sliderMusicVolume = document.getElementById("sliderMusicVolume");
        this._sliderMarioVolume = document.getElementById("sliderMarioVolume");
        this._sliderEnviromentVolume = document.getElementById("sliderEnviromentVolume");

        this._shadowCkBox = document.getElementById("shadowCkBox");
        this._animationCkBox = document.getElementById("animationCkBox");
        this._useNormalMap = document.getElementById("useNormalMap");

        this._confirmSettings = document.getElementById("confirmSettings");
        this._resetSettings = document.getElementById("resetSettings");

        this._ButtonsMainMenu();
        this._ButtonsSettings();
    }

    _OnWindowResize() {
        if (_MANAGER.isGameStarted())
            return;
        this._gameH = window.innerHeight;
        this._game.style.bottom = -(this._gameH + 200) + "px";

        this._settingsH = window.innerHeight;
        this._settings.style.bottom = -(this._settingsH + 200) + "px";
    }

    _ButtonsMainMenu() {
        this._startBTN.addEventListener("mouseover", fIN.bind(null, this._imgSMF, this._commandsStart), false);
        this._startBTN.addEventListener("mouseout", fOUT.bind(null, this._imgSMF, this._commandsStart, 400), false);
        this._startBTN.addEventListener("click", () => {
            this._game.style.bottom = "0px";
            this._game.style.animation = "1s newPage normal";
            document.activeElement.blur();
            _MANAGER.gameIsStarted(0);
        }, false);

        this._flyBTN.addEventListener("mouseover", fIN.bind(null, this._imgSMFF, this._commandsFlyMode), false);
        this._flyBTN.addEventListener("mouseout", fOUT.bind(null, this._imgSMFF, this._commandsFlyMode, 400), false);
        this._flyBTN.addEventListener("click", () => {
            this._game.style.bottom = "0px";
            this._game.style.animation = "1s newPage normal";
            document.activeElement.blur();
            _MANAGER.gameIsStarted(1);
        }, false);

        this._settingsBTN.addEventListener("mouseover", fIN.bind(null, this._imgSMMF, null), false);
        this._settingsBTN.addEventListener("mouseout", fOUT.bind(null, this._imgSMMF, null, 350), false);
        this._settingsBTN.addEventListener("click", () => {
            this._settings.style.bottom = "0px";
            this._settings.style.animation = "1s newPage normal";
            document.activeElement.blur();
            _MANAGER.audioSettingsOpen();
        }, false);

        this._exitSettings.addEventListener("click", this._exitSettingsFun.bind(null, this), false);

        function fIN(img, comm) {
            img.style.marginBottom = "0px";
            if(comm != null)
                comm.style.marginTop = "0px";
        };
        function fOUT(img, comm, dim) {
            img.style.marginBottom = -dim + "px";
            if(comm != null)
                comm.style.marginTop = -dim + "px";
        };
    }
    _exitSettingsFun(parent) {
        parent._settings.style.bottom = -parent._settingsH + "px";
        parent._settings.style.animation = "1s oldPage normal";
        _MANAGER.audioSettingsClose();
    }

    _ButtonsSettings() {
        var cookieMode = this._getCookie("mode");
        switch(cookieMode){
            case "normal":
                this._easyMode.classList.add("deselectedMode");
                this._normalMode.classList.add("selectedMode");
                this._hardMode.classList.add("deselectedMode");
                _MANAGER.setModeAndParams(this._normalMode, this._normalModeParams);
                break;
            case "hard":
                this._easyMode.classList.add("deselectedMode");
                this._normalMode.classList.add("deselectedMode");
                this._hardMode.classList.add("selectedMode");
                _MANAGER.setModeAndParams(this._hardMode, this._hardModeParams);
                break;
            case "easy":
            default:
                this._easyMode.classList.add("selectedMode");
                this._normalMode.classList.add("deselectedMode");
                this._hardMode.classList.add("deselectedMode");
                _MANAGER.setModeAndParams(this._easyMode, this._easyModeParams);
                break;
        }

        this._easyMode.addEventListener("click", this._selectElementMode.bind(null, this, this._easyMode, this._easyModeParams), false);
        this._normalMode.addEventListener("click", this._selectElementMode.bind(null, this, this._normalMode, this._normalModeParams), false);
        this._hardMode.addEventListener("click", this._selectElementMode.bind(null, this, this._hardMode, this._hardModeParams), false);

        this._updateSpansMode(_MANAGER.getModeParams());

        var cookieDayTime = this._getCookie("dayTime");
        switch(cookieDayTime){
            case "sunSet":
                this._dayDayTime.classList.add("deselectedDayTime");
                this._sunsetDayTime.classList.add("selectedDayTime");
                this._nightDayTime.classList.add("deselectedDayTime");
                _MANAGER.setDayTimeAndParams(this._sunsetDayTime, this._sunsetDayTimeParams);
                break;
            case "night":
                this._dayDayTime.classList.add("deselectedDayTime");
                this._sunsetDayTime.classList.add("deselectedDayTime");
                this._nightDayTime.classList.add("selectedDayTime");
                _MANAGER.setDayTimeAndParams(this._nightDayTime, this._nightDayTimeParams);
                break;
            case "day":
            default:
                this._dayDayTime.classList.add("selectedDayTime");
                this._sunsetDayTime.classList.add("deselectedDayTime");
                this._nightDayTime.classList.add("deselectedDayTime");
                _MANAGER.setDayTimeAndParams(this._dayDayTime, this._dayDayTimeParams);
                break;
        }

        this._dayDayTime.addEventListener("click", this._selectElementDayTime.bind(null, this._dayDayTime, this._dayDayTimeParams), false);
        this._sunsetDayTime.addEventListener("click", this._selectElementDayTime.bind(null, this._sunsetDayTime, this._sunsetDayTimeParams), false);
        this._nightDayTime.addEventListener("click", this._selectElementDayTime.bind(null, this._nightDayTime, this._nightDayTimeParams), false);

        var cookieOS = this._getCookie("curOtherSettings");
        if(cookieOS != null){
            var data = cookieOS.slice(1, cookieOS.length-1).split(", ");

            _MANAGER.setOtherSettings({
                Fov: parseFloat(data[0].split(":")[1]),
                Far: parseFloat(data[1].split(":")[1]),
                MouseVel: parseFloat(data[2].split(":")[1]),
                MusicVolume: parseFloat(data[3].split(":")[1]),
                MarioVolume: parseFloat(data[4].split(":")[1]),
                EnviromentVolume: parseFloat(data[5].split(":")[1]),
                Shadow: (data[6].split(":")[1] === 'true'),
                ReducedAnimation: (data[7].split(":")[1] === 'true'),
                UseNormalMap: (data[8].split(":")[1] === 'true'),
            });

            var curOtherSettings = _MANAGER.getOtherSettings();
            this._sliderFov.value = curOtherSettings.Fov;
            this._sliderFar.value = curOtherSettings.Far;
            this._sliderMouseVel.value = curOtherSettings.MouseVel;
            this._sliderMusicVolume.value = curOtherSettings.MusicVolume;
            this._sliderMarioVolume.value = curOtherSettings.MarioVolume;
            this._sliderEnviromentVolume.value = curOtherSettings.EnviromentVolume;
            this._shadowCkBox.checked = curOtherSettings.Shadow;
            this._animationCkBox.checked = curOtherSettings.ReducedAnimation;
            this._useNormalMap.checked = curOtherSettings.UseNormalMap;
        } else {
            _MANAGER.getOtherSettings({
                Fov: parseFloat(this._sliderFov.value),
                Far: parseFloat(this._sliderFar.value),
                MouseVel: parseFloat(this._sliderMouseVel.value),
                MusicVolume: parseFloat(this._sliderMusicVolume.value),
                MarioVolume: parseFloat(this._sliderMarioVolume.value),
                EnviromentVolume: parseFloat(this._sliderEnviromentVolume.value),
                Shadow: this._shadowCkBox.checked,
                ReducedAnimation: this._animationCkBox.checked,
                UseNormalMap: this._useNormalMap.checked,
            });
        }

        _MANAGER.updateAudio();
        _MANAGER.playAudioMenu();

        this._sliderFov.addEventListener("change", this._changeOtherSettings.bind(null, "Fov", this._sliderFov), false);
        this._sliderFar.addEventListener("change", this._changeOtherSettings.bind(null, "Far", this._sliderFar), false);
        this._sliderMouseVel.addEventListener("change", this._changeOtherSettings.bind(null, "MouseVel", this._sliderMouseVel), false);
        this._sliderMusicVolume.addEventListener("change", this._changeOtherSettings.bind(null, "MusicVolume", this._sliderMusicVolume), false);
        this._sliderMarioVolume.addEventListener("change", this._changeOtherSettings.bind(null, "MarioVolume", this._sliderMarioVolume), false);
        this._sliderEnviromentVolume.addEventListener("change", this._changeOtherSettings.bind(null, "EnviromentVolume", this._sliderEnviromentVolume), false);
        this._shadowCkBox.addEventListener("change", this._changeOtherSettings.bind(null, "Shadow", this._shadowCkBox), false);
        this._animationCkBox.addEventListener("change", this._changeOtherSettings.bind(null, "ReducedAnimation", this._animationCkBox), false);
        this._useNormalMap.addEventListener("change", this._changeOtherSettings.bind(null, "UseNormalMap", this._useNormalMap), false);
        
        this._confirmSettings.addEventListener("click", () => {
            document.cookie = "mode="+_MANAGER.getMode()+";";
            document.cookie = "dayTime="+_MANAGER.getDayTime()+";";

            var curOtherSettings = _MANAGER.getOtherSettings();
            document.cookie = "curOtherSettings={Fov:"+curOtherSettings.Fov+", Far:"+curOtherSettings.Far+
                ", MouseVel:"+curOtherSettings.MouseVel+", MusicVolume:"+curOtherSettings.MusicVolume+
                ", MarioVolume:"+curOtherSettings.MarioVolume+
                ", EnviromentVolume:"+curOtherSettings.EnviromentVolume+", Shadow:"+curOtherSettings.Shadow+
                ", ReducedAnimation:"+curOtherSettings.ReducedAnimation+", UseNormalMap:"+curOtherSettings.UseNormalMap+"};";
            
            _MANAGER.updateAudio();
            this._exitSettingsFun(this);
        });

        this._resetSettings.addEventListener("click", this._resetOtherSettings.bind(null, this), false);
    }
    _getCookie(name){
        var elem = document.cookie.split("; ").find(row => row.startsWith(name))
        if(elem == null)
            return null;
        return elem.split('=')[1];
    }
    _selectElementMode(parent, elem, param) {
        if (_MANAGER.getSelMode() == elem)
            return;

        _MANAGER._selMode.classList.remove("selectedMode");
        elem.classList.remove("deselectedMode");
        _MANAGER._selMode.classList.add("deselectedMode");
        elem.classList.add("selectedMode");
        _MANAGER._selMode = elem;
        _MANAGER._curParamMode = param;
        parent._updateSpansMode(_MANAGER._curParamMode);
    }
    _selectElementDayTime(elem, param) {
        if (_MANAGER._selDayTime == elem)
            return;

        _MANAGER._selDayTime.classList.remove("selectedDayTime");
        elem.classList.remove("deselectedDayTime");
        _MANAGER._selDayTime.classList.add("deselectedDayTime");
        elem.classList.add("selectedDayTime");
        _MANAGER._selDayTime = elem;
        _MANAGER._curParamDayTime = param;
    }
    _updateSpansMode(param) {
        this._lifesSpan.innerHTML = "Lifes: " + param.lifes;
        this._timeSpan.innerHTML = "time: " + parseInt(param.time / 60) + ":" + (param.time % 60).toLocaleString('en-US',
            { minimumIntegerDigits: 2, useGrouping: false });
        this._starsSpan.innerHTML = "stars: " + param.stars;
    }
    _changeOtherSettings(key, elem) {
        _MANAGER.setOneOtherSetting(key, elem);
    }
    _resetOtherSettings(parent){
        _MANAGER.setOtherSettings({
            Fov: 60,
            Far: 1000,
            MouseVel: 1,
            MusicVolume: 0.1,
            MarioVolume: 0.2,
            EnviromentVolume: 0.2,
            Shadow: true,
            ReducedAnimation: false,
            UseNormalMap: true,
        });

        var curOtherSettings = _MANAGER.getOtherSettings();
        parent._sliderFov.value = curOtherSettings.Fov;
        parent._sliderFar.value = curOtherSettings.Far;
        parent._sliderMouseVel.value = curOtherSettings.MouseVel;
        parent._sliderMusicVolume.value = curOtherSettings.MusicVolume;
        parent._sliderMarioVolume.value = curOtherSettings.MarioVolume;
        parent._sliderEnviromentVolume.value = curOtherSettings.EnviromentVolume;
        parent._shadowCkBox.checked = curOtherSettings.Shadow;
        parent._animationCkBox.checked = curOtherSettings.ReducedAnimation;
        parent._useNormalMap.checked = curOtherSettings.UseNormalMap;
    }
}

class MapEnviroment {
    constructor() {
        this._scoreManager = new ScoreManager({
            lifesTarget: document.getElementById("lifesSpanGame"),
            timeTarget: document.getElementById("timeSpanGame"),
            starsTarget: document.getElementById("starsSpanGame"),
            scoreTarget: document.getElementById("scoreSpanGame"),
            init: {
                lifes: _MANAGER.getLifes(), time: _MANAGER.getTime(),
                stars: _MANAGER.getStars(), score: _MANAGER.getScore(),
            },
            curr: {lifes: _MANAGER.getLifes(),
                startTime:0, currTime:0, pauseTime:0, stars:0, score:0,},
        });
        this._gameMode = _MANAGER.getGameMode();

        this._models = {};
        this._textures = {};

        this._Loader();
    }

    _Loader(){
        var useNormalMap = _MANAGER.getUseNormalMap();

        var promise = [
            this._getModel('block/scene.gltf', "", 0.004),
            this._getModel('coin_hd/scene.gltf', "", 0.007),
            this._getModel('goomba_hd/scene.gltf', "", 0.05),
            this._getModel('mario_64/scene.gltf', "", 0.04),
            this._getModel('star/scene.gltf', "", 3.8),
            this._getModel('whomp/scene.gltf', "", 0.1),
            this._getModel('flow_tree/scene.gltf', "", 4),
            this._getModel('flower/scene.gltf', "", 3),
            this._getModel('piranha/scene.gltf', "", 2),
            this._getModel('cannone/scene.gltf', "", 0.004),

            this._getTexture("fantasy_bricks.png", useNormalMap),
            this._getTexture("grey_bricks.png", useNormalMap),
            this._getTexture("flowers.png", false),
            this._getTexture("wood_bridge.png", useNormalMap),
            this._getTexture("brown_bricks.png", useNormalMap),

            this._getTexture("transporter1.png", useNormalMap, {wrapS: 1, wrapT: 1, repeat: [2, 1]}),
            this._getTexture("transporter1.png", useNormalMap, {wrapS: 2, wrapT: 2, repeat: [3, 3]}),
            
            this._getTexture("brown_bricks.png", useNormalMap, {wrapS: 2, wrapT: 2, repeat: [1, 16]}),
            this._getTexture("grey_bricks.png", useNormalMap, {wrapS: 2, wrapT: 2, repeat: [1, 2]}),
            this._getTexture("flowers.png", false, {wrapS: 2, wrapT: 2, repeat: [1, 2]}),
            this._getTexture("white_bricks.png", useNormalMap, {wrapS: 2, wrapT: 2, repeat: [1, 2]}),
            this._getTexture("grey_bricks.png", useNormalMap, {wrapS: 2, wrapT: 2, repeat: [1, 4]}),
            this._getTexture("white_bricks.png", useNormalMap, {wrapS: 2, wrapT: 2, repeat: [1, 4]}),
            this._getTexture("white_bricks.png", useNormalMap, {wrapS: 2, wrapT: 2, repeat: [1, 16]}),
            this._getTexture("flowers.png", false, {wrapS: 2, wrapT: 2, repeat: [3, 3]}),
            this._getTexture("tower_bricks.png", useNormalMap, {wrapS: 1, wrapT: 1, repeat: [10, 1]}),
            this._getTexture("yellow_bricks.png", useNormalMap, {wrapS: 1, wrapT: 1, repeat: [12, 6]}),
            this._getTexture("window.png", false),
            this._getTexture("tower_floor.png", useNormalMap, {wrapS: 2, wrapT: 2, repeat: [6, 6]}),
            this._getTexture("tower_floor.png", useNormalMap, {wrapS: 0, wrapT: 6, repeat: [6, 1]}),
            this._getTexture("brown_bricks.png", useNormalMap, {wrapS: 2, wrapT: 2, repeat: [1, 16]}),
            this._getTexturePlane("fence.png", useNormalMap, {wrapS: 1, wrapT: 1, repeat: [30, 1]}),
            this._getTexturePlane("fence.png", useNormalMap, {wrapS: 1, wrapT: 1, repeat: [28, 1]}),
            this._getTexturePlane("fence.png", useNormalMap, {wrapS: 1, wrapT: 1, repeat: [7, 1]}),
            this._getTexturePlane("fence.png", useNormalMap, {wrapS: 1, wrapT: 1, repeat: [16.33, 1]}),
            this._getTexturePlane("fence.png", useNormalMap, {wrapS: 1, wrapT: 1, repeat: [20, 1]}),
            this._getTexture("brown_bricks.png", useNormalMap, {wrapS: 1, wrapT: 1, repeat: [3, 3]}),
            this._getTexture("bad_face_cube.png", useNormalMap),
            this._getTexture("enemy.png", useNormalMap),

            this._getTexturePlane("border.png", useNormalMap, {wrapS: 1, wrapT: 1, repeat: [6.8, 1]}),
            this._getTexturePlane("border.png", useNormalMap, {wrapS: 1, wrapT: 1, repeat: [2.3, 1]}),
            this._getTexturePlane("border.png", useNormalMap, {wrapS: 1, wrapT: 1, repeat: [10, 1]}),
            this._getTexturePlane("border.png", useNormalMap, {wrapS: 1, wrapT: 1, repeat: [2, 1]}),
            this._getTexturePlane("border.png", useNormalMap),

            this._getTexture("land.png", false,{wrapS: 1, wrapT: 1, repeat: [10, 1]}),
            this._getTexture("grass.png", false,{wrapS: 1, wrapT: 1, repeat: [6, 6]}),
            this._getTexture("only_land.png", false,{wrapS: 1, wrapT: 1, repeat: [4, 4]}),
            this._getTexture("land.png", false,{wrapS: 1, wrapT: 1, repeat: [4, 1]}),
            this._getTexture("grass.png", false,{wrapS: 1, wrapT: 1, repeat: [2.7, 2.7]}),
            this._getTexture("only_land.png", false),
        ];
        Promise.all(promise).then(data => {
            var nameModels = [
                "Block", "Coin", "Goomba",
                "Mario", "Star", "Whomp",
                "Tree", "Flower", "Piranha", "Bullet",
            ];
            var nameTestures = [
                "brick",
                "grey_bricks",
                "flowers",
                "wood_bridge",
                "brown_bricks",

                "transporter1_small",
                "transporter1_medium",

                "brick_medium",
                "grey_bricks_medium",
                "flowers_medium",
                "white_bricks_medium",

                "grey_bricks_tall",
                "white_bricks_tall",

                "white_bricks_verytall",
                "flowers_manyflowers",
                "tower_bricks_medium",
                "yellow_bricks_medium",
                "window",
                "tower_floor",
                "tower_floor_border",
                "brown_bricks",
                "fence1",
                "fence2",
                "fence3",
                "fence4",
                "fence5",
                "brown_bricks_small",
                "bad_face_cube",
                "enemy",
                "border1",
                "border2",
                "border3",
                "border4",
                "border5",

                "latral_grass_big",
                "grass_big",
                "land_garden",
                "latral_grass_small",
                "grass_small",
                "small_land_garden",
            ];

            for(var i in nameModels){
                this._models[nameModels[i]] = {};
                this._models[nameModels[i]].model = data[i];
                this._models[nameModels[i]].name = nameModels[i];
            }
            var displace = nameModels.length;
            for(var i in nameTestures){
                this._textures[nameTestures[i]] = data[(parseInt(i) + displace)];
            }

            this._textures["materials_big_grass"] = [
                this._textures["latral_grass_big"],
                this._textures["latral_grass_big"],
                this._textures["grass_big"],
                this._textures["land_garden"],
                this._textures["latral_grass_big"],
                this._textures["latral_grass_big"],
            ];
            this._textures["materials_small_grass"] = [
                this._textures["latral_grass_small"],
                this._textures["latral_grass_small"],
                this._textures["grass_small"],
                this._textures["small_land_garden"],
                this._textures["latral_grass_small"],
                this._textures["latral_grass_small"],
            ];
            this._textures["materials_grey_bricks"] = [
                this._textures["grey_bricks_medium"],
                this._textures["grey_bricks_medium"],
                this._textures["grey_bricks"],
                this._textures["grey_bricks"],
                this._textures["grey_bricks_medium"],
                this._textures["grey_bricks_medium"],
            ];
            this._textures["materials_grey_bricks_tall"] = [
                this._textures["grey_bricks_tall"],
                this._textures["grey_bricks_tall"],
                this._textures["grey_bricks"],
                this._textures["grey_bricks"],
                this._textures["grey_bricks_tall"],
                this._textures["grey_bricks_tall"],
            ];
            this._textures["materials_white_bricks_verytall"] = [
                this._textures["white_bricks_verytall"],
                this._textures["white_bricks_verytall"],
                this._textures["white_bricks_tall"],
                this._textures["white_bricks_tall"],
                this._textures["white_bricks_verytall"],
                this._textures["white_bricks_verytall"],
            ];
            this._textures["materials_brown_bricks_tall"] = [
                this._textures["brown_bricks"],
                this._textures["brown_bricks"],
                this._textures["brown_bricks_small"],
                this._textures["brown_bricks_small"],
                this._textures["brown_bricks"],
                this._textures["brown_bricks"],
            ];
            this._textures["materials_brown_bricks_verytall"] = [
                this._textures["brick_medium"],
                this._textures["brick_medium"],
                this._textures["brown_bricks_small"],
                this._textures["brown_bricks_small"],
                this._textures["brick_medium"],
                this._textures["brick_medium"],
            ];
            this._textures["materials_flowers"] = [
                this._textures["wood_bridge"],
                this._textures["flowers_manyflowers"],
                this._textures["wood_bridge"],
                this._textures["flowers_manyflowers"],
                this._textures["flowers_manyflowers"],
                this._textures["flowers_manyflowers"],
            ];
            this._textures["materials_tower_floor"] = [
                this._textures["tower_floor_border"],
                this._textures["tower_floor_border"],
                this._textures["tower_floor"],
                this._textures["tower_floor"],
                this._textures["tower_floor_border"],
                this._textures["tower_floor_border"],
            ];
            this._textures["materials_blu_whomp"] = [
                this._textures["bad_face_cube"],
                this._textures["bad_face_cube"],
                this._textures["enemy"],
                this._textures["enemy"],
                this._textures["bad_face_cube"],
                this._textures["bad_face_cube"],
            ];
            this._textures["materials_transporter1"] = [
                this._textures["transporter1_small"],
                this._textures["transporter1_small"],
                this._textures["transporter1_medium"],
                this._textures["transporter1_medium"],
                this._textures["transporter1_small"],
                this._textures["transporter1_small"],
            ];

            setTimeout(this._init(), 3000);
        }, error => {
            console.log('An error happened:', error);
        });
    }

    _getModel(path, child_name, scale=1.0) {
        const myPromise = new Promise((resolve, reject) => {
            const gltfLoader = new GLTFLoader();
            gltfLoader.load("./resources/models/" + path, (gltf) => {
                var mesh = gltf.scene.children.find((child) => child.name === child_name);
                if (mesh == null)
                    mesh = gltf.scene;

                mesh.traverse(c => {
                    c.castShadow = true;
                });

                mesh.scale.setScalar(scale);

                resolve(mesh);
            },
                function (xhr) {
                },
                function (error) {
                    console.log('An error happened');
                    reject(error);
                });
        });
        return myPromise;
    }
    _getTexture(path, useNormalMap=false, mode={wrapS: 1, wrapT: 1, repeat: [1, 1]}) {
        const myPromise = new Promise((resolve, reject) => {
            var textureLoader = new THREE.TextureLoader();
            textureLoader.load("./resources/textures/" + path, (img) => {
                img.wrapS = mode.wrapS;
                img.wrapT = mode.wrapT;
                img.repeat.set(...mode.repeat);

                if(useNormalMap){
                    var normalMap = new THREE.TextureLoader().load("./resources/normalMap/"+ path);
                    normalMap.wrapS = mode.wrapS;
                    normalMap.wrapT = mode.wrapT;
                    normalMap.repeat.set(...mode.repeat);
                } else {
                    var normalMap = null;
                }

                var material = new THREE.MeshStandardMaterial({
                    map: img,
                    normalMap: normalMap,
                    emissive: 'white',
                    emissiveIntensity: -0.6,
                 });
                resolve(material);
            },
                function (xhr) {
                },
                function (error) {
                    console.log('An error happened');
                    reject(error);
                });
        });
        return myPromise;
    }
    _getTexturePlane(path, useNormalMap=false, mode={wrapS: 1, wrapT: 1, repeat: [1, 1]}) {
        const myPromise = new Promise((resolve, reject) => {
            var textureLoader = new THREE.TextureLoader();
            textureLoader.load("./resources/textures/" + path, (img) => {
                img.wrapS = mode.wrapS;
                img.wrapT = mode.wrapT;
                img.repeat.set(...mode.repeat);

                if(useNormalMap){
                    var normalMap = new THREE.TextureLoader().load("./resources/normalMap/"+ path);
                    normalMap.wrapS = mode.wrapS;
                    normalMap.wrapT = mode.wrapT;
                    normalMap.repeat.set(...mode.repeat);
                } else {
                    var normalMap = null;
                }

                var material = new THREE.MeshStandardMaterial({
                    map: img,
                    transparent: true,
                    side: THREE.DoubleSide,
                    normalMap: normalMap,
                    emissive: 'white',
                    emissiveIntensity: -0.4,
                });
                resolve(material);
            },
                function (xhr) {
                },
                function (error) {
                    console.log('An error happened');
                    reject(error);
                });
        });
        return myPromise;
    }
    
    _init() {
        this._MyCanvas = document.getElementById("canvas");
        this._renderer = new RendererWebGLFactory(_MANAGER.getShadow(), { canvas: this._MyCanvas, antialias: true, });
        window.addEventListener('resize', () => { this._OnWindowResize(); }, false);

        this._camera = new CameraFactory({
            fov: _MANAGER.getFov(), aspect: window.innerWidth / window.innerHeight,
            near: 1.0, far: _MANAGER.getFar(),
        });
        this._scene = new SceneFactory(_MANAGER.getSkyBoxType());
        this._world = new WorldCannonFactory(true, WorldCannonFactory.TYPE_GROUND);

        this._entityManager = new EntityManager({
            scene: this._scene, world: this._world, manager: _MANAGER,
            scoreManager: this._scoreManager, models: this._models
        });

        // ######### LIGHTS #########
        this._lights = new LightFactory(_MANAGER.getShadow(), _MANAGER.getLightsType());
        for (var i in this._lights) {
            this._scene.add(this._lights[i]);
        }

        // ######### MAP #########
        this._map(3)

        // ######### CHARACTER #########
        this._buildCharachter();

        // ######### ENTITY #########
        this._decorations()
        this._collectables();
        this._enemies();


        this._LockScreen();

        var time = Date.now()
        this._scoreManager.setStartTime(time);
        this._scoreManager.updateCurrTime(time);

        this._previousRAF = null;
        this._currTime = Date.now();

        this._RAF();
    }

    _addBox(dimVec, posVec, material) {
        var boxShape = new CANNON.Box(dimVec);
        var boxBody = new CANNON.Body({ mass: 0, shape: boxShape });

        var boxGeometry = new THREE.BoxGeometry(dimVec.x * 2, dimVec.y * 2, dimVec.z * 2);
        var boxMesh = new THREE.Mesh(boxGeometry, material);

        boxBody.position.set(...posVec);
        boxMesh.position.set(...posVec);

        boxMesh.castShadow = true;
        boxMesh.receiveShadow = true;
        this._world.add(boxBody);
        this._scene.add(boxMesh);

        return { body: boxBody, mesh: boxMesh };
    }
    _addCylinder(dimVec, posVec, material) {
        var cylinderShape = new CANNON.Cylinder(...dimVec);
        var cylinderBody = new CANNON.Body({ mass: 0, shape: cylinderShape });
        cylinderBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);

        var cylinderGeometry = new THREE.CylinderGeometry(...dimVec);
        var cylinderMesh = new THREE.Mesh(cylinderGeometry, material);

        cylinderBody.position.set(...posVec);
        cylinderMesh.position.set(...posVec);

        cylinderMesh.castShadow = true;
        cylinderMesh.receiveShadow = true;

        this._world.add(cylinderBody);
        this._scene.add(cylinderMesh);

        return { body: cylinderBody, mesh: cylinderMesh };
    }
    _addCylinderTraversable(dimVec, posVec, material) {
        var cylinderGeometry = new THREE.CylinderGeometry(...dimVec);
        var cylinderMesh = new THREE.Mesh(cylinderGeometry, material);

        cylinderMesh.position.set(...posVec);

        cylinderMesh.castShadow = true;
        cylinderMesh.receiveShadow = true;

        this._scene.add(cylinderMesh);
    }
    _addPlane(dimVec, posVec, rotVec, material){
        var boxShape = new CANNON.Box(new CANNON.Vec3(...dimVec, 2));
        var planeBody = new CANNON.Body({ mass: 0, shape: boxShape });

        var planeMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(dimVec[0]* 2, dimVec[1]* 2, 1, 1),
            material,
        );

        planeBody.position.set(...posVec);
        planeMesh.position.set(...posVec);

        planeMesh.castShadow = true;
        planeMesh.receiveShadow = true;

        if(rotVec.x != 0)
            planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), rotVec.x);
        if(rotVec.y != 0)
            planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), rotVec.y);
        if(rotVec.z != 0)
            planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), rotVec.z);

        planeMesh.rotation.x = rotVec.x;
        planeMesh.rotation.y = rotVec.y;
        planeMesh.rotation.z = rotVec.z;

        this._world.add(planeBody);
        this._scene.add(planeMesh);
    }
    _map(scale) {
        // ############## GARDEN ##############
        var dimVec = new CANNON.Vec3(11, 0.5, 15).scale(scale);
        var posVec = [-6 * scale, -0.5 * scale, -7 * scale];
        this._addBox(dimVec, posVec, this._textures["materials_big_grass"]);

        var dimVec = new CANNON.Vec3(3, 0.5, 3.5).scale(scale);
        var posVec = [8 * scale, -0.5 * scale, 4.5 * scale];
        this._addBox(dimVec, posVec, this._textures["materials_small_grass"]);

        // ############## FLOWERS IN THE GARDEN ##############
        var dimVec = [2 * scale, 2 * scale, 0.1 * scale, 20];
        var posVec = [-13 * scale, 0.1 * scale, 5 * scale];
        this._addCylinderTraversable(dimVec, posVec, this._textures["materials_flowers"]);

        var dimVec = [2 * scale, 2 * scale, 0.1 * scale, 20];
        var posVec = [-13 * scale, 0.1 * scale, -3 * scale];
        this._addCylinderTraversable(dimVec, posVec, this._textures["materials_flowers"]);

        var dimVec = [2 * scale, 2 * scale, 0.1 * scale, 20];
        var posVec = [-13 * scale, 0.1 * scale, -11 * scale];
        this._addCylinderTraversable(dimVec, posVec, this._textures["materials_flowers"]);

        var dimVec = [2 * scale, 2 * scale, 0.1 * scale, 20];
        var posVec = [-13 * scale, 0.1 * scale, -19 * scale];
        this._addCylinderTraversable(dimVec, posVec, this._textures["materials_flowers"]);

        var dimVec = [2*scale, 2*scale, 0.1*scale, 20];
        var posVec = [7*scale, 0.1*scale, 5*scale];
        this._addCylinderTraversable(dimVec, posVec, this._textures["materials_flowers"]);

        // ############## GARDEN FENCE ##############
        var dimVec = [15 * scale, 0.5 * scale];
        var posVec = [-17 * scale, 0.5*scale, -7 * scale];
        var rotVec = new THREE.Vector3(0, -PI_2, 0);
        this._addPlane(dimVec, posVec, rotVec, this._textures["fence1"]);

        var dimVec = [14 * scale, 0.5 * scale];
        var posVec = [-3 * scale, 0.5*scale, 8 * scale];
        var rotVec = new THREE.Vector3(0, 0, 0);
        this._addPlane(dimVec, posVec, rotVec, this._textures["fence2"]);

        var dimVec = [3.5 * scale, 0.5 * scale];
        var posVec = [11 * scale, 0.5*scale, 4.5 * scale];
        var rotVec = new THREE.Vector3(0, -PI_2, 0);
        this._addPlane(dimVec, posVec, rotVec, this._textures["fence3"]);

        var dimVec = [8.165*scale, 0.5*scale];
        var posVec = [-8.8*scale, 0.5*scale, -22*scale];
        var rotVec = new THREE.Vector3(0, 0, 0);
        this._addPlane(dimVec, posVec, rotVec, this._textures["fence4"]);

        var dimVec = [10*scale, 0.5*scale];
        var posVec = [5*scale, 0.5*scale, -10*scale];
        var rotVec = new THREE.Vector3(0, -PI_2, 0);
        this._addPlane(dimVec, posVec, rotVec, this._textures["fence5"]);

        // ############## FIRST LAYER ##############

        // ############## 2 steps with white bricks ##############
        var dimVec = new CANNON.Vec3(0.5, 0.75, 1).scale(scale);
        var posVec = [2.5 * scale, 0.5 * scale, 0 * scale];
        this._addBox(dimVec, posVec, this._textures["white_bricks_medium"]);

        var dimVec = new CANNON.Vec3(0.5, 0.5, 1).scale(scale);
        var posVec = [1.5 * scale, 0 * scale, 0 * scale];
        this._addBox(dimVec, posVec, this._textures["white_bricks_medium"]);

        // ############## white bricks ##############
        var dimVec = new CANNON.Vec3(1, 1, 1).scale(scale);
        var posVec = [4 * scale, 1 * scale, 0 * scale];
        this._addBox(dimVec, posVec, this._textures["white_bricks_tall"]);

        var dimVec = new CANNON.Vec3(1, 1, 1).scale(scale);
        var posVec = [6 * scale, 1 * scale, 0 * scale];
        this._addBox(dimVec, posVec, this._textures["white_bricks_tall"]);

        var dimVec = new CANNON.Vec3(1, 1, 1).scale(scale);
        var posVec = [8 * scale, 1 * scale, 0 * scale];
        this._addBox(dimVec, posVec, this._textures["white_bricks_tall"]);

        var dimVec = new CANNON.Vec3(1, 1, 1).scale(scale);
        var posVec = [10 * scale, 1 * scale, 0 * scale];
        this._addBox(dimVec, posVec, this._textures["white_bricks_tall"]);

        var dimVec = new CANNON.Vec3(1, 1, 1).scale(scale);
        var posVec = [15 * scale, 1 * scale, 0 * scale];
        this._addBox(dimVec, posVec, this._textures["white_bricks_tall"]);

        var dimVec = new CANNON.Vec3(1, 1, 1).scale(scale);
        var posVec = [20 * scale, 1 * scale, 0 * scale];
        this._addBox(dimVec, posVec, this._textures["white_bricks_tall"]);

        // ############## brown bricks ##############
        var dimVec = new CANNON.Vec3(1.15, 1.15, 1.15).scale(scale);
        var posVec = [25 * scale, 1 * scale, 0 * scale];
        this._addBox(dimVec, posVec, this._textures["brown_bricks_small"]);

        var dimVec = new CANNON.Vec3(1.15, 1.15, 1.15).scale(scale);
        var posVec = [25 * scale, 1 * scale, -2.25 * scale];
        this._addBox(dimVec, posVec, this._textures["brown_bricks_small"]);

        var dimVec = new CANNON.Vec3(1.15, 1.15, 1.15).scale(scale);
        var posVec = [25 * scale, 1 * scale, -4.5 * scale];
        this._addBox(dimVec, posVec, this._textures["brown_bricks_small"]);

        // ############## brown bricks fence ##############
        var dimVec = [3.4 * scale, 0.5 * scale, 1, 1];
        var posVec = [26.15 * scale, 2.64 * scale, -2.25 * scale];
        var rotVec = new THREE.Vector3(0, -PI_2, 0);
        this._addPlane(dimVec, posVec, rotVec, this._textures["border1"]);

        var dimVec = [1.15 * scale, 0.5 * scale, 1, 1];
        var posVec = [25 * scale, 2.64 * scale, 1.1 * scale];
        var rotVec = new THREE.Vector3(0, 0, 0);
        this._addPlane(dimVec, posVec, rotVec, this._textures["border2"]);

        var dimVec = [1.15 * scale, 0.5 * scale, 1, 1];
        var posVec = [25 * scale, 2.64 * scale, -5.65 * scale];
        var rotVec = new THREE.Vector3(0, 0, 0);
        this._addPlane(dimVec, posVec, rotVec, this._textures["border2"]);

        // ############## SECOND LAYER ##############

        // ############## stairs with grey bricks ##############
        var dimVec = new CANNON.Vec3(1, 1, 1).scale(scale);
        var posVec = [20 * scale, 1 * scale, -4.5 * scale];
        this._addBox(dimVec, posVec, this._textures["grey_bricks"]);

        var dimVec = new CANNON.Vec3(1, 2, 1).scale(scale);
        var posVec = [18 * scale, 2 * scale, -4.5 * scale];
        this._addBox(dimVec, posVec, this._textures["materials_grey_bricks"]);

        var dimVec = new CANNON.Vec3(1, 3, 1).scale(scale);
        var posVec = [16 * scale, 3 * scale, -4.5 * scale];
        this._addBox(dimVec, posVec, this._textures["materials_grey_bricks"]);

        var dimVec = new CANNON.Vec3(1, 4, 1).scale(scale);
        var posVec = [14 * scale, 4 * scale, -4.5 * scale];
        this._addBox(dimVec, posVec, this._textures["materials_grey_bricks_tall"]);

        var dimVec = new CANNON.Vec3(1, 5, 1).scale(scale);
        var posVec = [12 * scale, 5 * scale, -4.5 * scale];
        this._addBox(dimVec, posVec, this._textures["materials_grey_bricks_tall"]);

        var dimVec = new CANNON.Vec3(1, 6, 1).scale(scale)
        var posVec = [10 * scale, 6 * scale, -4.5 * scale];
        this._addBox(dimVec, posVec, this._textures["materials_grey_bricks_tall"]);

        // ############## THIRD LAYER ##############

        // ############## white bricks with Goomba ##############
        var dimVec = new CANNON.Vec3(1, 6.0, 1).scale(scale);
        var posVec = [10 * scale, 6 * scale, -6.5 * scale];
        this._addBox(dimVec, posVec, this._textures["materials_white_bricks_verytall"]);

        var dimVec = new CANNON.Vec3(1, 6.0, 1).scale(scale);
        var posVec = [8 * scale, 6 * scale, -6.5 * scale];
        this._addBox(dimVec, posVec, this._textures["materials_white_bricks_verytall"]);

        var dimVec = new CANNON.Vec3(1, 6.0, 1).scale(scale);
        var posVec = [8 * scale, 6 * scale, -8.5 * scale];
        this._addBox(dimVec, posVec, this._textures["materials_white_bricks_verytall"]);

        var dimVec = new CANNON.Vec3(1, 6.0, 1).scale(scale);
        var posVec = [10*scale, 6*scale, -8.5*scale];
        this._addBox(dimVec, posVec, this._textures["materials_white_bricks_verytall"]);

        // ############## first bridge ##############
        var dimVec = new CANNON.Vec3(2, 0.2, 0.75).scale(scale);
        var posVec = [5 * scale, 11.8 * scale, -8.5 * scale];
        this._addBox(dimVec, posVec, this._textures["wood_bridge"]);

        // ############## lay-by between the bridges ##############
        var dimVec = new CANNON.Vec3(1.5, 0.2, 1.5).scale(scale);
        var posVec = [1.5 * scale, 11.8 * scale, -8.5 * scale];
        this._addBox(dimVec, posVec, this._textures["grey_bricks_medium"]);

        // ############## second bridge ##############
        var dimVec = new CANNON.Vec3(0.8, 0.2, 1.5).scale(scale);
        var posVec = [1.5 * scale, 11.8 * scale, -11.5 * scale];
        this._addBox(dimVec, posVec, this._textures["wood_bridge"]);

        // ############## lay-by to wait the non-static bridge ##############
        var dimVec = new CANNON.Vec3(1, 6.0, 1).scale(scale);
        var posVec = [1.5 * scale, 6 * scale, -14 * scale];
        this._addBox(dimVec, posVec, this._textures["materials_white_bricks_verytall"]);

        var dimVec = new CANNON.Vec3(1, 6.0, 1).scale(scale);
        var posVec = [3.5 * scale, 6 * scale, -14 * scale];
        this._addBox(dimVec, posVec, this._textures["materials_white_bricks_verytall"]);

        // ############## brown bricks with Goomba  ##############
        var dimVec = new CANNON.Vec3(1, 6.0, 1).scale(scale);
        var posVec = [2.5 * scale, 6 * scale, -23 * scale];
        this._addBox(dimVec, posVec, this._textures["materials_brown_bricks_tall"]);

        var dimVec = new CANNON.Vec3(1, 6.0, 1).scale(scale);
        var posVec = [0.5 * scale, 6 * scale, -23 * scale];
        this._addBox(dimVec, posVec, this._textures["materials_brown_bricks_tall"]);

        var dimVec = new CANNON.Vec3(1, 6.0, 1).scale(scale);
        var posVec = [4.5 * scale, 6 * scale, -23 * scale];
        this._addBox(dimVec, posVec, this._textures["materials_brown_bricks_tall"]);

        var dimVec = new CANNON.Vec3(1, 6.0, 1).scale(scale);
        var posVec = [6.5 * scale, 6 * scale, -23 * scale];
        this._addBox(dimVec, posVec, this._textures["materials_brown_bricks_tall"]);

        var dimVec = new CANNON.Vec3(1, 6.0, 1).scale(scale);
        var posVec = [8.5 * scale, 6 * scale, -23 * scale];
        this._addBox(dimVec, posVec, this._textures["materials_brown_bricks_tall"]);

        var dimVec = new CANNON.Vec3(1, 6.0, 1).scale(scale);
        var posVec = [4.5 * scale, 6 * scale, -21 * scale];
        this._addBox(dimVec, posVec, this._textures["materials_brown_bricks_tall"]);

        var dimVec = new CANNON.Vec3(1, 6.0, 1).scale(scale);
        var posVec = [6.5 * scale, 6 * scale, -21 * scale];
        this._addBox(dimVec, posVec, this._textures["materials_brown_bricks_tall"]);

        var dimVec = new CANNON.Vec3(1, 6.0, 1).scale(scale);
        var posVec = [8.5 * scale, 6 * scale, -21 * scale];
        this._addBox(dimVec, posVec, this._textures["materials_brown_bricks_tall"]);

        var dimVec = new CANNON.Vec3(1, 6.0, 1).scale(scale);
        var posVec = [7.5 * scale, 6 * scale, -19 * scale];
        this._addBox(dimVec, posVec, this._textures["materials_brown_bricks_tall"]);

        var dimVec = new CANNON.Vec3(1, 6.0, 1).scale(scale);
        var posVec = [9.5 * scale, 6 * scale, -19 * scale];
        this._addBox(dimVec, posVec, this._textures["materials_brown_bricks_tall"]);

        var dimVec = new CANNON.Vec3(1, 6.0, 1).scale(scale);
        var posVec = [10.5 * scale, 6 * scale, -21 * scale];
        this._addBox(dimVec, posVec, this._textures["materials_brown_bricks_tall"]);

        var dimVec = new CANNON.Vec3(1, 6.0, 1).scale(scale);
        var posVec = [11.5 * scale, 6 * scale, -19 * scale];
        this._addBox(dimVec, posVec, this._textures["materials_brown_bricks_tall"]);

        //  ############## fence ##############
        var dimVec = [5 * scale, 0.5 * scale, 1, 1];
        var posVec = [4.5 * scale, 12.5 * scale, -24 * scale];
        var rotVec = new THREE.Vector3(0, 0, 0);
        this._addPlane(dimVec, posVec, rotVec, this._textures["border3"]);

        var dimVec = [1 * scale, 0.5 * scale, 1, 1];
        var posVec = [9.5 * scale, 12.5 * scale, -23 * scale];
        var rotVec = new THREE.Vector3(0, -PI_2, 0);
        this._addPlane(dimVec, posVec, rotVec, this._textures["border4"]);

        var dimVec = [1 * scale, 0.5 * scale, 1, 1];
        var posVec = [11.5 * scale, 12.5 * scale, -21 * scale];
        var rotVec = new THREE.Vector3(0, -PI_2, 0);
        this._addPlane(dimVec, posVec, rotVec, this._textures["border4"]);

        var dimVec = [1 * scale, 0.5 * scale, 1, 1];
        var posVec = [12.5 * scale, 12.5 * scale, -19 * scale];
        var rotVec = new THREE.Vector3(0, -PI_2, 0);
        this._addPlane(dimVec, posVec, rotVec, this._textures["border4"]);

        var dimVec = [1 * scale, 0.5 * scale, 1, 1];
        var posVec = [10.5 * scale, 12.5 * scale, -22 * scale];
        var rotVec = new THREE.Vector3(0, 0, 0);
        this._addPlane(dimVec, posVec, rotVec, this._textures["border4"]);

        var dimVec = [0.5 * scale, 0.5 * scale, 1, 1];
        var posVec = [12 * scale, 12.5 * scale, -20 * scale];
        var rotVec = new THREE.Vector3(0, 0, 0);
        this._addPlane(dimVec, posVec, rotVec, this._textures["border5"]);

        //  ############## FOURTH LAYER ##############

        //  ############## brown bricks ##############
        var dimVec = new CANNON.Vec3(1, 9.6, 1).scale(scale);
        var posVec = [11.5 * scale, 10 * scale, -17 * scale];
        this._addBox(dimVec, posVec, this._textures["materials_brown_bricks_verytall"]);

        var dimVec = new CANNON.Vec3(1, 9.6, 1).scale(scale);
        var posVec = [13.5 * scale, 10 * scale, -17 * scale];
        this._addBox(dimVec, posVec, this._textures["materials_brown_bricks_verytall"]);

        var dimVec = new CANNON.Vec3(1, 9.6, 1).scale(scale);
        var posVec = [15.5 * scale, 10 * scale, -17 * scale];
        this._addBox(dimVec, posVec, this._textures["materials_brown_bricks_verytall"]);

        // ############## towers platform ##############
        var dimVec = new CANNON.Vec3(10, 0.5, 10).scale(scale);
        var posVec = [22.5 * scale, 19.5 * scale, -17 * scale];
        this._addBox(dimVec, posVec, this._textures["materials_tower_floor"]);

        // ############## first castle ##############
        var dimVec = [2* scale, 2* scale, 4 * scale, 20];
        var posVec = [27.5 * scale, 21.7 * scale, -10 * scale];
        this._addCylinder(dimVec, posVec, this._textures["yellow_bricks_medium"]);

        var dimVec = [2* scale, 2* scale, 2* scale, 20];
        var posVec = [27.5 * scale, 24.7 * scale, -10 * scale];
        this._addCylinder(dimVec, posVec, this._textures["tower_bricks_medium"]);

        var dimVec = [1* scale, 1* scale, 2* scale, 20];
        var posVec = [27.5 * scale, 26.5 * scale, -10 * scale];
        this._addCylinder(dimVec, posVec, this._textures["window"]);

        var dimVec = [0* scale, 2* scale, 2* scale, 20];
        var posVec = [27.5 * scale, 28.1 * scale, -10 * scale];
        this._addCylinder(dimVec, posVec, this._textures["tower_bricks_medium"]);

        // ############## second castle ##############
        var dimVec = [2* scale, 2* scale, 4 * scale, 20];
        var posVec = [27.5 * scale, 21.7 * scale, -24 * scale];
        this._addCylinder(dimVec, posVec, this._textures["yellow_bricks_medium"]);

        var dimVec = [2* scale, 2* scale, 2* scale, 20];
        var posVec = [27.5 * scale, 24.7 * scale, -24 * scale];
        this._addCylinder(dimVec, posVec, this._textures["tower_bricks_medium"]);

        var dimVec = [1* scale, 1* scale, 2* scale, 20];
        var posVec = [27.5 * scale, 26.5 * scale, -24 * scale];
        this._addCylinder(dimVec, posVec, this._textures["window"]);

        var dimVec = [0* scale, 2* scale, 2* scale, 20];
        var posVec = [27.5 * scale, 28.1 * scale, -24 * scale];
        this._addCylinder(dimVec, posVec, this._textures["tower_bricks_medium"]);
    }

    _buildCharachter() {
        switch(this._gameMode){
            case 0:
                this._characterInitPos = [0, 2.5, 0];
                this._character = this._entityManager.addEntityAndReturn({name: EntityManager.ENTITY_MARIO, position: this._characterInitPos});
                this._entityManager.setCharacter(this._character);
                
                this._controls = new BasicCharacterController({
                    MANAGER: _MANAGER, camera: this._camera,
                    target: this._character.model, body: this._character.body,
                });
                break;
            case 1:
                this._characterInitPos = [0, 10, 0];
                this._character = this._entityManager.addEntityAndReturn({name: EntityManager.ENTITY_MARIO, position: this._characterInitPos});
                this._entityManager.setCharacter(this._character);
                
                document.getElementById("GameValues").style.display = "none";
                this._controls = new BasicCharacterControllerFly({
                    MANAGER: _MANAGER, camera: this._camera,
                    target: this._character.model, body: this._character.body,
                });
                break;
        }
    }

    _collectables(){
        // ########## COINS ##########
        // coins on the first layer white bricks
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [16, 8, 0]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [18.5, 8, 0]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [21, 8, 0]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [23.5, 8, 0]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [26, 8, 0]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [52.5, 16, 0], rotation: [0, -PI_2, 0]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [50, 14, 0], rotation: [0, -PI_2, 0]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [55, 14, 0], rotation: [0, -PI_2, 0]});


        // coins on the wood bridge
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [4.5, 37.8, -32], rotation: [0, -PI_2, 0]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [4.5, 37.8, -34.5], rotation: [0, -PI_2, 0]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [4.5, 37.8, -37], rotation: [0, -PI_2, 0]});

        // coins in circle for the non-static bridge
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [4.5, 37.8, -49], rotation: [0, -PI_2, 0]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [4.5, 37.8, -54], rotation: [0, -PI_2, 0]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [4.5, 37.8, -59], rotation: [0, -PI_2, 0]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [10, 37.8, -54], rotation: [0, -PI_2, 0]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [-1, 37.8, -54], rotation: [0, -PI_2, 0]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [0.5, 37.8, -50.5], rotation: [0, -PI_2, 0]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [0.5, 37.8, -57.5], rotation: [0, -PI_2, 0]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [8.5, 37.8, -50.5], rotation: [0, -PI_2, 0]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [8.5, 37.8, -57.5], rotation: [0, -PI_2, 0]});

        // coins on the garden
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [-10, 1, 3], rotation: [0, -PI_2, 0]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [-18, 1, 3], rotation: [0, -PI_2, 0]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [-26, 1, 3], rotation: [0, -PI_2, 0]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [-14, 1, -9]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [-22, 1, -9]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [-10, 1, -21], rotation: [0, -PI_2, 0]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [-18, 1, -21], rotation: [0, -PI_2, 0]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [-26, 1, -21], rotation: [0, -PI_2, 0]});

        // coins on the stairs
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [60, 8, -13.5]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [54, 14, -13.5]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [42, 26, -13.5]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [36, 32, -13.5]});

        // coins around the final star
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [82.5, 70.3, -48]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [82.5, 70.3, -54]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [82.5, 62, -60]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [82.5, 62, -42]});

        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [82.5, 62, -48]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [82.5, 62, -54]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [82.5, 70.3, -60]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [82.5, 70.3, -42]});

        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [82.5, 66.15, -60]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_COIN, position: [82.5, 66.15, -42]});

        // ########## STARS ##########
        switch(_MANAGER.getMode()){
            case "hard":
                this._entityManager.addEntity({name: EntityManager.ENTITY_STAR, position: [-19, 4, -57]});

            case "normal":
                this._entityManager.addEntity({name: EntityManager.ENTITY_STAR, position: [75, 18, -1.75], rotation: [0, -PI_2, 0]});
                
            case "easy":
                this._entityManager.addEntity({name: EntityManager.ENTITY_STAR, position: [82.5, 67, -51], rotation: [0, -PI_2, 0]});
        }

        // ########## BLOCKS ##########
        this._entityManager.addEntity({name: EntityManager.ENTITY_BLOCK, position: [-39, 12, -45], rotation: [0, -PI_4, 0]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_BLOCK, position: [-14, 12, 15], rotation: [0, -PI_4, 0]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_BLOCK, position: [15, 45, -68], rotation: [0, -PI_4, 0]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_BLOCK, position: [75, 16, -10.75], rotation: [0, -PI_4, 0]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_BLOCK, position: [52.5, 72.3, -31], rotation: [0, -PI_4, 0]});
    }
    _decorations(){
        // ########## TREES ##########
        this._entityManager.addEntity({name: EntityManager.ENTITY_TREE, position: [6, 0, -26]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_TREE, position: [-27, 0, -57]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_TREE, position: [-11, 0, -57]});

        // ########## FLOWERS ##########
        this._entityManager.addEntity({name: EntityManager.ENTITY_FLOWER, position: [6, 3, -18]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_FLOWER, position: [4, 3, -14]});
        this._entityManager.addEntity({name: EntityManager.ENTITY_FLOWER, position: [8, 3, -12]});
    }
    _enemies(){
        // ########## blue cube enemy on the stairs ##########
        var dimVec = new CANNON.Vec3(3, 3, 3);
        var posVec = [48, 39, -13.5];
        var elems = this._addBox(dimVec, posVec, this._textures["materials_blu_whomp"]);
        this._entityManager.addEntityPreBuilded(EntityManager.ENTITY_WHOMPBLOCK, elems.mesh, elems.body);

        // ########## wood non-static bridge ##########
        var dimVec = new CANNON.Vec3(2.2, 0.6, 7.5);
        var posVec = [4.5, 35.4, -54];
        var elems = this._addBox(dimVec, posVec, this._textures["wood_bridge"]);
        this._entityManager.addEntityPreBuilded(EntityManager.ENTITY_TRASPORTER, elems.mesh, elems.body);
        
        // ########## conveyor ##########
        var dimVec = new CANNON.Vec3(2.25, 0.3, 2.25);
        var posVec = [33.6, 39, -57];
        var elems = this._addBox(dimVec, posVec, this._textures["materials_transporter1"]);
        this._entityManager.addEntityPreBuilded(EntityManager.ENTITY_ELEVATOR, elems.mesh, elems.body);

        // ########## GOOMBAS ##########
        switch(_MANAGER.getMode()){
            case "hard":
                this._entityManager.addEntity({
                    name: EntityManager.ENTITY_GOOMBA, position: [11, 1, 15], rotation: [0, Math.PI + PI_4, 0],
                    maxDistance: 16,
                });
                this._entityManager.addEntity({
                    name: EntityManager.ENTITY_GOOMBA, position:  [75, 10, -7.5], rotation: [0, -PI_2, 0],
                    maxDistance: 10,
                });
            
            case "normal":
                this._entityManager.addEntity({
                    name: EntityManager.ENTITY_GOOMBA, position: [3, 36.36, -25.5], rotation: [0, PI_2, 0],
                    maxDistance: 10,
                });
                this._entityManager.addEntity({
                    name: EntityManager.ENTITY_GOOMBA, position: [-40, 1, 3], rotation: [0, -Math.PI/3 - Math.PI, 0],
                    maxDistance: 35,
                });

            case "easy":
                this._entityManager.addEntity({
                    name: EntityManager.ENTITY_GOOMBA, position: [28.5, 36.5, -60], rotation: [0, Math.PI + PI_4, 0],
                    maxDistance: 10,
                });
                this._entityManager.addEntity({
                    name: EntityManager.ENTITY_GOOMBA, position: [30, 36.36, -25.5],
                    maxDistance: 10,
                });
                this._entityManager.addEntity({
                    name: EntityManager.ENTITY_GOOMBA, position: [-40, 1, -21], rotation: [0, Math.PI/3, 0],
                    maxDistance: 35,
                });
                
                this._entityManager.addEntity({
                    name: EntityManager.ENTITY_WHOMP, position: [65.5, 60, -60], rotation: [0, -PI_4, 0],
                    maxDistance: 25,
                });

                this._entityManager.addEntity({
                    name: EntityManager.ENTITY_PIRANHA, position: [-4, 0.1, -48],
                    maxDistance: 35,
                });

                this._entityManager.addEntity({name: EntityManager.ENTITY_BULLET, position: [2, 3.5, 15]});
        }
    }

    _LockScreen() {
        document.getElementById("loading").style.display = "none";
        _MANAGER.stopAudioMenu();
        _MANAGER.playAudioGame();
        document.body.requestPointerLock();

        var element = document.body;
        var pauseGame = document.getElementById('pauseGame');
        var pointerlockchange = () => {
            if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
                if(this._pauseTime){
                    this._scoreManager.addPauseTime(Date.now()-this._pauseTime);
                }
                this._controls._input._scopeEnabled = true;
                pauseGame.style.display = 'none';
            } else {
                this._pauseTime = Date.now();
                this._controls._input._scopeEnabled = false;
                pauseGame.style.display = '-webkit-flex';
                pauseGame.style.display = '-moz-flex';
                pauseGame.style.display = 'flex';
            }
        }
        document.addEventListener('pointerlockchange', pointerlockchange, false);
        document.addEventListener('mozpointerlockchange', pointerlockchange, false);
        document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

        pauseGame.addEventListener('click', () => {
            element.requestPointerLock();
        }, false);
        document.getElementById("GameValues").addEventListener('click', () => {
            element.requestPointerLock();
        }, false);
        document.getElementById("canvas").addEventListener('click', () => {
            element.requestPointerLock();
        }, false);
    }

    _OnWindowResize() {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(window.innerWidth, window.innerHeight);
    }

    _RAF() {
        var requestID = requestAnimationFrame(this._RAF.bind(this));

        if (!this._controls._input._scopeEnabled)
            return;
            
        var timeInSeconds = Date.now() - this._currTime;

        this._controls.update(timeInSeconds);
        this._world.step(1/60);

        if(this._character.body.position.y < -20){
            _MANAGER.audioMarioGetHit();
            this._scoreManager.lose1life();
            this._character.body.position.x = this._characterInitPos[0];
            this._character.body.position.y = this._characterInitPos[1];
            this._character.body.position.z = this._characterInitPos[2];
        }

        if(this._gameMode == 0)
            this._entityManager.update(timeInSeconds, true);
        if(this._gameMode == 1)
            this._entityManager.update(timeInSeconds, false);

        this._scoreManager.updateCurrTime(Date.now());
        if(this._scoreManager.isGameOver()){
            cancelAnimationFrame(requestID);
            _MANAGER.stopAudioGame();
            document.exitPointerLock();
            _MANAGER.terminateGame({
                win: this._scoreManager.isWin(),
                currStars: this._scoreManager.getCurrStars(), totStars: this._scoreManager.getStars(),
                score: this._scoreManager.getCurrScore(), time: this._scoreManager.getRemaningTime(),
            });
            return;
        }

        this._renderer.render(this._scene, this._camera);
        this._currTime = Date.now();
    }
}

class GameOverEnviroment {
    constructor(params){
        this._gameOver = document.getElementById("gameOver");

        this._gameOverResoult = document.getElementById("gameOverResoult");

        this._statsSars = document.getElementById("statsSars");
        this._statsScore = document.getElementById("statsScore");
        this._statsTime = document.getElementById("statsTime");

        if(params.win){
            _MANAGER.playAudioGameoverWin();
            this._gameOverResoult.innerHTML ="You WIN";
        } else {
            _MANAGER.playAudioGameoverLose();
            this._gameOverResoult.innerHTML ="You LOSE";
        }

        this._statsSars.innerHTML = params.currStars+"/"+params.totStars;
        var score = ("0000" + params.score);
        this._statsScore.innerHTML = score.substr(score.length-4);
        this._statsTime.innerHTML = parseInt(params.time / 60) + ":" + (params.time % 60).toLocaleString('en-US',
            { minimumIntegerDigits: 2, useGrouping: false });
        
        this._gameOver.style.display = "block";
    }
}

var _APP = null;
var _MANAGER = new generalManager();

window.addEventListener('DOMContentLoaded', () => {
    _APP = new MenuEnviroment();
});
