// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export class Player extends cc.Component {

    @property
    jumpHeight: number = 0;

    @property
    jumpDuration: number = 0;

    @property
    maxMoveSpeed: number = 0;

    @property
    accel: number = 0;

    @property(cc.AudioClip)
    private jumpAudio:cc.AudioClip = null;

    private accLeft: boolean = false;
    private accRight: boolean = false;
    private xSpeed: number = 0;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // Initialize jump action
        var jumpAction = this.runJumpAction();
        cc.tween(this.node).then(jumpAction).start()

        // Acceleration direction switch
        this.accLeft = false;
        this.accRight = false;
        // The main character's current horizontal velocity
        this.xSpeed = 0;

        // Initialize the keyboard input listening
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy() {
        // Cancel keyboard input monitoring
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    runJumpAction() {
        // Jump up
        var jumpUp = cc.tween().by(this.jumpDuration, { y: this.jumpHeight }, { easing: 'sineOut' });
        // Jump down
        var jumpDown = cc.tween().by(this.jumpDuration, { y: -this.jumpHeight }, { easing: 'sineIn' });

        // Create a easing and perform actions in the order of "jumpUp", "jumpDown"
        var tween = cc.tween().sequence(jumpUp, jumpDown).call(this.playJumpSound, this);
        // Repeat
        return cc.tween().repeatForever(tween);
    }

    playJumpSound() {
        cc.audioEngine.playEffect(this.jumpAudio, false);
    }

    onKeyDown(event) {
        // Set a flag when key pressed
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = true;
                break;
            case cc.macro.KEY.d:
                this.accRight = true;
                break;
        }
    }

    onKeyUp(event) {
        // Unset a flag when key released
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = false;
                break;
            case cc.macro.KEY.d:
                this.accRight = false;
                break;
        }
    }

    

    update(dt) {
        // Update speed of each frame according to the current acceleration direction
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }
        // Restrict the movement speed of the main character to the maximum movement speed
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            // If speed reach limit, use max speed with current direction
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        // Update the position of the main character according to the current speed
        this.node.x += this.xSpeed * dt;
    }
}
