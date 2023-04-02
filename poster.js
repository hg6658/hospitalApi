let pet = function(){
    this.speak = function(){
        console.log("Peter");
    }
    this.beat= function(){
        console.log("Strength");
    }
}

let dog = function(){
    pet.call(this);
    this.speak = function(){
        console.log('Woof');
    }
}

let dg = new dog();
dg.speak();
dg.beat();