class HashTagAdapter {
    constructor(hashTagPrinter){
        this.printer = hashTagPrinter;
    }

    pushText(text){
        this.printer.textArr.push(text);
    }

    print(){
        return this.printer.printWithHashTag();
    }
}



export default HashTagAdapter;