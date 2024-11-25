const sum = (a,b) => {
    if(a && b){
        return a + b;
    }
    throw new Error("Invalid argument!");
};

// try {
//     console.log(sum(1))
// } catch (error) {
//     console.log("Error Occured!");
//     // console.log(error);
// }
console.log(sum(1))
console.log("Its Work")