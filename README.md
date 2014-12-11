# jquery.finite

Allows customizing the navigation experience of the Jetpack Infinite Scroll
module. A typical use-case would be adding a loading indicator.

## Usage

Finite allows you to listen for 4 simple events:

```js
var el = $("#infinite-handle");

el.finite();

el.on("finite-fetch", function(e){
  // Triggered when new posts are being fetched
});

el.on("finite-progress", function(e, percentage){
  // Triggered every progressInterval with a new percentage
});

el.on("finite-load", function(e){
  // Triggered after new posts are loaded and added to the page
});

el.on("finite-end", function(e){
  // Triggered when no more posts can be loaded
});
```

## Options

`progressInterval` — How often the fake progress events are fired in
milliseconds. Defaults to `500`.

`progressFunction` — Used to generate percentages for the `finite-progress`
events. Default implementation generates random increasing percentages.

```js
var percent = 0;

el.finite({
  progressInterval: 50,
  progressFunction: function(){
    return percent = Math.min(percent + 10, 100);
  }
});
```

## Example

http://codepen.io/anon/pen/zxqKjx
