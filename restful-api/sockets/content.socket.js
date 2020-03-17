const db = require('../middleware/sequelize.mw.js');
const User = require('../models/user.model.js');
const Subject = require('../models/subject.model.js');
const Text = require('../models/text.model.js');
const Relation = require('../models/relation.model.js');

const NAME = "Content: ";

module.exports = function(app, io){

  io.of("content").on('connection', socket => {

    // Client connected
    console.log(NAME + 'user connected');

    // Client disconnected
    socket.on('disconnect', () => {
      console.log(NAME + 'user disconnected');
    });

    // Create Text and Relation
    socket.on('createContent', (data) => {

        console.log(data);

        // Search for the User
        User.GetUserByUsername(data.username).then((user) => {
            if(user.success === false) socket.emit("errorMessage", user.message);
            else {

                console.log(user.user.dataValues);

                // Search for the Subject
                Subject.GetSubjectByTitle(data.title).then((subject) => {
                    if(subject.success === false) socket.emit("errorMessage", subject.message);
                    else {

                        console.log(subject.subject.dataValues);

                        // Create each block of text
                        for(let i = 0; i < data.texts.length; i++) {
                            Text.CreateText(data.texts[i]).then((text) => {
                                console.log(text);
                                if(text.success === false) socket.emit("errorMessage", text.message);
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
            const user = User.GetUserByUsername(data.username).catch(err => socket.emit("errorMessage", err));     // Get the User ID
            const subject = Subject.GetSubjectByTitle(data.title).catch(err => socket.emit("errorMessage", err));  // Get the Subject ID

            Promise.all([user, subject]).then( async(values) => {

                // EDITOR TEXT : Search for the Relations for the Editor
                const editor = Relation.GetRelationByUserAndSubject(values[0].dataValues.id, values[1].dataValues.id).then(async (relations) => {
                    const text = relations.map(async relation => {
                        const text = await Text.getTextByID(relation.dataValues.textID).catch(err => socket.emit("errorMessage", err));
                        return text.dataValues;
                    });
                    return await Promise.all(text);

                }).catch(err => socket.emit("errorMessage", err));

                // EXPLORER TEXT : Search for the Relations for the Explorer
                const explorer = Relation.GetRelationBySubjectWithoutUser(values[0].dataValues.id, values[1].dataValues.id).then(async (relations) => {
                    const text = relations.map(async relation => {
                        const text = await Text.getTextByID(relation.dataValues.textID).catch(err => socket.emit("errorMessage", err));
                        return text.dataValues;
                    })
                    return await Promise.all(text);

                }).catch(err => socket.emit("errorMessage", err));

                // Return values
                Promise.all([subject, editor, explorer]).then( async(values) => {
                    socket.emit("contentResponse", {
                        subject: values[0].dataValues,
                        editorText: values[1],
                        explorerText: values[2]
                    });
                })
            });
        } catch(err) {
            socket.emit("errorMessage", err);
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