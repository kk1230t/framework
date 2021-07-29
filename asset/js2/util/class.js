import {attr} from './attr.js';
import {hasOwn, includes, isString, isUndefined, toNodes, last} from './lang.js';

export function addClass(element, ...args) {
    apply(element, args, 'add');
}

export function removeClass(element, ...args) {
    apply(element, args, 'remove');
}

export function replaceClass(element, ...args) {
    args[0] && removeClass(element, args[0]);
    args[1] && addClass(element, args[1]);
}

export function hasClass(element, cls) {
    return cls && toNodes(element).some(element => element.classList.contains(cls.split(' ')[0]));
}

export function toggleClass(element, ...args) {
    console.log(args)
    if (!args.length) {
        return;
    }

    args = getArgs(args);

    const force = !isString(last(args)) ? args.pop() : []; // in iOS 9.3 force === undefined evaluates to false

    args = args.filter(Boolean);

    toNodes(element).forEach(({classList}) => {
        for (let i = 0; i < args.length; i++) {
            supports.Force
                ? classList.toggle(...[args[i]].concat(force))
                : (classList[(!isUndefined(force) ? force : !classList.contains(args[i])) ? 'add' : 'remove'](args[i]));
        }
    });

}


export function test(){
    var aa = {
        bb : 1,
        cc : 2
    }
    console.log(hasOwn(aa, 'dd'))
    // console.log(getArgs(['aab', 'ddddd dsf dsf22', 'ddddd dfffd', 'ddddddfffd']))
    
}

function apply(element, args, fn){
    var args = getArgs(args).filter(Boolean);   // Array.prototype.filter(), 배열을 검색해서 boolean으로 평가 후 false로 평가되는 값을 제거한다.
    args.length && toNodes(element).forEach(({classList}) => {
        supports.Multiple
            ? classList[fn](...args)
            : args.forEach(cls => classList[fn](cls));
    });
    
}

function getArgs(args) {
    return args.reduce((args, arg) =>
        /**
         * concat을 콜하여 문자열이고 문자열 사이에 공백이 있는지 체크하여 공백이 있으면 공백을 기준으로 배열로 나눠서 합치고.
         * 공백이 없다면 그냥 합쳐서 반환한다.
         * 또한 concat에 잘못된 값이 전달되어 에러가 발생할 경우 (args.concat.call(args)로 하면 뒤의 값을 반환한다.) 빈 배열을 반환한다.
         */
        args.concat.call(args, isString(arg) && includes(arg, ' ') ? arg.trim().split(' ') : arg)
        , []);
}



// IE 11
const supports = {

    get Multiple1111() {
        return this;
    },

    get Force() {
        return this.get('_force');
    },

    get(key) {

        if (!hasOwn(this, key)) {
            const {classList} = document.createElement('_');
            classList.add('a', 'b');
            classList.toggle('c', false);
            this._multiple = classList.contains('b');
            this._force = !classList.contains('c');
        }

        return this[key];
    }

};

