const Sequelize = require('sequelize');
const db = require('../middleware/sequelize.mw.js');
const User = require('../models/user.model.js');

const model_name = "text";

// Model
const Text = db.define(model_name, {
    id: {
      type: Sequelize.INTEGER(10),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    text: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    authorID: {
      type: Sequelize.INTEGER(10),
      allowNull: true
    },
    previousTextID: {
      type: Sequelize.INTEGER(10),
      allowNull: true
    },
    depth: {
      type: Sequelize.INTEGER(10),
      allowNull: true
    },
    pointer: {
      type: Sequelize.INTEGER(10),
      allowNull: true
    },
    branches: {
      type: Sequelize.INTEGER(10),
      allowNull: true
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

// Create Text table if non existant
const CreateTableIfNonExistant = function() {
  db.query(`SHOW TABLES like "` + model_name + 's"').then(([results, metadata]) => {
      if(results == 0) Text.sync();
      else console.log("Sequelize : The following table exists : " + model_name + "s");
  })
}

// Create Empty Text
const CreateEmptyText = async(authorID) => {
  return new Promise( async(resolve,reject) => {

      let newText = {
          text: '',
          authorID: authorID,
          previousTextID: -1,
          depth: 0,
          pointer: 0,
          branches: 0
      };

      Text.create(newText).then(text => {
          resolve(text.dataValues);
      }).catch(err => {
          reject(err);
      });
  });
}

// Create Text based on another text
const CreateText = async(text, authorID) => {
  return new Promise( async(resolve,reject) => {
      let newText = {
          text: '',
          authorID: 0,
          previousTextID: 0,
          depth: 0,
          pointer: 0,
          branches: 0
      };

      if(text.hasOwnProperty('text') === true) { newText.text = text.text; }
      if(authorID != null) { newText.authorID = authorID; }
      if(text.hasOwnProperty('views')=== true) { newText.views = text.views; }
      if(text.hasOwnProperty('previousTextID')=== true) { newText.previousTextID = text.id; }
      if(text.hasOwnProperty('depth')=== true) { newText.depth = text.depth + 1; }
      if(text.hasOwnProperty('pointer')=== true) { newText.pointer = newText.depth; }

      try {
        const t = await Text.create(newText).catch(err => { throw err });
        await Text.increment({ branches: 1 }, {where: {id: text.id}}).catch(err => { throw err });
        resolve(t);
      } catch (err) { reject(err); }
  });
}

// Get Text by ID
const GetTextByID = async(id) => {
  return new Promise( async(resolve,reject) => {
    try {
      const text = await Text.findByPk(id).catch(err => { throw "Error finding text by id"; });
      resolve(text);
    } catch(err) { reject(err); }
  });
}

// Update Text by ID
const UpdateTextByID = async(textID, text) => {
  return new Promise( async(resolve,reject) => {
      Text.update(
          {   text: text, },
          {   where: { id: textID }}
      ).then(() => {
          resolve();
      }).catch(err => {
          reject(err);
      });
  });
}

// Update Texts by ID
const UpdateTexts = async(texts) => {
  return new Promise( async(resolve,reject) => {
    try {
      let updates = new Array(texts.length);
      texts.forEach( async(text, i) => {
        updates[i] = Text.update({ text: text.text }, { where: { id: text.id }}).catch(err => { throw err; });
      });
      await Promise.all(updates).catch(err => {throw err});
      resolve();
    } catch(err) { reject(err); }
  });
}

// Delete Text by ID
const DeleteTextByID = async(id) => {
  return new Promise( async(resolve,reject) => {
      Text.destroy(
          {   where: { id: id }}
      ).then(() => {
          resolve();
      }).catch(err => {
          reject(err);
      });
  });
}

// 
const GetTextsByID = async(IDs) => {
  return new Promise( async(resolve,reject) => {
    try { resolve( await Text.findAll({ where: { id: IDs}}).catch(err => { throw err; }))}
    catch(err) { reject(err); }
  });
}

const CountPreviousTextID = async(id) => {
  return new Promise( async(resolve,reject) => {
    try { resolve( await Text.count({ where: { previousTextID: id}}).catch(err => { throw err; }))}
    catch(err) { reject(err); }
  });
}

// Map Texts Data for client
const MapTexts = async(texts) => {
  return new Promise( async(resolve,reject) => {
    try {
      Promise.all(
        texts.map( async(text, i) => {
          const disable = text.pointer === text.depth ? false: true;

          let currentText = text;
          let count = text.depth - text.pointer;
          for(let i = count; i > 0; i--) {
            currentText = await GetTextByID(currentText.previousTextID).catch(err => { throw err; });
          }

          const author = await User.GetUserByID(currentText.authorID).catch(err => { throw err; });
          const popularity = await CountPreviousTextID(currentText.id).catch(err => { throw err; });    
          return {
            text: currentText.text,
            author: author.username,
            disabled: disable,
            popularity: popularity,
            branches: currentText.branches,
            createdAt: currentText.createdAt,
            updatedAt: currentText.updatedAt
          };
        })
      ).then((data) => {
        resolve(data);
      }).catch(err => { throw err; });  
    } catch(err) { reject(err); }
  });
}

// Map Text Data for client
const MapText = async(text) => {
  return new Promise( async(resolve,reject) => {
    try {
      if(text === null) throw "Text is empty";
      const disable = text.pointer === text.depth ? false: true;

      let currentText = text;
      let count = text.depth - text.pointer;
      for(let i = count; i > 0; i--) {
        currentText = await GetTextByID(currentText.previousTextID).catch(err => { throw err; });
      }

      const author = await User.GetUserByID(currentText.authorID).catch(err => { throw err; });
      const popularity = await CountPreviousTextID(currentText.id).catch(err => { throw err; });

      resolve({
        text: currentText.text,
        author: author.username,
        disabled: disable,
        popularity: popularity,
        branches: currentText.branches,
        createdAt: currentText.createdAt,
        updatedAt: currentText.updatedAt
      });
    } catch(err) { reject(err); }
  });
}

// Increase pointer of text
const IncreasePointerOfText = async(text, amount) => {
  return new Promise( async(resolve,reject) => {
    try {
      if((text.depth < text.pointer + amount) || ( 0 > text.pointer + amount)) throw "Amount out of bound";
      await Text.increment({ pointer: amount }, { where: { id: text.id,}
        }).catch(err => reject(err))
      resolve();
    } catch(err) {reject(err)}
  });
}


module.exports = {
  Text,
  CreateTableIfNonExistant,
  CreateText,
  CreateEmptyText,
  GetTextByID,
  GetTextsByID,
  UpdateTextByID,
  UpdateTexts,
  DeleteTextByID,
  CountPreviousTextID,
  MapText,
  MapTexts,
  IncreasePointerOfText
};