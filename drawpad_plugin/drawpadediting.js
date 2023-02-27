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
                // attributes: ['src','latex_code']//'style' , 'role', 'dir', 'aria-label', 'contenteditable','aria-multiline', 'tabindex' ]
            },
            model: ( viewElement, { writer: modelWriter } ) => {
                // Extract the "name" from "{name}".
                // const name = viewElement.getChild( 0 ).data;
                const latex_code = viewElement.getAttribute('latex_code');
                const src = viewElement.getAttribute('src');
                console.log("upcast ma xu")
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
                console.log("hey! editing downcast");
                const latex_code = modelItem.getAttribute('latex_code');
                const src = modelItem.getAttribute('src');
                // const element = viewWriter.createEditableElement('math-field');
                // const container = viewWriter.createContainerElement('span',{'class':'math-field-cont'});
                const src2 = "http://chart.apis.google.com/chart?cht=tx&chl=" + encodeURIComponent(latex_code);
                const element = viewWriter.createContainerElement('img',{'class':'math-field','latex_code':latex_code,'src':src2});
                // const element = viewWriter.createContainerElement('span',{'class':'math-field',id:'math-field-disp','latex_code':latex_code,'src':src});
                // const mathelm = viewWriter.createText('\\('+ latex_code +'\\)')
                // viewWriter.insert( viewWriter.createPositionAt( element, 0 ), mathelm )
                // console.log(element)
                // MathJax.typeset();
                // var math = MathJax.typeset([mathelm.document])//.Hub.getAllJax("math-field-disp")[0];
                // console.log(math)
                // MathJax.Hub.Queue(["Text",math,latex_code]);
                // viewWriter.insert( viewWriter.createPositionAt( container, 1 ), mathelm )
                // const math_element = viewWriter.createContainerElement('math-field',{
                //     style: 'width:max-content', 
                //     // role:"math", 
                //     // dir:"ltr",
                //     // 'aria-label':"math input field",
                //     // contenteditable:"false",
                //     // 'aria-multiline':"false",
                //     // tabindex:"0"
                // })
                // viewWriter.insert( viewWriter.createPositionAt( element, 0 ), math_element );
                // console.log("editingDowncast",modelItem.getChild(0).data)
                // const innerText = viewWriter.createText( modelItem.getAttribute('latex_code') );
                // viewWriter.insert( viewWriter.createPositionAt( math_element, 0 ), innerText );
                
                // const container_element = viewWriter.createContainerElement( 'span', {
                    // class: 'product',
                    // 'data-id': id
                // } );
                // const element = viewWriter.createRawElement( 'math-field', 
                //     {
                //         style: 'width:max-content', 
                //         role:"math", 
                //         dir:"ltr",
                //         'aria-label':"math input field",
                //         contenteditable:"true",
                //         'aria-multiline':"false",
                //         tabindex:"0"
                //     }, function( domElement ) {
                //         domElement.innerHTML = '\\alpha';
                    
                //         return domElement;
                //     } 
                // );

                // viewWriter.insert( viewWriter.createPositionAt( container_element, 0 ), element );
                
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
                // const element = viewWriter.createEditableElement('div')
                // const element = viewWriter.createElement('math-field',{
                //     // style: 'width:max-content', 
                //     role:"math", 
                //     dir:"ltr",
                //     'aria-label':"math input field",
                //     contenteditable:"true",
                //     'aria-multiline':"false",
                //     tabindex:"0"
                // })
                let latex_code = modelItem.getAttribute('latex_code')
                let src = modelItem.getAttribute('src')
                const element = viewWriter.createContainerElement('img',{'class':'math-field','latex_code':latex_code, 'src':src});
                // const innerText = viewWriter.createText( latex_code );
                // viewWriter.insert( viewWriter.createPositionAt( element, 0 ), innerText );

                // Enable widget handling on a placeholder element inside the editing view.
                return element;//toWidget( widgetElement, viewWriter );
            }
        } );


    }
}