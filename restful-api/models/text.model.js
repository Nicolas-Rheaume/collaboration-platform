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
    previous: {
      type: Sequelize.INTEGER(10),
      allowNull: true
    },
    views: {
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
const CreateText = (text) => {
  return new Promise(resolve => {

    console.log(text);

      let newText = {
          text: '',
          previous: 0,
          views: 0,
          likes: 0,
          dislikes: 0,
      };

      if(text.hasOwnProperty('text')) { newText.text = text.text; }
      if(text.hasOwnProperty('previous')) { newText.previous = text.previous; }
      if(text.hasOwnProperty('views')) { newText.views = text.views; }
      if(text.hasOwnProperty('likes')) { newText.likes = text.likes; }
      if(text.hasOwnProperty('dislikes')) { newText.dislikes = text.dislikes; }

      console.log(newText);

      Text.create(newText).then(text => {
          resolve({success: true, text: text});
      }).catch(err => {
          resolve({success: false, message: err});
      });
  });
}

// Get Text by ID
const getTextByID = (id) => {
  return new Promise((resolve, reject) => {
      Text.findByPk(id).then(text => {
        resolve(text);
      }).catch(err => {
        reject(err);
      });
  });
}


module.exports = {
  Text,
  CreateTableIfNonExistant,
  CreateText,
  getTextByID
};