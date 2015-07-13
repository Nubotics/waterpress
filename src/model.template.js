const model = {
  identity: '',
  connection: '',
  tableName:'',
  attributes:{
    id: {
      type: 'integer',
      columnName: 'wb_id',
      primaryKey: true,
      autoIncrement: false
    },
    field1:{
      type: 'string',
      columnName: '',
      defaultsTo: ''
    },
    field2:{
      type: 'datetime',
      columnName: ''
    },
    field3:{
      type: 'string',
      columnName: '',
      defaultsTo: ()=>{
        return ''
      }
    },
    field4:{
      type: 'text',
      columnName: ''
    },
    field5:{
      type: 'array'
    },
    parentAssociation:{
      collection: '',
      via:''
    },
    childAssociation:{
      model: ''
    }
    /*    ,
     migrate: 'safe',
     autoPK: false,
     autoCreatedAt: false,
     autoUpdatedAt: false,*/
  },

  beforeCreate: (values, next) => {

  },
  beforeUpdate: (values, next) => {

  }
}


export default model
/**
 * Created by nubuck on 15/07/09.
 */
