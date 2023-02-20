/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class AbbreviationEditing extends Plugin {
	init() {
		this._defineSchema();
		this._defineConverters();
	}
	_defineSchema() {
		const schema = this.editor.model.schema;

    	// Extend the text node's schema to accept the abbreviation attribute.
		schema.extend( '$text', {
			allowAttributes: [ 'math-node' ]
		} );
	}
	_defineConverters() {
		const conversion = this.editor.conversion;
		
		//the converters are only mapping the attributes, the actual contents of the nodes are not changed

        // Conversion from a model attribute to a view element
		conversion.for( 'downcast' ).attributeToElement( {
			model: 'math-node',
			
            // Callback function provides access to the model attribute value
			// and the DowncastWriter
			view: ( modelAttributeValue, conversionApi ) => {
				const { writer } = conversionApi;
				return writer.createAttributeElement( 'math-field');
			}
		} );
		

		// Conversion from a view element to a model attribute
		conversion.for( 'upcast' ).elementToAttribute( {
			view: {
				name: 'math-field', //name of the tag
			},
			model: {
				key: 'math-field', //extended attribute to $text model - 
										//the model isn't specified here but it is specified when inserting, at abbreviationui
										// So, this means => model must already have been created, and won't be created from a view. 

                // Callback function provides access to the view element
				value: true //viewElement => {
				// 	const title = viewElement.getAttribute( 'title' );
				// 	return title;
				// }
			}
		} );
	}
}