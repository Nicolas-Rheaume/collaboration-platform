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

// Create Relation table if non existant
const CreateTableIfNonExistant = function() {
    db.query(`SHOW TABLES like "` + model_name + 's"').then(([results, metadata]) => {
        if(results == 0) {
            Relation.sync();
        }
        else {
            console.log("Sequelize : The following table exists : " + model_name + "s");
        }
    })
}

// Create Relation
const CreateRelation = (userID, subjectID, textID, order) => {
    return new Promise(resolve => {
  
        let newRelation = {
            subjectID: subjectID,
            userID: userID,
            textID: textID,
            order: order
        }
  
        Relation.create(newRelation).then(relation => {
            resolve({success: true, relation: relation});
        }).catch(err => {
            resolve({success: false, message: "Error creating relation"});
        });
    });
}

// Get Relation by user id and subject id
const GetRelationByUserAndSubject = async(userID, subjectID) => {
    return new Promise((resolve, reject) => {
        Relation.findAll({
            where: {
                userID: userID,
                subjectID: subjectID
            },
            order: [['order', 'ASC']]
        }).then((relations) => {
            resolve(relations);
        }).catch(err => {
            reject(err);
        });
    });
}

// Get Relation with subject id but without user id
const GetRelationBySubjectWithoutUser = async(userID, subjectID) => {
    return new Promise((resolve, reject) => {
        Relation.findAll({
            where: {
                subjectID: subjectID,
                [Sequelize.Op.not]: [
                    {userID: userID}
                ]
            }
        }).then((relations) => {
            resolve(relations);
        }).catch(err => {
            reject(err);
        });
    });
}



module.exports = {
    Relation,
    CreateTableIfNonExistant,
    CreateRelation,
    GetRelationByUserAndSubject,
    GetRelationBySubjectWithoutUser
};