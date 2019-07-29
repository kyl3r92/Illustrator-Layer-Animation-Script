#target illustrator

var min_layer = 1;
var max_layer = 36;
var loops = 1;


var box = new Window('dialog', "Some title");  
  
box.panel = box.add('panel', undefined, "Layer Settings");  
box.panel_text1 = box.panel.add('edittext', undefined, "1");  
box.panel_text2 = box.panel.add('edittext', undefined, "36");
box.panel_box = box.panel.add('checkbox', undefined, "trace");
box.panel_box.minimumSize.width = 20;
box.panel_box.minimumSize.height = 20;
box.panel_text1.minimumSize.width = 60;
box.panel_text2.minimumSize.width = 60;

box.panel_text1.onChange = function() {
    updateSliderRange ();
}
box.panel_text2.onChange = function() {
    updateSliderRange();
}

function updateSliderRange ()
{
    min_layer = parseInt(box.panel_text1.text);
    max_layer = parseInt(box.panel_text2.text);
    
    anim_slider.minvalue = min_layer;
    anim_slider.maxvalue = max_layer;
	anim_slider.notify("onChange"); // call the onchange event handler
}



  

var animGroup = box.add("group");
var current_frame_text = animGroup.add('edittext', undefined, "1");
current_frame_text.minimumSize.width = 30;

var prev_btn = animGroup.add('button',undefined, "<", {name:'<'});  
var anim_slider = animGroup.add("slider", undefined, 100, 1, 100); // 1 min scaling to avoid division by zero
var next_btn = animGroup.add('button',undefined, ">", {name:'>'}); 

anim_slider.onChange = function() {
    var frame = Math.round(anim_slider.value);
    current_frame_text.text = frame;
    
    hideAllLayers ();
    showFrame(frame);
}

updateSliderRange ();

animGroup.playBtn = animGroup.add('button',undefined, "Play", {name:'play'});  
  
animGroup.playBtn.onClick = function(){
  min_layer = parseInt(box.panel_text1.text);
  max_layer = parseInt(box.panel_text2.text);
  playAnimation ();
}

prev_btn.onClick = function()
{
    var frame = Math.round(anim_slider.value);
    frame -= 1;
    if(frame < min_layer)
        frame = max_layer;
    
    current_frame_text.text = frame;
    anim_slider.value = frame;
    anim_slider.notify("onChange");
}
next_btn.onClick = function()
{
    var frame = Math.round(anim_slider.value);
    frame += 1;
    if(frame > max_layer)
        frame = min_layer;
    
    current_frame_text.text = frame;
    anim_slider.value = frame;
    anim_slider.notify("onChange");
}


  
box.show()

function hideAllLayers ()
{
    // hide all
    for (var i = min_layer; i <= 36; i++)
    {
        layer = app.activeDocument.layers.getByName("Layer " + i);
        layer.visible = false;
    }
}

function playAnimation ()
{
    hideAllLayers ();
    for (var i = 1; i <= max_layer; i++)
    {
        showFrame(i);
    }
    // restore 1st
    layer = app.activeDocument.layers.getByName("Layer " + 1);
    layer.visible = true;
    layer.opacity = 100.0;
    app.redraw ();
}

function showFrame (frame)
{   
    var i = frame;
    var prev_i = i - 1;
    var prev_prev_i = i - 2;
    var prev_prev_prev_i = i - 3;
    if (i == min_layer)
    {
        prev_i = 36;
        prev_prev_i = max_layer - 1;
        prev_prev_prev_i = max_layer - 2;
    }        
    if (i == 2)
    {
        prev_prev_i = max_layer;
        prev_prev_prev_i = max_layer - 1;
    }
    if(i == 3)
    {
        prev_prev_prev_i = max_layer;
    }
    
    // current_frame_text.text = "" + i;
    anim_slider.value = i;

    prev_prev_prev_layer = app.activeDocument.layers.getByName("Layer " + prev_prev_prev_i);
    prev_prev_layer = app.activeDocument.layers.getByName("Layer " + prev_prev_i);
    prev_layer = app.activeDocument.layers.getByName("Layer " + prev_i);
    layer = app.activeDocument.layers.getByName("Layer " + i);
    
    
    if(box.panel_box.value == true)
    {
        prev_prev_prev_layer.visible = false;
        prev_prev_prev_layer.opacity = 100.0;
        prev_prev_layer.visible = true;
        prev_prev_layer.opacity = 25.0;
        prev_layer.visible = true;
        prev_layer.opacity = 50.0;
    }else{
        prev_prev_prev_layer.visible = false;
        prev_prev_layer.visible = false;
        prev_layer.visible = false;
    }
    
    layer.visible = true;
    layer.opacity = 100.0;
    app.redraw ();
}





