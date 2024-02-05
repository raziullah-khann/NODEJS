const person = {
    name: 'Raziullah',
    age: 22,
    greet() {
        console.log('Hi, I am ' + this.name);
    }
};

const printName = ({ name  }) => {  //This name is pulled out from incomming object
    console.log( name);
}

printName(person);

//Array destructuring in js
//In array we can use any name for destructuring
const hobbies = ['Sports', 'Cooking'];
const [hobby1, hobby2] = hobbies;
console.log(hobby1, hobby2);