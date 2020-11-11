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
      if(this.data.some(user => user.email === email && user.password === password)){
        return true;
      }
      return false;
    }

    getByEmail(email) {
      return this.data.find(user => user.email === email) || null;
    }

    getByMatricNumber(matricNumber) {
      return this.data.find(user => user.matricNumber === matricNumber) || null
    }

    validate(obj) {
      if(obj.id && obj.firstname && obj.lastname && obj.email && obj.password && obj.matricNumber && obj.program && obj.graduationYear){
        if(!this.data.some(user=>user.email===obj.email || user.matricNumber===obj.matricNumber) && obj.password.length >= 7){
          return true;
        }
      }
      return false;
    }
}

// Do not worry about the below for now; It is included so that we can test your code
// We will cover module exports in later parts of this course
module.exports = {
    User,
    Users
};
