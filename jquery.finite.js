/*!
 * jQuery Finite
 *
 * Allows customizing the navigation experience of the Jetpack Infinite Scroll
 * module. A typical use-case would be adding a loading indicator.
 *
 * Copyright 2014, Pixel Union - http://pixelunion.net
 * Released under the MIT license
 */
(function($){
  var Loader = function(el, options) {
    this.handle = $(el);
    this.body = $(document.body);

    // Options

    this.options = $.extend({
      progressInterval: 500,
      progressFunction: null
    }, options);

    // State

    this.loading = false;
    this.interval = null;
    this.percent = 0;
    this.endFired = false;

    // Events

    this.handle.on("click", $.proxy(this.onFetch, this));
    this.body.on("post-load", $.proxy(this.onPostLoad, this));
    this.body.on("infinite-scroll-posts-end", $.proxy(this.onEnd, this));
  };

  // Jetpack has started loading new posts.
  Loader.prototype.onFetch = function(){
    if (this.loading) {
      return;
    }

    this.loading = true;
    this.endFired = false;
    this.handle.trigger("finite-fetch");

    this.onProgress();

    var _this = this;
    this.interval = setInterval(function(){
      _this.onProgress();
    }, this.options.progressInterval);
  };

  // Still waiting for new posts to load.
  Loader.prototype.onProgress = function(){
    var isDone = !this.loading || this.body.hasClass("infinity-end");

    // Trigger progress event
    var nextPercentage = 0;

    if (isDone) {
      nextPercentage = 100;
    } else {
      nextPercentage = (this.options.progressFunction)
        ? this.options.progressFunction()
        : this.nextPercentage();
    }

    this.handle.trigger("finite-progress", [nextPercentage]);

    // Done loading, call the load event
    if (isDone) {
      clearInterval(this.interval);
      this.percent = 0;

      var _this = this;
      setTimeout(function(){
        _this.onLoad();
      }, this.options.progressInterval / 2);
    }
  };

  // New posts have loaded. Signal our progess handler to complete.
  Loader.prototype.onPostLoad = function(){
    this.loading = false;
  };

  // Progress handler is complete.
  Loader.prototype.onLoad = function(){
    this.handle.trigger("finite-load");

    if (this.body.hasClass("infinity-end")) {
      this.onEnd();
    }
  };

  // Detected that there are no more posts to load.
  Loader.prototype.onEnd = function(){
    if (this.endFired) {
      return;
    }

    this.loading = false;
    this.endFired = true;
    this.handle.trigger("finite-end");
  };

  // Calculate the next random percentage.
  Loader.prototype.nextPercentage = function(){
    return this.percent = Math.floor(Math.random() * (100 - this.percent)) + this.percent;
  };

  // jQuery plugin.
  $.fn.finite = function(options){
    return this.each(function(){
      new Loader(this, options);
    });
  };
})(jQuery);
