//create models
'use strict';

exports.__esModule = true;
var bookmark = {
  identity: 'bookmark',
  //connection: 'mongo',
  connection: 'mysql',
  tableName: 'nio_bookmark',
  attributes: {
    id: {
      type: 'integer',
      columnName: 'id',
      primaryKey: true,
      autoIncrement: true
    },
    user: {
      type: 'integer',
      required: true,
      model: 'user'
    },
    post: {
      type: 'integer',
      required: true,
      model: 'post'
    },
    order: {
      type: 'integer'
    }
  },
  migrate: 'create',
  autoPK: false,
  autoCreatedAt: true,
  autoUpdatedAt: true
};

var curation = {
  identity: 'curation',
  //connection: 'mongo',
  connection: 'mysql',
  tableName: 'nio_curation',

  attributes: {
    id: {
      type: 'integer',
      columnName: 'id',
      primaryKey: true,
      autoIncrement: true
    },
    user: {
      type: 'integer',
      required: true,
      model: 'user'
    },
    title: {
      type: 'string',
      required: true
    },
    tags: {
      type: 'json'
    },
    description: {
      type: 'string'
    }

  },
  migrate: 'create',
  autoPK: false,
  autoCreatedAt: true,
  autoUpdatedAt: true
};

var curationBookmark = {
  identity: 'curationBookmark',
  //connection: 'mongo',
  connection: 'mysql',
  tableName: 'nio_curationBookmark',
  attributes: {
    id: {
      type: 'integer',
      columnName: 'id',
      primaryKey: true,
      autoIncrement: true
    },
    curation: {
      type: 'integer',
      required: true,
      model: 'curation'
    },
    bookmark: {
      type: 'integer',
      required: true,
      model: 'bookmark'
    }
  },
  migrate: 'create',
  autoPK: false,
  autoCreatedAt: true,
  autoUpdatedAt: true
};

var following = {
  identity: 'following',
  //connection: 'mongo',
  connection: 'mysql',
  tableName: 'nio_following',
  attributes: {
    id: {
      type: 'integer',
      columnName: 'id',
      primaryKey: true,
      autoIncrement: true
    },
    user: {
      type: 'integer',
      required: true,
      model: 'user'
    },
    followUser: {
      columnName: 'follow_user',
      type: 'integer',
      model: 'user'
    },
    followTerm: {
      columnName: 'follow_term',
      type: 'integer',
      model: 'term'
    }
  },
  migrate: 'create',
  autoPK: false,
  autoCreatedAt: true,
  autoUpdatedAt: true
};

var like = {
  identity: 'like',
  //connection: 'mongo',
  connection: 'mysql',
  tableName: 'nio_like',

  attributes: {
    id: {
      type: 'integer',
      columnName: 'id',
      primaryKey: true,
      autoIncrement: true
    },
    user: {
      type: 'integer',
      required: true,
      model: 'user'
    },
    post: {
      type: 'integer',
      required: true,
      model: 'post'
    }
  },
  migrate: 'create',
  autoPK: false,
  autoCreatedAt: true,
  autoUpdatedAt: true
};

var passport = {
  identity: 'passport',
  connection: 'mysql',
  tableName: 'nio_passport',
  attributes: {
    id: {
      type: 'integer',
      columnName: 'id',
      primaryKey: true,
      autoIncrement: true
    },
    user: {
      type: 'integer',
      //required:true,
      model: 'user'
    },
    protocol: {
      type: 'alphanumeric'
    },
    provider: {
      type: 'alphanumericdashed'
    },
    identifier: {
      type: 'string'
    },
    tokens: {
      type: 'json'
    }
  },
  migrate: 'create',
  autoPK: false,
  autoCreatedAt: true,
  autoUpdatedAt: true
};

var read = {
  identity: 'read',
  //connection: 'mongo',
  connection: 'mysql',
  tableName: 'nio_read',

  attributes: {
    id: {
      type: 'integer',
      columnName: 'id',
      primaryKey: true,
      autoIncrement: true
    },
    user: {
      type: 'integer',
      required: true,
      model: 'user'
    },
    post: {
      type: 'integer',
      required: true,
      model: 'post'
    }
  },
  migrate: 'create',
  autoPK: false,
  autoCreatedAt: true,
  autoUpdatedAt: true
};

var settings = {
  identity: 'settings',
  //connection: 'mongo',
  connection: 'mysql',
  tableName: 'nio_profile_settings',

  attributes: {
    id: {
      type: 'integer',
      columnName: 'id',
      primaryKey: true,
      autoIncrement: true
    },
    user: {
      type: 'integer',
      required: true,
      model: 'user'
    },
    key: {
      type: 'string',
      required: true

    },
    value: {
      type: 'json'
    }
  },
  migrate: 'create',
  autoPK: false,
  autoCreatedAt: true,
  autoUpdatedAt: true

};

var share = {
  identity: 'share',
  //connection: 'mongo',
  connection: 'mysql',
  tableName: 'nio_share',

  attributes: {
    id: {
      type: 'integer',
      columnName: 'id',
      primaryKey: true,
      autoIncrement: true
    },
    user: {
      type: 'integer',
      required: true,
      model: 'user'
    },
    post: {
      type: 'integer',
      required: false,
      model: 'post'
    },
    url: {
      type: 'string'
    },
    provider: {
      type: 'alphanumericdashed'
    },
    responseId: {
      type: 'string'
    }
  },
  migrate: 'create',
  autoPK: false,
  autoCreatedAt: true,
  autoUpdatedAt: true
};

//main
exports['default'] = {
  bookmark: bookmark,
  curation: curation,
  curationBookmark: curationBookmark,
  following: following,
  like: like,
  passport: passport,
  read: read,
  settings: settings,
  share: share
};
module.exports = exports['default'];
//required:true