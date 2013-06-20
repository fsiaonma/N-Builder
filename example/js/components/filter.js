FilterComponent = pc.components.Component.extend('FilterComponent',
    {
      create:function(opts) {
        var c = this._super();
        c.config(opts);
        return c;
      }
    },
    {
      pivot: null,
      color: null,
      row: null,
      column: null,
      dir: null,
      x: null,
      y: null,
      image:null,

      init: function()
      {
        this._super('filter');
      },

      config: function(opts) {
        this.pivot = opts.pivot;
        this.color = opts.color;
        this.row = opts.row;
        this.column = opts.column;
        this.dir = opts.dir;
        this.x = opts.x;
        this.y = opts.y;
        this.image = opts.image;
      },

      isTurning:function() {
        return this.pivot.getComponent('pivot').turning > 0;
      },

      letsThrough:function(color) {
        if(this.color == 'clear' || this.color == 'mirror')
          return true;
        return this.color == color;
      },

      doTurn:function(turning) {

      }

    });
