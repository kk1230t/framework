(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
})((function () { 'use strict';

    function printLabel(labeledObj) {
        console.log(labeledObj.label);
        console.log(labeledObj.size);
    }
    var myObj = {
        size: 10,
        label: "Size 10 Object"
    };
    printLabel(myObj);
    function createSquare(config) {
        var newSquare = {
            color: "white",
            area: 100
        };
        if (config.color) {
            newSquare.color = config.color;
        }
        if (config.width) {
            newSquare.area = config.width * config.width;
        }
        return newSquare;
    }
    var mySquare = createSquare({ colour: "red", width: 100 });
    console.log(mySquare);
    function buildName(firstName, lastName) {
        if (lastName === void 0) { lastName = "Smith"; }
        return firstName + " " + lastName;
    }
    var result1 = buildName("Bob"); // 올바르게 동작, "Bob Smith" 반환
    var result2 = buildName("Bob", undefined); // 여전히 동작, 역시 "Bob Smith" 반환
    var result3 = buildName("Bob", "Adams"); // 오류, 너무 많은 매개변수
    var result4 = buildName("Bob", "Adams"); // 정확함
    console.log(result1);
    console.log(result2);
    console.log(result3);
    console.log(result4);

}));
//# sourceMappingURL=GCui.js.map
