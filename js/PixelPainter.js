window.onload = function(){
var pixelPaintRunner = pixelPainter();
pixelPaintRunner.buildGrid(105,105);
pixelPaintRunner.buildSwatch(['green','pink','orange','gray','black','white','brown','yellow','red','blue','red','red','red'])
};


var pixelPainter = function(){
  var pixelPainterEl = document.getElementById('pixelPainter');
  var selectedColor = null;
  var ppGridCells = document.getElementsByClassName('ppCell');
  var ppSwatchCells = document.getElementsByClassName('ppSwatchCell')
  var gridSize = null;

  var clearButton = document.getElementById('clearAll');
  clearButton.addEventListener('click',clearCanvas);

  var eraseButton = document.getElementById('erasor');
  eraseButton.addEventListener('click',function(){
     selectedColor = 'transparent';
  });

  function clearCanvas(){
    Array.prototype.forEach.call(ppGridCells,function(val){
    val.style.backgroundColor = 'transparent'; });
  };

  var fillColorClick = function(){
    this.style.backgroundColor = selectedColor;
  };

  var fillColorHover = function(){
      this.style.backgroundColor = selectedColor;
  };

  var pickColor = function(){
    selectedColor = this.style.backgroundColor;
  };

  var mousedown = function(){
    Array.prototype.forEach.call(ppGridCells,function(val){
    val.addEventListener('mouseover',fillColorHover)})
  };

  var mouseup = function(){
    Array.prototype.forEach.call(ppGridCells,function(val){
    val.removeEventListener('mouseover',fillColorHover)})
  };

  // generates the pp swatch
  var swatchGenerator = function(colorArray){
    var ppSwatch = document.createElement('div');
    ppSwatch.id = 'ppSwatch'
    var totalColors = colorArray.length;
    var nrOfRows = Math.ceil(totalColors/6);
    console.log(nrOfRows)
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
          gridCellEl.className = 'ppCell';
          if(gridSize){
            gridCellEl.style.width = gridSize;
            gridCellEl.style.heigth = gridSize;
          }
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
      val.addEventListener('mouseup',mouseup)})
  };

  var buildFromObject = function(object){
    gridSize = object.gridSize;
    buildGrid(object.width,object.height);
    buildSwatch(object.colorSwatch);

  };

  // the module to be returned
  return {
    buildGrid : gridGenerator,
    buildSwatch : swatchGenerator,
    buildFromObject : buildFromObject
  };
};