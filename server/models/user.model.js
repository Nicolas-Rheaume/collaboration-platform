const Sequelize = require('sequelize');
const op = Sequelize.Op;
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
        type: Sequelize.ENUM(['Visitor', 'Contributor', 'Admin']),
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

// Register and Login a new user
const RegisterAndLoginUser = async(user) => {
    return new Promise( async(resolve, reject) => {
      const data = await RegisterUser(user).catch(err => reject(err));
  
      const username = user.username;
      const password = user.password1;
  
      LoginUser({username, password})
        .then(data => resolve(data))
        .catch(err => reject(err))
    });
};

// Register a new User
const RegisterUser = async (user) => {
    return new Promise(async (resolve, reject) => {
        if(user.hasOwnProperty("username") === true) {
            User.count({
                where: Sequelize.or(
                        {username: user.username}, 
                        {email: user.email}
                )
            }).then(count => {
                if(count > 0) reject("Invalid username or email. It already exists");
                else if(user.hasOwnProperty("password1")) {
                    try{
                        bcrypt.genSalt(10, (err, salt) => {
                            if(err) throw err;
                            else {
                                bcrypt.hash(user.password1, salt, (err, hash) => {
                                    if(err) throw err;
                                    else {
                                        let newUser = {
                                            username: user.username,
                                            email: user.email,
                                            password: hash,
                                            role: 'Contributor'
                                        }
                                        User.create(newUser).then((user) => { 
                                            resolve({
                                                id: user.dataValues.id,
                                                username: user.dataValues.username,
                                                email: user.dataValues.email,
                                                role: user.dataValues.role,
                                                createdAt: user.dataValues.createdAt
                                            });
                                        }).catch(err => reject(err));
                                    }
                                });
                            }
                        });
                    } catch (err) {
                        reject(err);
                    }
                }
            }).catch(err => {
                reject(err);
            });
        }
    });
}

// Authenticate a user
const LoginUser = async ({username, password}) => {
    return new Promise(async (resolve, reject) => {
        User.findOne({
            where: {
                username: username
            }
        }).then(user => {
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) reject("Passwords do not match");
                else if(isMatch) {
                    const token = jwt.sign({ username: user.username }, config.jwt_secret, {
                        expiresIn: 604800 // 1 week
                    });

                    resolve({
                        success: true,
                        token: 'JWT ' + token,
                        user: {
                          id: user.id,
                          username: user.username,
                          email: user.email,
                          role: user.role,
                          createdAt: user.createdAt
                        }
                      });
                } else {
                    reject("Wrong password");
                }
            });
        }).catch(err => {
            reject("User not found");
        });
    });
}

// Validate a user
const AuthenticateUser = async(token) => {
    return new Promise( async(resolve, reject) => {
        if(token == '' || token == null) reject('Empty token');
        else{
            jwt.verify(token.replace(/^JWT\s/, ''), config.jwt_secret, (err, decoded) => {
                if(err) reject("Invalid token")
                else {
                    GetUserByUsername(decoded.username).then(user => {
                        resolve({
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            role: user.role,
                            createdAt: user.createdAt
                        })
                    }).catch(err => reject(err));
                }
            });
        }
    });
}

// Get User by ID
const GetUserByID = async(id) => {
    return new Promise( async(resolve,reject) => {
      try {
        const user = await User.findByPk(id).catch(err => { throw "Error finding user by id"; });
        resolve(user);
      } catch(err) { reject(err); }
    });
}

// Get User by Username 
const GetUserByUsername = async (username) => {
    return new Promise((resolve, reject) => {
        User.findOne({
            where: {
                username: username
            }
        }).then(user => {
            resolve(user.dataValues);
        }).catch(err => {
            reject(err);
        });
    });
}

const GetTop5Users = async (username) => {
    return new Promise((resolve, reject) => {
        User.findAll({
            limit: 5,
            where: {
                username: {
                    [op.like]: '%' + username + '%'
                }
            }
        }).then(users => {
            resolve(users);
        }).catch(err => {
            reject(err);
        });
    });
}

module.exports = {
    User,
    CreateTableIfNonExistant,
    RegisterAndLoginUser,
    RegisterUser,
    LoginUser,
    AuthenticateUser,
    GetUserByUsername,
    GetTop5Users,
    GetUserByID
};