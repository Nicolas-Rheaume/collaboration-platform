/*****************************************************************************
    *  VARIABLES
*****************************************************************************/
const arrayMove = require('array-move');
const config = require('../configuration');

// Global
const User = require('../models/user.model');
const Page = require('../models/page.model');
const Text = require('../models/text.model');
const Document = require('../models/document.model');
const Content = require('../mw/content.mw');

// Local
let connections = new Array();

module.exports = function(app, io){

  io.on('connect', socket => {
    console.log("connected");
  })

    io.on('connection', socket => {

      /*****************************************************************************
          *  MAIN
      *****************************************************************************/

      // User Connect
      connections.push(socket);
      socket.connectedOn = Date.now();
      console.log('Connected: %s sockets connected', connections.length);

      // User Disconnect
      socket.on('disconnect', () => {
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length);
      });

      // User Route
      socket.on("path", ({url}) => {
        socket.path = url;
        console.log(connections.indexOf(socket) + ": " + socket.path);
        if(url.startsWith("/content/")) socket.join(url);
        else socket.join('');
      });

      // User Information


      // User Page

      /*****************************************************************************
          *  ADMINISTRATION
      *****************************************************************************/
      // Get all connected users
      socket.on('user/connectedUsers', () => {
        if(socket.path === '/administration') {
          socket.emit('user/all-users', connections.map(user => { return {
            id: user.id,
            user: user.user,
            path: user.path,
            connectedOn: user.connectedOn
          }}));
        }
      });

      /*****************************************************************************
          *  REGISTRATION PAGE
      *****************************************************************************/

      // Login
      socket.on('user/login', async (user) => { 
        const data = await User.LoginUser(user).catch(err => { socket.emit("user/login-error", err); });
        connections[connections.indexOf(socket)].user = data.user;
        socket.emit("user/validated", data); 
      });

      // Register
      socket.on('user/register', async (user) => { 
        const data = await User.RegisterAndLoginUser(user).catch(err => { socket.emit("user/register-error", err); });
        connections[connections.indexOf(socket)].user = data.user;
        socket.emit("user/validated", data); 
      });

      // Authenticate
      socket.on('user/authenticate', async (token) => { 
        const user = await User.AuthenticateUser(token).catch(err => { socket.emit("user/login-error", err); });
        connections[connections.indexOf(socket)].user = user;
        socket.emit("user/currentUser", user); 
      });

      /*****************************************************************************
          *  DASHBOARD PAGE
      *****************************************************************************/

      // Create Page By Title
      socket.on('subject/create-by-title', async (title) => {
        await Page.CreatePageByTitle(title).then( async() => {
          const subjects = await Page.GetAllPages().catch(err => { socket.emit("subject/dashboard-error", err); });
          socket.emit("subject/create-error", null);
          io.emit("subject/dashboard", subjects);
        }).catch(err => { socket.emit("subject/create-error", err); });
      });

      // Delete Page By Title
      socket.on('subject/delete-by-title', async (title) => {
        await Page.DeletePageByTitle(title).catch(err => { socket.emit("subject/delete-error", err); });
        const subjects = await Page.GetAllPages().catch(err => { socket.emit("subject/dashboard-error", err); });
        io.emit("subject/dashboard", subjects);
      });

      // Get All Pages 
      socket.on('subject/get-all', async () => {
        const subjects = await Page.GetAllPages().catch(err => { socket.emit("subject/dashboard-error", err); });
        socket.emit("subject/dashboard", subjects);
      });

      // Search Pages
      socket.on('subject/search', async (search) => {
        let subjects = await Page.SearchPages(search.title).catch(err => { socket.emit("subject/dashboard-error", err); });
        subjects = await Document.GetContributorsAndTextsCount(subjects).catch(err => { throw err; });

        if(search.sort === 'null' || search.sort === 'none' || search.sort === 'A - Z') 
          subjects.sort( (a,b) => {
            if(a.title > b.title) return 1;
            else return -1;
          })
        else if(search.sort === 'Z - A') subjects.sort((a,b) => { 
          if(a.title < b.title) return 1;
            else return -1;
          }
        )
        else if(search.sort === 'Oldest') subjects.sort((a,b) => { 
          if(a.createdAt > b.createdAt) return 1;
            else return -1;
          }
        )
        else if(search.sort === 'Newest') subjects.sort((a,b) => { 
          if(a.createdAt < b.createdAt) return 1;
            else return -1;
          }
        )
        else if(search.sort === 'Most Contributors') subjects.sort((a,b) => { 
          if(a.contributors < b.contributors) return 1;
            else return -1;
          }
        )
        else if(search.sort === 'Least Contributors') subjects.sort((a,b) => { 
          if(a.contributors > b.contributors) return 1;
            else return -1;
          }
        )
        else if(search.sort === 'Most Texts') subjects.sort((a,b) => { 
          if(a.texts < b.texts) return 1;
            else return -1;
          }
        )
        else if(search.sort === 'Least Texts') subjects.sort((a,b) => { 
          if(a.texts > b.texts) return 1;
            else return -1;
          }
        )
        socket.emit("subject/dashboard", subjects);
      });

      /*****************************************************************************
          *  CONTENT
      *****************************************************************************/

     /*
     const ValidatePageURL = async(url) => {
       return new Promise( async(resolve, reject) => {

        // Check if the connections has already a subject
        if(connections[connections.indexOf(socket)].hasOwnProperty('subject')) {

          // If the connection's subject is the same, resolve
          if(connections[connections.indexOf(socket)].subject.url === url) resolve("Resolved with same subject");
          else {

            // Check if it has a valid URL
            await Page.ValidateURL(url).then( async() => {

              // Get Page
              const subject = await Page.GetPageWhere({where: {url: url}}).catch(err => reject(err));
              connections[connections.indexOf(socket)].subject = subject.dataValues;
              resolve("Successfully added the subject");
            }).catch(err => reject(err));
          }
        } else {
          // Check if it has a valid URL
          await Page.ValidateURL(url).then( async() => {

            // Get Page
            const subject = await Page.GetPageWhere({where: {url: url}}).catch(err => reject(err));
            connections[connections.indexOf(socket)].subject = subject.dataValues;
            resolve("Successfully added the subject");
          }).catch(err => reject(err));
        }
     });
    };
    */

      /*****************************************************************************
          *  EDITOR PAGE
      *****************************************************************************/

      // Initialize Editor Texts
      socket.on('editor/initialize', async (url) => {
        try {
          const {subject, texts} = await Content.InitializeEditor(socket, url).catch(err => { throw err; });
          socket.subject = subject;
          socket.editor = texts;
          socket.emit('editor/texts', await Text.MapTexts(texts));
        } catch(err) { socket.emit("editor/error", err); }
      });


      // Create new Text
      socket.on('editor/create-text-at-index', async(index) => {
        try {
          if(socket.hasOwnProperty('texts')) { if(socket.editor.length >= config.editor_text_size) { throw "Max number of texts"; }};
          const {userID, subjectID} = await Content.GetUserAndPageID(socket).catch(err => { throw err; });
          const text = await Content.CreateEmptyTextAtIndex(userID, subjectID, index).catch(err => { throw err; });
          socket.editor.splice(index, 0, text);
          socket.emit('editor/create-text-response', {text, index});
          socket.to(socket.path).broadcast.emit("explorer/update", {});
        } catch(err) {socket.emit("editor/error", err); }
      });

      // Update all texts
      socket.on('editor/update-texts', async(texts) => {
        try {
          const {userID, subjectID} = await Content.GetUserAndPageID(socket).catch(err => { throw err; });
          if(texts.length != socket.editor.length) throw "Texts mismatch";
          socket.editor.forEach((text, i) => { text.text = texts[i]; });
          await Text.UpdateTexts(socket.editor).catch(err => { throw err; });
          socket.to(socket.path).broadcast.emit("explorer/update", {});
        } catch(err) {socket.emit("editor/error", err); }
      });

      // Refresh all texts
      socket.on('editor/refresh-texts', async() => {
        try {
          const {userID, subjectID} = await Content.GetUserAndPageID(socket).catch(err => { throw err; });
          const texts = await Content.GetEditorText(userID, subjectID).catch(err => { throw err; });
          socket.emit('editor/texts', await Text.MapTexts(texts));
        } catch(err) { socket.emit("editor/error", err); }
      });

      // Drag text from to
      socket.on('editor/move-text', async({from , to}) => {
        try {
          if(from === to) throw "from and to value can't be the same";
          const {userID, subjectID} = await Content.GetUserAndPageID(socket).catch(err => { throw err; });
          arrayMove.mutate(socket.editor, from, to);
          const min = Math.min(from, to);
          const max = Math.max(from, to);
          await Document.UpdateDocumentsOrder(userID, subjectID, socket.editor.slice(min, max + 1), min).catch(err => { throw err; });
        } catch(err) { socket.emit("editor/move-text-error", {to, from}); }
      });

      // Delete Editor Text
      socket.on('editor/delete-text-at-index', async(index) => {
        try {
          console.log(index + ", " + socket.editor.length);
          if(index < 0 || index >= socket.editor.length) throw "Index is out of bound";
          const {userID, subjectID} = await Content.GetUserAndPageID(socket).catch(err => { throw err; });
          await Content.DeleteTextAtIndex(userID, subjectID, socket.editor[index].id, index).catch(err => { throw err; });
          socket.editor.splice(index, 1);
          socket.emit('editor/delete-text-response', index);
          socket.to(socket.path).broadcast.emit("explorer/update", {});
        } catch(err) {socket.emit("editor/error", err); }
      });

      // Increase or decrease the pointer of text
      socket.on('editor/increase-pointer', async({index , amount}) => {
        try {
          if(index < 0 || index >= socket.editor.length) throw "Index is out of bound";
          const {userID, subjectID} = await Content.GetUserAndPageID(socket).catch(err => { throw err; });
          await Text.IncreasePointerOfText(socket.editor[index], amount).catch(err => { throw err; });
          socket.editor[index].pointer += amount;
          const text = await Text.MapText(socket.editor[index]).catch(err => { throw err; });
          socket.emit('editor/text', {text, index});
        } catch(err) {socket.emit("editor/error", err); }
      });

      /*****************************************************************************
          *  EXPLORER PAGE
      *****************************************************************************/

      // Initialize Explorer Texts
      socket.on('explorer/initialize', async (url) => {
        try {
          const texts = await Content.InitializeExplorer(socket, url).catch(err => { throw err; });
          socket.explorer = texts;
          socket.emit('explorer/texts', await Text.MapTexts(texts));
        } catch(err) { socket.emit("explorer/error", err); }
      });

      // Get Explorer Texts
      socket.on('explorer/refresh-texts', async () => {
        try {
          const texts = await Content.GetExplorerText(socket.user.id, socket.subject.id).catch(err => { throw err; });
          socket.emit('explorer/texts', await Text.MapTexts(texts));
        } catch(err) { socket.emit("explorer/error", err); }
      });

      // Move text from to
      socket.on('explorer/move-text', async({from , to}) => {
        try {
          if(from === to) throw "from and to value can't be the same";
          const {userID, subjectID} = await Content.GetUserAndPageID(socket).catch(err => { throw err; });
          arrayMove.mutate(socket.explorer, from, to);
        } catch(err) { socket.emit("explorer/move-text-error", {to , from}); }
      });

      // Adopt text from explorer to editor
      socket.on('explorer/adopt-text', async({from , to}) => {
        try {
          const text = await Content.AdoptText(socket, from, to).catch(err => { throw err; });
          console.log(text);
          socket.editor.splice(to, 0, text);
        } catch(err) { socket.emit("explorer/adopt-text-error", {to, from}); }
      });

    });   
}
