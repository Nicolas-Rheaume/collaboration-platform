
const User = require('../models/user.model.js');
const Subject = require('../models/subject.model.js');
const Text = require('../models/text.model.js');
const Relation = require('../models/relation.model.js');

// Get Editor Text
const GetEditorText = async (userID, subjectID) => {
    return new Promise( async(resolve, reject) => {

        // Get all the relations
        const relations = await Relation.GetRelationByUserAndSubject(userID, subjectID).catch(err => reject(err));

        // Get Editor Texts
        let texts = new Array(relations.length);
        relations.forEach( async(relation,i) => {
            texts[i] = Text.getTextByID(relation.dataValues.textID).catch(err => reject(err));
        });

        Promise.all(texts).then((values) => {
            const editorText = values.map(text => {
                return text.dataValues;
            });
            resolve(editorText);
        }).catch(err => {
            reject(err);
        });
    });
}

// Get Explorer Text
const GetExplorerText = async (userID, subjectID) => {
    return new Promise( async(resolve, reject) => {

        // Get all the relations
        const relations = await Relation.GetRelationBySubjectWithoutUser(userID, subjectID).catch(err => reject(err));

        // Get Editor Texts
        let texts = new Array(relations.length);
        relations.forEach( async(relation,i) => {
            texts[i] = Text.getTextByID(relation.dataValues.textID).catch(err => reject(err));
        });

        Promise.all(texts).then((values) => {
            const explorerText = values.map(text => {
                return text.dataValues;
            });
            resolve(explorerText);
        }).catch(err => {
            reject(err);
        });
    });
}




// Create a new Text and its Relation at a specific index
/*
const InsertAtIndex = async (userID, subjectID, text index) => {
    return new Promise((resolve, reject) => {
        try {
      
            const text = await Text.CreateEmptyText().catch(err => reject(err));
            const relation = await Relation.CreateRelation(userID, subjectID, text.id, index).catch(err => reject(err));

            


        } catch(err) { reject(err); }


      if(data.username === null || data.title === null) reject({message: "Username or title missing."})
      else {
        try {
          const user = User.GetUserByUsername(data.username).catch(err => reject(err)); 
          const subject = Subject.GetSubjectByTitle(data.title).catch(err => reject(err));

          Promise.all([user, subject]).then( async(values) => {
            resolve({
              user: values[0].dataValues,
              subject: values[1].dataValues
            });
          }).catch(err => reject(err));
        } catch(err) {
          reject(err);
        }
        

    });
}
*/


// Get the user and the subject concurrently by their username and title respectively
const GetUserAndSubject = async (data) => {
    return new Promise((resolve, reject) => {
        try {
            Promise.all([
                User.GetUserByUsername(data.username).catch(err => reject(err)),
                Subject.GetSubjectByTitle(data.title).catch(err => reject(err))
            ]).then( async(values) => {
                resolve({
                  user: values[0].dataValues,
                  subject: values[1].dataValues
                })
            }).catch(err => reject(err));
        } catch(err) {
            reject(err);
        }

        /*
          const user = User.GetUserByUsername(data.username).catch(err => reject(err)); 
          const subject = Subject.GetSubjectByTitle(data.title).catch(err => reject(err));

          Promise.all([user, subject]).then( async(values) => {
            resolve({
              user: values[0].dataValues,
              subject: values[1].dataValues
            });
          }).catch(err => reject(err));
        } catch(err) {
          reject(err);
        }
        */
    });
}


module.exports = {
    GetEditorText,
    GetExplorerText,
    GetUserAndSubject,
};