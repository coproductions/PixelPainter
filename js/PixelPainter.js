window.onload = function(){
  var pixelPaintRunner = pixelPainter();
  pixelPaintRunner.buildSwatch(pixelPaintRunner.randomColorGenerator(36));
  pixelPaintRunner.buildGrid(15,15);
  if(window.location.hash){
    pixelPaintRunner.renderHash();
  }
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

  var saveButton = document.createElement('button');
  saveButton.innerHTML = 'save';
  saveButton.id = 'save';
  saveButton.addEventListener('click',saveImageToUrl);

  var savePrompt = document.createElement('div');
  savePrompt.id = 'savePrompt';

  window.onhashchange = renderHash;

  function renderHash(){
    var hash = window.location.hash.substr(1);
    if(hash){
      var savedImageDataObj = deSerialize(hash);
      resolutionInputRender(null,savedImageDataObj.gridSize);

      var ppCells = document.querySelectorAll('.ppCell');
        for (var i = 0; i < ppCells.length; i++) {
          if(i.toString() in savedImageDataObj){
            ppCells[i].style.backgroundColor = '#'+ savedImageDataObj[i.toString()];
          }
        };
    }
  };

  function saveImageToUrl(){
    var savedImageData = {};
    var ppCells = document.querySelectorAll('.ppCell');
    var gridSize = Math.sqrt(ppCells.length);
    for (var i = 0; i < ppCells.length; i++) {
      if(ppCells[i].style.backgroundColor && ppCells[i].style.backgroundColor !== 'white'){
        savedImageData[i] = rgbToHex(ppCells[i].style.backgroundColor);
      }
    };
    // console.log(serializeObject(savedImageData,gridSize));
    window.location.href = '#' + serializeObject(savedImageData,gridSize);
    savePrompt.innerHTML = 'please bookmark this page to save your image';
  }

  function serializeObject(obj,gridSize){
    var resultStr = gridSize;
    for(var key in obj){
      resultStr += '&' + key+obj[key];
    }
    return resultStr;
  };

  function deSerialize(str){
    var strArray = str.split('&');
    var deSerializedObj = {};
    deSerializedObj.gridSize = strArray.shift();
    for (var i = 0; i < strArray.length; i++) {
      deSerializedObj[strArray[i].slice(0,strArray[i].length-6)]
      = strArray[i].slice(strArray[i].length-6,strArray[i].length);
    };
    return deSerializedObj;
  }

  function rgbToHex(str){
    str = str.slice(4,str.length-1);
    var strArray = str.split(',');
    var R = strArray[0];
    var G = strArray[1];
    var B = strArray[2];
    return toHex(R)+toHex(G)+toHex(B)
  };

  function toHex(n) {
   n = parseInt(n,10);
   if (isNaN(n)) return "00";
   n = Math.max(0,Math.min(n,255));
   return "0123456789ABCDEF".charAt((n-n%16)/16)
        + "0123456789ABCDEF".charAt(n%16);
  };

  function colourNameToHex(colour){
    var colours = {"aliceblue":"#f0f8ff","antiquewhite":"#faebd7","aqua":"#00ffff","aquamarine":"#7fffd4","azure":"#f0ffff",
    "beige":"#f5f5dc","bisque":"#ffe4c4","black":"#000000","blanchedalmond":"#ffebcd","blue":"#0000ff","blueviolet":"#8a2be2","brown":"#a52a2a","burlywood":"#deb887",
    "cadetblue":"#5f9ea0","chartreuse":"#7fff00","chocolate":"#d2691e","coral":"#ff7f50","cornflowerblue":"#6495ed","cornsilk":"#fff8dc","crimson":"#dc143c","cyan":"#00ffff",
    "darkblue":"#00008b","darkcyan":"#008b8b","darkgoldenrod":"#b8860b","darkgray":"#a9a9a9","darkgreen":"#006400","darkkhaki":"#bdb76b","darkmagenta":"#8b008b","darkolivegreen":"#556b2f",
    "darkorange":"#ff8c00","darkorchid":"#9932cc","darkred":"#8b0000","darksalmon":"#e9967a","darkseagreen":"#8fbc8f","darkslateblue":"#483d8b","darkslategray":"#2f4f4f","darkturquoise":"#00ced1",
    "darkviolet":"#9400d3","deeppink":"#ff1493","deepskyblue":"#00bfff","dimgray":"#696969","dodgerblue":"#1e90ff",
    "firebrick":"#b22222","floralwhite":"#fffaf0","forestgreen":"#228b22","fuchsia":"#ff00ff",
    "gainsboro":"#dcdcdc","ghostwhite":"#f8f8ff","gold":"#ffd700","goldenrod":"#daa520","gray":"#808080","green":"#008000","greenyellow":"#adff2f",
    "honeydew":"#f0fff0","hotpink":"#ff69b4",
    "indianred ":"#cd5c5c","indigo":"#4b0082","ivory":"#fffff0","khaki":"#f0e68c",
    "lavender":"#e6e6fa","lavenderblush":"#fff0f5","lawngreen":"#7cfc00","lemonchiffon":"#fffacd","lightblue":"#add8e6","lightcoral":"#f08080","lightcyan":"#e0ffff","lightgoldenrodyellow":"#fafad2",
    "lightgrey":"#d3d3d3","lightgreen":"#90ee90","lightpink":"#ffb6c1","lightsalmon":"#ffa07a","lightseagreen":"#20b2aa","lightskyblue":"#87cefa","lightslategray":"#778899","lightsteelblue":"#b0c4de",
    "lightyellow":"#ffffe0","lime":"#00ff00","limegreen":"#32cd32","linen":"#faf0e6",
    "magenta":"#ff00ff","maroon":"#800000","mediumaquamarine":"#66cdaa","mediumblue":"#0000cd","mediumorchid":"#ba55d3","mediumpurple":"#9370d8","mediumseagreen":"#3cb371","mediumslateblue":"#7b68ee",
    "mediumspringgreen":"#00fa9a","mediumturquoise":"#48d1cc","mediumvioletred":"#c71585","midnightblue":"#191970","mintcream":"#f5fffa","mistyrose":"#ffe4e1","moccasin":"#ffe4b5",
    "navajowhite":"#ffdead","navy":"#000080",
    "oldlace":"#fdf5e6","olive":"#808000","olivedrab":"#6b8e23","orange":"#ffa500","orangered":"#ff4500","orchid":"#da70d6",
    "palegoldenrod":"#eee8aa","palegreen":"#98fb98","paleturquoise":"#afeeee","palevioletred":"#d87093","papayawhip":"#ffefd5","peachpuff":"#ffdab9","peru":"#cd853f","pink":"#ffc0cb","plum":"#dda0dd","powderblue":"#b0e0e6","purple":"#800080",
    "red":"#ff0000","rosybrown":"#bc8f8f","royalblue":"#4169e1",
    "saddlebrown":"#8b4513","salmon":"#fa8072","sandybrown":"#f4a460","seagreen":"#2e8b57","seashell":"#fff5ee","sienna":"#a0522d","silver":"#c0c0c0","skyblue":"#87ceeb","slateblue":"#6a5acd","slategray":"#708090","snow":"#fffafa","springgreen":"#00ff7f","steelblue":"#4682b4",
    "tan":"#d2b48c","teal":"#008080","thistle":"#d8bfd8","tomato":"#ff6347","turquoise":"#40e0d0",
    "violet":"#ee82ee",
    "wheat":"#f5deb3","white":"#ffffff","whitesmoke":"#f5f5f5",
    "yellow":"#ffff00","yellowgreen":"#9acd32"};

    if (typeof colours[colour.toLowerCase()] != 'undefined')
        return colours[colour.toLowerCase()];

    return false;
  };


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
    window.location.hash = '';
    savePrompt.innerHTML = '';
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
        randomColorArray.push(colourNameToHex(CSS_COLOR_NAMES[randomNr]))
        n --;
      }
    }
    return randomColorArray;
  };

  function resolutionInputRender(event,gridSize){
    var value;
    if(gridSize){
      value = Number(gridSize);
    }else if(typeof Number(resolutionInput.value) !== 'number' || Number(resolutionInput.value)<1 || Number(resolutionInput.value) > 99){
      throw new TypeError('please enter a valid number between 1 and 99');
    } else{
      value = Number(resolutionInput.value);
    }
    document.getElementById('ppCanvas').remove();
    gridGenerator(value,value)
    var cellSizeIncBorder = 650/value;
    var cellSizeExBorder = cellSizeIncBorder - 2;

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
    ppSwatchArea.appendChild(saveButton);
    ppSwatchArea.appendChild(savePrompt);


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
          var gridCellEl = document.createElement('div');
          gridCellEl.id = 'ppCell'+cellCounter;
          gridCellEl.className = 'ppCell';
          if(gridSize){
            gridCellEl.style.width = gridSize;
            gridCellEl.style.heigth = gridSize;
          }
          rowEl.appendChild(gridCellEl);
          cellCounter ++;
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
    randomColorGenerator : randomColorGenerator,
    renderHash: renderHash
  };
};