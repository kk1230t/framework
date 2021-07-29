class HashTagPrinter {
    constructor() {
        this.textArr = [];
    }

    pushText(text) {
        this.textArr.push(text);
    }

    printWithHashTag() {  // print -> printWithHashTag로 변경
        return this.textArr.map(text => `#${text}`).join(' ');
    }
}

export default HashTagPrinter;

