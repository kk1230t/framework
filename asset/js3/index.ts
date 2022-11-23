import { create } from "domain";

interface LabelValue {
    label: string;
    size: number;
}


function printLabel(labeledObj:LabelValue) {
    console.log(labeledObj.label);
    console.log(labeledObj.size);
};


let myObj = {
    size:10,
    label:"Size 10 Object",
}

printLabel(myObj)




interface SquareConfig {
    color?: string;
    width?: number;
    [propName:string]: any;
}

function createSquare(config: SquareConfig):{color: string, area: number} {
    let newSquare = {
        color:"white",
        area: 100,
    };

    if (config.color) {
        newSquare.color = config.color;
    }

    if (config.width) {
        newSquare.area = config.width * config.width;
    }

    return newSquare;

}

let mySquare = createSquare({colour: "red", width:100} as SquareConfig);
console.log(mySquare)


interface SearchFunc{
    (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source:string, subString: string){
    let result = source.search(subString);
    return result > -1;
}


function buildName(firstName: string, lastName = "Smith") {
    return firstName + " " + lastName;
}

let result1 = buildName("Bob");                  // 올바르게 동작, "Bob Smith" 반환
let result2 = buildName("Bob", undefined);       // 여전히 동작, 역시 "Bob Smith" 반환
let result3 = buildName("Bob", "Adams", "Sr.");  // 오류, 너무 많은 매개변수
let result4 = buildName("Bob", "Adams");         // 정확함

console.log(result1)
console.log(result2)
console.log(result3)
console.log(result4)