const person = {
  name: "Raziullah",
  age: 22,
  greet() {
    console.log("Hi, I am " + this.name);
  },
};

person.greet();

//How to Dynamically Set Properties
const userName = "level";

let person1 = {
  "first name": "kamal",
  age: 30,
  [userName]: "see",
};
console.log(person1);

//Object Spread Operator
let person3 = {
  name: "kamal",
  age: 30,
  hobbies: ["reading", "playing", "sleeping"],
};
console.log(person3);
const person2 = { ...person3 };
person2.age = 22;
console.log(person2.age);

//Object Destructuring
//   -->Object destructuring is an important feature in JavaScript that allows you to pull out values from an object and assign them to individual variables.
const person4 = { name: "lawal", age: 39 };
const { name, age } = person4;
console.log(name); // 'lawal'
console.log(age); // 39
