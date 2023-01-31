import Plugin from '@ckeditor/ckeditor5-core/src/plugin'

// Define the plugin.
class DrawPad extends Plugin {
    static get requires() {
        return [ Dialog, CanvasUI ];
    }

    init() {
        const editor = this.editor;

        // Add the command for the button.
        editor.commands.add( 'drawPad', new DrawPadCommand( editor ) );

        // Add the button to the toolbar.
        editor.ui.componentFactory.add( 'drawPad', locale => {
            const button = new ButtonView( locale );

            button.set( {
                label: 'Draw Pad',
                command: 'drawPad',
                toolbar: 'insert'
            } );

            return button;
        } );

        // Define the dialog box.
        editor.dialogs.add( 'drawPad', dialogDefinition );
    }
}

// Define the command for the button.
class DrawPadCommand extends Command {
    execute() {
        this.editor.execute( 'drawPad' );
        this.editor.openDialog( 'drawPad' );
    }

    refresh() {
        const model = this.editor.model;
        this.isEnabled = model.document.selection.hasAttribute( 'linkHref' );
    }
}

// Define the contents of the dialog box.
const dialogDefinition = {
    title: 'Draw Pad',
    minWidth: 300,
    minHeight: 200,
    contents: [
        {
            id: 'tab1',
            label: 'Draw',
            elements: [
                {
                    type: 'html',
                    html: '<div id="canvas-container"></div>'
                }
            ]
        }
    ],
    onShow() {
        const dialog = this;
        const canvasContainer = dialog.getElement().findOne( '#canvas-container' );
        const canvas = new CanvasUI( canvasContainer );

        // Define the behavior of the plugin when the "OK" button is clicked.
        dialog.on( 'ok', () => {
            const imageData = canvas.toDataURL();

            // Insert the image into the editor.
            editor.model.change( writer => {
                const imageElement = writer.createElement( 'image', {
                    src: imageData
                } );

                editor.model.insertContent( imageElement );
            } );
        } );
    }
};

// Register the plugin.
Editor.builtinPlugins.push( DrawPad );
