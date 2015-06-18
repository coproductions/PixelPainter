window.onload = function(){
var pixelPaintRunner = pixelPainter();
pixelPaintRunner.buildSwatch(pixelPaintRunner.randomColorGenerator(36));
pixelPaintRunner.buildGrid(15,15);
};


var pixelPainter = function(){
  var pixelPainterEl = document.getElementById('pixelPainter');
  var selectedColor = null;
  var ppGridCells = document.getElementsByClassName('ppCell');
  var ppSwatchCells = document.getElementsByClassName('ppSwatchCell')
  var gridSize = null;
  var undoArray = [];
  var undoHistoryArray = [];
  var selectedColorElement;

  var clearButton = document.createElement('button');
  clearButton.innerHTML = 'start over';
  clearButton.id = 'clearAll';
  clearButton.addEventListener('click',clearCanvas);

  var eraseImage = document.createElement('img');
  eraseImage.id = 'eraseImage';
  eraseImage.src = '../assets/red-slash.svg';


  var eraseButton = document.createElement('button');
  eraseButton.id = 'erasor';
  eraseButton.appendChild(eraseImage);
  eraseButton.addEventListener('click',erase);

  var undoButton = document.createElement('button');
  undoButton.innerHTML = 'undo';
  undoButton.id = 'undo';
  undoButton.addEventListener('click',undoLastStep);

  var undoImage = document.createElement('img');
  undoImage.src = '../assets/undo.svg';
  undoImage.id = 'undoImage';
  undoButton.appendChild(undoImage);

  function clearCanvas(){
     if(selectedColorElement){
      selectedColorElement.className = 'ppSwatchCell';
    }
    Array.prototype.forEach.call(ppGridCells,function(val){
    val.style.backgroundColor = 'white';
    undoArray = [];
    ndoHistoryArray = [];
    selectedColor = null;
     });
  };

  function erase(){
    if(selectedColorElement){
      selectedColorElement.className = 'ppSwatchCell';
    }
    selectedColor = 'white';
  }

  function undoLastStep(){
    if(undoArray.length === 0 && undoHistoryArray.length > 0){
      undoArray = undoHistoryArray.pop();
    }
    undoArray.forEach(function(val){
      document.getElementById(val[0]).style.backgroundColor = val[1];
    })
    undoArray = [];
  }

  var fillColorClick = function(){
    if(undoArray.length > 0){
      undoHistoryArray.push(undoArray);
      undoArray = [];
    }
    undoArray.push([this.id,this.style.backgroundColor]);
    this.style.backgroundColor = selectedColor;

  };

  var fillColorHover = function(){
    undoArray.push([this.id,this.style.backgroundColor]);
    this.style.backgroundColor = selectedColor;
  };

  var pickColor = function(){
    if(selectedColorElement){
      selectedColorElement.className = 'ppSwatchCell';
    }
    selectedColor = this.style.backgroundColor;
    selectedColorElement = this;
    selectedColorElement.className = 'ppSwatchCell selectedColorElement'
  };

  var mousedown = function(){
      if(undoArray.length > 0){
      undoHistoryArray.push(undoArray);
      undoArray = [];
    }
    Array.prototype.forEach.call(ppGridCells,function(val){
    val.addEventListener('mouseover',fillColorHover)})
  };

  var mouseup = function(){
    Array.prototype.forEach.call(ppGridCells,function(val){
    val.removeEventListener('mouseover',fillColorHover)})
  };

  var randomColorGenerator = function(n){
    if(n>100){
      throw('cannot generate more than 100 colors')
    }
    var CSS_COLOR_NAMES = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];
    var randomColorArray = [];
    while(n > 0){
      var randomNr = Math.floor(Math.random()*147);
      if(randomColorArray.indexOf(CSS_COLOR_NAMES[randomNr]) < 0 ){
      randomColorArray.push(CSS_COLOR_NAMES[randomNr])
        n --;
      }
    }
    return randomColorArray;
  };

  // generates the pp swatch
  var swatchGenerator = function(colorArray){
    var ppSwatch = document.createElement('div');
    ppSwatch.id = 'ppSwatch'
    var ppSwatchArea = document.createElement('div');
    ppSwatchArea.id = 'ppSwatchArea'
    var totalColors = colorArray.length;
    var nrOfRows = Math.ceil(totalColors/6);
    var colorIndex = 0;
    var logo = document.createElement('div');
    logo.id = 'logo';
    var logoImage = document.createElement('div');
    logoImage.id = 'logoImage';
    var logoText = document.createElement('div');
    logoText.id = 'logoText';
    logoText.innerHTML = 'Pixel Painter'
    logo.appendChild(logoImage);
    logo.appendChild(logoText);
    ppSwatchArea.appendChild(logo);
    ppSwatchArea.appendChild(clearButton);

    //generating swatch rows
    while(nrOfRows > 0){
      var rowEl = document.createElement('div');
      rowEl.className = 'ppSwatchRow';
      var columnCounter = 1;

      //generating swatch cells
      while(columnCounter <= 6 && colorIndex < totalColors){
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

    ppSwatchArea.appendChild(ppSwatch);
    ppSwatchArea.appendChild(eraseButton);
    ppSwatchArea.appendChild(undoButton);

    pixelPainterEl.appendChild(ppSwatchArea);

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
    ppCanvas.addEventListener('mouseup',mouseup)
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
    buildFromObject : buildFromObject,
    randomColorGenerator : randomColorGenerator
  };
};