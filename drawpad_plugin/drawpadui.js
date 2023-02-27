import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";
import { ContextualBalloon, clickOutsideHandler } from "@ckeditor/ckeditor5-ui";
import DomEventObserver from '@ckeditor/ckeditor5-engine/src/view/observer/domeventobserver';

import CanvasView from "./drawpadview";
import MathNodeView from "./mathnodeview";
import "./styles.css";

import DrawpadCommand from "./drawpadcommand";

class DoubleClickObserver extends DomEventObserver {
	constructor( view ) {
		super( view );

		this.domEventType = 'dblclick';
	}

	onDomEvent( domEvent ) {
		this.fire( domEvent.type, domEvent );
	}
}

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

    view.addObserver( DoubleClickObserver );

    this.editor.listenTo( viewDocument, 'dblclick', ( evt, data ) => {
        const modelElement = this.editor.editing.mapper.toModelElement( data.target);

        if ( modelElement.name == 'math-node' ) {
            this._showWidgetUI(modelElement);
        }
    } );	

  }

  _createMathNodeView() {
    const editor = this.editor;
    const mathNodeView = new MathNodeView(editor.locale);
    this.listenTo(mathNodeView, "submit", () => {
            console.log("mathNodeView submit!");
    })
    this.listenTo(mathNodeView, 'cancel', () => {7
      console.log("mathNodeView cancel!");
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

  _createCanvasView() {
    const editor = this.editor;
    const canvasView = new CanvasView(editor.locale);
    this.listenTo(canvasView, "submit", () => {

            var canvas_elm = document.getElementById('canvas-drawing_pad')
            var image_64 = canvas_elm.toDataURL().split('base64,')[1];
            // console.log(image_64)

            var data = {
                img_file:image_64
            }
            //sending a request

          // fetch('http://127.0.0.1:8000/process-image',{
          //       method:'POST',
          //       headers: {
          //           'Content-Type': 'application/json'
          //           // 'Content-Type': 'application/x-www-form-urlencoded',
          //           },
          //       body: JSON.stringify(data)

          //   }).then((response)=>{
          //     return response.json();
          //   }).then((data)=>{
          //     console.log(data);
          //     // Change the model to insert the response.
          //     //insert a math-node
          //     editor.model.change( writer => {
          //       editor.model.insertContent( writer.createText( data['message'], { 'math-node': 'math-node' } ) );
          //     } );
          //     // editor.model.change(writer => {
          //     //     editor.model.insertContent( writer.createText( data['message'], { 'math-node':true} ) );
          //     // });
          //     // insert plain text
          //     // editor.model.change( writer => {
          //     //       editor.model.insertContent( writer.createText( data['message'] ) );
          //     // });
          // })

          //for testing purposes, data is a dummy response
          var canvas_elm = document.getElementById('canvas-drawing_pad')
          var image_64 = canvas_elm.toDataURL().split('base64,')[1];
          console.log(canvas_elm.toDataURL())

          data = {
              message:'\\theta',
              img_file:canvas_elm.toDataURL()
          }
        
          //insert a math-node

          // editor.model.change( writer => {
          //   let math_node = writer.createElement('mathtex-inline',{equation:"hey",type:'span',display:'false'});
          //   // writer.appendText(data['message'],math_node);
          //   editor.model.insertContent( math_node);
          //   // editor.model.insertContent( writer.createText( data['message'], { 'math-node': 'math-node' } ) );
          // } );

          editor.model.change(writer => {
            const math_node = writer.createElement('math-node',{'latex_code':data['message'],src:data['img_file']});
            // writer.appendText(data['message'],math_node);
            editor.model.insertObject( math_node, null, null, { setSelection: 'on' }  );
            console.log("hey yall!");
          });
          // insert plain text
          // editor.model.change( writer => {
            //       editor.model.insertContent( writer.createText( data['message'] ) );
            // });
            
            // const selection = editor.model.document.selection;
            // const text = this.canvasView.strInputView.fieldView.element.value;
            
            console.log("hey!");
            this._hideUI();
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
    this._widgetBalloon.add({
      view: this.mathNodeView,
      position: this._getBalloonPositionData(),
    });
    this.mathNodeView.mathlivView.innerHTML=latex_code
    // console.log(this.mathNodeView.fieldView.element);
    console.log(this.mathNodeView.strInputView.element.querySelector('input'));
    // this.mathNodeView.strInputView.element.querySelector('input').value = latex_code;
    this.mathNodeView.strInputView.fieldView.value=latex_code
    this.mathNodeView.focus();
  }
  _hideWidgetUI(view) {
    // Clear the input field values and reset the form.
    // this.canvasView.strInputView.fieldView.value = "";
    // this.canvasView.element.reset();

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
    // Clear the input field values and reset the form.
    this.canvasView.strInputView.fieldView.value = "";
    this.canvasView.element.reset();

    this._balloon.remove(this.canvasView);

    // Focus the editing view after inserting the drawpad so the user can start typing the content
    // right away and keep the editor focused.
    this.editor.editing.view.focus();
  }
}
