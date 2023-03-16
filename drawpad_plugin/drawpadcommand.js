import Command from '@ckeditor/ckeditor5-core/src/command';

export default class DrawpadCommand extends Command {
    execute( { value } ) {
        const editor = this.editor;
        const selection = editor.model.document.selection;

        editor.model.change( writer => {
            const math_node = writer.createElement('math-node', {
                    ...Object.fromEntries( selection.getAttributes() ),
            });
            writer.appendText(data['message'],math_node);
            editor.model.insertObject( math_node, null, null, { setSelection: 'on' }  );
        } );
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;

        const isAllowed = model.schema.checkChild( selection.focus.parent, 'math-node' );

        this.isEnabled = isAllowed;
    }
}
