const hobbies = ['Sports', 'Cooking'];
for(let hobby of hobbies) {
    console.log(hobby);
}

console.log(hobbies.map(hobby => 'Hobby: ' + hobby));
console.log(hobbies);
//concat array
const newArray = hobbies.concat("Ram",[1,2,3]);
console.log(newArray);