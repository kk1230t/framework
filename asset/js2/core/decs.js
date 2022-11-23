export default {

    // 다른 컴포넌트 들과 합침
    mixins: ,

    // 확장...
    extends:,

    // 뭘까 이건...
    args:,

    // props로 받을 수 있는 리스트와 props 타입 정의
    props: ,

    // 각종 데이터
    data: ,

    // 계산 식... 
    computed: {
        func(){},
        obj: {
            get() {},
            watch() {},
            set() {},
            // 즉각반응
            immediate: true
        }
    },

    // 이벤트 핸들링 리스트
    events: [
        {

            name: 'click',

            self: Boolean,

            delegate() {},

            handler(e) {}

        },

    ],

    // 메서드 리스트
    methods: ,

    // 상태가 변할 시 호출
    update:[
        {
            read() {},

            // 뭐지....
            order:,

            write() {},

            events: []
        }
    ],

    created(){},

    connected(){},

    disconnected(){},

    beforeDisconnect() {

    },


};
