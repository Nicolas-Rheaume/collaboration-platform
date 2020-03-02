const Sequelize = require('sequelize');
const db = require('../middleware/sequelize.mw.js');
const bcrypt = require('bcryptjs');

// Model
const User = db.define('user', {
    id: {
        type: Sequelize.INTEGER,
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
        type: Sequelize.INTEGER,
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


module.exports = User;