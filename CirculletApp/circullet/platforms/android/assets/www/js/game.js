window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
  })();

var stageWidth = 360;
var stageHeight = 640;
var defaultFontStyle = { font: '14px Snippet', fill: 'white', align: 'center' };
var accessToken = null;
var prefs = plugins.appPreferences;
var server = "http://52.79.151.233:5959";

var Bullet = new Class({
    initialize: function() {

    },
    extend : {
        makeSprite: function(size, color, power) {
            var graphic = new PIXI.Graphics();
            var sprite = new PIXI.Sprite();
            sprite.addChild(graphic);
            this.initBullet(sprite, size, color, power);
            return sprite;
        },

        initBullet: function(sprite, size, color, power) {
            var g = sprite.getChildAt(0);
            g.clear();
            g.beginFill(0x000);
            g.lineStyle(1, color, 1);
            g.drawCircle(0, 0, size);
            g.endFill();
            sprite.size = size;
            sprite.power = power;
        }
    }
});

var Enemy = new Class({
    initialize: function() {

    },
    extend : {
        makeSprite : function(size, color, hp) {
            var graphic = new PIXI.Graphics();
            var sprite = new PIXI.Sprite();
            sprite.addChild(graphic);
            this.initEnemy(sprite, size, color, hp);
            return sprite;
        },

        initEnemy: function(sprite, size, color, hp) {
            var g = sprite.getChildAt(0);
            g.clear();
            g.beginFill(0x000);
            g.lineStyle(1, color, 1);
            g.drawCircle(0, 0, size);
            g.endFill();
            sprite.size = size;
            sprite.hp = hp;
        }
    }
});

var Scene = new Class({
    initialize: function() {
        this.stage = new PIXI.Container();
        this.stage.width = stageWidth;
        this.stage.height = stageHeight;
    },
    onShow: function() {

    },
    update: function(){

    }
});

var ButtonFactory = new Class({
    extend : {
        makeButton: function (text, click, width, height) {
            var button = new PIXI.Sprite();
            var textg = new PIXI.Text(text,{ font: '15px Snippet', fill: 'white', align: 'center' });
            textg.position.x = width / 2 - textg.width / 2;
            textg.position.y = height / 2 - textg.height / 2;
            var g = new PIXI.Graphics();
            g.lineStyle(3, 0xffffff, 1);
            g.beginFill(0, 0);
            g.drawRoundedRect(0, 0, width, height, 10);
            g.endFill();
            g.addChild(textg);
            button.addChild(g);

            var onButtonDown = function() {

            };
            var onButtonUp = function() {
                if(click) {
                    click();
                }
            };
            var onButtonOver = function() {

            };
            var onButtonOut = function() {

            };

            button.buttonMode = true;
            button.anchor.set(0.5);
            button.interactive = true;
            button
                .on('mousedown', onButtonDown)
                .on('touchstart', onButtonDown)
                .on('mouseup', onButtonUp)
                .on('touchend', onButtonUp)
                .on('mouseupoutside', onButtonUp)
                .on('touchendoutside', onButtonUp)
                .on('mouseover', onButtonOver)
                .on('mouseout', onButtonOut);

            // button.tap = noop;
            // button.click = noop;

            return button;
        }
    }
})

var MenuScene = new Class(Scene, {
    initialize: function() {
        this.callSuper();
        var gameTitle = new PIXI.Text("Circullet", { font: '50px Snippet', fill: 'white', align: 'center' });
        var startButton = ButtonFactory.makeButton("Start", function(){
            if(!accessToken) {
                if(!window.facebookConnectPlugin) {
                    SceneManager.goto(gameScene);
                    gameScene.startGame();
                    return;
                }

                facebookConnectPlugin.login(["public_profile"], function(resp){

                    var accessToken = resp.authResponse.accessToken;
                    $.ajax({
                        url : server + "/login",
                        data : {
                            accessToken : accessToken
                        },
                        dataType : "json",
                        method : "POST",
                        success: function(resp) {
                            window.accessToken = accessToken;
                            var userId = resp.id;
                            window.userId = userId;
                            var ok = function() {
                            };
                            var fail = function(err) {
                                console.log(err);
                            }
                            prefs.fetch(function (value) {
                                    if(!value) {
                                        prefs.store(ok, fail, 'first_time', new Date().getTime());
                                        Log.updateUser(userId, new Date().getTime(), new Date().getTime(), null);
                                    } else {
                                        Log.updateUser(userId, null, new Date().getTime(), null);
                                    }
                                }, fail, 'first_time');

                            SceneManager.goto(gameScene);
                            gameScene.startGame();
                        }
                    });
                }, function() {

                });
            } else {
                SceneManager.goto(gameScene);
                gameScene.startGame();
            }

        }, 100, 30);

        /*
        var rankingButton = ButtonFactory.makeButton("Ranking", function(){
            SceneManager.goto(rankingScene);
        }, 100, 30);
        */

        startButton.position.x = 130;
        startButton.position.y = 360;

        /*
        rankingButton.position.x = 130;
        rankingButton.position.y = 420;
        */

        gameTitle.position.x = stageWidth / 2 - gameTitle.width / 2;
        gameTitle.position.y = 100;

        this.stage.addChild(startButton);
        // this.stage.addChild(rankingButton);
        this.stage.addChild(gameTitle);
    },
    onShow: function() {

    },
    update: function() {

    }
});

var Log = new Class({
    extend : {
        updateUser: function (userId, firstDate, lastLaunchDate, lastGameDate) {
            $.ajax({
                url : server + "/user/" + userId,
                method : "PUT",
                data : {
                    firstDate : firstDate,
                    lastLaunchDate: lastLaunchDate,
                    lastGameDate: lastGameDate,
                    accessToken: accessToken
                },
                dataType : "json",
                success: function(resp){
                    console.log(resp);
                }
            });
        },
        insertGameLog: function(userId, score, playtime) {
            $.ajax({
                url : server + "/gamelog/" + userId,
                method : "POST",
                data : {
                    score: score,
                    playtime: playtime,
                    accessToken: accessToken
                },
                dataType : "json",
                success: function(resp){
                    console.log(resp);
                }
            });
        }
    }
})

var Pool = new Class({
    objs: null,
    size : 10,
    initialize: function(size, createFunction) {
        this.size = size;
        this.objs = new Array();
        for(var i = 0;i< size; i++) {
            this.objs.push(createFunction());
        }
    },

    borrowObject: function() {
        if(this.objs.length > 0) {
            return this.objs.shift();
        }
    },

    returnObject: function(obj) {
        this.objs.push(obj);
    }
});

PIXI.Point.prototype.distanceTo = function(p) {
    var w = this.x - p.x;
    var h = this.y - p.y;
    return Math.sqrt(w*w+h*h);
}

var GameScene = new Class(Scene, {
    enemyPool: null,
    bulletPool: null,
    tick: 0,
    score: 0,
    scoreText: null,
    level: 0,
    hp: 1000,
    enemys: [],
    bullets: [],
    initialize: function() {
        var self = this;
        this.callSuper();
        this.enemyPool = new Pool(1000, function(){
            return Enemy.makeSprite(1, 0xffffff, 1);
        });
        this.bulletPool = new Pool(100, function(){
            return Bullet.makeSprite(1, 0xffffff, 1);
        });
        this.stage.interactive = true;
        this.stage.hitArea = new PIXI.Rectangle(0, 0, stageWidth, stageHeight);
        this.scoreText = new PIXI.Text("Score : 0", defaultFontStyle);
        this.scoreText.position.x = 260;
        this.scoreText.position.y = 10;

        this.gameOverText = new PIXI.Text("Game Over. \nScore is 0", defaultFontStyle);
        this.gameOverText.position.x = stageWidth / 2 - this.gameOverText.width / 2;
        this.gameOverText.position.y = stageHeight / 2 - this.gameOverText.height / 2;

        this.hpText = new PIXI.Text("HP : 1000", defaultFontStyle);
        this.hpText.position.x = 10;
        this.hpText.position.y = 10;

        this.stage.addChild(this.scoreText);
        this.stage.addChild(this.hpText);
        this.stage.on("touchstart", function(e){
            if(self.playing) {
                self.fireBullet(e);
            } else {
                SceneManager.goto(menuScene);
            }
        });
        this.stage.on("mousedown", function(e){
            if(self.playing) {
                self.fireBullet(e);
            } else {
                SceneManager.goto(menuScene);
            }
        });
    },
    onShow: function() {

    },
    fireBullet: function(e) {
        var x = e.data.global.x;
        this.addBullet(2, 0xffffff, 1, x);
    },
    addBullet: function(size, color, power, x) {
        var bullet = this.bulletPool.borrowObject();
        Bullet.initBullet(bullet, size, color, power);
        bullet.position.x = x;
        bullet.position.y = 650;

        var bullets = this.bullets;
        var i;
        for(i=0;i<bullets.length;i++){
            if(!bullets[i]) {
                bullets[i] = bullet;
                break;
            }
        }
        if(i==bullets.length) {
            bullets.push(bullet);
        }
        this.stage.addChild(bullet);
    },
    addEnemy: function(size, color, hp) {
        var enemy = this.enemyPool.borrowObject();
        Enemy.initEnemy(enemy, size, color, hp);
        enemy.position.x = Math.floor(Math.random() * stageWidth);
        enemy.position.y = -10;

        var enemys = this.enemys;
        var i;
        for(i=0;i<enemys.length;i++){
            if(!enemys[i]) {
                enemys[i] = enemy;
                break;
            }
        }
        if(i==enemys.length) {
            enemys.push(enemy);
        }
        this.stage.addChild(enemy);
    },
    updateBullet: function() {
        var bullets = this.bullets;
        var enemys = this.enemys;

        for(var i=0;i<bullets.length;i++){
            if(!bullets[i]) {
                continue;
            }

            bullets[i].position.y = bullets[i].position.y - 3;

            var checked = false;
            for(var j=0;j<enemys.length;j++) {
                if(!enemys[j]) {
                    continue;
                }

                if(enemys[j].position.distanceTo(bullets[i].position) < enemys[j].size + bullets[i].size) {

                    this.bulletPool.returnObject(bullets[i]);
                    this.stage.removeChild(bullets[i]);
                    delete bullets[i];
                    checked = true;

                    this.score++;

                    enemys[j].hp--;
                    if(enemys[j].hp <= 0) {
                        this.enemyPool.returnObject(enemys[j]);
                        this.stage.removeChild(enemys[j]);
                        delete enemys[j];
                    }
                    break;
                }
            }
            if(checked) {
                continue;
            }

            if(bullets[i].position.y < -10) {
                this.bulletPool.returnObject(bullets[i]);
                this.stage.removeChild(bullets[i]);
                delete bullets[i];
            }
        }

    },
    updateEnemy: function() {
        var enemys = this.enemys;
        for(var i=0;i<enemys.length;i++){
            if(!enemys[i]) {
                continue;
            }

            enemys[i].position.y = enemys[i].position.y + (this.level / 5.0);
            if(enemys[i].position.y > 600) {
                this.enemyPool.returnObject(enemys[i]);
                this.stage.removeChild(enemys[i]);
                delete enemys[i];
                this.hp--;

                if(this.hp <= 0) {
                    this.gameOver();
                }
            }
        }
    },
    gameOver: function() {
        this.playing = false;
        this.gameOverText.text = "Game Over. \nScore is " + this.score;
        this.stage.addChild(this.gameOverText);
        Log.updateUser(userId, null, null, new Date().getTime());
        var playtime = new Date().getTime() - this.startTime;
        Log.insertGameLog(userId, this.score, playtime);
    },
    update: function() {
        if(this.playing) {
            this.tick++;
            var ratio = (11 - this.level) + 5;
            if(this.tick % ratio == 0) {
                this.addEnemy(ratio + 3, 0xffffff, 1);
            }
            this.updateEnemy();
            this.updateBullet();
            this.scoreText.text = "Score : " + this.score;
            this.hpText.text = "HP : " + this.hp;
            this.stage.removeChild(this.scoreText);
            this.stage.addChild(this.scoreText);
            this.stage.removeChild(this.hpText);
            this.stage.addChild(this.hpText);
            this.level = Math.min(10, 1 + parseInt(this.score / 10));
        }
    },

    startGame: function() {
        this.startTime = new Date().getTime();
        this.hp = 1000;
        this.stage.removeChild(this.gameOverText);

        var enemys = this.enemys;
        for(var i=0;i<enemys.length;i++) {
            if (!enemys[i]) {
                continue;
            }
            this.enemyPool.returnObject(enemys[i]);
            this.stage.removeChild(enemys[i]);
            delete enemys[i];
        }

        var bullets = this.bullets;
        for(var i=0;i<bullets.length;i++) {
            if (!bullets[i]) {
                continue;
            }
            this.bulletPool.returnObject(bullets[i]);
            this.stage.removeChild(bullets[i]);
            delete bullets[i];
        }
        this.score = 0;
        this.playing = true;
    }
});

var SceneManager = new Class({
    currentScene : null,
    extend : {
        goto : function(scene) {
            this.currentScene = scene;
            this.currentScene.onShow();
        }
    }
});

var menuScene = new MenuScene();
var gameScene = new GameScene();


SceneManager.goto(menuScene);

var renderer = PIXI.autoDetectRenderer(stageWidth, stageHeight, { antialias: true });
document.getElementById("play-area").appendChild(renderer.view);
requestAnimFrame( animate );


/*
enemy.on('mousedown', onDown);
enemy.on('touchstart', onDown);
*/

function animate() {
	requestAnimFrame( animate );
    var scene = SceneManager.currentScene;
    scene.update();
	renderer.render(scene.stage);
}