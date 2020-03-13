const Sequelize = require('sequelize');
const db = require('../middleware/sequelize.mw.js');
const bcrypt = require('bcryptjs');

const model_name = "user";

// Model
const User = db.define(model_name, {
    id: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    role: {
        type: Sequelize.INTEGER(1),
        allowNull: false
    },
    createdAt: {
        type: Sequelize.DATE,
    },
    updatedAt: {
        type: Sequelize.DATE,
    }
    
  }, {
}
);

const Create = function() {
    db.query(`SHOW TABLES like "` + model_name + 's"').then(([results, metadata]) => {
        if(results == 0) {
            User.sync();
        }
        else {
            console.log("Sequelize : The following table exists : " + model_name + "s");
        }
    })
}

/*
module.exports.getUserById = function(id) {
    return User.find({
        where: {
           id: id
        }
     }).then(function(user) {
        if (!user) {
            return 'not find';
        }
        return user;
     });
}

module.exports.getUserByUsername = function(username) {
    return User.find({
        where: {
            username: username
        }
     }).then(function(user) {
        if (!user) {
            return 'not find';
        }
        return user;
     });
}

module.exports.addUser = function(newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if(err) throw err;
        newUser.password = hash;
        newUser.save(callback);
      });
    });
  }
  
  module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if(err) throw err;
      callback(null, isMatch);
    });
  }
  */


module.exports = {
    User,
    Create
};