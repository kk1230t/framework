import {$, addClass, removeClass, toggleClass, hasClass, Dimensions, height, isVisible, width, toNodes, findAll} from '../../util/index';
import {cssPrefix} from 'GC-data'
export default {

    props: {},

    data: {
        target: `.${cssPrefix}toggle`,
        cont: `.${cssPrefix}toggle-cont`,
        activeClass: `${cssPrefix}active`
    },

    computed: {
        // targets() {
        //     return findAll(this.toggle, this.$el);
        // }
    },

    events: [
        {
            name: 'click',
            delegate() {
                return this.target;
            },
            handler(e) {
                e.preventDefault();
                this.toggleElement(e.current);
            }
        }
    ],

    methods: {
        toggleElement(target) {
            console.log(target)
        }
    }
};
