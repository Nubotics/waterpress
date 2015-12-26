const option = {
  identity: 'option',
  connection: 'mysql',
  tableName: 'wp_options',
  attributes: {
    id: {
      type: 'integer',
      columnName: 'option_id',
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: 'string',
      columnName: 'option_name'
    },
    value: {
      type: 'text',
      columnName: 'option_value'
    },
    autoload: {
      type: 'string',
      columnName: 'autoload'
    },
  },
  migrate: 'safe',
  autoPK: false,
  autoCreatedAt: false,
  autoUpdatedAt: false
}

export default {
  option,
}
