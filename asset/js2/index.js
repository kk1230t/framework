import * as util from './util/index.js';
import { on } from './util/index.js';
// import * as util from 'uikit-util';
// import {addC33lass} from './util/index.js';


const testBtn = document.querySelector('#testBtn');

console.log(Element.prototype)
var el = document.querySelectorAll('.test')
// console.log(el)
util.addClass(el, ['aaaaa', 'bbbbder'])

console.log(util.hasClass(el, 'aacdsfswerwe'))

console.log(util)
util.test();

// testBtn.addEventListener('click', function(e){
//     util.toggleClass(el, 'aaabbbdfa')
// }, false)


// on(testBtn, 'click', function(){
//     console.log(this)
// })
on(testBtn, 'click', (e)=>{
    console.log(this)
})
// window.addEventListener('scroll', function(e){
//     console.log(this.scrollY)
// })
export default util;

// window.frontui = util;