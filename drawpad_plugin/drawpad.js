import DrawpadUI from './drawpadui';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import DrawpadEditing from './drawpadediting';

//combines all the plugin components
export default class Drawpad extends Plugin {
    static get requires() {
        return [ DrawpadEditing , DrawpadUI ];
    }
}
