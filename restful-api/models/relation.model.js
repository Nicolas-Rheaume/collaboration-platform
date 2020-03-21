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
const CreateRelation = async (userID, subjectID, textID, order) => {
    return new Promise((resolve, reject) => {
  
        let newRelation = {
            subjectID: subjectID,
            userID: userID,
            textID: textID,
            order: order
        }
  
        Relation.create(newRelation).then(relation => {
            resolve(relation);
        }).catch(err => {
            reject(err);
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

// Get Relation with subject id but without user id
const GetRelationByUserSubjectAndOrder = async(userID, subjectID, order) => {
    return new Promise((resolve, reject) => {
        Relation.findOne({
            where: {
                userID: userID,
                subjectID: subjectID,
                order: order
            }
        }).then((relation) => {
            resolve(relation.dataValues);
        }).catch(err => {
            reject(err);
        });
    });
}


// Count the number of relations by the userID and subjectID
const CountRelationByUserAndSubject = async(userID, subjectID) => {
    return new Promise((resolve, reject) => {
        Relation.count({
            where: {
                userID, userID,
                subjectID: subjectID
            }
        }).then(count => {
            resolve(count);
        }).catch(err => {
            reject(err);
        });

    });
}

// Count the number of relations by the userID and subjectID
const SetOrder = async(relationID, order) => {
    return new Promise((resolve, reject) => {
        Relation.update(
            {   order: order },
            {   where: { id: relationID }}
        ).then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}

// Increase the order of all the relations at index
const IncreaseOrder = async(userID, subjectID, index) => {
    return new Promise( async(resolve, reject) => {

        const relations = await GetRelationByUserAndSubject(userID, subjectID).catch(err => {reject(err)});

        let orders = [];
        relations.forEach( async(relation,i) => {
            if(i >= index)
                orders.push(SetOrder(relation.dataValues.id, i + 1).catch(err => {return reject(err)}));
        });
        Promise.all(orders).then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}

// Increase the order of all the relations at index
const DecreaseOrder = async(userID, subjectID, index) => {
    return new Promise( async(resolve, reject) => {

        const relations = await GetRelationByUserAndSubject(userID, subjectID).catch(err => {reject(err)});

        let orders = [];
        relations.forEach( async(relation,i) => {
            if(i >= index)
                orders.push(SetOrder(relation.dataValues.id, i - 1).catch(err => {return reject(err)}));
        });
        Promise.all(orders).then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}

// Increase the order of all the relations at index
/*
const DecreaseOrder = async(relationID, order) => {
    return new Promise((resolve, reject) => {
        Relation.update(
            {   order: order },
            {   where: { id: relationID }}
        ).then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}
*/

// Insert a new relation at the index
const InsertAtIndex = async(userID, subjectID, textID, index) => {

    // Change their order
    const orders = await IncreaseOrder(userID, subjectID, index).catch(err => {reject(err)});

    // Create a new relation for the new Text
    const relation = await CreateRelation(userID, subjectID, textID, index).catch(err => {reject(err)});
}

// Delete Text by ID
const DeleteRelationByID = async(relationID) => {
    return new Promise((resolve, reject) => {
        Relation.destroy(
            {   where: { id: relationID }}
        ).then(() => {
            resolve();
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
    GetRelationBySubjectWithoutUser,
    GetRelationByUserSubjectAndOrder,
    CountRelationByUserAndSubject,
    InsertAtIndex,
    SetOrder,
    IncreaseOrder,
    DecreaseOrder,
    DeleteRelationByID
};