import {$, addClass, removeClass, hasClass, toggleClass, Dimensions, height, isVisible, width, toNodes, queryAll, trigger} from '../../util/index';
import button from "./button";

export default {
    mixins : [button],
    props: { },

    data: {
        target: 'a',
        bbb: 'bbb',
        ccc: 'ccc'
    },

    computed: {
        // targets() {
        //     return queryAll('.kui-nav', this.$el);
        // }
    },

    events: [
        {

            name: 'click',
            delegate() {
                return this.target;
            },

            handler(e) {
                // console.log(e)
                console.log(e)
                e.preventDefault();
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
            alert('dddddd')
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

            console.log('resizeWrite')
            // console.log(test)

        },

        events: ['resize']

    }

};
