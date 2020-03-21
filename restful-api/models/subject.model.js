const Sequelize = require('sequelize');
const db = require('../middleware/sequelize.mw.js');
const NAME = "subject";

// Subject Definition
const Subject = db.define(NAME, {
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
    },/*
    creator: {
        type: Sequelize.TEXT,
        allowNull: true
    },*/
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

// Create Subject Table if it is non-existant
const CreateTableIfNonExistant = () => {
    return new Promise(resolve => {
        db.query(`SHOW TABLES like "` + NAME + 's"').then(([results, metadata]) => {
            if(results == 0) {
                Subject.sync();
            }
            else {
                console.log("Sequelize : The following table exists : " + NAME + "s");
            }
            resolve();
        })
    });
}

// Create Subject
const CreateSubject = (subject) => {
    return new Promise(resolve => {

        let newSubject = {
            title: '',
            description: '',
        }

        if(subject.hasOwnProperty('title')) { newSubject.title = subject.title; }
        if(subject.hasOwnProperty('description')) { newSubject.description = subject.description; }

        Subject.create(newSubject).then(subject => {
            resolve(subject);
        }).catch(err => {
            console.log(err); 
            resolve();
        });
    });
}

// Create Subject
const CreateSubjectByTitle = (title) => {
    return new Promise((resolve, reject) => {

        let newSubject = {
            title: title,
            description: '',
        }

        Subject.create(newSubject).then(subject => {
            resolve(subject);
        }).catch(err => {
            reject(err);
        });
    });
}

// Get Subject by ID
const GetSubjectByID = (id) => {
    return new Promise(resolve => {
        Subject.findByPk(id).then(subject => {
            resolve(subject);
        }).catch(err => {
            console.log(err);
            resolve();
        });
    });
}

// Get Subject by ID
const GetSubjectByTitle = (title) => {
    return new Promise((resolve, reject) => {
        Subject.findOne({
            where: {
                title: title
            }
        }).then(subject => {
            resolve(subject);
        }).catch(err => {
            reject(err);
        });
    });
}

// Update Subject
const UpdateSubject = (subject) => {
    return new Promise(resolve => {
        Subject.update(
            {   title: subject.title,
                description: subject.description
            },
            { where: { id: subject.id }}
        ).then(() => {
            Subject.findByPk(subject.id).then(subject => {
                resolve(subject);
            }).catch(err => {
                console.log(err);
                resolve();
            });
        }).catch(err => {
            console.log(err);
            resolve();
        });
    });
}

// Delete Subject
const DeleteSubjectByID = (id) => {
    return new Promise(resolve => {
        Subject.destroy({
            where: {
              id: id,
            }
        }).then( subject => {
            resolve(subject);
        }).catch(err => {
            console.log(err);
            resolve();
        });
    });
}

// Get All Subjects
const GetAllSubjects = () => {
    return new Promise((resolve, reject) => {
        Subject.findAll().then(subjects => {
            let list = [];
            subjects.forEach(subject => {
                list.push({
                    id: subject.dataValues.id,
                    title: subject.dataValues.title,
                    description: subject.dataValues.description,
                    createdAt: subject.dataValues.createdAt,
                    updatedAt: subject.dataValues.updatedAt
                });
            });
            resolve(list);
          }).catch(err => {reject(err)});
    });
}




module.exports = {
    Subject,
    CreateTableIfNonExistant,
    CreateSubject,
    CreateSubjectByTitle,
    GetSubjectByID,
    GetSubjectByTitle,
    UpdateSubject,
    DeleteSubjectByID,
    GetAllSubjects
};