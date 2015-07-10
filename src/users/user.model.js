const user = {
  identity: 'user',
  connection: 'mysql',
  tableName:'wp_users',
  attributes:{
    id: {
      type: 'integer',
      columnName: 'ID',
      primaryKey: true,
      autoIncrement: false
    },
    slug:{
      type: 'string',
      columnName: 'user_nicename',
      defaultsTo: ''
    },
    displayName:{
      type: 'string',
      columnName: 'display_name'
    },
    userName:{
      type: 'string',
      columnName: 'user_login'
    },
    email:{
      type:'string',
      required: true
    }/*,
     parentAssociation:{
      collection: '',
      via:''
    },
    childAssociation:{
      model: ''
    }*/
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

const userMeta = {

}

export {user,userMeta}
