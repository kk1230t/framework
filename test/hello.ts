function greet(person: string, date: Date) {
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}
  
greet("Maddison", new Date());

let myName: string = "Alice";



function test():number {
  return 26;
}

enum Color {Red = 1, Green = 2, Blue = 4}
let c: Color = Color.Green;