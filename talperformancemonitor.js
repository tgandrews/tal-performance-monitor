(function (window, document, undefined) {
	var startTime = new Date();

	var config = {
		server : '10.10.14.27:3000'
	}; 

	var utils = {
		sendStatistic: function (statName, statValue) {
			var body = document.getElementsByTagName('body')[0];
			var statsCallScript = document.createElement('script');
			statsCallScript.type = 'text/javascript';
			statsCallScript.src = 'http://' + config.server + '?' + statName + '=' + statValue;
			body.appendChild(statsCallScript);
			// console.log('Sent: ' + statName + ' ' + statValue);
		},
		timeFromStart: function () {
			return new Date() - startTime;
		}
	};

	var statEvents = {
		registerCallbacksForStatistics: function () {
			this.windowOnLoad();
			this.requireReady();
			this.interceptRequire();
		},
		windowOnLoad: function () {
			window.onload = function () {
				var onloadTime = utils.timeFromStart();
				utils.sendStatistic('onload', onloadTime);
			};
		},
		requireReady: function () {
			var originalMethod = require.ready;
			require.ready = function (callback) {
				var self = this;
				var newCallback = function () {
					var timeElapsed = utils.timeFromStart();
					utils.sendStatistic('requireready', timeElapsed);
					callback.call(self);
				};
				originalMethod.call(this, newCallback);
			}
		},
		interceptRequire: function () {
			var originalMethod = require.execCb;
			require.execCb = function (name, method, args) {
				var object = originalMethod.apply(this, arguments);
				if (name === 'antie/application') {
					var originalReady = object.prototype.ready;
					object.prototype.ready =  function () {
						originalReady.apply(this, arguments);
						var timeElapsed = utils.timeFromStart();
						utils.sendStatistic('applicationstart', timeElapsed);
					}
				}
				// else if (name === 'antie/devices/browserdevice') {
				// 	var originalCreateElement = object.prototype._createElement;
				// 	object.prototype._createElement = function (tagName) {
				// 		var element = originalCreateElement.apply(this, arguments)
				// 		if (tagName === 'video') {
				// 			var loadstartTime;
				// 			element.addEventListener('loadstart', function () {
				// 				loadstartTime = new Date();
				// 			})
				// 			element.addEventListener('canplay', function () {
				// 				var timeElapsed = new Date() - loadstartTime;
				// 				utils.sendStatistic('canplay', timeElapsed);
				// 			})
				// 		}
				// 		return element;
				// 	}
				// }
				else if (name === 'bigscreen/controllers/homecontroller') {
					var originalAddFrameListeners = object.prototype._addFrameListeners;
					var beforerenderDate;
					object.prototype._addFrameListeners = function () {
						originalAddFrameListeners.apply(this, arguments);
						this._frameset.getContentFrame().addEventListener('beforerender', function () {
							beforerenderDate = new Date();
						});
						this._frameset.getContentFrame().addEventListener('databound', function() {
							utils.sendStatistic('Hello',1);
							try {
								document.getElementById('homeContentContainer_WidgetStrip').lastChild.offsetLeft;
							}
							catch (e) {
								window.console.log(e);
							}
							var timefrombeforerender = new Date() - beforerenderDate;
							utils.sendStatistic('homecontentcontroller-br2as', timefrombeforerender);
						})
					}
				}
				return object;
			}
		}
	}

	var tpm = function (userConfig) {
		if (userConfig && userConfig.server) {
			config.server = userConfig.server
		}

		statEvents.registerCallbacksForStatistics();
	} 

	window.tpm = tpm;
})(window, document);

window.tpm();
