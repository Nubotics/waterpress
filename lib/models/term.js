'use strict';

exports.__esModule = true;
var term = {
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
};

var termTaxonomy = {
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
      model: 'termTaxonomy'
    },
    childCollection: {
      collection: 'termTaxonomy',
      via: 'parent'
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
};

var termRelationship = {
  identity: 'termRelationship',
  connection: 'mysql',
  tableName: 'wp_term_relationships',
  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },
    object: {
      type: 'integer',
      columnName: 'object_id',
      //primaryKey: true,
      required: true,
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
  autoPK: false,
  autoCreatedAt: false,
  autoUpdatedAt: false

};

exports['default'] = { term: term, termTaxonomy: termTaxonomy, termRelationship: termRelationship };
module.exports = exports['default'];