const Sequelize = require('sequelize');
const db = require('../middleware/sequelize.mw.js');

const model_name = "relation";

// Model
const Relation = db.define(model_name, {
    id: {
        type: Sequelize.INTEGER(10),
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    subjectID: {
        type: Sequelize.INTEGER(10),
        allowNull: false
    },
    userID: {
        type: Sequelize.INTEGER(10),
        allowNull: false
    },
    textID: {
        type: Sequelize.INTEGER(10),
        allowNull: false
    },
    order: {
        type: Sequelize.INTEGER(10),
        allowNull: false
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
            Relation.sync();
        }
        else {
            console.log("Sequelize : The following table exists : " + model_name + "s");
        }
    })
}

module.exports = {
    Relation,
    Create
};