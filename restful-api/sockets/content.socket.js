const db = require('../middleware/sequelize.mw.js');
const User = require('../models/user.model.js');
const Subject = require('../models/subject.model.js');
const Text = require('../models/text.model.js');
const Relation = require('../models/relation.model.js');
const Content = require('../mw/content.mw.js');

const NAME = "Content: ";

module.exports = function(app, io){

  io.of("content").on('connection', socket => {

    // Client connected
    console.log(NAME + 'user connected');

    // Client disconnected
    socket.on('disconnect', () => {
      console.log(NAME + 'user disconnected');
    });

    /*************************************************************************************************************************************************
     * EDITOR TEXT EVENT LISTENERS
    *************************************************************************************************************************************************/

    /*****************************************************************************
     *  GET ALL EDITOR TEXT
     * @input {username: user.username, title: subject.title}
    *****************************************************************************/
   socket.on('get-editor-text', async (data) => {

    console.log(data);

    // Check if all values are there and valid 
    if(data.hasOwnProperty('username') === false) { socket.emit("error-message", "missing username") }
    else if(data.hasOwnProperty('title') === false) { socket.emit("error-message", "missing title") }

    else {

      // Get User and Subject
      const {user, subject} = await Content.GetUserAndSubject(data).catch(err => socket.emit("error-message", err))

      // Submit the new texts format to the user
      const texts = await Content.GetEditorText(user.id, subject.id).catch(err => socket.emit("error-message", err))
      socket.emit("editor-response", texts);
    }
  });

    /*****************************************************************************
     *  CREATE TEXT AT INDEX
     * @input {username: user.username, title: subject.title, index: text.position}
    *****************************************************************************/
    socket.on('create-text-at-index', async (data) => {

      // Check if all values are there and valid 
      if(data.hasOwnProperty('username') === false) { socket.emit("error-message", "missing username") }
      else if(data.hasOwnProperty('title') === false) { socket.emit("error-message", "missing title") }
      else if(data.hasOwnProperty('index') === false) { socket.emit("error-message", "missing index") }

      else {

        // Get User and Subject
        const {user, subject} = await Content.GetUserAndSubject(data).catch(err => socket.emit("error-message", err))

        // Check if the index is valid
        const count = await Relation.CountRelationByUserAndSubject(user.id, subject.id).catch(err => socket.emit("error-message", err))
        if(data.index < 0 || data.index > count) { socket.emit("error-message", {success: false, message: "index out of bound"}) }
        else {

          // Create an Empty Text
          const text = await Text.CreateEmptyText().catch(err => socket.emit("error-message", err));

          // Insert the new text at index
          await Relation.InsertAtIndex(user.id, subject.id, text.id, data.index).catch(err => socket.emit("error-message", err))

          // Submit the new texts format to the user
          const texts = await Content.GetEditorText(user.id, subject.id).catch(err => socket.emit("error-message", err))
          socket.emit("editor-response", texts);
          socket.broadcast.emit("explorer-update");
        }
      }
    });

    /*****************************************************************************
     *  UPDATE TEXT AT INDEX
     * @input {username: user.username, title: subject.title, text: editorText index: text.position}
    *****************************************************************************/
   socket.on('update-text-at-index', async (data) => {

    // Check if all values are there and valid 
    if(data.hasOwnProperty('username') === false) { socket.emit("error-message", "missing username") }
    else if(data.hasOwnProperty('title') === false) { socket.emit("error-message", "missing title") }
    else if(data.hasOwnProperty('text') === false) { socket.emit("error-message", "missing text") }
    else if(data.hasOwnProperty('index') === false) { socket.emit("error-message", "missing index") }

    else {

      // Get User and Subject
      const {user, subject} = await Content.GetUserAndSubject(data).catch(err => socket.emit("error-message", err))

      // Check if the index is valid
      const count = await Relation.CountRelationByUserAndSubject(user.id, subject.id).catch(err => socket.emit("error-message", err))
      if(data.index < 0 || data.index > count) { socket.emit("error-message", {success: false, message: "index out of bound"}) }
      else {

        // Get Relation by UserID, SubjectID and Order
        const relation = await Relation.GetRelationByUserSubjectAndOrder(user.id, subject.id, data.index).catch(err => socket.emit("error-message", err));

        // Update Text at index
        await Text.UpdateTextByID(relation.textID, data.text).catch(err => socket.emit("error-message", err));

        // Submit the Editor Texts to the user
        const texts = await Content.GetEditorText(user.id, subject.id).catch(err => socket.emit("error-message", err))
        socket.emit("editor-response", texts);
        socket.broadcast.emit("explorer-update");
      }
    }
  });

    /*****************************************************************************
     *  DELETE TEXT AT INDEX
     * @input {username: user.username, title: subject.title, index: text.position}
    *****************************************************************************/
    socket.on('delete-text-at-index', async (data) => {
      
      // Check if all values are there and valid 
      if(data.hasOwnProperty('username') === false) { socket.emit("error-message", {success: false, message: "missing username"}) }
      else if(data.hasOwnProperty('title') === false) { socket.emit("error-message", {success: false, message: "missing title"}) }
      else if(data.hasOwnProperty('index') === false) { socket.emit("error-message", {success: false, message: "missing index"}) }

      else {

        // Get User and Subject
        const {user, subject} = await Content.GetUserAndSubject(data).catch(err => socket.emit("error-message", err))

        // Check if the index is valid
        const count = await Relation.CountRelationByUserAndSubject(user.id, subject.id).catch(err => socket.emit("error-message", err))
        if(data.index < 0 || data.index > count) { socket.emit("error-message", {success: false, message: "index out of bound"}) }
        else {

          // Get Relation by UserID, SubjectID and Order
          const relation = await Relation.GetRelationByUserSubjectAndOrder(user.id, subject.id, data.index).catch(err => socket.emit("error-message", err));

          // Delete Text and Relation and Decremente
          await Text.DeleteTextByID(relation.textID).catch(err => socket.emit("error-message", err));
          await Relation.DecreaseOrder(user.id, subject.id, data.index + 1).catch(err => socket.emit("error-message", err));
          await Relation.DeleteRelationByID(relation.id).catch(err => socket.emit("error-message", err));

          // Submit the Editor Texts to the user
          const texts = await Content.GetEditorText(user.id, subject.id).catch(err => socket.emit("error-message", err))
          socket.emit("editor-response", texts);
          socket.broadcast.emit("explorer-update");

        }
      }
    });

    /*************************************************************************************************************************************************
     * EXPLORER TEXT EVENT LISTENERS
    *************************************************************************************************************************************************/

    /*****************************************************************************
     *  GET ALL EXPLORER TEXT
     * @input {username: user.username, title: subject.title}
    *****************************************************************************/
   socket.on('get-explorer-text', async (data) => {

    // Check if all values are there and valid 
    if(data.hasOwnProperty('username') === false) { socket.emit("error-message", {success: false, message: "missing username"}) }
    else if(data.hasOwnProperty('title') === false) { socket.emit("error-message", {success: false, message: "missing title"}) }

    else {

      // Get User and Subject
      const {user, subject} = await Content.GetUserAndSubject(data).catch(err => socket.emit("error-message", err))

      // Submit the new texts format to the user
      const texts = await Content.GetExplorerText(user.id, subject.id).catch(err => socket.emit("error-message", err))
      socket.emit("explorer-response", texts);
    }
  });





    // Create Text and Relation
    socket.on('createContent', (data) => {

        console.log(data);

        // Search for the User
        User.GetUserByUsername(data.username).then((user) => {
            if(user.success === false) socket.emit("error-message", user.message);
            else {

                console.log(user.user.dataValues);

                // Search for the Subject
                Subject.GetSubjectByTitle(data.title).then((subject) => {
                    if(subject.success === false) socket.emit("error-message", subject.message);
                    else {

                        console.log(subject.subject.dataValues);

                        // Create each block of text
                        for(let i = 0; i < data.texts.length; i++) {
                            Text.CreateText(data.texts[i]).then((text) => {
                                console.log(text);
                                if(text.success === false) socket.emit("error-message", text.message);
                                else {

                                    console.log(text.text.dataValues);

                                    // Create each relation
                                    Relation.CreateRelation(
                                        user.user.id,
                                        subject.subject.id,
                                        text.text.id,
                                        i   // order
                                    ).then((relation) => {
                                        console.log(relation);
                                    });
                                }
                            });
                        }
                    }
                });
            }
        });
    });


    // Get Content
    socket.on('getContent', async(data) => {
        try {
            const user = User.GetUserByUsername(data.username).catch(err => socket.emit("error-message", err));     // Get the User ID
            const subject = Subject.GetSubjectByTitle(data.title).catch(err => socket.emit("error-message", err));  // Get the Subject ID

            Promise.all([user, subject]).then( async(values) => {

                // EDITOR TEXT : Search for the Relations for the Editor
                const editor = Relation.GetRelationByUserAndSubject(values[0].dataValues.id, values[1].dataValues.id).then(async (relations) => {
                    const text = relations.map(async relation => {
                        const text = await Text.getTextByID(relation.dataValues.textID).catch(err => socket.emit("error-message", err));
                        return text.dataValues;
                    });
                    return await Promise.all(text);

                }).catch(err => socket.emit("error-message", err));

                // EXPLORER TEXT : Search for the Relations for the Explorer
                const explorer = Relation.GetRelationBySubjectWithoutUser(values[0].dataValues.id, values[1].dataValues.id).then(async (relations) => {
                    const text = relations.map(async relation => {
                        const text = await Text.getTextByID(relation.dataValues.textID).catch(err => socket.emit("error-message", err));
                        return text.dataValues;
                    })
                    return await Promise.all(text);

                }).catch(err => socket.emit("error-message", err));

                // Return values
                Promise.all([subject, editor, explorer]).then( async(values) => {
                    socket.emit("content-response", {
                        subject: values[0].dataValues,
                        editorText: values[1],
                        explorerText: values[2]
                    });
                })
            });
        } catch(err) {
            socket.emit("error-message", err);
        }
    });

    // Create Empty Text by User
    socket.on('create-empty-text-by-username-and-title', async (data) => {
      if(data.user === null || data.subject === null) socket.emit("error-message", {success: false, message: "Missing information"});
      else {
        try {
          const text = Text.CreateEmptyText().catch(err => socket.emit("error-message", err));
          const user = User.GetUserByUsername(data.username).catch(err => socket.emit("error-message", err)); 
          const subject = Subject.GetSubjectByTitle(data.title).catch(err => socket.emit("error-message", err));

          Promise.all([user, subject, text]).then( async(data) => {
            const relation = await Relation.CreateRelation(data[0].dataValues.id, data[1].dataValues.id, data[2].dataValues.id, 0).catch(err => socket.emit("error-message", err));
            const editor = await Relation.GetRelationByUserAndSubject(data[0].dataValues.id, data[1].dataValues.id).then(async (relations) => {
              const text = relations.map(async relation => {
                  const text = await Text.getTextByID(relation.dataValues.textID).catch(err => socket.emit("error-message", err));
                  return text.dataValues;
              });
              Promise.all(text).then( async(data2) => {
                console.log(data2);
                socket.emit("editor-response", {
                  editorText: data2,
              });
              });
            });



          }).catch(err => socket.emit("error-message", err));
            /*

            const relation = await Relation.CreateRelation(data[0].id, data[1].id, data[2].id, 0).then(relations => {
              const editor = Relation.GetRelationByUserAndSubject(values[0].dataValues.id, values[1].dataValues.id).then(async (relations) => {
                const text = relations.map(async relation => {
                    const text = await Text.getTextByID(relation.dataValues.textID).catch(err => socket.emit("error-message", err));
                    return text.dataValues;
                });
                Promise.all(text);
            }).catch(err => socket.emit("error-message", err));



          /*
            Promise.all([texts]).then(async(rel) => {
              socket.emit("editor-response", {
                subject: values[0].dataValues,
                editorText: values[1],
                explorerText: values[2]
              });
            });
          });

          socket.emit("editor-response", {
            text: text,
            user: user,
            subject: subject,
            relation: relation
        });*/

        } catch(err) {
          socket.emit("error-message", err);
        }
      }
    });









    /*
    // Create Subject
    socket.on('create', (data) => {
      Subject.CreateSubject(data).then(() => {
        Subject.GetAllSubjects().then(subjects => {
          socket.emit("update", subjects);
          socket.broadcast.emit("update", subjects);
        });
      });
    });

    // Get All Users 
    socket.on('get', (data) => {
      Subject.GetAllSubjects().then(subjects => {
        socket.emit("get", subjects);
      });
    });

    // Get Subject by id
    socket.on('get subject by id', (data) => {
      Subject.GetSubjectByID(data).then(subject => {
        socket.emit("get", subject);
      });
    });

    // Update Subject
    socket.on('save', (data) => {
      Subject.UpdateSubject(data).then(subject => {
        socket.emit("get", subject);
        socket.broadcast.emit("get", subject);
      });
    });

    // Delete Subject
    socket.on('delete', (subject) => {
      Subject.DeleteSubjectByID(subject.id).then(() => {
        Subject.GetAllSubjects().then(subjects => {
          socket.emit("update", subjects);
          socket.broadcast.emit("update", subjects);
        });
      });
    });

    // Update User - fix
    socket.on('update', (data) => {
      Subject.Subject.findAll().then(subjects => {
        socket.emit("update", subjects);
        socket.broadcast.emit("update", subjects);
      }).catch(err => console.log(err));
    });
    */


  });
}