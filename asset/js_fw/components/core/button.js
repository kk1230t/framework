import {addClass, Dimensions, height, isVisible, width} from '../../util/index';
import {cssPrefix} from 'GC-data'
export default {

    props: {
        abcd:String
    },

    data: {
        target: `~.${cssPrefix}switcher`,
        activeClass: '1122221'
    },

    computed: {
        testaa: {
            get() {
                return 'aaa';
            },
            watch() {
                this.test();
            },
            immediate: true
            
        }
    },

    events: [
        {

            name: 'click',

            handler(e) {
                e.preventDefault();
                // this.$emit('checkStatus');
                console.log(this);
                console.log(this.test)
                
            }
        },
        {

            name: 'scroll',

            el: window,

            handler() {

                // this.$emit('resize');

            }

        }
    ],

    methods: {
        test() {
            // alert('dddddd')
            console.log('watch')
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
