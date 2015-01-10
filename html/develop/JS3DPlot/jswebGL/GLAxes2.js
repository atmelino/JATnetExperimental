/*
 * This class represents the axes for the webGL plot.
 */
GLAxes2 = function(data3D, surfacePlot){
    
    this.labels = [];
    
    this.initAxesBuffers = function(){
        
        // Set up the main X-axis label.
        var labelPos = {
            x: 0.5,
            y:  - 1.35,
            z: 0
        };
        var glText = new GLText2(data3D, "label", labelPos, 0, surfacePlot, "x", "centre");
        this.labels.push(glText);
                
    };
    
	//printlnMessage('messages', 'GLTexture gl ' + surfacePlot.gl);

    this.initAxesBuffers();
};

GLAxes2.prototype.draw = function(){
            
    // Render the axis labels.
    var numLabels = this.labels.length;
        
    for (var i = 0; i < numLabels; i++) 
        this.labels[i].draw();
};
