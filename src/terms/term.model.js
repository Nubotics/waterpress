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
      via: 'termId'
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
    termId: {
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
      model: 'termTaxonomy'
    },
    childCollection: {
      collection: 'termTaxonomy',
      via: 'parent'
    },
    relationshipCollection: {
      collection: 'termRelationship',
      via: 'termTaxonomyId'
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
/*  types: {
    compositeKey: function () {
      return `${this.objectId.toString()}_${this.termTaxonomyId.toString()}`
    }
  },*/
  attributes: {
    /*    id: {
     type: 'string',
     compositeKey:true,
     primaryKey: true
     },*/
    objectId: {
      type: 'integer',
      columnName: 'object_id',
      primaryKey: true,
      required: true,
      model: 'post'
    },
    termTaxonomyId: {
      type: 'integer',
      columnName: 'term_taxonomy_id',
      primaryKey: true,
      required: true,
      model: 'termTaxonomy'
    },
    order: {
      type: 'integer',
      columnName: 'term_order'
    }
  },
  migrate: 'safe',
  autoPK: false,
  autoCreatedAt: false,
  autoUpdatedAt: false

}

export {term, termTaxonomy, termRelationship}
