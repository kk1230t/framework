import {$, findAll, removeClass, hasClass, toggleClass, Dimensions, height, isVisible, width, toNodes, queryAll, trigger, $$} from '../../util/index';
import Button from "./button";
import {cssPrefix} from 'GC-data'

export default {
    extends : Button,
    props: { 
        media: Boolean,
        boundary: Boolean,
        tabContents: String,
    },
    data: {
        target:`>ul.${cssPrefix}tab-nav>*>:first-child`,
        clsContainer: `>ul.${cssPrefix}tab-nav>*`,
        tabContents: `>.${cssPrefix}tab-contents>div`,
        clsOpen: `${cssPrefix}active`,
        isContainer:true,

    },
    computed: {
        tabContents: {
            get({tabContents}, $el) {
                return $$(tabContents, $el)
            },
            watch(tabContents) {
                const n = this.index() < 0 ? 0 : this.index();
                this.activeTab(tabContents[n]);
            },
            immediate: true,
        }
    },
    events: [
        {
            name: 'click',
            delegate() {
                return this.target;
            },
            handler(e) {
                const n = this.index();
                this.activeTab(this.tabContents[n])
            }
        }
    ],
    methods: {
        activeTab(item) {
            this.tabContents.map(el => toggleClass(el, this.clsOpen, el === item))
            
        }
    }
};
