const Sequelize = require('sequelize');
const db = require('../middleware/sequelize.mw.js');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const config = require("../configuration.js");
const NAME = "user";

// User Definition
const User = db.define(NAME, {
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

// Create Subject Table if it is non-existant
const CreateTableIfNonExistant = () => {
    db.query(`SHOW TABLES like "` + NAME + 's"').then(([results, metadata]) => {
        if(results == 0) {
            User.sync();
        }
        else {
            console.log("Sequelize : The following table exists : " + NAME + "s");
        }
    })
}

// Create User
const CreateUser = (user) => {
    return new Promise(resolve => {

        let newUser = {
            username: '',
            email: '',
            password: '',
            role: 0,
        }
        
        if(user.hasOwnProperty('username')) { newUser.username = user.username; }
        if(user.hasOwnProperty('email')) { newUser.username = user.email; }
        if(user.hasOwnProperty('password1')) { newUser.username = user.password1; }
        if(user.hasOwnProperty('role')) { newUser.username = 0; }

        User.create(newUser).then((user) => {
            resolve(user);
        }).catch(err => {
            resolve({success: false, message: err});
        });
    });
}

// Register a new User
const RegisterUser = (user) => {
    return new Promise(resolve => {
        if(user.hasOwnProperty("username")) {
            User.findAll({
                where: Sequelize.or(
                        {username: user.username}, 
                        {email: user.email}
                )
            }).then(users => {
                if(users.length > 0) resolve({success: false, message: "Username already exists"});
                else if(user.hasOwnProperty("password1")) {
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(user.password1, salt, (err, hash) => {
                            if(err) resolve({err: err});

                            let newUser = {
                                username: '',
                                email: '',
                                password: hash,
                                role: 0
                            }

                            if(user.hasOwnProperty('username')) { newUser.username = user.username; }
                            if(user.hasOwnProperty('email')) { newUser.email = user.email; }
    
                            User.create(newUser).then((user) => {
                                if(err) resolve({success: false, message: "failed at registration"});
                                else resolve({success: true, user: user});
                            });
                        });
                    });
                }
            }).catch(err => {
                resolve({success: false, message: err});
            });
        }
    });
}

// Authenticate a user
const AuthenticateUser = (user) => {
    return new Promise(resolve => {

        const username = user.username;
        const password = user.password;

        User.findOne({
            where: {
                username: username
            }
        }).then(user => {
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) resolve({err: err});
                else if(isMatch) {
                    const token = jwt.sign({data: user}, config.jwt_secret, {
                        expiresIn: 604800 // 1 week
                    });

                    resolve({
                        success: true,
                        token: 'JWT ' + token,
                        user: {
                          id: user.id,
                          username: user.username,
                          email: user.email,
                          role: user.role
                        }
                      });
                } else {
                    resolve({success: false, message: "Wrong password"});
                }
            });
        }).catch(err => {
            resolve({success: false, message: "User not found"});
        });

    });
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
    CreateTableIfNonExistant,
    CreateUser,
    RegisterUser,
    AuthenticateUser
};