(function (window, document, undefined) {
	var startTime = new Date();

	var config = {
		server : 'localhost:3000'
	}; 

	var utils = {
		sendStatistic: function (statName, statValue) {
			var body = document.getElementsByTagName('body')[0];
			var statsCallScript = document.createElement('script');
			statsCallScript.type = 'text/javascript';
			statsCallScript.src = 'http://' + config.server + '?' + statName + '=' + statValue;
			body.appendChild(statsCallScript);
			console.log('Sent: ' + statName + ' ' + statValue);
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
					originalReady = object.prototype.ready;
					object.prototype.ready =  function () {
						originalReady.apply(this, arguments);
						var timeElapsed = utils.timeFromStart();
						utils.sendStatistic('applicationstart', timeElapsed);
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