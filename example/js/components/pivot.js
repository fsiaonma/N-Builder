PivotComponent = pc.components.Component.extend('PivotComponent',
    {
      create:function(opts) {
        var c = this._super();
        c.config(opts);
        return c;
      }
    },
    {
      row:null,
      column:null,
      filterColors:null,
      turning: 0,
      centerX: null,
      centerY: null,
      x: null,
      y: null,
      image:null,

      init: function()
      {
        this._super('pivot');
      },

      config:function(opts) {
        this.row = opts.row;
        this.column = opts.column;
        this.filterColors = opts.filterColors;
        this.turning = opts.turning || 0;
        this.x = opts.x;
        this.y = opts.y;
        this.centerX = opts.centerX;
        this.centerY = opts.centerY;
      }

    });
