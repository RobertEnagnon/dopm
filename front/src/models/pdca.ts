type Task = { 
    id: number,
    title          : string,
    what           : string,
    when           : string,
    hours          : string,
    why            : string,
    picture        : string,
    flashing       : Boolean,
    currentEvent   : Boolean,
    commitmentDate : string,
    status         : Array <JSON>,
    userTask     : Array <JSON>,
    table          : Array <JSON>,
    createdAt?: Date,
    updatedAt?: Date
  }
  type Table = {
    id : number,
    name : string , 
    description : string,
    userTable : Array<JSON>,
    taskTable : Array<JSON>,
    createdAt?: Date,
    updatedAt?: Date
}
type Category = {
  id : number,
  name : string , 
  description : string,
  taskCategory : Array<JSON>,
  createdAt?: Date,
  updatedAt?: Date
}
  export type {
      Task,
      Table,
      Category
  }