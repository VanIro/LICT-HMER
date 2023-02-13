import DrawpadUI from './drawpadui';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import DrawpadEditing from './drawpadediting';

export default class Drawpad extends Plugin {
    static get requires() {
        return [ DrawpadEditing , DrawpadUI ];
    }
}
