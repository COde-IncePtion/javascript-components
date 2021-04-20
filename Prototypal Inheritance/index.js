"use strict"

function Person(name, gender) {
    this.name = name;
    this.gender = gender;
    this.getName= function(){
        return (`Name = ${name}`)
    }
}

Person.prototype.sayHello = function(){
    console.log("Hey buddy from ", this.name)
}

function Employee(name, gender, empId, salary) {
    Person.apply(this, [name, gender]);
    this.empId = empId;
    this.salary = salary;
}


// inheriting the prototype of Person
// after doing this, sayHello() will be available on Employee as well
Employee.prototype = Object.create(Person.prototype)

let person = new Person("Ashok", "Male");
console.log({person});



let emp1 = new Employee("Ashish", "Male", "21388", "70k");
console.log({emp1});
console.log(emp1.sayHello());
