# LICT-HMER

The objective is to make a drawpad integrated in a rich text editor for easily including mathematical expressions in documents.

## Commands
- Install necessary packages 
  - `npm install`
- Run in development mode, with hot reload
  - `npm run start:dev` or `npm run dev` 
- Build the bundled file
  - `npm run build`

## Documentation
- `drawpad_plugin` folder contains the plugin that we have implemented. 
- `drawpadview.js` and `mathnodeview.js` implement the ui used for drawpad and editing features.
- `drawpadediting.js` implements the mathnode model that internally represents the equation widget, and its upcast and downcast converters that 
  handle its view and data representations.
- `drawpadcommand.js` implements some important functions for the drawpad plugin.
- `drawpadui.js` uses DrawpadView and MathnodeView to implement all ui features and functionalities.
- `drawpad.js` combines all the plugin components together.

= `app.js` integrates the drawpad plugin into ckeditor5.
