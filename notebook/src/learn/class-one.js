
const profile = {
    name: 'Ibrahim',
    age: '29',
    occupation: 'Software Engineer'
}

const profile_two = Object()
profile_two.profile = profile

const profile_three = Object.create(profile)

//function run_learning() {
//    const isFather = true
//
//    do {
//        console.log('I have a pretty cool mother')
//    } while (!isFather) {
//        console.log('No response for now!!')
//    }
   
   //console.log('[CLASS ONE] PROFILE THREE this.object', profile)
   //console.log('[CLASS ONE] PROFILE THREE raw nam', name)
//}

//function isOddNumber(n) {
//    for (let i=0; i<=n.length; 1++) {
//        if (n%2===0) true
//        return false
//    }
//}





module.exports = {
    run_learning,
    //isOddNumber,

    //obj
    profile,
    profile_three,
    profile_two
}