const DataModel = require('./data_model');

class User {
    constructor(id, firstname, lastname, email, password, matricNumber, program, graduationYear) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.matricNumber = matricNumber;
        this.program = program;
        this.graduationYear = graduationYear;
    }

    getFullName() {
        return this.firstname + " " + this.lastname;
    }
}

class Users extends DataModel {
    authenticate(email, password) {
        for (let i = 0; i < this.data.length; i++){
            if (this.data[i].email == email && this.data[i].password == password){
                return true;
            }
        }
        return false;
    }

    getByEmail(email) {
        for(let i = 0; i < this.data.length; i++){
            if(this.data[i].email == email){
                return this.data[i];
            }
        }
        return null;
    }

    getByMatricNumber(matricNumber) {
        for(let i = 0; i < this.data.length; i++){
            if(this.data[i].matricNumber == matricNumber){
                return this.data[i];
            }
        }
        return null;
    }

    validate(obj) {
        let test1 = true, test2 = true, test3 = true, test4 = true;

        if (obj.id.length == 0 || obj.firstname.length == 0 || obj.lastname.length == 0 || obj.email.length == 0 || obj.password.length == 0 || obj.matricNumber.length == 0 || obj.program.length == 0 || obj.graduationYear.length == 0){
            test1 = false;
        }

        for(let i = 0; i < this.data.length; i++){
            if(this.data[i].email == obj.email){
                test2 = false;
                break;
            }
        }

        for (let i = 0; i < this.data.length; i++){
            if(this.data[i].matricNumber == obj.matricNumber){
                test3 = false;
                break;
            }
        }

        if(obj.password.length < 7){
            test4 = false;
        }

        if(test1 && test2 && test3 && test4){
            return true;
        }else{
             return false;
        }
       
    }
}

// Do not worry about the below for now; It is included so that we can test your code
// We will cover module exports in later parts of this course
module.exports = {
    User,
    Users
};