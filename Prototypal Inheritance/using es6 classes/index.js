"use strict"

class Person {
    constructor(name, gender) {
        this.gender = gender;
        this.name = name;
        this.getName = function () {
            return (`Name = ${this.name}`)
        }
    }
}

Person.prototype.sayHello = function () {
    console.log("Hey buddy from ", this.name)
}

let person = new Person("Ashok", "Male");

class Employee extends Person {
    constructor(name, gender, empId, salary) {
        super(name, gender);
        this.empId = empId;
        this.salary = salary
    }
}

let emp1 = new Employee("Ashish", "Male", "21388", "70k");
console.log(emp1);


