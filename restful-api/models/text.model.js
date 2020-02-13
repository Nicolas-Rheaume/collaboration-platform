const Sequelize = require('sequelize');
const db = require('../middleware/sequelize.mw.js');

// Model
const Text = db.define('text', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    }
    
  }, {
}
);

module.exports = Text;