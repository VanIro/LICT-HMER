import {
    View,
    LabeledFieldView,
    createLabeledInputText,
    InputTextView,
    ButtonView,
    submitHandler,
    Template,
} from '@ckeditor/ckeditor5-ui';

import { KeystrokeHandler } from '@ckeditor/ckeditor5-utils';

import { icons } from '@ckeditor/ckeditor5-core';

export default class MathNodeView extends View {
    constructor(locale) {
        super(locale);
        this.keystrokes = new KeystrokeHandler();
        //TODO: Remove this input field
        this.strInputView = this._createInput('Latex Code');
        this.mathlivView = this.get_mathliv_element();

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
                this.mathlivView,
                ...this.childViews
            ],
        });
    }    
    get_mathliv_element() {
        const math_el = document.createElement('math-field');
        math_el.innerHTML ="\\alpha"// "<math-field>\\alpha</math-field>"
        return math_el;
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
        // const labeledInput = new LabeledFieldView(this.locale, ( labeledFieldView, viewUid, statusUid ) => {
        //     const inputView = new InputTextView( labeledFieldView.locale );
        
        //     inputView.set( {
        //         id: viewUid,
        //         ariaDescribedById: statusUid
        //     } );
        
        //     // inputView.bind( 'isReadOnly' ).to( labeledFieldView, 'isEnabled', value => !value );
        //     // inputView.bind( 'hasError' ).to( labeledFieldView, 'errorText', value => !!value );
        
        //     return inputView;
        // } );

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