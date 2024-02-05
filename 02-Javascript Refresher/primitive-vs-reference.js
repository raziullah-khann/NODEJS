//It is a crucial concept in javascript

const hobbies = ["Sports", "Running", "Cooking"];
hobbies.push("Progrmming");
// console.log(hobbies);

//Spread Operator
// const copiedArray = hobbies.slice();
const copiedArray = [...hobbies];
console.log("copiedArray",copiedArray);

const person = {
    name: 'Raziullah',
    age: 22,
    greet() {
        console.log('Hi, I am ' + this.name);
    },
    hobbies: {
        player1: "Running"
    }
};

const copyObject = {
    ...person
}
copyObject.hobbies.player1 = 'Coocking';
console.log("person", person);
console.log("copyObject",copyObject);


//rest operator
const toArray = (arg1, arg2, ...arg3) => {
    return [arg1, arg2, arg3];
};

console.log(toArray(1,2,3,4,5));