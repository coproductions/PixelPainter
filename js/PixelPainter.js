window.onload = function(){
var pixelPaintRunner = pixelPainter();
pixelPaintRunner.buildGrid(35,50);
pixelPaintRunner.buildSwatch(['#FF0000','#800080','#00FF00','#FF0000','#800080','#00FF00','#00FFFF','green','red','blue','black','white','yellow','grey','pink','green','red','blue','black','white','yellow','grey','pink','green','red','blue','black','white','yellow','grey','pink','green','red','blue','black','white','yellow','grey','pink'])
};


var pixelPainter = function(){
  var pixelPainterEl = document.getElementById('pixelPainter');
  var selectedColor = null;
  var hover = false;
  var mouseIsDown = false;
  var ppGridCells = document.getElementsByClassName('ppCell');

  var clearButton = document.getElementById('clearAll');
  clearButton.addEventListener('click',clearCanvas);

  var eraseButton = document.getElementById('erasor');
  eraseButton.addEventListener('click',function(){
     selectedColor = 'transparent';
    });


  function clearCanvas(){
    Array.prototype.forEach.call(ppGridCells,function(val){
      val.style.backgroundColor = 'transparent';
      });
  }

  var fillColorClick = function(){
    this.style.backgroundColor = selectedColor;
  };

  var fillColorHover = function(){
    if(mouseIsDown){
      this.style.backgroundColor = selectedColor;
    }
  };

  var pickColor = function(){
    selectedColor = this.style.backgroundColor;
  };

  var mousedown = function(){
    mouseIsDown = true;
    if(mouseIsDown){
      Array.prototype.forEach.call(ppGridCells,function(val){
      val.addEventListener('mouseover',fillColorHover)})
      this.style.backgroundColor = selectedColor;
    }
  };

  // generates the pp swatch
  var swatchGenerator = function(colorArray){
    var ppSwatch = document.createElement('div');
    ppSwatch.id = 'ppSwatch'
    var totalColors = colorArray.length;
    var nrOfRows = Math.ceil(totalColors/6);
    var colorIndex = 0;

    //generating swatch rows
    while(nrOfRows > 0){
      var rowEl = document.createElement('div');
      rowEl.className = 'ppSwatchRow';
      var columnCounter = 1;

      //generating swatch cells
      while(columnCounter < 6 && colorIndex < totalColors){
        var swatchCellEl = document.createElement('div');
        swatchCellEl.id = 'ppSwatchCell'+colorIndex;
        swatchCellEl.className = 'ppSwatchCell'
        swatchCellEl.style.backgroundColor = colorArray[colorIndex];
        rowEl.appendChild(swatchCellEl);
        colorIndex ++;
        columnCounter ++;
      }
      ppSwatch.appendChild(rowEl);
      nrOfRows --;
    }
    pixelPainterEl.appendChild(ppSwatch);
    var ppSwatchCells = document.getElementsByClassName('ppSwatchCell')

    // event listener for picking colors
    Array.prototype.forEach.call(ppSwatchCells,function(val){
      val.addEventListener('click',pickColor)
      });
  };

  // generates the pp grid
  var gridGenerator = function(x,y){
    var ppCanvas = document.createElement('div');
    ppCanvas.id = 'ppCanvas';
    var cellCounter = 0;
    var rowCounter = 1;

      //generating row elements
    while (rowCounter <= y){
      var rowEl = document.createElement('div');
      rowEl.className = 'ppRow';
      rowEl.id = 'ppRow'+rowCounter;
      var columnCounter = 1;

          //populating rows with grid cells
        while (columnCounter <= x){
          cellCounter ++;
          var gridCellEl = document.createElement('div');
          gridCellEl.id = 'ppCell'+cellCounter;
          gridCellEl.className = 'ppCell'
          rowEl.appendChild(gridCellEl);
          columnCounter ++;
        }
        ppCanvas.appendChild(rowEl);
        rowCounter ++;
    }
    pixelPainterEl.appendChild(ppCanvas);

    //event listener to fill colors one click at a time
    Array.prototype.forEach.call(ppGridCells,function(val){
      val.addEventListener('click',fillColorClick)
      });

    // event listener for activating mouse down
    Array.prototype.forEach.call(ppGridCells,function(val){
      val.addEventListener('mousedown',mousedown)
      });

    //event listener to cancel mousedown
    Array.prototype.forEach.call(ppGridCells,function(val){
      val.addEventListener('mouseup',function(){
        mouseIsDown = false;
      })})
  };


  return {
    buildGrid : gridGenerator,
    buildSwatch : swatchGenerator

  };

};