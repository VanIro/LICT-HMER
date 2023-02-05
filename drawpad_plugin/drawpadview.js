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
    constructor( locale ) {
        super( locale );
        
        this.keystrokes = new KeystrokeHandler();
        
        this.strInputView = this._createInput( 'Add text' );
        
        
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
        this.cancelButtonView.delegate( 'execute' ).to( this, 'cancel' );
        
        this.childViews = this.createCollection( [
            this.strInputView,
            this.saveButtonView,
            this.cancelButtonView,
        ] );
        this.setTemplate( {
            tag: 'form',
            attributes: {
                class: [ 'ck', 'ck-abbr-form' ],
                tabindex: '-1'
            },
            children:[
                this.getHTML_Canvas(),
                ...this.childViews,
                get_test_element()
            ],
        } );
    }
    getHTML_Canvas(){
        const canvas = document.createElement( 'canvas' );
        canvas.setAttribute( 'width', '400' );
        canvas.setAttribute( 'height', '400' );
        canvas.setAttribute( 'style', 'border: 1px solid #ddd' );

        const ctx = canvas.getContext( '2d' );
        ctx.fillStyle = '#fff';
        ctx.fillRect( 0, 0, 400, 400 );

        canvas.addEventListener( 'mousedown', ( e ) => {
            ctx.beginPath();
            ctx.moveTo( e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop );
        } );

        canvas.addEventListener( 'mouseup', ( e ) => {
            ctx.lineTo( e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop );
            ctx.stroke();
        } );

        return canvas;
    }
    get_test_element(){
        const button = document.createElement( 'button' );
        button.onclick=()=>console.log("Clicked")
        return button;
    }
    render() {
        super.render();

        // Submit the form when the user clicked the save button
        // or pressed enter in the input.
        submitHandler( {
            view: this
        } );

        this.keystrokes.listenTo(this.element);
    }
    focus() {
        this.childViews.first.focus();
    }

    _createInput( label ) {
        const labeledInput = new LabeledFieldView( this.locale, createLabeledInputText );

        labeledInput.label = label;

        return labeledInput;
    }
    _createButton( label, icon, className ) {
        const button = new ButtonView();

        button.set( {
            label,
            icon,
            tooltip: true,
            class: className
        } );

        return button;
    }


}
