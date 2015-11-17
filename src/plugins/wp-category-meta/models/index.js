const termMeta = {
  identity: 'termMeta',
  connection: 'mysql',
  tableName: 'wp_termsmeta',
  attributes: {
    id: {
      type: 'integer',
      columnName: 'meta_id',
      primaryKey: true,
      autoIncrement: true
    },
    term: {
      type: 'integer',
      columnName: 'terms_id',
      model: 'term'
    },
    key: {
      type: 'string',
      columnName: 'meta_key'
    },
    value: {
      type: 'string',
      columnName: 'meta_value'
    }
  },
  migrate: 'safe',
  autoPK: false,
  autoCreatedAt: false,
  autoUpdatedAt: false
}

let term = {
  attributes: {
    metaCollection: {
      collection: 'termMeta',
      via: 'term'
    }
  }
}

export default { termMeta, term }
