export default {

    props: { },

    data: {
        aaa: 'aaa',
        bbb: 'bbb',
        ccc: 'ccc'
    },

    computed: {

    },

    events: [
        {

            name: 'click',

            handler(e) {
                e.preventDefault();
                this.$emit('checkStatus');
                console.log('dfsdfsdf')
                
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
