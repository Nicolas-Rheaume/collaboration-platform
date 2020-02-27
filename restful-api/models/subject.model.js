const Sequelize = require('sequelize');
const db = require('../middleware/sequelize.mw.js');

// Model
const Subject = db.define('subject', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true
    },
    createdAt: {
        type: Sequelize.DATE,
    },
    updatedAt: {
        type: Sequelize.DATE,
    }
    
  }, {
}
);

module.exports = Subject;