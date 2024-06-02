const name = "Raziullah";
let age = 22;
const hasHobbies = true;

age = 30;

console.log("name", name);

function summerizeUser(userName, userAge, userHasHobby) {
  return (
    "Name is " +
    userName +
    ", age is " +
    userAge +
    ", and the user has hobbies: " +
    userHasHobby
  );
}

console.log(summerizeUser(name, age, hasHobbies));

//Arrow Function Syntax
const summerizeUser1 = (name, age, hasHobbies) => {};

// const add = (a,b) => a+b;
// const addOne =  a => a + 3;
const addRandom =  () => 1 + 3;
console.log(addRandom(5));
// console.log(addOne(5));
// console.log(add(5,6));
