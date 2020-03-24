
const User = require('../models/user.model.js');
const Subject = require('../models/subject.model.js');
const Text = require('../models/text.model.js');
const Relation = require('../models/relation.model.js');

/*****************************************************************************
    *  EDITOR
*****************************************************************************/

const InitializeEditor = async(socket, url) => {
    return new Promise( async(resolve, reject) => {
        try {
            if(!socket.hasOwnProperty('user')) throw "User is not logged in";
            const subject = await ValidateSubject(socket, url).catch(err => {throw err});
            const texts =  await GetEditorText(socket.user.id, subject.id).catch(err => {throw err});
            resolve({subject, texts});
        } catch(err) {
            reject(err)
        }
    });
}

// Check if the url provided is valid
const ValidateSubject = async (socket, url) => {
    return new Promise( async(resolve, reject) => {
        if(socket.hasOwnProperty('subject')) {
            if(socket.subject.url === url) resolve(socket.subject);
            else {
                try {
                    await Subject.ValidateURL(url).catch(err => { throw err; });
                    const subject = await Subject.GetSubjectWhere({where: {url: url}}).catch(err => { throw err; });
                    resolve(subject);
                } catch (err) { reject(err); }
            }
        } else {
            try {
                await Subject.ValidateURL(url).catch(err => { throw err; });
                const subject = await Subject.GetSubjectWhere({where: {url: url}}).catch(err => { throw err; });
                resolve(subject);
            } catch (err) { reject(err); }
        }
    });
}

// Get Editor Text
const GetEditorText = async(userID, subjectID) => {
    return new Promise( async(resolve, reject) => {
        try {
            const relations = await Relation.GetRelationByUserAndSubject(userID, subjectID).catch(err => { throw err; });
            const ids = relations.map(relation => {return relation.textID });
            const texts = (await Text.GetTextsByID(ids).catch(err => { throw err; })).sort((a, b) => {
                return ids.indexOf(a.id) - ids.indexOf(b.id);
            });
            resolve(texts.map(text => { return text.dataValues; }));
        } catch(err) { reject(err); }
    });
}

// Get the User's and the Subject<S ID
const GetUserAndSubjectID = async(socket) => {
    return new Promise( async(resolve, reject) => {
        try {
            if(!socket.hasOwnProperty('user')) throw ("User not logged in");
            if(!socket.hasOwnProperty('subject')) throw ("Subject not being registered");
            resolve({userID: socket.user.id, subjectID: socket.subject.id});
        } catch (err) { reject(err); }
    });
  }

// Create a new Text and its Relation at a specific index
const CreateEmptyTextAtIndex = async(userID, subjectID, index) => {
    return new Promise( async(resolve, reject) => {
        try {
            if(index < 0 || index > await Relation.CountRelationByUserAndSubject(userID, subjectID)) throw "Index is out of bound";
            const text = await Text.CreateEmptyText().catch(err => { throw err; });
            await Relation.ChangeOrders(userID, subjectID, index, 1).catch(err => { throw err; });
            await Relation.CreateRelation(userID, subjectID, text.id, index).catch(err => { throw err; });
            resolve(text);
        } catch(err) { reject(err); }
    });
}

// Delete Text and its Relation at a specific index
const DeleteTextAtIndex = async(userID, subjectID, textID, index) => {
    return new Promise( async(resolve, reject) => {
        try {
            if(index < 0 || index > await Relation.CountRelationByUserAndSubject(userID, subjectID)) throw "Index is out of bound";
            await Relation.DeleteRelationByOrder(userID, subjectID, index).catch(err => { throw err; });
            await Relation.ChangeOrders(userID, subjectID, index, -1).catch(err => { throw err; });
            resolve();
        } catch(err) { reject(err); }
    });
}

// Get the user and the subject concurrently by their username and title respectively


/*****************************************************************************
    *  EXPLORER
*****************************************************************************/

// Get Explorer Text
const InitializeExplorer = async(socket, url) => {
    return new Promise( async(resolve, reject) => {
        try {
            await Subject.ValidateURL(url).catch(err => { throw err; });
            const subject = await Subject.GetSubjectWhere({where: {url: url}}).catch(err => { throw err; });
            let texts = [];
            if(socket.hasOwnProperty('user')) { texts = await GetExplorerText(socket.user.id, subject.id).catch(err => { throw err; });}
            else { texts = await GetExplorerText(-1, subject.id).catch(err => { throw err; });}
            resolve(texts);
        } catch(err) { reject(err) }
    });
}

// Get Explorer Text
const GetExplorerText = async(userID, subjectID) => {
    return new Promise( async(resolve, reject) => {
        try {
            const relations = await Relation.GetRelationBySubjectWithoutUser(userID, subjectID).catch(err => { throw err; });
            const ids = relations.map(relation => {return relation.textID });
            const texts = (await Text.GetTextsByID(ids).catch(err => { throw err; })).sort((a, b) => {
                return ids.indexOf(a.id) - ids.indexOf(b.id);
            });
            resolve(texts.map(text => { return text.dataValues; }));
        } catch(err) { reject(err); }
    });
}

// Adopt Explorer Text to Editor
const AdoptText = async(socket, from, to) => {
    return new Promise( async(resolve, reject) => {
        try {
            if(!socket.hasOwnProperty('explorer') || !socket.hasOwnProperty('editor')) throw "No Explorer or Editor list";
            if(from < 0 || from > socket.explorer.length) throw "Explorer index is out of bound";
            if(to < 0 || to > socket.editor.length) throw "Explorer index is out of bound";
            const {userID, subjectID} = await GetUserAndSubjectID(socket).catch(err => { throw err; });
            const text = await Text.CreateText(socket.explorer[from]).catch(err => { throw err; });
            await Relation.ChangeOrders(userID, subjectID, to, 1).catch(err => { throw err; });
            await Relation.CreateRelation(userID, subjectID, text.id, to).catch(err => { throw err; });
            resolve(text);
        } catch(err) { reject(err); }
    });
}

/*
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
*/

module.exports = {
    InitializeEditor,
    InitializeExplorer,
    GetEditorText,
    GetExplorerText,
    ValidateSubject,
    GetUserAndSubjectID,
    CreateEmptyTextAtIndex,
    DeleteTextAtIndex,
    AdoptText
};