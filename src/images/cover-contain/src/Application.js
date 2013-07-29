//# Cover/Contain Image Scaling <a title="View raw file" href="https://raw.github.com/gameclosure/examples/master/src/images/cover-contain/src/Application.js"><img src="../../include/download_icon.png" class="icon"></a>
//Given the following image:
//<img src="./doc/window.png" alt="button image" class="screenshot" style="display:block;width:200px;">

//This demo shows how to display images with cover and contain scaling.

//The debugging flag of the `ImageScaleView` is set to true so you can see the view bounds.

import ui.ImageScaleView;
import ui.View as View;
import ui.TextView as TextView;

exports = Class(GC.Application, function () {
	this.initUI = function () {
		this.style.layout = 'linear';
		this.style.direction = 'vertical';
		this.style.justifyContent = 'space-outside';

		var isContain = true;
		var isv = new ui.ImageScaleView({
			superview: this,
			scaleMethod: 'contain',
			image: 'resources/images/kitten.jpg',
			layout: 'box',
			layoutWidth: '80%',
			layoutHeight: '60%',
			debug: true,
			centerX: true
		});

		var bottomView = new View({
			superview: this,
			layout: 'linear',
			direction: 'horizontal',
			layoutHeight: '20%',
			backgroundColor: 'red'
		});

		var coverContain = new TextView({
			superview: bottomView,
			text: 'cover',
			layout: 'box',
			flex: 1
		});

		coverContain.on('InputSelect', function() {
			isContain = !isContain;
			var cur = isContain ? 'contain' : 'cover';
			var next = isContain ? 'cover' : 'contain';
			isv.updateOpts({
				scaleMethod: cur
			});
			coverContain.setText('current: ' + cur + ', next: ' + next);
		});

		var valignments = ['top', 'middle', 'bottom'];
		var valignIndex = 0;
		var getVAlign = function() {
			var newVA = valignments[valignIndex];
			valignIndex = (valignIndex + 1) % 3;
			return newVA;
		};
		var verticalAlign = new TextView({
			superview: bottomView,
			text: getVAlign(),
			layout: 'box',
			flex: 1
		});

		verticalAlign.on('InputSelect', function() {
			var cur = getVAlign();
			var next = valignments[valignIndex];
			isv.updateOpts({
				verticalAlign: cur
			});
			verticalAlign.setText('current: ' + cur + ', next: ' + next);
		});
	};
});

//Run this code as the `Application.js` file in your project, and you should see something
//like this in the simulator:
//<img src="./doc/screenshot.png" alt="cover/contain screenshot" class="screenshot">