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

        // Add a new model node "math-node"
        schema.register( 'math-node', {
            isObject:true,
            inheritAllFrom:'$inlineObject',
            // alloWhere:'$block',
            allowAttributes:['latex_code','src']
        } );
    }

    _defineConverters() {									
        const conversion = this.editor.conversion;
        
        // Conversion from a view element to a model attribute.
        conversion.for( 'upcast' ).elementToElement( {
            view: {
                name: 'img',
                classes:['math-field'],
                // attributes: ['src','latex_code']
            },
            model: ( viewElement, { writer: modelWriter } ) => {
                // Extract the "latex_code" property
                const latex_code = viewElement.getAttribute('latex_code');
                const src = viewElement.getAttribute('src');
                // console.log("upcast ma xu")
                const element = modelWriter.createElement( 'math-node',{'latex_code':latex_code,'src':src} )
                // modelWriter.appendText(name,element)
                return element;
            }
        } );

        // Conversion from a model attribute to a view element.
        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'math-node',
            // Callback function provides access to the model attribute value
            // and the DowncastWriter.
            view: ( modelItem, { writer: viewWriter } ) => {
                // console.log("hey! editing downcast");
                const latex_code = modelItem.getAttribute('latex_code');
                const src = modelItem.getAttribute('src');
                const src2 = "http://chart.apis.google.com/chart?cht=tx&chl=" + encodeURIComponent(latex_code);
                const element = viewWriter.createContainerElement('img',{'class':'math-field','latex_code':latex_code,'src':src2});
            

                return toWidget( element, viewWriter );
            }
        } );
        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'math-node',
            // Callback function provides access to the model attribute value
            // and the DowncastWriter.
            view: ( modelItem, { writer: viewWriter } ) => {
                // console.log("hey! data downcast");
                
                let latex_code = modelItem.getAttribute('latex_code')
                let src = modelItem.getAttribute('src')
                const element = viewWriter.createContainerElement('img',{'class':'math-field','latex_code':latex_code, 'src':src});

                // Enable widget handling on a placeholder element inside the editing view.
                return element;
            }
        } );


    }
}