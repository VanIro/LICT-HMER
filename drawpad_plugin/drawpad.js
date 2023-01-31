import DrawpadUI from './drawpadui';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class Drawpad extends Plugin {
    static get requires() {
        return [ DrawpadUI ];
    }
}
