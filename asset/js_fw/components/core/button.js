import {$, addClass, removeClass, toggleClass, hasClass, Dimensions, height, isVisible, width, toNodes, findAll} from '../../util/index';
import {cssPrefix} from 'GC-data'
export default {

    props: {
        multiple:Boolean
    },

    data: {
        toggle: `.${cssPrefix}button`,
        activeClass: `${cssPrefix}active`,
        multiple:false
    },

    computed: {
        targets() {
            return findAll(this.toggle, this.$el);
        }
    },

    events: [
        {
            name: 'click',
            delegate() {
                return this.toggle;
            },
            handler(e) {
                e.preventDefault();
                this.toggleElement(e.current);
            }
        }
    ],

    methods: {
        toggleElement(target) {
            // console.log(this.targets)
            if(this.multiple) {
                hasClass(target, this.activeClass) ? 
                    removeClass(target, this.activeClass) 
                    : addClass(target, this.activeClass);
            }else{
                this.targets.map(el => {
                    toggleClass(el, this.activeClass, el === target);
                })
            }
        }
    }
};
