//# Using gestures <a title="View raw file" href="https://raw.github.com/gameclosure/examples/master/src/events/input-gesture/src/Application.js"><img src="../../include/download_icon.png" class="icon"></a>
//This example shows how to use the Swipe, Pinch, Rotate, DragSingle, and FingerUp events generated by the GestureView.

import device;
import ui.View as View;
import ui.TextView as TextView;
import ui.GestureView as GestureView;

//## Class: Application
//Create an Application.
exports = Class(GC.Application, function () {
	this.initUI = function () {
		// Create a GestureView
		var gview = new GestureView({
			superview: this.view,
			layout: 'box',
			backgroundColor: 'blue'
		});
		// Subscribe to gesture events: Swipe, Pinch, Rotate, DragSingle, FingerUp
		gview.on('Swipe', bind(this, 'swipe'));
		gview.on('Pinch', bind(this, 'pinch'));
		gview.on('Rotate', bind(this, 'rotate'));
		gview.on('DragSingle', bind(this, 'drag'));
		gview.on('FingerUp', bind(this, 'saveState'));
		// This view scales, rotates, and moves around
		// in response to Swipe, Pinch, Rotate, and DragSingle events
		this.demoView = new View({
			superview: this.view,
			width: 100,
			height: 100,
			x: 100,
			y: 200,
			canHandleEvents: false,
			blockEvents: true,
			backgroundColor: 'red'
		});
		// This view logs Swipe events
		this.logView = new TextView({
			superview: this.view,
			layout: 'box',
			bottom: 0,
			height: 50,
			canHandleEvents: false,
			blockEvents: true,
			backgroundColor: 'green',
			text: device.isSimulator ? 'test on device for multitouch' : 'swipe, pinch, rotate, drag'
		});
		// These values are updated in response to FingerUp events
		this._currentScale = 1;
		this._currentRotation = 0;
	};

	this.swipe = function (dir) {
		// update logView in response to Swipe event
		this.logView.setText(dir);
	};

	this.pinch = function (d) {
		// scale demoView in response to Pinch event
		this.demoView.style.scale = d * this._currentScale;
	};

	this.rotate = function (r) {
		// rotate demoView in response to Rotate event
		this.demoView.style.r = r + this._currentRotation;
	};

	this.drag = function(x, y) {
		// reposition demoView in response to DragSingle event
		this.demoView.style.x += x;
		this.demoView.style.y += y;
	};

	this.saveState = function() {
		// save current scale and rotation in response to FingerUp event
		this._currentScale = this.demoView.style.scale;
		this._currentRotation = this.demoView.style.r;
	};
});

//The output should look like this screenshot:
//<img src="./doc/screenshot.png" alt="a book screenshot" class="screenshot">