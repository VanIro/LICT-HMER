import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";
import { ContextualBalloon, clickOutsideHandler } from "@ckeditor/ckeditor5-ui";
import CanvasView from "./drawpadview";
import "./styles.css";

import DrawpadCommand from "./drawpadcommand";

export default class DrawpadUI extends Plugin {
  static get requires() {
    return [ContextualBalloon];
  }

  init() {
    const editor = this.editor;

    this._balloon = this.editor.plugins.get(ContextualBalloon);
    this.canvasView = this._createCanvasView();

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

          //fetch('http://127.0.0.1:8000/process-image',{
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
          //     editor.model.change(writer => {
          //         editor.model.insertContent( writer.createText( data['message'], { 'math-node':true} ) );
          //     });
          //     // insert plain text
          //     // editor.model.change( writer => {
          //     //       editor.model.insertContent( writer.createText( data['message'] ) );
          //     // });
          // })

          //for testing purposes, data is a dummy response

          data={message:'\\theta'}
          //insert a math-node
          editor.model.change(writer => {
            const math_node = writer.createElement('math-node');
            writer.appendText(data['message'],math_node);
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
