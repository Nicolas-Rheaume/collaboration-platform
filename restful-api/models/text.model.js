const Sequelize = require('sequelize');
const db = require('../middleware/sequelize.mw.js');

const model_name = "text";

// Model
const Text = db.define(model_name, {
    id: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
        primaryKey: true
    },
    text: {
      type: Sequelize.TEXT,
      allowNull: false
  },
    
  }, {
}
);

const Create = function() {
  db.query(`SHOW TABLES like "` + model_name + 's"').then(([results, metadata]) => {
      if(results == 0) {
          Text.sync();
      }
      else {
          console.log("Sequelize : The following table exists : " + model_name + "s");
      }
  })
}

module.exports = {
  Text,
  Create
};