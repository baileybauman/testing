
///////////////////////////////////////////////////////////////////////////////
// Passive calibration gaze tracking.
// Click the floating coloured circles to pop them; they randomly re-inflate.
// Gaze also pops Shapes when calibrated.
///////////////////////////////////////////////////////////////////////////////
var Shapes = {

  complete : false,
  total : 25,

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Mouse Listener
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  onMouseUp : function() {
    var x = Mouse.xMouseScreen;
    var y = Mouse.yMouseScreen;

    var doc = xLabs.scr2doc( x, y );
    // console.log( "click@ "+doc.x+","+doc.y );

    // //xLabs.updateCalibrationTruth( doc.x, doc.y );

    // if(Shapes.total <=0){
    //   //calibrate system
    //   //xLabs.calibrate();
    //   console.log( "done calibrating");
    //   window.location = "main.html";
    // }
    // else{
    //   Shapes.changeShape();
    // }
    //console.log( "click@ "+doc.x+","+doc.y );
    //Graph.hideCircleAt( doc.x, doc.y, 1.0 );
  },

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Shape functions
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // randColor : function() {
  //   var letters = '0123456789ABCDEF';
  //   var color = '#';
  //   for(var i=0; i<6; i++) {
  //       color += letters[Math.floor(Math.random()*16)]
  //   }
  //   return color;
  // },
                    
  // changeShape : function() {                
  //   // Get a start size
  //   var size2 = 25;
  //   var size = size2.toString();
  //   size = size.concat("px");

  //   // Assign Initial Shape
  //   document.getElementById("shape").style.backgroundColor = Shapes.randColor();
  //   document.getElementById("shape").style.width = size;
  //   document.getElementById("shape").style.height = size;
  //   document.getElementById("shape").style.borderRadius = "50%";


  //   var left = (Math.floor(Math.random()*1000 + 1)).toString();
  //   left = left.concat("px");
  //   var top = (Math.floor(Math.random()*600 + 1)).toString();
  //   top = top.concat("px");
  //   document.getElementById("shape").style.left = left;
  //   document.getElementById("shape").style.top = top;

  //   Shapes.total = Shapes.total -1;
  //   console.log( "total@ "+Shapes.total );
  // },

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // Key events
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  start : function() {
    xLabs.setConfig( "calibration.clear", "1" );
    xLabs.setConfig( "system.mode", "learning" ); // this also clears the memory buffer
    document.getElementById( "start" ).style.display = "none";
    // Shapes.changeShape();
  },

  update : function() {
    // update gaze tracking
    Gaze.update();
    if( Gaze.available == true ) {
      var doc = xLabs.scr2doc( Gaze.xMeasuredSmoothed, Gaze.yMeasuredSmoothed );
      console.log("x: " + doc.x);
        console.log("y: " + doc.y); 
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

    Gaze.xyLearningRate = 1.0; //0.8;

    var updateInterval = 50;
    setInterval( Shapes.update, updateInterval );

    Mouse.mouseUpCallback = Shapes.onMouseUp;

    document.getElementById( "start" ).onclick = Shapes.start;

    xLabs.setup( Shapes.onXlabsReady, Shapes.onXlabsState, null, "48972173-7048-4011-a339-c623f6ab6742");
  }

};

Shapes.setup();
