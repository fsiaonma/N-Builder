// XWUZ standard code
// Having thoughts? Ask here: xwuz@tjp.hu
/*global XWUZ */
/*jslint browser:true */

XWUZ = {};

// will be stuffed by the games itselves:
XWUZ.games = {};

// the name of the current game:
XWUZ.game = '';

var heightScore = 0;

// frame / object check
//XWUZ.framecheck = function () {
//	if (top.frames.length === 0 && navigator.userAgent.indexOf('iPhone') === -1 && window.location.href.indexOf('i2.html') === -1) {
//		window.location.href = 'game.html';
//	}
//};

//alert
XWUZ.say = function () {
	return {
		alert: function (question) {
			XWUZ.flow.pause();
			document.getElementById('alertbox').style.display = 'block';
			document.getElementById('alertbox_content').innerHTML = question + '<br style="clear:both" /><br /><a href="#" onclick="XWUZ.say.dismiss(); XWUZ.flow.restart();return false;"><img src="./i/b_okay.png" alt="Okay" /></a>';
		},
		confirm: function (question) {
			XWUZ.flow.pause();
			document.getElementById('alertbox').style.display = 'block';
			document.getElementById('alertbox_content').innerHTML = question + '<br style="clear:both" /><br /><a href="#" onclick="XWUZ.say.dismiss(); XWUZ.flow.restart();return false;"><img src="./i/b_yes.png" alt="Yes" /></a><a href="#" onclick="XWUZ.say.dismiss(); XWUZ.flow.resume(); return false;"><img src="./i/b_no.png" alt="No" /></a>';
		},
		dismiss: function () {
			document.getElementById('alertbox').style.display = '';
			document.getElementById('alertbox_content').innerHTML = '';
		}
	};
}();

//cookie
XWUZ.cookie = function () {
	var now = new Date();
	var expire = new Date();
	var domain = 'xwuz.com';
	expire.setTime(now.getTime() + 1000 * 60 * 60 * 24 * 90); //90 days
	return {
		set: function (name, value) {
			document.cookie = name + "=" + encodeURIComponent(value) + "; expires=" + expire.toGMTString() + ";domain=" + domain + ";path=/;";
			return value;
		},
		get: function (name) {
			var search, offset, end;
			search = name + "=";
			if (document.cookie.length > 0) {
				offset = document.cookie.indexOf(search);
				if (offset !== -1) {
					offset += search.length;
					end = document.cookie.indexOf(";", offset);
					if (end === -1) {
						end = document.cookie.length;
					}
					return decodeURIComponent(document.cookie.substring(offset, end));
				}
			}
			return ''; //falsy
		},
		del: function (name) {
			var expireNow = new Date();
			document.cookie = name + "=" + "; expires=Thu, 01-Jan-70 00:00:01 GMT" + "; domain=" + domain + ";path=/;";
		}
	};
}();

// menuswitch
XWUZ.menu = function () {
	var menu, status;
	menu = {
		game: {
			position: 0,
			bgpos: 0
		},
		highscore: {
			position: -320,
			bgpos: -72
		},
		about: {
			position: -640,
			bgpos: -182
		}
	};
	menu.game.active = true;

	status = {
		running: false,
		steps: 5
	};

	return {
		setMenu: function() {
			menu['highscore']['position'] = -480;
			menu['about']['position'] = -960;
		},
		get: function () {
			var name;
			for (name in menu) {
				if (menu.hasOwnProperty(name)) {
					if (menu[name].active) {
						return name;
					}
				}
			}	
		},
		set: function (what) {
			var step, oldwhat;
			if (status.running) {
				return false;
			}
			if (menu[what].active && what === 'game') {
				//if we're at the game and she clicks it again, we're asking her if she wants to start a new game
				XWUZ.say.confirm('<h1>New game</h1>Do you really want to<br />restart your game?');
				return;
			}
			
			if (menu[what].active) {
				return false;
			}
			
			oldwhat = XWUZ.menu.get();
			
			status.running = true;
			status.from = menu[oldwhat].position;
			status.to = menu[what].position;
			status.stepnow = 0;
			
			menu[oldwhat].active = false;
			menu[what].active = true;
			
			document.getElementById('button_' + what).getElementsByTagName('span')[0].style.backgroundPosition = menu[what].bgpos + 'px 0';
			document.getElementById('button_' + oldwhat).getElementsByTagName('span')[0].style.backgroundPosition = menu[oldwhat].bgpos + 'px -41px';
			
			step = function () {
				if (status.stepnow < status.steps) {
					status.stepnow += 1;
					document.getElementById('stage_contents').style.marginLeft = status.from + (status.to - status.from) * ((status.stepnow === status.steps)?(1):(1 - 1 / Math.pow(2, status.stepnow))) + 'px';
					setTimeout(step, 50);
				} else {
					delete status.from;
					delete status.to;
					delete status.stepnow;
					status.running = false;
				}
			};
			step();
			return false;
		}
		
	};
}();

//game pause/resume/restart
XWUZ.flow = function () {
	var status = 'STATIC';
	//we don't have a lot of flow controls by default
	return {
		getstatus: function () {
			return status;
		}, 
		restart: function () {},
		pause: function () {},
		resume: function () {}
	};
}();


//let's roll
//XWUZ.framecheck();
