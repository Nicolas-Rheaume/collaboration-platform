
const User = require('../models/user.model.js');
const Page = require('../models/page.model.js');
const Text = require('../models/text.model.js');
const Document = require('../models/document.model.js');

/*****************************************************************************
    *  EDITOR
*****************************************************************************/

const InitializeEditor = async(socket, url) => {
    return new Promise( async(resolve, reject) => {
        try {
            if(!socket.hasOwnProperty('user')) throw "User is not logged in";
            const page = await ValidatePage(socket, url).catch(err => {throw err});
            const texts =  await GetEditorText(socket.user.id, page.id).catch(err => {throw err});
            resolve({page, texts});
        } catch(err) {
            reject(err)
        }
    });
}

// Check if the url provided is valid
const ValidatePage = async (socket, url) => {
    return new Promise( async(resolve, reject) => {
        if(socket.hasOwnProperty('page')) {
            if(socket.page.url === url) resolve(socket.page);
            else {
                try {
                    await Page.ValidateURL(url).catch(err => { throw err; });
                    const page = await Page.GetPageWhere({where: {url: url}}).catch(err => { throw err; });
                    resolve(page);
                } catch (err) { reject(err); }
            }
        } else {
            try {
                await Page.ValidateURL(url).catch(err => { throw err; });
                const page = await Page.GetPageWhere({where: {url: url}}).catch(err => { throw err; });
                resolve(page);
            } catch (err) { reject(err); }
        }
    });
}

// Get Editor Text
const GetEditorText = async(userID, pageID) => {
    return new Promise( async(resolve, reject) => {
        try {
            const documents = await Document.GetDocumentByUserAndPage(userID, pageID).catch(err => { throw err; });
            const ids = documents.map(document => {return document.textID });
            const texts = (await Text.GetTextsByID(ids).catch(err => { throw err; })).sort((a, b) => {
                return ids.indexOf(a.id) - ids.indexOf(b.id);
            });
            resolve(texts.map(text => { return text.dataValues; }));
        } catch(err) { reject(err); }
    });
}

// Get the User's and the Page<S ID
const GetUserAndPageID = async(socket) => {
    return new Promise( async(resolve, reject) => {
        try {
            if(!socket.hasOwnProperty('user')) throw ("User not logged in");
            if(!socket.hasOwnProperty('page')) throw ("Page not being registered");
            resolve({userID: socket.user.id, pageID: socket.page.id});
        } catch (err) { reject(err); }
    });
  }

// Create a new Text and its Document at a specific index
const CreateEmptyTextAtIndex = async(userID, pageID, index) => {
    return new Promise( async(resolve, reject) => {
        try {
            if(index < 0 || index > await Document.CountDocumentByUserAndPage(userID, pageID)) throw "Index is out of bound";
            const text = await Text.CreateEmptyText(userID).catch(err => { throw err; });
            await Document.ChangeOrders(userID, pageID, index, 1).catch(err => { throw err; });
            await Document.CreateDocument(userID, pageID, text.id, index).catch(err => { throw err; });
            resolve(text);
        } catch(err) { reject(err); }
    });
}

// Delete Text and its Document at a specific index
const DeleteTextAtIndex = async(userID, pageID, textID, index) => {
    return new Promise( async(resolve, reject) => {
        try {
            if(index < 0 || index > await Document.CountDocumentByUserAndPage(userID, pageID)) throw "Index is out of bound";
            await Document.DeleteDocumentByOrder(userID, pageID, index).catch(err => { throw err; });
            await Document.ChangeOrders(userID, pageID, index, -1).catch(err => { throw err; });
            resolve();
        } catch(err) { reject(err); }
    });
}

// Get the user and the page concurrently by their username and title respectively


/*****************************************************************************
    *  EXPLORER
*****************************************************************************/

// Get Explorer Text
const InitializeExplorer = async(socket, url) => {
    return new Promise( async(resolve, reject) => {
        try {
            await Page.ValidateURL(url).catch(err => { throw err; });
            const page = await Page.GetPageWhere({where: {url: url}}).catch(err => { throw err; });
            let texts = [];
            if(socket.hasOwnProperty('user')) { texts = await GetExplorerText(socket.user.id, page.id).catch(err => { throw err; });}
            else { texts = await GetExplorerText(-1, page.id).catch(err => { throw err; });}
            resolve(texts);
        } catch(err) { reject(err) }
    });
}

// Get Explorer Text
const GetExplorerText = async(userID, pageID) => {
    return new Promise( async(resolve, reject) => {
        try {
            const documents = await Document.GetDocumentByPageWithoutUser(userID, pageID).catch(err => { throw err; });
            const ids = documents.map(document => {return document.textID });
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
            const {userID, pageID} = await GetUserAndPageID(socket).catch(err => { throw err; });
            const text = await Text.CreateText(socket.explorer[from], userID).catch(err => { throw err; });
            await Document.ChangeOrders(userID, pageID, to, 1).catch(err => { throw err; });
            await Document.CreateDocument(userID, pageID, text.id, to).catch(err => { throw err; });
            resolve(text);
        } catch(err) { reject(err); }
    });
}

/*
const GetExplorerText = async (userID, pageID) => {
    return new Promise( async(resolve, reject) => {


        // Get all the documents
        const documents = await Document.GetDocumentByPageWithoutUser(userID, pageID).catch(err => reject(err));

        // Get Editor Texts
        let texts = new Array(documents.length);
        documents.forEach( async(document,i) => {
            texts[i] = Text.getTextByID(document.dataValues.textID).catch(err => reject(err));
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
    ValidatePage,
    GetUserAndPageID,
    CreateEmptyTextAtIndex,
    DeleteTextAtIndex,
    AdoptText
};