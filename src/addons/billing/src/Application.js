//# Using the billing plugin for in-app purchases <a title="View raw file" href="https://raw.github.com/gameclosure/examples/master/src/addons/billing/src/Application.js"><img src="../../include/download_icon.png" class="icon"></a>
//This example shows how to use the billing plugin for in-app purchases.

import ui.TextView as TextView;
import ui.widget.ButtonView as ButtonView;
import plugins.billing.install;
import device;
import menus.views.TextDialogView as TextDialogView;

//## Class: Application
//Create an Application.
exports = Class(GC.Application, function () {
	this.initUI = function () {
		this.view.style.layout = "linear";
		this.view.style.direction = "vertical";

		// Present coin counter
		this._coinCount = 0;

		this._coin = new TextView({
			superview: this.view,
			layout: "box",
			height: device.height/10,
			buffer: false,
			autoFontSize: true,
			text: "Coin Count = <coin count>",
			color: "#ff88ff",
			outlineColor: "#000000",
			verticalPadding: 5,
			horizontalPadding: 20,
			backgroundColor: "#000044"
		});

		// Present disable market toggle button
		var disabled = false;

		this._disable = new ButtonView({
			superview: this.view,
			layout: "box",
			width: device.width/2,
			height: device.height/10,
			centerX: true,
			images: {
				up: "resources/images/white1.png",
				down: "resources/images/white2.png",
				disabled: "resources/images/blue2.png"
			},
			scaleMethod: "9slice",
			sourceSlices: {
				horizontal: {left: 80, center: 116, right: 80},
				vertical: {top: 10, middle: 80, bottom: 10}
			},
			destSlices: {
				horizontal: {left: 40, right: 40},
				vertical: {top: 4, bottom: 4}
			},
			on: {
				up: bind(this, function() {
					disabled = !disabled;
					var newTitle = disabled ? "Purchases: Disabled" : "Purchases: Enabled";
					this._disable.setTitle(newTitle);

					if (disabled) {
						// Disable onPurchase callback
						billing.onPurchase = null;
						billing.onFailure = null;
					} else {
						// Re-enable onPurchase callback
						billing.onPurchase = bind(this, handlePurchase);
						billing.onFailure = bind(this, handleFailure);
					}
				})
			},
			title: "Purchases: Enabled",
			text: {
				color: "#000044",
				size: 16,
				autoFontSize: false,
				autoSize: false
			}
		});

		// Buy simulation button
		this._buy = new ButtonView({
			superview: this.view,
			layout: "box",
			width: device.width/2,
			height: device.height/10,
			centerX: true,
			images: {
				up: "resources/images/blue1.png",
				down: "resources/images/blue2.png",
				disabled: "resources/images/white1.png"
			},
			scaleMethod: "9slice",
			sourceSlices: {
				horizontal: {left: 80, center: 116, right: 80},
				vertical: {top: 10, middle: 80, bottom: 10}
			},
			destSlices: {
				horizontal: {left: 40, right: 40},
				vertical: {top: 4, bottom: 4}
			},
			on: {
				up: bind(this, function() {
					billing.purchase("fiveCoins", "simulate");
				})
			},
			title: "Buy 5 Coins (good)",
			text: {
				color: "#000044",
				size: 16,
				autoFontSize: false,
				autoSize: false
			}
		});

		// Buy cancel button
		this._buyCancel = new ButtonView({
			superview: this.view,
			layout: "box",
			width: device.width/2,
			height: device.height/10,
			centerX: true,
			images: {
				up: "resources/images/blue1.png",
				down: "resources/images/blue2.png",
				disabled: "resources/images/white1.png"
			},
			scaleMethod: "9slice",
			sourceSlices: {
				horizontal: {left: 80, center: 116, right: 80},
				vertical: {top: 10, middle: 80, bottom: 10}
			},
			destSlices: {
				horizontal: {left: 40, right: 40},
				vertical: {top: 4, bottom: 4}
			},
			on: {
				up: bind(this, function() {
					billing.purchase("fiveCoins", "cancel");
				})
			},
			title: "Buy 5 Coins (cancel)",
			text: {
				color: "#000044",
				size: 16,
				autoFontSize: false,
				autoSize: false
			}
		});

		// Refund button
		this._buyRefund = new ButtonView({
			superview: this.view,
			layout: "box",
			width: device.width/2,
			height: device.height/10,
			centerX: true,
			images: {
				up: "resources/images/blue1.png",
				down: "resources/images/blue2.png",
				disabled: "resources/images/white1.png"
			},
			scaleMethod: "9slice",
			sourceSlices: {
				horizontal: {left: 80, center: 116, right: 80},
				vertical: {top: 10, middle: 80, bottom: 10}
			},
			destSlices: {
				horizontal: {left: 40, right: 40},
				vertical: {top: 4, bottom: 4}
			},
			on: {
				up: bind(this, function() {
					billing.purchase("fiveCoins", "refund");
				})
			},
			title: "Refunded item test",
			text: {
				color: "#000044",
				size: 16,
				autoFontSize: false,
				autoSize: false
			}
		});

		// Unavailable item button
		this._buyUnavail = new ButtonView({
			superview: this.view,
			layout: "box",
			width: device.width/2,
			height: device.height/10,
			centerX: true,
			images: {
				up: "resources/images/blue1.png",
				down: "resources/images/blue2.png",
				disabled: "resources/images/white1.png"
			},
			scaleMethod: "9slice",
			sourceSlices: {
				horizontal: {left: 80, center: 116, right: 80},
				vertical: {top: 10, middle: 80, bottom: 10}
			},
			destSlices: {
				horizontal: {left: 40, right: 40},
				vertical: {top: 4, bottom: 4}
			},
			on: {
				up: bind(this, function() {
					billing.purchase("fiveCoins", "unavailable");
				})
			},
			title: "Unavailable item test",
			text: {
				color: "#000044",
				size: 16,
				autoFontSize: false,
				autoSize: false
			}
		});

		// onPurchase result text, tap to clear it
		this._purchase = new TextView({
			superview: this.view,
			height: device.height/10,
			layout: "box",
			buffer: false,
			autoFontSize: true,
			text: "<last onPurchase result>",
			color: "#88ffff",
			outlineColor: "#000000",
			verticalPadding: 5,
			horizontalPadding: 20,
			backgroundColor: "#004400"
		});

		this._purchase.on('InputSelect', bind(this, function (evt, pt) {
			this._purchase.setText("");
		}));

		// onFailure result text, tap to clear it
		this._fail = new TextView({
			superview: this.view,
			height: device.height/10,
			layout: "box",
			buffer: false,
			autoFontSize: true,
			text: "<last onFailure result>",
			color: "#ffff88",
			outlineColor: "#000000",
			verticalPadding: 5,
			horizontalPadding: 20,
			backgroundColor: "#440000"
		});

		this._fail.on('InputSelect', bind(this, function (evt, pt) {
			this._fail.setText("");
		}));

		// isMarketAvailable status
		this._avail = new TextView({
			superview: this.view,
			height: device.height/10,
			layout: "box",
			buffer: false,
			autoFontSize: true,
			text: "<isMarketAvailable>",
			color: "#ff8888",
			outlineColor: "#000000",
			verticalPadding: 5,
			horizontalPadding: 20,
			backgroundColor: "#444400"
		});

		if (billing.isMarketAvailable) {
			this._avail.setText("Market: Initially Available");
		} else {
			this._avail.setText("Market: Initially -Not- Available");
		}

		billing.on('MarketAvailable', bind(this, function (available) {
			if (available) {
				this._avail.setText("Market: Available");
			} else {
				this._avail.setText("Market: -Not- Available");
			}
		}));

		// Initialize the coin counter
		var coinCount = localStorage.getItem("coinCount") | 0;
		var _coin = this._coin;

		function updateCoinCount(count) {
			coinCount = count;
			localStorage.setItem("coinCount", coinCount);
			_coin.setText(count);
		}

		updateCoinCount(coinCount);

		// Handle successful coin purchase
		function handleCoinPurchase() {
			updateCoinCount.call(this, coinCount + 5);

			new TextDialogView({
				superview: this.view,
				title: 'Award Modal',
				text: 'You purchased 5 coins!  Well done!',
				modal: true,
				buttons: [
					{
						title: 'Ok',
						width: 160,
						style: 'GREEN'
					}
				]
			}).show();
		}

		// Handle the android test purchase string also
		var purchaseHandlers = {
			"fiveCoins": bind(this, handleCoinPurchase),
			"android.test.purchased": bind(this, handleCoinPurchase)
		};

		// onPurchase handler
		function handlePurchase(item) {
			var handler = purchaseHandlers[item];
			if (typeof handler === "function") {
				handler();
			}

			this._purchase.setText('Purchase Result: "' + item + '"');
		};

		// onFailure handler
		function handleFailure(reason, item) {
			this._fail.setText('Failure Reason: "' + reason + '", Item: "' + item + '"');
		}

		billing.onPurchase = bind(this, handlePurchase);
		billing.onFailure = bind(this, handleFailure);
	};

	this.launchUI = function () {};
});

//The output should look like this screenshot:
//<img src="./doc/screenshot.png" alt="a book screenshot" class="screenshot">

