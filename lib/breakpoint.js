(function () {
	'use strict';

	/**
	 * Add a new breakpoint
	 *
	 * @param  {string}   query - The media query for this breakpoint
	 * @param  {object}   config - Configuration object
	 * @param  {function} config.first_enter - Will execute the FIRST TIME the query matches.
	 * @param  {function} config.enter - Will execute everytime the query starts matching.
	 * @param  {function} config.exit - Will execute everytime the query stops matching, provided is has matched before.
	 *
	 * The purpose of the config.exit method is to undo changes made in the
	 * first_enter and enter methods.
	 */
	window.breakpoint = function (query, config) {
		var mql = window.matchMedia(query);
		var has_run = false;

		mql.addListener(handle);
		handle(mql);

		function handle (mql) {
			if (mql.matches) {
				if (typeof config.first_enter === 'function') {
					try {
						config.first_enter.apply(config);
					} catch (e) {}

					// As this function is only meant to run once, remove it now.
					delete config.first_enter;
				}

				if (typeof config.enter === 'function') {
					try {
						config.enter.apply(config);
					} catch (e) {}
				}

				has_run = true;
			}
			else {
				if (typeof config.exit === 'function' && has_run) {
					try {
						config.exit.apply(config);
					} catch (e) {}
				}
			}
		}
	}
}())
