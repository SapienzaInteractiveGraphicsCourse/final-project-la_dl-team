
export class ScoreManager{
    constructor(params){
        this._lifesSpanGame = params.lifesTarget;
        this._timeSpanGame = params.timeTarget;
        this._starsSpanGame = params.starsTarget;
        this._scoreSpanGame = params.scoreTarget;

        this._lifes = params.init.lifes;
        this._time = params.init.time;
        this._stars = params.init.stars;
        this._score = params.init.score;

        this._currLifes = params.curr.lifes;
        this._startTime = params.curr.startTime;
        this._currTime = params.curr.currTime;
        this._pauseTime = params.curr.pauseTime;
        this._currPassedTime = parseInt((this._currTime - this._startTime - this._pauseTime) / 1000);
        this._currStars = params.curr.stars;
        this._currScore = params.curr.score;

        this._lastHit = null;

        this._win = false;
        this._gameOver = false;

        this._updateSpansGame()
    }

    getStars(){return this._stars}
    getRemaningTime(){return this._time-this._currPassedTime;}
    getCurrStars(){return this._currStars}
    getCurrScore(){return this._currScore}

    setStartTime(time){this._startTime = time}

    addPauseTime(time){
        this._pauseTime += time;
    }

    isWin(){return this._win}
    isGameOver(){
        this._updateGameOver();
        return this._gameOver;
    }
    _updateGameOver(){
        if(this._currLifes <= 0 || this._currPassedTime < 0){
            this._gameOver = true;
        }
        if(this._currStars >= this._stars){
            this._win = true;
            this._gameOver = true;
        }
    }

    lose1life(){
        var hitTime = Date.now();
        if (this._lastHit == null || hitTime-this._lastHit > 500){
            this._lastHit = hitTime;
            
            this._currLifes -= 1;
            this._updateSpansGame();
            this._updateGameOver();
        }
    }
    add1Star(){
        this._currStars += 1;
        this._updateSpansGame();
        this._updateGameOver();
    }
    updateCurrTime(time){
        this._currTime = time;
        this._currPassedTime = parseInt(this._time - (this._currTime - this._startTime - this._pauseTime) / 1000);
        this._updateGameOver();
        this._updateSpansGame();
    }
    changeScore(value){
        this._currScore += value;
        this._updateSpansGame();
    }

    _updateSpansGame() {
        this._lifesSpanGame.innerHTML = "Lifes: " + this._currLifes;
        this._timeSpanGame.innerHTML = "time: " + parseInt(this._currPassedTime / 60) + ":" + (this._currPassedTime % 60).toLocaleString('en-US',
            { minimumIntegerDigits: 2, useGrouping: false });
        this._starsSpanGame.innerHTML = "stars: " + this._currStars;
        var score = ("0000" + this._currScore);
        this._scoreSpanGame.innerHTML = "score: " + score.substr(score.length-4);
    }
}