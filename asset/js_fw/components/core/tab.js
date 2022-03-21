import {$, findAll, removeClass, hasClass, toggleClass, Dimensions, height, isVisible, width, toNodes, queryAll, trigger} from '../../util/index';
import button from "./button";
import {cssPrefix} from 'GC-data'

export default {
    mixins : [button],
    props: { 
        conts: String
    },
    data: {
        target: 'a',
        conts: '.kui-tab-conts > div',
        activeClass: `${cssPrefix}active`
    },
    computed: {
        tabConts() {
            return findAll(this.conts, this.$el);
        }
    },
    events: [
        {
            name: 'click',
            delegate() {
                return this.target;
            },
            handler(e) {
                if (e.current.hash !== '') this.show(e.current.hash.replace('#', ''));
            }
        }
    ],
    methods: {
        show(id) {
            this.tabConts.map(el => toggleClass(el, this.activeClass, el.id === id));
            trigger(this.$el, 'show', id);
        }
    }
};
