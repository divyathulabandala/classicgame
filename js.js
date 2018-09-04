
(function() {
    var resourceCache = {};
    var loading = [];
    var readyCallbacks = [];

    
    function load(urlOrArr) {
        if(urlOrArr instanceof Array) {
         
            urlOrArr.forEach(function(url) {
                _load(url);
            });
        } else {
            /* The developer did not pass an array to this function,
             * assume the value is a string and call our image loader
             * directly.
             */
            _load(urlOrArr);
        }
    }

    /* This is our private image loader function, it is
     * called by the public image loader function.
     */
    function _load(url) {
        if(resourceCache[url]) {
            
            return resourceCache[url];
        } else {
            
            var img = new Image();
            img.onload = function() {
            
                resourceCache[url] = img;

               
                if(isReady()) {
                    readyCallbacks.forEach(function(func) { func(); });
                }
            };

            
            resourceCache[url] = false;
            img.src = url;
        }
    }

    function get(url) {
        return resourceCache[url];
    }

    
    function isReady() {
        var ready = true;
        for(var k in resourceCache) {
            if(resourceCache.hasOwnProperty(k) &&
               !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    /* This function will add a function to the callback stack that is called
     * when all requested images are properly loaded.
     */
    function onReady(func) {
        readyCallbacks.push(func);
    }

    /* This object defines the publicly accessible functions available to
     * developers by creating a global Resources object.
     */
    window.Resources = {
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
})();


// Sets the initial score to 0
var score = 0;
document.getElementById('lvlScore').innerHTML = score;


// Enemies the player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = speed;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'https://raw.githubusercontent.com/udacity/frontend-nanodegree-arcade-game/master/images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    // resets position of enemy to move from left to right when player reaches destination
    if (this.x > 500) {
        this.x = -150;
        this.speed = 150 + Math.floor(Math.random() * 500);
    }

    // below code will check for any collisions between player and enemy
    if (player.x < this.x + 60 &&
        player.x + 37 > this.x &&
        player.y < this.y + 25 &&
        30 + player.y > this.y) {
        player.x = 200; // re-aligns position.1
        player.y = 400; // re-aligns position.2
        score = 0; // resets score back to 0 if player collides with enemy
        document.getElementById('lvlScore').innerHTML = score; // 
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'https://raw.githubusercontent.com/udacity/frontend-nanodegree-arcade-game/master/images/char-boy.png';
};

Player.prototype.update = function() {
    // Below code will stop the player from moving off canvas
    if (this.y > 380) {
        this.y = 380;
    }

    if (this.x > 400) {
        this.x = 400;
    }

    if (this.x < 0) {
        this.x = 0;
    }

    // Once player reaches top of canvas/water. 1 point will be added to their lvl/score
    if (this.y < 0) {
        this.x = 200;
        this.y = 380;
        score++;
        document.getElementById('lvlScore').innerHTML = score;
        if(score >= 20) {
            alert("Congratulations! You won!");
            document.getElementById("lvlScore").innerHTML = "0";
        }
   
    } 
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Maneuver around the board using standard arrow keys OR WASD keys
Player.prototype.handleInput = function(keyPress) {
    switch (keyPress) {
        case 'left':
            this.x -= this.speed + 50;
            break;
        case 'up':
            this.y -= this.speed + 30;
            break;
        case 'right':
            this.x += this.speed + 50;
            break;
        case 'down':
            this.y += this.speed + 30;
            break;
        case 'a':
            this.x -= this.speed + 50;
            break;
        case 'w':
            this.y -= this.speed + 30;
            break;
        case 'd':
            this.x += this.speed + 50;
            break;
        case 's':
            this.y += this.speed + 30;
            break;    
    }
};



var allEnemies = [];

// Position enemies 
var enemyPosition = [50, 135, 220];
var player = new Player(200, 400, 50);
var enemy;

enemyPosition.forEach(function(posY) {
    enemy = new Enemy(0, posY, 100 + Math.floor(Math.random() * 499));
    allEnemies.push(enemy);
});

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        65: 'a',
        87: 'w',
        68: 'd',
        83: 's'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
var Engine = (function(global) {
    
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    
    function main() {
        
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        
        update(dt);
        render();

        
        lastTime = now;

     
        win.requestAnimationFrame(main);
    }

    
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

   
    function update(dt) {
        updateEntities(dt);
       
    }

    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }

   
    function render() {
       
        var rowImages = [
                'https://raw.githubusercontent.com/udacity/frontend-nanodegree-arcade-game/master/images/water-block.png',   

                'https://rawgit.com/udacity/frontend-nanodegree-arcade-game/master/images/stone-block.png',   
 
                'https://rawgit.com/udacity/frontend-nanodegree-arcade-game/master/images/stone-block.png',   

                'https://rawgit.com/udacity/frontend-nanodegree-arcade-game/master/images/stone-block.png',  

                'https://rawgit.com/udacity/frontend-nanodegree-arcade-game/master/images/grass-block.png',   
                'https://rawgit.com/udacity/frontend-nanodegree-arcade-game/master/images/grass-block.png'     
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }

  
    function renderEntities() {
        
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    
    function reset() {
        
    }

  
    Resources.load([
        'https://rawgit.com/udacity/frontend-nanodegree-arcade-game/master/images/stone-block.png',
        'https://raw.githubusercontent.com/udacity/frontend-nanodegree-arcade-game/master/images/water-block.png',
        'https://rawgit.com/udacity/frontend-nanodegree-arcade-game/master/images/grass-block.png',
        'https://raw.githubusercontent.com/udacity/frontend-nanodegree-arcade-game/master/images/enemy-bug.png',
        'https://raw.githubusercontent.com/udacity/frontend-nanodegree-arcade-game/master/images/char-boy.png'
    ]);
    Resources.onReady(init);

    global.ctx = ctx;
})(this);

