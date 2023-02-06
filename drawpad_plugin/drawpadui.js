import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import { ContextualBalloon, clickOutsideHandler } from '@ckeditor/ckeditor5-ui';
import CanvasView from './drawpadview';
import './styles.css'

export default class DrawpadUI extends Plugin {

    static get requires() {
        return [ContextualBalloon];
    }

    init() {
        const editor = this.editor;

        this._balloon = this.editor.plugins.get(ContextualBalloon);
        this.canvasView = this._createCanvasView();

        editor.ui.componentFactory.add('drawpad', () => {
            const button = new ButtonView();
            button.label = 'drawpad';
            button.tooltip = true;
            button.withText = true;
            this.listenTo(button, 'execute', () => {
                this._showUI();
            });

            return button;
        });

    }

    _createCanvasView() {
        const editor = this.editor;
        const canvasView = new CanvasView(editor.locale);
        this.listenTo(canvasView, 'submit', () => {

            // var canvas_elm = document.getElementById('canvas-drawing_pad')
            // var image_64_url = canvas_elm.toDataURL().split(';base64,')[1]
            // var image_bin = window.atob(image_64_url);

            // console.log(image_64_url)
            //     // console.log(image_bin);

            // fetch("http://localhost:8000/image", {
            //         method: "POST",
            //         body: {
            //             image_64_url,
            //         })
            //     .then((response) => response.json())
            //     .then((data) => {
            //         console.log("Success:", data);
            //     })
            //     .catch((error) => {
            //         console.error("Error:", error);
            //     });


            //sending a request
            let request = new XMLHttpRequest();
            const url = ``; //url

            request.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    const response = JSON.parse(this.responseText);

                    console.log("response aayo ta", this.responseText);
                    // getElements(response);
                }
            };

            request.open("POST", url, true);
            request.send();

            const selection = editor.model.document.selection;
            const text = this.canvasView.strInputView.fieldView.element.value;

            // Change the model to insert the abbreviation.
            editor.model.change(writer => {
                editor.model.insertContent(
                    // Create a text node with the abbreviation attribute.
                    writer.createText(text)
                );
            });

            this._hideUI();
        }) this.listenTo(canvasView, 'cancel', () => {

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
        target = () => view.domConverter.viewRangeToDom(
            viewDocument.selection.getFirstRange()
        );

        return {
            target
        };
    }
    _showUI() {
        if (this._balloon.visibleView === this.canvasView) {
            this._hideUI();
        } else {
            this._balloon.add({
                view: this.canvasView,
                position: this._getBalloonPositionData()
            });
            this.canvasView.focus();
        }
    }
    _hideUI() {

        // Clear the input field values and reset the form.
        this.canvasView.strInputView.fieldView.value = '';
        this.canvasView.element.reset();

        this._balloon.remove(this.canvasView);

        // Focus the editing view after inserting the drawpad so the user can start typing the content
        // right away and keep the editor focused.
        this.editor.editing.view.focus();
    }
}