class DataModel {
    constructor() {
        this.data = [];
    }

    getAll() {
        return this.data;
    }

    getById(id) {
        return this.data.find(entity => entity.id === id) || null;
    }

    save(obj) {
        if (this.validate(obj)) {
            this.data.push(obj);
            return true;
        }
        return false;
    }

    update(obj, id) {
      let flag = false;
      this.data = this.data.map(entity => {
        if(entity.id === id){
          const prototype = Object.getPrototypeOf(entity);
          entity = Object.assign(Object.create(prototype), entity, obj);
          flag = true;
        }
        return entity;
      })
      return flag;
    }

    delete(id) {
      let position = this.data.findIndex(entity => entity.id === id);
      if(position===-1){
        return false;
      } else {
        this.data.splice(position, 1);
        return true;
      }
    }

    // this method will be overriden in the sub classes
    validate(obj) {
        return false;
    }
}

// Do not worry about the below for now; It is included so that we can test your code
// We will cover module exports in later parts of this course
module.exports = DataModel;