import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

export default class DrawpadUI extends Plugin {
    init() {
        const editor = this.editor;

        editor.ui.componentFactory.add( 'drawpad', () => {
            const button = new ButtonView();
            button.label = 'drawpad';
            button.tooltip = true;
            button.withText = true;

            this.listenTo( button, 'execute', () => {
                const selection = editor.model.document.selection;
                const text = 'Drawpad Button clicked';

                // Change the model to insert the abbreviation.
                editor.model.change( writer => {
                    editor.model.insertContent(
                        // Create a text node with the abbreviation attribute.
                        writer.createText( text )
                    );
                } );
            } );

            return button;
        } );
    }
}
