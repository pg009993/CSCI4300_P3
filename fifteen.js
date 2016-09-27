"use strict";

/*
 * CSCI 4300 Project 3
 * This code creates a tile game from the fifteen.html file provided. The main 
 * component of this game is a two dimensional array of block objects that have
 * defined properties and behaviors.
 */

(function() {
    var numBlocks = 4; // number of blocks in a row/column
    var blockSize = 100; // size in pixels of one block

    var blocks = [[],[],[],[]]; // two dimensional array to be populated with block objects
    var blockEls = document.querySelectorAll('div div'); // grabs all block elements from the page
    
    // for each block element on the page, create a new block() object and add into the grid
    for(var i = 0; i < blockEls.length; i++){
        blocks[i % 4].push(new block(blockEls[i], i % 4, parseInt(i / 4)));
    }
    
    // use null to represent the empty square
    blocks[3][3] = null;
    
    // iterates through blocks, setting class name for highlight
    for(var i = 0; i < blocks.length; i++){
        for(var j = 0; j < blocks[i].length; j++){
            if(blocks[i][j]){
                blocks[i][j].setClass();
            }
        }
    }

    // this function defines a block, given the html element, and an x,y position
    function block(el, x, y) {
        var instance = this;
        this.el = el;

        // initializes the block, setting the background, background position,
        // and adding the event listeners
        this.init = function(x, y) {
            instance.updatePosition(x, y);
            instance.el.style['background-image'] = 'url(background.jpg)';
            instance.el.style['background-position'] = (-1 * blockSize * x) + 'px ' + (-1 * blockSize * y) + 'px';
            instance.el.addEventListener('click', instance.click);
        };

        // updates the position a block is currently displaying in
        this.updatePosition = function(x, y) {
            instance.x = x;
            instance.y = y;
            instance.el.style.left = (blockSize * x) + 'px';
            instance.el.style.top = (blockSize * y) + 'px';
        };
        
        // sets the class to enable hover highlight
        this.setClass = function(){
            if(instance.canMove()){
                instance.el.className = 'canmove';
            } else {
                instance.el.className = '';
            }
        };

        // on click, if the block can move, call the move block function
        this.click = function(){
            var movePos = instance.canMove();
            if(movePos){
                moveBlocks(instance.x, instance.y, movePos[0], movePos[1]);
            }
        };

        // determines if a block can move, checking all directly adjacent positions
        // for the empty sqaure. if it can move, returns an array with x,y coordinates
        // to move to, if it cannot move, returns false
        this.canMove = function() {
            if (instance.y > 0) {
                if (blocks[instance.x][instance.y - 1] === null)
                    return [instance.x, instance.y - 1];
            }
            if (instance.y < numBlocks - 1) {
                if (blocks[instance.x][instance.y + 1] === null)
                    return [instance.x, instance.y + 1];
            }
            if (instance.x > 0) {
                if (blocks[instance.x - 1][instance.y] === null)
                    return [instance.x - 1, instance.y];
            }
            if (instance.x < numBlocks - 1) {
                if (blocks[instance.x + 1][instance.y] === null)
                    return [instance.x + 1, instance.y];
            }
            return false;
        };

        this.init(x, y);
    }
    
    // swaps the positions of two blocks given their x,y coordinates, then sets class names for all blocks
    function moveBlocks(x1, y1, x2, y2){
        var temp = blocks[x1][y1];
        blocks[x1][y1] = blocks[x2][y2];
        blocks[x2][y2] = temp;
        if(blocks[x1][y1]){
            blocks[x1][y1].updatePosition(x1, y1);
        }
        if(blocks[x2][y2]){
            blocks[x2][y2].updatePosition(x2, y2);
        }
        for(var i = 0; i < blocks.length; i++){
            for(var j = 0; j < blocks[i].length; j++){
                if(blocks[i][j]){
                    blocks[i][j].setClass();
                }
            }
        }
    }
   
    // on the click of the shuffle button, runs the shuffle algorithm given in
    // the project description
    document.getElementsByTagName('B')[0].addEventListener('click', function() {
        var swap, neighbors, blankX, blankY, oldX, oldY, i, j;
        
        // finds x,y of the current empty block
        for(i = 0; i < numBlocks; i++){
            for(j = 0; j < numBlocks; j++){
                if(blocks[i][j] === null){
                    blankX = i;
                    blankY = j;
                    break;
                }
            }
        }
        
        // iterates over 1000 moves
        for(i = 0; i < 1000; i++){
            // finds all valid neighbors of the empty block
            neighbors = [];
            if(blankX > 0){
                neighbors.push(blocks[blankX - 1][blankY]);
            }
            if(blankX > numBlocks - 1){
                neighbors.push(blocks[blankX+ 1][blankY]);
            }
            if(blankY > 0){
                neighbors.push(blocks[blankX][blankY - 1]);
            }
            if(blankY < numBlocks - 1){
                neighbors.push(blocks[blankX][blankY + 1]);
            }
            // chooses a random neighbor to swap
            swap = neighbors[parseInt(Math.random() * neighbors.length)];
            
            // calls the move method, storing the old locaiton as it is the
            // new locaiton of the blank square
            oldX = swap.x;
            oldY = swap.y;
            moveBlocks(swap.x, swap.y, blankX, blankY);
            blankX = oldX;
            blankY = oldY;
        }
        
    });
})();