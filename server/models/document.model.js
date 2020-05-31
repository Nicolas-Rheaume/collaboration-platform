const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const db = require('../middleware/sequelize.mw.js');

const model_name = "document";

// Model
const Document = db.define(model_name, {
    id: {
        type: Sequelize.INTEGER(10),
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    pageID: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    textID: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    userID: {
        type: Sequelize.INTEGER,
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

// Create Document table if non existant
const CreateTableIfNonExistant = function() {
    db.query(`SHOW TABLES like "` + model_name + 's"').then(([results, metadata]) => {
        if(results == 0) {
            Document.sync();
        }
        else {
            console.log("Sequelize : The following table exists : " + model_name + "s");
        }
    })
}

// Create Document
const CreateDocument = async (userID, pageID, textID, order) => {
    return new Promise( async(resolve, reject) => {
  
        let newDocument = {
            pageID: pageID,
            userID: userID,
            textID: textID,
            order: order
        }
  
        Document.create(newDocument).then(document => {
            resolve(document);
        }).catch(err => {
            reject(err);
        });
    });
}

// Get Document by user id and page id
const GetDocumentByUserAndSubject = async(userID, pageID) => {
    return new Promise( async(resolve, reject) => {
        Document.findAll({
            where: {
                userID: userID,
                pageID: pageID
            },
            order: [['order', 'ASC']]
        }).then((documents) => {
            resolve(documents.map(document => {
                return document.dataValues;
            }));
        }).catch(err => {
            reject(err);
        });
    });
}

// Get Document with page id but without user id
const GetDocumentBySubjectWithoutUser = async(userID, pageID) => {
    return new Promise( async(resolve, reject) => {
        Document.findAll({
            where: {
                pageID: pageID,
                [Op.not]: [{userID: userID}]
            }
        }).then((documents) => {
            resolve(documents);
        }).catch(err => {
            reject(err);
        });
    });
}

// Get Document with page id but without user id
const GetDocumentByUserSubjectAndOrder = async(userID, pageID, order) => {
    return new Promise( async(resolve, reject) => {
        Document.findOne({
            where: {
                userID: userID,
                pageID: pageID,
                order: order
            }
        }).then((document) => {
            resolve(document.dataValues);
        }).catch(err => {
            reject(err);
        });
    });
}


// Count the number of documents by the userID and pageID
const CountDocumentByUserAndSubject = async(userID, pageID) => {
    return new Promise( async(resolve, reject) => {
        Document.count({
            where: {
                userID, userID,
                pageID: pageID
            }
        }).then(count => {
            resolve(count);
        }).catch(err => {
            reject(err);
        });

    });
}

// Count the number of documents by the userID and pageID
const UpdateDocumentsOrder = async(userID, pageID, texts, offset) => {
    return new Promise( async(resolve, reject) => {
        try {
            let updates = new Array(texts.length);
            texts.forEach( async(text,i) => {
                updates[i] = Document.update({ order: i + offset }, {where: {
                    pageID: pageID,
                    userID: userID,
                    textID: text.id
                }}).catch(err => {throw err});
            });
            Promise.all(updates).then(() => {
                resolve();
            }).catch(err => {throw err});
        } catch (err) {reject(err);}
    });
}

// Change the order of all the documents after index and by amount
const ChangeOrders = async(userID, pageID, index, amount) => {
    return new Promise( async(resolve, reject) => {
        try {
            await Document.increment(
                { order: amount },
                { where: { 
                    userID: userID,
                    pageID: pageID,
                    order: {
                        [Op.gte]: index
                    }
                }
            }).catch(err => reject(err))
            resolve();
        } catch(err) {reject(err)}
    });
}

// Increase the order of all the documents at index
const IncreaseOrder = async(userID, pageID, index) => {
    return new Promise( async(resolve, reject) => {

        const documents = await GetDocumentByUserAndSubject(userID, pageID).catch(err => {reject(err)});

        let orders = [];
        documents.forEach( async(document,i) => {
            if(i >= index)
                orders.push(SetOrder(document.dataValues.id, i + 1).catch(err => {return reject(err)}));
        });
        Promise.all(orders).then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}

// Increase the order of all the documents at index
const DecreaseOrder = async(userID, pageID, index) => {
    return new Promise( async(resolve, reject) => {

        const documents = await GetDocumentByUserAndSubject(userID, pageID).catch(err => {reject(err)});

        let orders = [];
        documents.forEach( async(document,i) => {
            if(i >= index)
                orders.push(SetOrder(document.dataValues.id, i - 1).catch(err => {return reject(err)}));
        });
        Promise.all(orders).then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}

// Increase the order of all the documents at index
/*
const DecreaseOrder = async(documentID, order) => {
    return new Promise((resolve, reject) => {
        Document.update(
            {   order: order },
            {   where: { id: documentID }}
        ).then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
}
*/

// Insert a new document at the index
const InsertAtIndex = async(userID, pageID, textID, index) => {

    // Change their order
    const orders = await IncreaseOrder(userID, pageID, index).catch(err => {reject(err)});

    // Create a new document for the new Text
    const document = await CreateDocument(userID, pageID, textID, index).catch(err => {reject(err)});
}

// Delete Text by ID
const DeleteDocumentByID = async(documentID) => {
    return new Promise((resolve, reject) => {
        Document.destroy(
            {   where: { id: documentID }}
        ).then(() => {
            resolve();
        }).catch(err => {
            reject(err);
        });
    });
  }

const DeleteDocumentByOrder = async(userID, pageID, order) => {
    return new Promise( async(resolve, reject) => {
        try {
            await Document.destroy({   
                where: {
                    userID: userID,
                    pageID: pageID,
                    order: order
                }}
            ).catch(err => { throw(err); });
            resolve();
        } catch(err) { reject(err); }

    });
}

const GetContributorsAndTextsCount = async(pages) => {
    return new Promise( async(resolve, reject) => {
        try {
            Promise.all(
                pages.map( async(page, i) => {
                    let contributors = await GetContributorsCount(page.id).catch(err => { throw err; });
                    let texts = await GetTextsCount(page.id).catch(err => { throw err; });
                    return {
                        id: page.id,
                        title: page.title,
                        description: page.description,
                        url: page.url,
                        contributors: contributors,
                        texts: texts,
                        createdAt: page.createdAt,
                        updatedAt: page.updatedAt
                    };
                })
            ).then((data) => {
                resolve(data);
            }).catch(err => { throw err; }); 

            /*
            let contributors = new Array(pages.length);
            let texts = new Array(pages.length);

            await pages.forEach( async(page, i) => {
                contributors[i] = GetContributorsCount(page.id).catch(err => { throw err; });
                texts[i] = GetTextsCount(page.id).catch(err => { throw err; });
            });

            await Promise.all([contributors, texts]).then(val => {
                console.log(val);

                resolve(pages);
            }).catch(err => {throw err});

            
            pages.forEach( async(page, i) => {
                pages[i].contributors = contributors[i];
                pages[i].texts = texts[i];
            });
            resolve(pages)*/
        } catch(err) { reject(err); }

    });
}


const GetContributorsCount = async(pageID) => {
    return new Promise( async(resolve, reject) => {
        try {
            const count = await Document.count({   
                where: {
                    pageID: pageID,
                },
                distinct:true, col: 'userID'
            }).catch(err => { throw(err); });
            resolve(count);
        } catch(err) { reject(err); }

    });
}

const GetTextsCount = async(pageID) => {
    return new Promise( async(resolve, reject) => {
        try {
            const count = await Document.count({   
                where: {
                    pageID: pageID,
                }}
            ).catch(err => { throw(err); });
            resolve(count);
        } catch(err) { reject(err); }
    });
}

module.exports = {
    Document,
    CreateTableIfNonExistant,
    CreateDocument,
    GetDocumentByUserAndSubject,
    GetDocumentBySubjectWithoutUser,
    GetDocumentByUserSubjectAndOrder,
    CountDocumentByUserAndSubject,
    InsertAtIndex,
    UpdateDocumentsOrder,
    IncreaseOrder,
    DecreaseOrder,
    ChangeOrders,
    DeleteDocumentByID,
    DeleteDocumentByOrder,
    GetContributorsAndTextsCount,
    GetContributorsCount,
    GetTextsCount
};