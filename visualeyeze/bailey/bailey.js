var heatmap = h337.create({
  container: document.getElementById('heatmapContainer'),
  maxOpacity: .6,
  radius: 50,
  blur: .90,
  // backgroundColor with alpha so you can see through it
  backgroundColor: 'rgba(0, 0, 58, 0.96)'
});
var heatmapContainer = document.getElementById('heatmapContainerWrapper');

var Shapes = {

  calibrationComplete : false, // determines if calibration is done
  total : 25, // number of shapes displayed for calibration
  numPoints : 0, // number of data points added so far in the heatmap
  totalPoints : 100, // total number of data points to be in the heatmap //100!!!
  images : ["cat.jpeg","cat2.jpg","cat3.jpg"],
  imageIndex : 0,
  interval : null,

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Mouse Listener
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  onMouseUp : function() {
    var x = Mouse.xMouseScreen;
    var y = Mouse.yMouseScreen;

    var doc = xLabs.scr2doc( x, y );
    console.log( "click@ "+doc.x+","+doc.y );

    //once callibration is done
    if(Shapes.total <=0){
      console.log( "done calibrating");
      Shapes.calibrationComplete = true;

      // now show the image and not the calibration shapes
      document.getElementById( "catdiv" ).style.display = "block";
      document.getElementById('catdiv').style.backgroundImage="url(" + Shapes.images[Shapes.imageIndex] + ")";
      document.getElementById( "shape" ).style.display = "none";
    }
    else{
      Shapes.changeShape();
    }
  },

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Shape functions
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  randColor : function() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for(var i=0; i<6; i++) {
        color += letters[Math.floor(Math.random()*16)]
    }
    return color;
  },
                    
  changeShape : function() {                
    // Get a start size
    var size2 = 25;
    var size = size2.toString();
    size = size.concat("px");

    // Assign shape and size
    document.getElementById("shape").style.backgroundColor = Shapes.randColor();
    document.getElementById("shape").style.width = size;
    document.getElementById("shape").style.height = size;
    document.getElementById("shape").style.borderRadius = "50%";

    // assign location
    var left = (Math.floor(Math.random()*1000 + 1)).toString();
    left = left.concat("px");
    var top = (Math.floor(Math.random()*600 + 1)).toString();
    top = top.concat("px");
    document.getElementById("shape").style.left = left;
    document.getElementById("shape").style.top = top;

    Shapes.total = Shapes.total -1;
    console.log( "total@ "+Shapes.total );
  },

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Key events
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  start : function() {
    xLabs.setConfig( "calibration.clear", "1" );
    xLabs.setConfig( "system.mode", "learning" ); // this also clears the memory buffer?
    document.getElementById( "start" ).style.display = "none";
    Shapes.changeShape();
  },

  update : function() {
    // update gaze tracking
    //done calibrating and not enough data points from looking yet
    if(Shapes.calibrationComplete == true && Shapes.numPoints < Shapes.totalPoints){
      Gaze.update();
      if( Gaze.available == true ) {
        var doc = xLabs.scr2doc( Gaze.xMeasuredSmoothed, Gaze.yMeasuredSmoothed );
        console.log("x: " + doc.x);
        console.log("y: " + doc.y); 
        heatmap.addData({ x: doc.x, y: doc.y, value: 100});
        Shapes.numPoints = Shapes.numPoints + 1;
      }
    }
    //done calibrating and have enough data points from looking
    else if(Shapes.calibrationComplete == true && Shapes.numPoints >= Shapes.totalPoints){
      //show the heat map
      console.log("done with timing...");
      document.getElementById( "heatmapContainerWrapper" ).style.display = "block";
      //stop update interval
      clearInterval(Shapes.interval);
      //show next image
      setTimeout(Shapes.showNextImage, 10000);
    }
    //not done calibrating..
    else if(Shapes.calibrationComplete == false){
      Gaze.update();
      if( Gaze.available == true ) {
        var doc = xLabs.scr2doc( Gaze.xMeasuredSmoothed, Gaze.yMeasuredSmoothed );
        console.log("x: " + doc.x);
        console.log("y: " + doc.y); 

      }
    }
  }, 

  showNextImage : function(){
    if(Shapes.imageIndex < Shapes.images.length){
      Shapes.imageIndex = Shapes.imageIndex + 1;
      //update picture

      document.getElementById('catdiv').style.backgroundImage="url(" + Shapes.images[Shapes.imageIndex] + ")";
      //update heat map
      Gaze.update();
      if( Gaze.available == true ) {
        var doc = xLabs.scr2doc( Gaze.xMeasuredSmoothed, Gaze.yMeasuredSmoothed );
        console.log("x: " + doc.x);
        console.log("y: " + doc.y); 
        var data = {
          max: 100,
          min: 100,
          data: [
            {x: doc.x, y: doc.y, value: 100}
          ]
        };
        heatmap.setData(data);
        document.getElementById( "heatmapContainerWrapper" ).style.display = "none";

        // Deletes the current data
        
      }
      //restart interval

      Shapes.numPoints = 0;
    // this updates the gaze every 150 milliseconds
    var updateInterval = 150; //150!!!!
    Shapes.interval = setInterval( Shapes.update, updateInterval );

    }
  },

  // xLabs API
  onXlabsReady : function() {
  },
  onXlabsState : function() {
  },

  // Setup
  setup : function() {
    window.addEventListener( "beforeunload", function() {
        xLabs.setConfig( "system.mode", "off" );
    });

    Gaze.xyLearningRate = 1.0;

    // this updates the gaze every 150 milliseconds
    var updateInterval = 150; //150!!!!
    Shapes.interval = setInterval( Shapes.update, updateInterval );

    Mouse.mouseUpCallback = Shapes.onMouseUp;

    document.getElementById( "start" ).onclick = Shapes.start;
    document.getElementById( "heatmapContainerWrapper" ).style.display = "none";
    document.getElementById( "catdiv" ).style.display = "none";

    xLabs.setup( Shapes.onXlabsReady, Shapes.onXlabsState, null, "48972173-7048-4011-a339-c623f6ab6742");
  }

};

Shapes.setup();
