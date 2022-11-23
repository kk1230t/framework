import {default as Togglable} from '../mixin/togglable';
import {$, $$, filter, getIndex, toggleClass, hasClass, findIndex, closest} from '../../util/index';
import {cssPrefix} from 'GC-data'
export default {

    mixins: [Togglable],

    props: {
        target: String,
        clsContainer: String,
        multiple:Boolean,
        isContainer:Boolean,
    },

    data: {
        target: `.${cssPrefix}item`,
        clsActive: `${cssPrefix}active`,
        clsContainer: `.${cssPrefix}box`,
        isContainer: false,
        multiple:false,
    },

    computed: {
        connects: {
            get({target, clsContainer, isContainer}, $el) {
                const el = isContainer ? clsContainer : target;
                return $$(el, $el);
            },
            watch(connects) {
                const n = this.index() < 0 ? 0 : this.index();
                this.toggle(connects[n]);
            },
            immediate: true,
        },
        
    },

    events: [
        {
            name: 'click',
            delegate() {
                return this.target;
            },
            handler(e) {
                e.preventDefault();
                this.toggle(e.current);
            }
        }
    ],

    methods: {
        index() {
            return findIndex(this.connects, el => hasClass(el, this.clsActive))
        },
        toggle(target) {
            const item = this.isContainer 
                            ? closest(target, this.clsContainer) : target;

            let lists = [this.connects[getIndex(item, this.connects)]];
            const activeItem = filter(this.connects, `.${this.clsActive}`);

            if(!this.multiple){
                if (hasClass(item, this.clsActive)) return false;
                lists = lists.concat(activeItem);
            }

            lists.forEach(el => this.toggleElement(el, !hasClass(el, this.clsActive), (el, show) => toggleClass(el, this.clsActive, show)))
        }
    }
};
