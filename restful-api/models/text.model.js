const Sequelize = require('sequelize');
const db = require('../middleware/sequelize.mw.js');

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
    previousID: {
      type: Sequelize.INTEGER(10),
      allowNull: true
    },
    view: {
      type: Sequelize.INTEGER(10),
      allowNull: true
    },
    likes: {
      type: Sequelize.INTEGER(10),
      allowNull: true
    },
    dislikes: {
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
      if(results == 0) {
          Text.sync();
      }
      else {
          console.log("Sequelize : The following table exists : " + model_name + "s");
      }
  })
}

// Create Text
const CreateText = async(text) => {
  return new Promise( async(resolve,reject) => {

    console.log(text);
      let newText = {
          text: '',
          previous: 0,
          views: 0,
          likes: 0,
          dislikes: 0,
      };

      if(text.hasOwnProperty('text') === true) { newText.text = text.text; }
      if(text.hasOwnProperty('previous')=== true) { newText.previous = text.previous; }
      if(text.hasOwnProperty('views')=== true) { newText.views = text.views; }
      if(text.hasOwnProperty('likes')=== true) { newText.likes = text.likes; }
      if(text.hasOwnProperty('dislikes')=== true) { newText.dislikes = text.dislikes; }

      Text.create(newText).then(text => {
          resolve(text);
      }).catch(err => {
          reject(err);
      });
  });
}

const CreateEmptyText = async() => {
  return new Promise( async(resolve,reject) => {

      let newText = {
          text: '',
          previous: 0,
          views: 0,
          likes: 0,
          dislikes: 0,
      };

      Text.create(newText).then(text => {
          resolve(text.dataValues);
      }).catch(err => {
          reject(err);
      });
  });
}

// Get Text by ID
const getTextByID = async(id) => {
  return new Promise( async(resolve,reject) => {
      Text.findByPk(id).then(text => {
        resolve(text);
      }).catch(err => {
        reject(err);
      });
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

      /*
      Promise.all(
        texts.forEach(text => {
          Text.update(
            {   text: text.text, },
            {   where: { id: text.id }}
          ).catch(err => { reject(err); });
        })).then(() => resolve()).catch(err => { throw err });
    } catch (err) { reject(err); }*/
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


module.exports = {
  Text,
  CreateTableIfNonExistant,
  CreateText,
  CreateEmptyText,
  getTextByID,
  GetTextsByID,
  UpdateTextByID,
  UpdateTexts,
  DeleteTextByID
};