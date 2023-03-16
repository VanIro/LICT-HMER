import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";
import { ContextualBalloon, clickOutsideHandler } from "@ckeditor/ckeditor5-ui";
import DomEventObserver from '@ckeditor/ckeditor5-engine/src/view/observer/domeventobserver';

import CanvasView from "./drawpadview";
import MathNodeView from "./mathnodeview";
import "./styles.css";

import DrawpadCommand from "./drawpadcommand";

//when backend server is not active, use a dummy output as the response
//change this to false if backend server is running
const TESTMODE = true;
const BACKEND_URL = 'http://127.0.0.1:8000/process-image';

//Implements double click event for the editor to listen to
class DoubleClickObserver extends DomEventObserver {
	constructor( view ) {
		super( view );

		this.domEventType = 'dblclick';
	}

	onDomEvent( domEvent ) {
		this.fire( domEvent.type, domEvent );
	}
}

//Implements all the ui functionalities
export default class DrawpadUI extends Plugin {
  static get requires() {
    return [ContextualBalloon];
  }

  init() {
    const editor = this.editor;

    this._balloon = this.editor.plugins.get(ContextualBalloon);
    this.canvasView = this._createCanvasView();
    this._widgetBalloon = this.editor.plugins.get(ContextualBalloon);
    this.mathNodeView = this._createMathNodeView();

  //Add drawpad button to the toolbar
    editor.ui.componentFactory.add("drawpad", () => {
      const button = new ButtonView();
      button.label = "drawpad";
      button.tooltip = true;
      button.withText = true;
      this.listenTo(button, "execute", () => {
        this._showUI();
      });

      return button;
    });

    this.editor.commands.add( 'math_node', new DrawpadCommand( this.editor ) );

    const view = this.editor.editing.view;
    const viewDocument = view.document;
    //add double click event to the list of events observed by the editor for all components
    view.addObserver( DoubleClickObserver );

    //if math-node element triggers a double click event, show the ui for editing the equation
    this.editor.listenTo( viewDocument, 'dblclick', ( evt, data ) => {
        const modelElement = this.editor.editing.mapper.toModelElement( data.target);
        // console.log(data,data.target)

        if ( modelElement.name == 'math-node' ) {
            this._showWidgetUI(modelElement);
        }
    } );	

  }

   //implements the event handlers like submit, ESC key, clicking outside the equation editing ui
  _createMathNodeView() {
    const editor = this.editor;
    const mathNodeView = new MathNodeView(editor.locale);
    this.listenTo(mathNodeView, "submit", () => {
      let mathliv_code = mathNodeView.mathlivView.value
      // console.log(mathliv_code)

      if(mathliv_code.length>0){
        let elm = editor.model.document.selection.getSelectedElement();
        let newSrc = "http://chart.apis.google.com/chart?cht=tx&chl=" + encodeURIComponent(mathliv_code);
  
        editor.model.change( writer => {
          const range = editor.model.document.selection.getFirstRange();
          const  math_node = writer.createElement('math-node',{'latex_code':mathliv_code,src:newSrc});
          editor.model.insertObject( math_node, null, range, { setSelection: 'on' }  );
        } );
      }
      else{
        editor.model.change( writer => {
          const range = editor.model.document.selection.getFirstRange();
          editor.model.insertContent( writer.createText(''),range);
        } );
      }
      this._hideWidgetUI();
      // console.log("mathNodeView submit!");

    })
    this.listenTo(mathNodeView, 'cancel', () => {7
      // console.log("mathNodeView cancel!");
      this._hideWidgetUI();
    })

    // Hide the form view when clicking outside the balloon.
    clickOutsideHandler({
        emitter: mathNodeView,
        activator: () => this._widgetBalloon.visibleView === mathNodeView,
        contextElements: [this._widgetBalloon.view.element],
        callback: () => this._hideWidgetUI()
    });

    mathNodeView.keystrokes.set('Esc', (data, cancel) => {
        this._hideWidgetUI();
        cancel();
    })

    return mathNodeView;
  }

  //implements event handlers like submit, ESC key, clicking outside the drawpad ui
  _createCanvasView() {
    const editor = this.editor;
    const canvasView = new CanvasView(editor.locale);
    this.listenTo(canvasView, "submit", () => {
        // MathJax.typeset();
        var canvas_elm = document.getElementById('canvas-drawing_pad')
        var image_64 = canvas_elm.toDataURL().split('base64,')[1];
        // console.log(image_64)

        var data = {
            img_file:image_64
        }
        if(!TESTMODE)
        //sending a request
          fetch(BACKEND_URL,{
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                body: JSON.stringify(data)

            }).then((response)=>{
              return response.json();
            }).then((data)=>{
              console.log(data);
              // Change the model to insert the response.
              //insert a math-node

              editor.model.change(writer => {
                const math_node = writer.createElement('math-node',{'latex_code':data['message'],src:'dummy'});
                editor.model.insertObject( math_node, null, null, { setSelection: 'on' }  );
              });
          })
        else{
          //for testing purposes, data is a dummy response

          var canvas_elm = document.getElementById('canvas-drawing_pad')
          var image_64 = canvas_elm.toDataURL().split('base64,')[1];
          // console.log(canvas_elm.toDataURL())

          data = {
              message:'\\theta',
              img_file:canvas_elm.toDataURL()
          }
        
          //insert a math-node

          editor.model.change(writer => {
            const math_node = writer.createElement('math-node',{'latex_code':data['message'],src:data['img_file']});
            // writer.appendText(data['message'],math_node);
            editor.model.insertObject( math_node, null, null, { setSelection: 'on' }  );
          });
            this._hideUI();
        }
    })

    this.listenTo(canvasView, 'cancel', () => {
        var canvas_elm = document.getElementById('canvas-drawing_pad')
        const context = canvas_elm.getContext('2d');
        context.clearRect(0, 0, canvas_elm.width, canvas_elm.height);
        this._hideUI();
    })

    // Hide the form view when clicking outside the balloon.
    clickOutsideHandler({
        emitter: canvasView,
        activator: () => this._balloon.visibleView === canvasView,
        contextElements: [this._balloon.view.element],
        callback: () => this._hideUI()
    });

    canvasView.keystrokes.set('Esc', (data, cancel) => {
        this._hideUI();
        cancel();
    })

    return canvasView;
  }
  _getBalloonPositionData() {
    const view = this.editor.editing.view;
    const viewDocument = view.document;
    let target = null;

    // Set a target position by converting view selection range to DOM.
    target = () =>
      view.domConverter.viewRangeToDom(viewDocument.selection.getFirstRange());

    return {
      target,
    };
  }
  _showWidgetUI(modelElement){
    let latex_code = "\\frac{\\sum_{i=1}^{7}f(i)}{2d+\\Gamma}"
    if (modelElement){
      latex_code = modelElement.getAttribute('latex_code')
    }
    // this.mathNodeView.latex_code = latex_code
    this._widgetBalloon.add({
      view: this.mathNodeView,
      position: this._getBalloonPositionData(),
    });
    
    this.mathNodeView.strInputView.fieldView.value=latex_code
    this.mathNodeView.mathlivView.value=latex_code
    
    this.mathNodeView.mathlivView.onkeyup = (arg)=>{
      // console.log('Changed mathliv',arg,this.mathNodeView.mathlivView.value)
      this.mathNodeView.strInputView.fieldView.value=this.mathNodeView.mathlivView.value;
    };
    this.mathNodeView.strInputView.fieldView.element.onkeyup=(arg)=>{
      // console.log('Changed strInput',this.mathNodeView.strInputView.fieldView.element.value)
      this.mathNodeView.mathlivView.value = this.mathNodeView.strInputView.fieldView.element.value
    }

    this.mathNodeView.focus();
  }
  _hideWidgetUI(view) {
    
    // this.mathNodeView.strInputView.fieldView.element.reset();

    this._widgetBalloon.remove(this.mathNodeView);

    // Focus the editing view after inserting the drawpad so the user can start typing the content
    // right away and keep the editor focused.
    this.editor.editing.view.focus();
  }
  _showUI() {
    if (this._balloon.visibleView === this.canvasView) {
      this._hideUI();
    } else {
      this._balloon.add({
        view: this.canvasView,
        position: this._getBalloonPositionData(),
      });
      this.canvasView.focus();
    }
  }
  _hideUI() {
    // Reset the form.
    
    this.canvasView.element.reset();

    this._balloon.remove(this.canvasView);

    // Focus the editing view after inserting the drawpad so the user can start typing the content
    // right away and keep the editor focused.
    this.editor.editing.view.focus();
  }
}
