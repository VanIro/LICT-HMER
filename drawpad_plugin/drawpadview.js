import {
    View,
    LabeledFieldView,
    createLabeledInputText,
    ButtonView,
    submitHandler,
    Template,
} from '@ckeditor/ckeditor5-ui';

import { KeystrokeHandler } from '@ckeditor/ckeditor5-utils';

import { icons } from '@ckeditor/ckeditor5-core';

export default class CanvasView extends View {
    constructor(locale) {
        super(locale);
        this.keystrokes = new KeystrokeHandler();
        //TODO: Remove this input field
        this.strInputView = this._createInput('Add text');

        // Create the save and cancel buttons.
        this.saveButtonView = this._createButton(
            'Save', icons.check, 'ck-button-save'
        );
        // Set the type to 'submit', which will trigger
        // the submit event on entire form when clicked.
        this.saveButtonView.type = 'submit';

        this.cancelButtonView = this._createButton(
            'Cancel', icons.cancel, 'ck-button-cancel'
        );
        // Delegate ButtonView#execute to FormView#cancel.
        this.cancelButtonView.delegate('execute').to(this, 'cancel');

        this.childViews = this.createCollection([
            this.strInputView,
            this.saveButtonView,
            this.cancelButtonView,
        ]);
        this.setTemplate({
            tag: 'form',
            attributes: {
                class: ['ck', 'ck-abbr-form'],
                tabindex: '-1',
                'text-align': 'center',
            },
            children: [
                this.getHTML_Canvas(),
                ...this.childViews
            ],
        });
    }
    getHTML_Canvas() {
        const canvas = document.createElement('canvas');
        canvas.setAttribute('width', '500');
        canvas.setAttribute('height', '200');
        canvas.setAttribute('style', 'border: solid ');
        canvas.setAttribute('id', 'canvas-drawing_pad');
        canvas.setAttribute('margin', '20px');

        const ctx = canvas.getContext('2d');


        let isPainting = false;
        let lineWidth = 2;
        let startX;
        let startY;

        const draw = (e) => {
            if (!isPainting) {
                return;
            }

            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';
            var canvas_elm = document.getElementById('canvas-drawing_pad')

            var canvas_elm_par = document.getElementById('canvas-drawing_pad').offsetParent
            const canvasOffsetX = canvas_elm_par.offsetLeft + canvas_elm.offsetLeft;
            const canvasOffsetY = canvas_elm_par.offsetTop + canvas_elm.offsetTop;

            ctx.lineTo(e.clientX - canvasOffsetX, e.clientY - canvasOffsetY);

            ctx.stroke();
        }

        canvas.addEventListener('mousedown', (e) => {
            isPainting = true;
            startX = e.clientX;
            startY = e.clientY;
        });

        canvas.addEventListener('mouseup', e => {
            isPainting = false;
            ctx.stroke();
            ctx.beginPath();
        });

        canvas.addEventListener('mousemove', draw);

        return canvas;
    }
    get_test_element() {
        const button = document.createElement('button');
        button.onclick = () => console.log("Clicked")
        return button;
    }
    render() {
        super.render();

        // Submit the form when the user clicked the save button
        // or pressed enter in the input.
        submitHandler({
            view: this
        });

        this.keystrokes.listenTo(this.element);
    }
    focus() {
        this.childViews.first.focus();
    }
    _createInput(label) {
        const labeledInput = new LabeledFieldView(this.locale, createLabeledInputText);

        labeledInput.label = label;

        return labeledInput;
    }
    _createButton(label, icon, className) {
        const button = new ButtonView();

        button.set({
            label,
            icon,
            tooltip: true,
            class: className
        });

        return button;
    }


}