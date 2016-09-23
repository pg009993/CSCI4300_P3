"use strict";

(function() {
    var numBlocks = 4;
    var blockSize = 100;

    var blocks = [[],[],[],[]];
    var blockEls = document.querySelectorAll('div div');

    for(var i = 0; i < blockEls.length; i++){
        blocks[i % 4].push(new block(blockEls[i], i % 4, parseInt(i / 4)));
    }

    blocks[3][3] = null;

    function block(el, x, y) {
        var instance = this;
        this.el = el;

        this.init = function(x, y) {
            instance.updatePosition(x, y);
            instance.el.style['background-image'] = 'url(background.jpg)';
            instance.el.style['background-position'] = (-1 * blockSize * x) + 'px ' + (-1 * blockSize * y) + 'px';
            instance.el.addEventListener('mouseover', instance.mouseover);
            instance.el.addEventListener('mouseout', instance.mouseout);
            instance.el.addEventListener('click', instance.click);
        };

        this.updatePosition = function(x, y) {
            instance.x = x;
            instance.y = y;
            instance.el.style.left = (blockSize * x) + 'px';
            instance.el.style.top = (blockSize * y) + 'px';
        };

        this.mouseover = function() {
            if(instance.canMove() !== false){
                instance.el.style['border'] = '5px solid red';
            }
        };

        this.mouseout = function() {
            instance.el.style['border'] = '5px solid black';
        };
        
        this.click = function(){
            var movePos = instance.canMove();
            if(movePos){
                moveBlocks(instance.x, instance.y, movePos[0], movePos[1]);
            }
        };

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
    }

    document.getElementsByTagName('B')[0].addEventListener('click', function() {
        var swap, neighbors, blankX, blankY, oldX, oldY, i, j;
        
        for(i = 0; i < numBlocks; i++){
            for(j = 0; j < numBlocks; j++){
                if(blocks[i][j] === null){
                    blankX = i;
                    blankY = j;
                    break;
                }
            }
        }
        
        for(i = 0; i < 1000; i++){
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
            swap = neighbors[parseInt(Math.random() * neighbors.length)];
            oldX = swap.x;
            oldY = swap.y;
            moveBlocks(swap.x, swap.y, blankX, blankY);
            blankX = oldX;
            blankY = oldY;
        }
        
    });
})();