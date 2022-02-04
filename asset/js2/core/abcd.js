import Class from '../mixin/class';
import {default as Togglable, toggleHeight} from '../mixin/togglable';
import {$, $$, attr, filter, getIndex, hasClass, includes, index, isInView, scrollIntoView, toggleClass, unwrap, wrapAll} from 'Framework-util';

export default {

    mixins: [Class, Togglable],

    props: {
        targets: String,
        active: null,
        collapsible: Boolean,
        multiple: Boolean,
        toggle: String,
        content: String,
        transition: String,
        offset: Number
    },

    data: {
        targets: '> *',
        active: false,
        animation: [true],
        collapsible: true,
        multiple: false,
        clsOpen: 'uk-open',
        toggle: '> .uk-accordion-title',
        content: '> .uk-accordion-content',
        transition: 'ease',
        offset: 0
    },

    computed: {

        items: {

            get({targets}, $el) {
                return $$(targets, $el);
            },

            watch(items, prev) {
                // console.log(prev)
                items.forEach(el => hide($(this.content, el), !hasClass(el, this.clsOpen)));

                if (prev || hasClass(items, this.clsOpen)) {
                    return;
                }

                const active = this.active !== false && items[Number(this.active)]
                    || !this.collapsible && items[0];

                if (active) {
                    this.toggle(active, false);
                }

            },

            immediate: true

        }

    },

    events: [

        {

            name: 'click',

            delegate() {
                return `${this.targets}`;
            },

            handler(e) {
                e.preventDefault();
                this.$emit('checkStatus');
                this.test(index(e.current));
            }

        }/* ,

        {

            el : window, 

            name: 'resize',

            handler(e) {
                console.log('resizeEvent');
            }

        } */


    ],

    methods: {

        test(target) {
            // console.log(target);            
        }

    },

    update: {

        write() {

            // console.log('resize')

        },

        events: ['checkStatus']

    }

};

function hide(el, hide) {
    attr(el, 'hidden', hide ? '' : null);
}
