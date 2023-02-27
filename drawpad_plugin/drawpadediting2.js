import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import { toWidget, toWidgetEditable } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

export default class DrawpadEditing extends Plugin {
    static get requires() {
        return [ Widget ];
    }
    init() {
        this._defineSchema();	
        this._defineConverters();								
    }

    _defineSchema() {											
        const schema = this.editor.model.schema;

        // Extend the text node's schema to accept the math-field attribute.
        schema.register( 'math-node', {
            // allowIn:'$root',
            inheritAllFrom:'$inlineObject'
        } );
    }

    _defineConverters() {									
        const conversion = this.editor.conversion;
        
        // Conversion from a view element to a model attribute.
        conversion.for( 'upcast' ).elementToElement( {
            view: {
                name: 'math-field',
                attributes: ['role']//'style' , 'role', 'dir', 'aria-label', 'contenteditable','aria-multiline', 'tabindex' ]
            },
            model: ( viewElement, { writer: modelWriter } ) => {
                const name = viewElement.getChild( 0 ).data;
                console.log("upcast ma xu",name)
                const element = modelWriter.createElement( 'math-node',{'latex_code':name} )
                modelWriter.appendText(name,element)
                return element;
            }
        } );

        // Conversion from a model attribute to a view element.
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'math-node',
            // Callback function provides access to the model attribute value
            // and the DowncastWriter.
            view: ( modelItem, { writer: viewWriter } ) => {
                console.log("hey! editing downcast");
                // const element = viewWriter.createEditableElement('math-field');
                const element = viewWriter.createEditableElement('math-field',{
                    style: 'width:max-content', 
                    role:"math", 
                    dir:"ltr",
                    'aria-label':"math input field",
                    contenteditable:"true",
                    'aria-multiline':"false",
                    tabindex:"0"
                })
                
                
                // Enable widget handling on a placeholder element inside the editing view.
                return toWidget( element, viewWriter );
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'math-node',
            // Callback function provides access to the model attribute value
            // and the DowncastWriter.
            view: ( modelItem, { writer: viewWriter } ) => {
                console.log("hey! data downcast");
                const element = viewWriter.createElement('math-field')
                // const element = viewWriter.createElement('math-field',{
                //     // style: 'width:max-content', 
                //     role:"math", 
                //     dir:"ltr",
                //     'aria-label':"math input field",
                //     contenteditable:"true",
                //     'aria-multiline':"false",
                //     tabindex:"0"
                // })

                // Enable widget handling on a placeholder element inside the editing view.
                return element;//toWidget( widgetElement, viewWriter );
            }
        } );


    }
}