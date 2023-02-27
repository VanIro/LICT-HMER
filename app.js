// app.js

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import CloudServices from '@ckeditor/ckeditor5-cloud-services/src/cloudservices';
import MathType from '@wiris/mathtype-ckeditor5/src/plugin';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import List from '@ckeditor/ckeditor5-list/src/list';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';

import Drawpad from './drawpad_plugin/drawpad'
import Abbreviation from './abbreviation/abbreviation'
// import SimpleBox from './boxplugin/simplebox';

// import Mathematics from 'ckeditor5-math/src/math';

import CKEditorInspector from '@ckeditor/ckeditor5-inspector'; 


ClassicEditor
	.create(document.querySelector('#mathtype-editor'), {
		plugins: [
			// Mathematics,
			Essentials, Paragraph, Heading, List, Bold, Italic,
			EasyImage,
			ImageUpload,
			CloudServices,
			MathType,
			Drawpad,
			Abbreviation,
			// SimpleBox
		],
		toolbar: {
			items: [
				'heading',
				'|',
				'drawpad',
				'abbreviation',
				'simpleBox',
				'|',
				'bold',
				'italic',
				'bulletedList',
				'numberedList',
				'|',
				// 'outdent',
				// 'indent',
				// '|',
				// 'MathType',
				// 'ChemType',
				// 'blockQuote',
				// 'link',
				// 'mediaEmbed',
				// 'insertTable',
				// '|',
				'undo',
				'redo'
			]
		},
		// image: {
		// 	toolbar: [
		// 		'imageStyle:inline',
		// 		'imageStyle:wrapText',
		// 		'imageStyle:breakText',
		// 		'|',
		// 		'toggleImageCaption',
		// 		'imageTextAlternative'
		// 	]
		// },
		table: {
			contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
		},
	})
	.then((editor)=>{
		
		// console.log( 'Editor was initialized', editor );

		CKEditorInspector.attach( 'editor', editor );

		window.editor = editor;
		// return editor;
	})
	.catch(err => {
		console.error(err.stack);
	});