window.onload = function(){
var pixelPaintRunner = pixelPainter();
pixelPaintRunner.buildGrid(5,5);
pixelPaintRunner.buildSwatch(['green','red','blue','black','white','yellow','grey','pink','green','red','blue','black','white','yellow','grey','pink','green','red','blue','black','white','yellow','grey','pink','green','red','blue','black','white','yellow','grey','pink'])
};


var pixelPainter = function(){
  var pixelPainterEl = document.getElementById('pixelPainter');

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
  };

  // generates the pp grid
  var gridGenerator = function(x,y){
    var ppCanvas = document.createElement('div');
    ppCanvas.id = 'ppCanvas';
    var cellCounter = 0;
    var rowCounter = 1;
    // var gridEl = document.createElement('div');
    // gridEl.id = 'ppGrid';

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
  };

  document.getElementsByClassName('ppSwatchCell').addEventListener()

  return {
    buildGrid : gridGenerator,
    buildSwatch : swatchGenerator

  };

};