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

	var talObjectModifications = {
		'antie/application': function (object) {
			var originalReady = object.prototype.ready;
			object.prototype.ready =  function () {
				originalReady.apply(this, arguments);
				var timeElapsed = utils.timeFromStart();
				utils.sendStatistic('applicationstart', timeElapsed);
			};
		},
		'antie/devices/browserdevice': function (object) {
			var originalCreateElement = object.prototype._createElement;
			object.prototype._createElement = function (tagName) {
				var element = originalCreateElement.apply(this, arguments);
				if (tagName === 'video') {
					var loadstartTime;
					element.addEventListener('loadstart', function () {
						loadstartTime = new Date();
					});
					element.addEventListener('canplay', function () {
						var timeElapsed = new Date() - loadstartTime;
						utils.sendStatistic('canplay', timeElapsed);
					});
				}
				return element;
			};
		},
		'antie/widgets/carousel/binder': function (object) {
			var original = object.prototype._getCallbacks;
			object.prototype._getCallbacks = function (widget, processItemFn, postBindFn) {
				var callbacks = original.call(this, widget, processItemFn, postBindFn);
				var originalOnSuccess = callbacks.onSuccess;
				callbacks.onSuccess = function (data) {
					var start = new Date();
					originalOnSuccess(data);

					var forceUpdate = window.getComputedStyle(widget.outputElement, null).width;
					var end = new Date();
					utils.sendStatistic('bind_success_time_for' + widget.id.replace(/[ -]/, '_'), end - start);
				};
				return callbacks;
			};
		},
		'bigscreen/antietemp/widgets/carousel/binder': function (object) {
			this['antie/widgets/carousel/binder'](object);
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
				console.log(name);
				var object = originalMethod.apply(this, arguments);
				for (var prop in talObjectModifications) {
					if (talObjectModifications.hasOwnProperty(prop)) {
						if (name === prop) {
							talObjectModifications[prop](object);
						}
					}
				}
				return object;
			};
		}
	};

	var tpm = function (userConfig) {
		if (userConfig && userConfig.server) {
			config.server = userConfig.server
		}

		statEvents.registerCallbacksForStatistics();
	} 

	window.tpm = tpm;
})(window, document);

window.tpm();
