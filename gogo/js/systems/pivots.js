
PivotSystem = pc.systems.EntitySystem.extend('PivotSystem',
    {},
    {
      init: function() {
        this._super(['pivot', 'filter']);
      },

      processFilter: function(ent, c) {
        if(!c.active)
          return;

        var pivot = c.pivot.getComponent('pivot');
        var sp = ent.getComponent('spatial');
        if(pivot.turning) {
          var img = c.image;
          var dir = c.dir + pivot.turning * -90;
          sp.dir = dir;
          var dx = c.x + img.width/2 - pivot.centerX;
          var dy = c.y + img.height/2 - pivot.centerY;
          var radians = pc.Math.degToRad(pivot.turning * -90);
          var cosT = Math.cos(radians);
          var sinT = Math.sin(radians);
          var nx = dx * cosT - dy * sinT;
          var ny = dy * cosT + dx * sinT;
          sp.pos.x = pivot.centerX - img.width/2 + nx;
          sp.pos.y = pivot.centerY - img.height/2 + ny;
        } else if(sp.dir != c.dir) {
          sp.pos.x = c.x;
          sp.pos.y = c.y;
          sp.setDir(c.dir);
        }
      },

      processPivot: function(ent, c) {
        if(!c.active)
          return;

        if(c.turning) {
          c.turning -= Math.min(0.1 * Math.ceil(c.turning), (pc.device.elapsed / 150) * Math.max(0.25, c.turning * c.turning));
          if(c.turning < 0.1) c.turning = 0;
          ent.getComponent('spatial').dir = c.turning * -90;
        }
      },

      process: function(ent) {
        var filter = ent.getComponent('filter');
        if(filter) {
          return this.processFilter(ent, filter);
        }
        var pivot = ent.getComponent('pivot');
        if(pivot) {
          return this.processPivot(ent, pivot);
        }

      }

    });