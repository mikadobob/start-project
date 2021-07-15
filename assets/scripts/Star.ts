// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import { Game } from "./Game";

const { ccclass, property } = cc._decorator;

@ccclass
export class Star extends cc.Component {

    @property
    pickRadius: number = 0;

    private game: Game = null;

    getPlayerDistance() {
        // Judge the distance according to the position of the player node
        let playerPos = this.game.player.getPosition();
        // Calculate the distance between the two points according to the position of the two points
        var dist = playerPos.subtract(this.node.getPosition()).mag();
        return dist;
    }

    onPicked() {
        this.game.spawnNewStar();

        this.node.destroy();
        this.game.gainScore();

    }

    update(dt) {
        console.log(this.game);
        if (this.getPlayerDistance() < this.pickRadius) {
            // Invoke collecting behavior
            this.onPicked();
            return;
        }

        var opacityRatio = 1 - this.game.timer/this.game.starDuration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
    }
}
