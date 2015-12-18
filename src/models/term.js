const term = {
  identity: 'term',
  connection: 'mysql',
  tableName: 'wp_terms',
  attributes: {
    id: {
      type: 'integer',
      columnName: 'term_id',
      primaryKey: true,
      autoIncrement: true
    },
    slug: {
      type: 'string',
      columnName: 'slug'
    },
    name: {
      type: 'string',
      columnName: 'name'
    },
    group: {
      type: 'integer',
      columnName: 'term_group'
    },
    taxonomyCollection: {
      collection: 'termTaxonomy',
      via: 'term'
    }
  },
  migrate: 'safe',
  autoPK: false,
  autoCreatedAt: false,
  autoUpdatedAt: false
}

const termTaxonomy = {
  identity: 'termTaxonomy',
  connection: 'mysql',
  tableName: 'wp_term_taxonomy',
  attributes: {
    id: {
      type: 'integer',
      columnName: 'term_taxonomy_id',
      primaryKey: true,
      autoIncrement: true
    },
    term: {
      type: 'integer',
      columnName: 'term_id',
      model: 'term'
    },
    taxonomy: {
      type: 'string',
      columnName: 'taxonomy'
    },
    description: {
      type: 'string',
      columnName: 'description'
    },
    parent: {
      type: 'integer',
      columnName: 'parent',
      //model: 'term'
    },
    relationshipCollection: {
      collection: 'termRelationship',
      via: 'termTaxonomy'
    }
  },
  migrate: 'safe',
  autoPK: false,
  autoCreatedAt: false,
  autoUpdatedAt: false
}

const termRelationship = {
  identity: 'termRelationship',
  connection: 'mysql',
  tableName: 'wp_term_relationships',
  attributes: {
  /*  id: {
      type: 'integer',
      columnName: 'id',
      primaryKey: true,
    },*/
    object: {
      type: 'integer',
      columnName: 'object_id',
      model: 'post',
      index: true
    },
    termTaxonomy: {
      type: 'integer',
      columnName: 'term_taxonomy_id',
      //primaryKey: true,
      required: true,
      model: 'termTaxonomy',
      index: true
    },
    order: {
      type: 'integer',
      columnName: 'term_order'
    }
  },
  migrate: 'safe',
  //autoPK: false,
  autoPK: true,
  autoCreatedAt: false,
  autoUpdatedAt: false

}

export default {term, termTaxonomy, termRelationship}
