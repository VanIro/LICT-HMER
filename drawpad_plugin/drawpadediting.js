import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class DrawpadEditing extends Plugin {
    init() {
        this._defineSchema();	
        console.log('init of editing...');								
    }

    _defineSchema() {											
        const schema = this.editor.model.schema;

        // Extend the text node's schema to accept the math-field attribute.
        schema.register( 'math-node', {
            allowAttributes: [ 'math-field' ]
        } );
    }

    _defineConverters() {									
        const conversion = this.editor.conversion;

        // Conversion from a model attribute to a view element.
        conversion.for( 'downcast' ).attributeToElement( {
            model: 'math-node',
            // Callback function provides access to the model attribute value
            // and the DowncastWriter.
            view: ( modelAttributeValue, conversionApi ) => {
                const { writer } = conversionApi;

                return writer.createAttributeElement( 'math-field', 
                    // {title: modelAttributeValue} 
                );
            }
        } );

        // Conversion from a view element to a model attribute.
        conversion.for( 'upcast' ).elementToAttribute( {
            view: {
                name: 'math-field',
                // attributes: [ 'title' ]
            },
            model: {
                key: 'math-node',
                // Callback function provides access to the view element.
                value: viewElement => {
                    // const title = viewElement.getAttribute( 'title' );
                    // return title;
                    return "hello-vai";
                }
            }
        } );

    }
}