var doorOverlap = 75;
var doorMidPointY = 386;
var doorLeftX = 48;
// Credits center point
var creditsX = 400;
var creditsY = 380;
DoorLayer = pc.Layer.extend('DoorLayer',
    {},
    {
      game:null,
      topDoorImage:null,
      bottomDoorImage:null,
      creditsImage: null,
      gap:0,
      showCredits:false,

      init:function(game,name,zIndex) {
        this._super(name,zIndex);
        this.game = game;
        this.topDoorImage = getImage("door_top");
        this.bottomDoorImage = getImage("door_bottom");
        this.creditsImage = getImage("credit_text");
      },
      draw:function() {
        var ctx = pc.device.ctx;
        if(this.showCredits) {
          this.creditsImage.draw(ctx,
              creditsX - this.creditsImage.width / 2,
              creditsY - this.creditsImage.height / 2);
          //console.log('drawing credits', creditsX, creditsY, this.creditsImage);
        }
        var topDoorY = doorMidPointY - this.gap - this.topDoorImage.height;
        this.topDoorImage.draw(ctx, 0,0, doorLeftX, topDoorY, this.topDoorImage.width, Math.min(this.topDoorImage.height, pc.device.canvasHeight-topDoorY));
        var botBoorY = doorMidPointY + this.gap - (doorOverlap / 2);
        this.bottomDoorImage.draw(ctx, 0,0, doorLeftX, botBoorY, this.bottomDoorImage.width, Math.min(this.bottomDoorImage.height, pc.device.canvasHeight-botBoorY));
        // Clear anything drawn outside the main area
        ctx.clearRect(0, 768, pc.device.canvasWidth, pc.device.canvasHeight);
      },
      process:function() {
        var wantToOpen = ! this.game.wantToCloseDoors;
        var maxGap = 330;
        var elapsed = pc.device.elapsed;

        // Let's slide at
        if(wantToOpen) {
          if(this.gap < maxGap) {
            this.gap = Math.min(maxGap, this.gap + elapsed*0.5);
            if(this.gap >= maxGap) {
              this.game.onDoorsOpened();
            }
          }
        } else {
          if(this.gap > 0) {
            this.gap = Math.max(0, this.gap - elapsed*0.5);
            if(this.gap == 0) {
              this.game.onDoorsClosed();
              if(this.game.complete) {
                this.showCredits = true;
              } else {
                this.showCredits = false;
              }
            }
          }
        }
      }
    });
