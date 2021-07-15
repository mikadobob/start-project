// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html


const { ccclass, property } = cc._decorator;

@ccclass
export class Game extends cc.Component {

    @property(cc.Prefab)
    private starPrefab: cc.Prefab = null;

    @property
    private maxStarDuration = 0;

    @property
    private minStarDuration = 0;

    @property(cc.Node)
    private ground: cc.Node = null;

    @property(cc.Node)
    public player: cc.Node = null;

    @property(cc.Label)
    private scoreDisplay: cc.Label = null;

    @property(cc.AudioClip)
    private scoreAudio: cc.AudioClip = null;

    private groundY: number = 0;
    private score: number;
    public timer: number;
    public starDuration: number;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // Obtain the anchor point of ground level on the y axis
        this.groundY = this.ground.y + this.ground.height / 2; // "this.ground.top" may also work

        this.timer = 0;
        this.starDuration = 0;

        // Generate a new star
        this.spawnNewStar();

        this.score = 0;
    }

    spawnNewStar() {
        // Generate a new node in the scene with a preset template
        var newStar = cc.instantiate(this.starPrefab);
        // Put the newly added node under the Canvas node
        this.node.addChild(newStar);
        // Set up a random position for the star
        newStar.setPosition(this.getNewStarPosition());

        newStar.getComponent('Star').game = this;

        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    }

    getNewStarPosition() {
        var randX = 0;
        // According to the position of the ground level and the main character's jump height, randomly obtain an anchor point of the star on the y axis
        var randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50;
        // According to the width of the screen, randomly obtain an anchor point of star on the x axis
        var maxX = this.node.width / 2;
        randX = (Math.random() - 0.5) * 2 * maxX;
        // Return to the anchor point of the star
        return cc.v2(randX, randY);
    }

    gainScore() {
        this.score += 1;
        this.scoreDisplay.string = "Score: " + this.score.toString();

        cc.audioEngine.playEffect(this.scoreAudio, false);
    }

    gameOver() {
        this.player.stopAllActions();

        cc.director.loadScene('game');
    }


    update(dt) {
        if (this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
    }
}
