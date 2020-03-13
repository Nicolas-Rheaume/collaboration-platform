const Sequelize = require('sequelize');
const db = require('../middleware/sequelize.mw.js');

const model_name = "subject";

// Model
const Subject = db.define(model_name, {
    id: {
        type: Sequelize.INTEGER(10),
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    title: {
        type: Sequelize.STRING(45),
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    createdAt: {
        type: Sequelize.DATE,
        allowNull: false
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
    }
  }, {
}
);

const Create = function() {
    db.query(`SHOW TABLES like "` + model_name + 's"').then(([results, metadata]) => {
        if(results == 0) {
            Subject.sync();
        }
        else {
            console.log("Sequelize : The following table exists : " + model_name + "s");
        }
    })
}

module.exports = {
    Subject,
    Create
};