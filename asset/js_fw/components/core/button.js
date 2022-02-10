import {$, addClass, removeClass, Dimensions, height, isVisible, width, toNodes} from '../../util/index';
import {cssPrefix} from 'GC-data'
export default {

    props: {
        multiple:String
    },

    data: {
        target: `.${cssPrefix}button`,
        activeClass: `${cssPrefix}active`,
        multiple:false
    },

    computed: {
        testaa: {
            get() {
                return 'aaa';
            },
            watch() {
                // this.test();
            },
            immediate: true
            
        },
        targets() {
            return this.$el.querySelectorAll(this.target);
        }
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
        test() {
            // alert('dddddd')
            console.log('watch')
        },
        toggleElement(target) {
            // alert('dddddd')
            // console.log(toNodes(this.l11ength));
            toNodes(this.targets).map(el => {
                if(el === target){
                    addClass(el, this.activeClass);
                    console.log()
                }else{
                    removeClass(el, this.activeClass)
                }
            })
        }
    },

    update: {

        read({test, aaaa}) {

            // console.log('resizeRead')
            // console.log(aaaa)
            // console.log(test)
            return {
                test: 'dddd',
                aaaa: 'dffadfsf'
            }

        },
        write({test}) {

            // console.log('resizeWrite')
            // console.log(test)

        },

        events: ['resize']

    }

};
