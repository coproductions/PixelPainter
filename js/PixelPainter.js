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
  var undoCache = {};
  var undoHistoryArray = [];
  var selectedColorElement;

  var resolutionInput = document.createElement('input');
  var resolutionRender = document.createElement('button');
  resolutionRender.id = 'resolutionRenderButton';
  resolutionRender.innerHTML = 'render'

  var renderInstructions = document.createElement('div');
  renderInstructions.id = 'renderInstructions';
  renderInstructions.innerHTML = 'Enter a number to rerender the grid resolution (max 99).'

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

    if(Object.keys(undoCache).length ===0 && undoHistoryArray.length > 0){
      undoCache = undoHistoryArray.pop();
    }
    for(key in undoCache){
      document.getElementById(key).style.backgroundColor = undoCache[key];
    }
    undoCache = {};
  }

  var fillColorClick = function(){
    if(Object.keys(undoCache).length > 0){
      undoHistoryArray.push(undoCache);
      undoCache = {};
    }
     if(!(this.id in undoCache)){
    undoCache[this.id] = this.style.backgroundColor;
    }
    this.style.backgroundColor = selectedColor;

  };

  var fillColorHover = function(){
    if(!(this.id in undoCache)){
      undoCache[this.id] = this.style.backgroundColor;
    }
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
      if(Object.keys(undoCache).length > 0){
        undoHistoryArray.push(undoCache);
        undoCache = {};
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

  var resolutionInputRender = function(){
    if(typeof Number(resolutionInput.value) !== 'number' || Number(resolutionInput.value)<1 || Number(resolutionInput.value) > 99){
      throw new TypeError('please enter a valid number between 1 and 99');
    }
    document.getElementById('ppCanvas').remove();
    gridGenerator(Number(resolutionInput.value),Number(resolutionInput.value))
    console.log(resolutionInput.value);
    var cellSizeIncBorder = 650/resolutionInput.value;
    var cellSizeExBorder = cellSizeIncBorder - 2;
    console.log(cellSizeIncBorder)
    console.log(cellSizeExBorder)

    Array.prototype.forEach.call(document.getElementsByClassName('ppCell'),function(val){
      val.style.width = cellSizeExBorder+'px';
      val.style.height = cellSizeExBorder+'px';
      });

  }

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
    ppSwatchArea.appendChild(resolutionInput);
    ppSwatchArea.appendChild(resolutionRender);
    ppSwatchArea.appendChild(renderInstructions);


    pixelPainterEl.appendChild(ppSwatchArea);

    // event listener for picking colors
    Array.prototype.forEach.call(ppSwatchCells,function(val){
      val.addEventListener('click',pickColor)
      });

    resolutionRender.addEventListener('click',resolutionInputRender)
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
    window.addEventListener('mouseup',mouseup)
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