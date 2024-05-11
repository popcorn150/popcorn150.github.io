/**Playing Board */
let tileSize = 32;
let rows = 16;
let column = 16;

let board;
let boardWidth = tileSize * column; // 32 * 16
let boardHeight = tileSize * rows; // 32 * 16
let context;

/**Building the ship */
let shipWidth = tileSize * 2;
let shipHeight = tileSize;
let shipX = tileSize * column / 2 - tileSize;
let shipY = tileSize * rows - tileSize * 2;

let ship = {
    x: shipX,
    y: shipY,
    width: shipWidth,
    height: shipHeight
}

let shipImg;
let shipVelocityx = tileSize; //ship moving speed

/**Aliens */
let alienArray = [];
let alienWIdth = tileSize * 2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;

let alienRows = 2;
let alienColoumns = 3;
let alienCount = 0; //number of aliens to defeat

/**Bullets */
let bulletArray = [];
let bulletVelocityY = -10; //bullet moving speed

let alienVelocityX = 1; //alien moving speed

window.onload = function () {
    board = document.getElementById("playingBoard");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d"); //used for drawing on the board

    /**Drawing the ship */
    // context.fillStyle = "green";
    // context.fillRect(ship.x, ship.y, ship.width, ship.height);
    shipImg = new Image();
    shipImg.src = "hero2.png";
    shipImg.onload = function () {
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    };

    alienImg = new Image();
    alienImg.src = "robot-Invader.png";
    createAliens();

    requestAnimationFrame(update);
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keyup", shoot);
}

function update() {
    requestAnimationFrame(update);

    //clearing the canvas after each ship movement
    context.clearRect(0, 0, board.width, board.height);

    //redrawing the ship over again on the canvas
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

    //aliens
    for (let i = 0; i < alienArray.length; i++) {
        let alien = alienArray[i];
        if (alien.alive) {
            alien.x += alienVelocityX;

            //if alien touches the borders
            if (alien.x + alien.width >= board.width || alien.x <= 0){
                alienVelocityX *= -1;
                alien.x += alienVelocityX * 2;

                //move all aliens down by one row
                for (j = 0; j < alienArray.length; j++){
                    alienArray[j].y += alienHeight;
                }
            }
            context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);
        }
    }

    //bullets
    for (let i = 0; i < bulletArray.length; i++){
        let bullet = bulletArray[i];
        bullet.y += bulletVelocityY;
        context.fillStyle="yellow";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        //bullet collision with aliens
        for (let j = 0; j < alienArray.length; j++){
            let alien = alienArray[j];
            if (!bullet.used && alien.alive && detectCollision(bullet, alien)){
                bullet.used = true;
                alien.alive = false;
                alienCount--;
            }
        }
    }

    //clear bullets
    while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y , 0)){
        bulletArray.shift(); //removes the first element of the array
    }

    //next level
    if (alienCount == 0) {
        //increase the number of aliens in columns and rows by 1
        alienColoumns = Math.min(alienColoumns + 1, column / 2 - 2); //cap at 16 / 2 - 2 = 6
        alienRows = Math.min(alienRows + 1, rows - 4); //cap 16 - 4 = 12
        alienArray = [];
        bulletArray = [];
        createAliens();
    }
}

function moveShip(e) {
    if (e.code == "ArrowLeft" && ship.x - shipVelocityx >= 0) {//check if ship is moving out of bounds on the left
        ship.x -= shipVelocityx; //moving the ship left one tile
    }
    else if (e.code == "ArrowRight" && ship.x + shipVelocityx + ship.width <= board.width) { //check if ship is moving out of bounds on the right
        ship.x += shipVelocityx; //moving the ship right one tile
    }
}

/** Mobile ship movement */
//moving left
let x = window.matchMedia("(max-width: 768px)")
function moveShipLeft() {
    if (x.matches) {// If media query matches
        if (ship.x - shipVelocityx >= 0) { //check if ship is moving out of bounds on the left
            ship.x -= shipVelocityx; //moving the ship left one tile on btn click mobile
        }
    }
}

//moving right
function moveShipRight() {
    if (x.matches) {// If media query matches
        if (ship.x + shipVelocityx + ship.width <= board.width) { //check if ship is moving out of bounds on the right
            ship.x += shipVelocityx; //moving the ship right one tile on btn click mobile
        }
    }
}

function createAliens() {
    for (let c = 0; c < alienColoumns; c++) {
        for (let r = 0; r < alienRows; r++) {
            let alien = {
                img: alienImg,
                x: alienX + c * alienWIdth,
                y: alienY + r * alienHeight,
                width: alienWIdth,
                height: alienHeight,
                alive: true
            }
            alienArray.push(alien);
        }
    }
    alienCount = alienArray.length;
}

function shoot(e){
    if (e.code == "Space"){
        //shoot
        let bullet = {
            x : ship.x + shipWidth * 15/32,
            y : ship.y,
            width : tileSize / 8,
            height : tileSize / 2,
            used : false //if bullet hits alien
        }
        bulletArray.push(bullet);
    }
}

/**Mobile shoot aliens */
function shootAlien() {
    if (x.matches) {// If media query matches
        let bullet = {
            x: ship.x + shipWidth * 15 / 32,
            y: ship.y,
            width: tileSize / 8,
            height: tileSize / 2,
            used: false //if bullet hits alien
        }
        bulletArray.push(bullet);
    }
}

function detectCollision(a, b){
    return a.x < b.x + b.width && //a's top left corner doesn't reach b's top right corner
                a.x + a.width > b.x && //a's top right corner passes b's top left corner
                a.y < b.y + b.height && //a's top left corner doesn't react b's bottom left corner
                a.y + a.height > b.y; //a's bottom left corner passes b's bottom left corner 
}
