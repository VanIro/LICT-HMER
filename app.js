// app.js

// import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
// import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
// import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
// import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
// import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';

// import MathType from '@wiris/mathtype-ckeditor5/src/plugin';

// ClassicEditor
//     .create( document.querySelector( '#editor' ), {
//         plugins: [ Essentials, Paragraph, Bold, Italic,MathType ],
//         toolbar: [ 'bold', 'italic','|','MathType','ChemType' ]
//     } )
//     .then( editor => {
//         console.log( 'Editor was initialized', editor );
//     } )
//     .catch( error => {
//         console.error( error.stack );
//     } );

/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* globals window, document, console */

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import ArticlePluginSet from '@ckeditor/ckeditor5-core/tests/_utils/articlepluginset';
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices';
import MathType from '@wiris/mathtype-ckeditor5/src/plugin';
import { CS_CONFIG } from '@ckeditor/ckeditor5-cloud-services/tests/_utils/cloud-services-config';

// import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
// import Image from '@ckeditor/ckeditor5-image/src/image';
// import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import Button from '@ckeditor/ckeditor5-ui/src/button/button';
import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';

const DrawPadCommand = ( editor ) => {
    const model = editor.model;
    const doc = model.document;

    const drawPad = model.createElement( 'drawPad' );
    model.insertContent( drawPad, doc.selection );

    toWidget( drawPad, editor );
    model.setSelection( drawPad, 'on' );
};

const DrawPadView = ( editor ) => {
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
};


ClassicEditor
	.create( document.querySelector( '#mathtype-editor' ), {
		plugins: [
			ArticlePluginSet,
			EasyImage,
			ImageUpload,
			CloudServices,
			MathType
		],
		toolbar: {
			items: [
				'heading',
				'|',
				'bold',
				'italic',
				'bulletedList',
				'numberedList',
				'|',
				'outdent',
				'indent',
				'|',
				'MathType',
				'ChemType',
				'|',
                ,'drawPad',
                '|',
				'blockQuote',
				'link',
				'mediaEmbed',
				'insertTable',
				'|',
				'undo',
				'redo'
			]
		},
		image: {
			toolbar: [
				'imageStyle:inline',
				'imageStyle:wrapText',
				'imageStyle:breakText',
				'|',
				'toggleImageCaption',
				'imageTextAlternative'
			]
		},
		table: {
			contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ]
		},
		cloudServices: CS_CONFIG
	} )
    .then( ( editor ) => {
        editor.ui.componentFactory.add( 'drawPad', ( locale ) => {
            const button = new Button( locale );

            button.set( {
                label: 'Draw',
                command: 'drawPad'
            } );

            button.on( 'execute', () => {
                DrawPadCommand( editor );
            } );

            return button;
        } );

        editor.ui.add( 'drawPad', {
            view: DrawPadView,
            position: 'top'
        } );
        editor.ui.toolbar.addItems( [ 'drawPad' ] );
    } )

	.then( editor => {
		window.editor = editor;

		window.attachTourBalloon( {
			target: window.findToolbarItem( editor.ui.view.toolbar,
				item => item.label && item.label === 'Insert a math equation - MathType' ),
			text: 'Click to insert mathematical or chemical formulas.',
			editor
		} );
	} )
	.catch( err => {
		console.error( err.stack );
	} );