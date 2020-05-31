const Sequelize = require('sequelize');
const db = require('../middleware/sequelize.mw.js');
const NAME = "page";
const Op = Sequelize.Op;

// Page Definition
const Page = db.define(NAME, {
    id: {
        type: Sequelize.INTEGER(10),
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    title: {
        type: Sequelize.STRING(45),
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    url: {
        type: Sequelize.STRING(50),
        allowNull: true
    },/*
    creator: {
        type: Sequelize.TEXT,
        allowNull: true
    },*/
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

// Create Page Table if it is non-existant
const CreateTableIfNonExistant = async() => {
    return new Promise(async(resolve, reject) => {
        db.query(`SHOW TABLES like "` + NAME + 's"').then(([results, metadata]) => {
            if(results == 0) {
                Page.sync();
            }
            else {
                console.log("Sequelize : The following table exists : " + NAME + "s");
            }
            resolve();
        })
    });
}

// Create Page
const CreatePage = async(page) => {
    return new Promise(async(resolve, reject) => {

        let newPage = {
            title: '',
            description: '',
        }

        if(page.hasOwnProperty('title')) { newPage.title = page.title; }
        if(page.hasOwnProperty('description')) { newPage.description = page.description; }

        Page.create(newPage).then(page => {
            resolve(page);
        }).catch(err => {
            console.log(err); 
            resolve();
        });
    });
}

// Create Page by title 
const CreatePageByTitle = async(title) => {
    return new Promise(async(resolve, reject) => {
        await ValidateTitle(title).then( async({name, url}) => {
            // Check if the title already exists
            if(await TitleExists(name).catch(err => reject(err))) {
                reject("Page title already exists");
            } else {
                // Create the page
                const page = await Page.create({title: name, url: url}).catch(err => reject(err));
                resolve(page);
            }
        }).catch(err => reject(err));
    });
}

const ValidateTitle = async(title) => {
    return new Promise(async(resolve, reject) => {

        if(title === '' || title === null) reject("Page title can't be empty");
        else {
            let name = title.replace(/\s\s+/g, ' ');
            name = name.split(" ");
            if(name[0] == '') name.splice(0, 1);
            if(name[name.length - 1] == '') name.splice(-1, 1);
            name = name.join(" ");

            const path = ('/' + name).replace(/ /g, "_").match(/(?<!\?.+)(?<=\/)[\w-]+(?=[/\r\n?]|$)/g);

            if(path === null || path.length != 1) reject("Page URL is invalid");
            else {
                const url = path[0];
                resolve({name, url});
            }
        }

    })
}

const ValidateURL = async(url) => {
    return new Promise(async(resolve, reject) => {
        if(url === '' || url === null) reject("Page URL can't be empty");
        else {
            const path = ('/' + url).replace(/ /g, "_").match(/(?<!\?.+)(?<=\/)[\w-]+(?=[/\r\n?]|$)/g);
            if(path === null || path.length != 1) reject("Page URL is invalid");
            else resolve(path[0]);
        }
    })
}

const TitleExists = async(title) => {
    return new Promise(async(resolve, reject) => {
        Page.findOne({
            where: {title: title}
        }).then(page => {
            if(page != null) resolve(true);
            else resolve(false);
        }).catch(err => {
            reject("Error validating the title");
        });
    });
}

const URLExists = async(url) => {
    return new Promise(async(resolve, reject) => {
        Page.findOne({
            where: {url: url }
        }).then(page => {
            if(page != null) resolve(true);
            else resolve(false);
        }).catch(err => {
            reject("Error validating the URL");
        });
    });
}


// Get Page by ID
const GetPageByID = async(id) => {
    return new Promise(async(resolve, reject) => {
        Page.findByPk(id).then(page => {
            resolve(page);
        }).catch(err => {
            console.log(err);
            resolve();
        });
    });
}

// Get Page by ID
const GetPageByTitle = async(title) => {
    return new Promise(async(resolve, reject) => {
        Page.findOne({
            where: {
                title: title
            }
        }).then(page => {
            resolve(page);
        }).catch(err => {
            reject(err);
        });
    });
}

// Get Page by Where
const GetPageWhere = async(search) => {
    return new Promise(async(resolve, reject) => {
        Page.findOne(search).then(page => {
            if(page === null) reject("Page doesn't exists");
            else resolve(page.dataValues);
        }).catch(err => {
            reject(err);
        });
    });
}

// Update Page
const UpdatePage = async(page) => {
    return new Promise(async(resolve, reject) => {
        Page.update(
            {   title: page.title,
                description: page.description
            },
            { where: { id: page.id }}
        ).then(() => {
            Page.findByPk(page.id).then(page => {
                resolve(page);
            }).catch(err => {
                console.log(err);
                resolve();
            });
        }).catch(err => {
            console.log(err);
            resolve();
        });
    });
}

// Delete Page
const DeletePageByID = async(id) => {
    return new Promise(async(resolve, reject) => {
        Page.destroy({
            where: {
              id: id,
            }
        }).then( page => {
            resolve(page);
        }).catch(err => {
            reject(err);
        });
    });
}

// Delete Page
const DeletePageByTitle = async(title) => {
    return new Promise(async(resolve, reject) => {
        Page.destroy({
            where: {
              title: title,
            }
        }).then(() => {
            resolve();
        }).catch(err => {
            reject(err)
        });
    });
}

// Get All Pages
const GetAllPages = async() => {
    return new Promise(async(resolve, reject) => {
        Page.findAll().then(pages => {
            let list = [];
            pages.forEach(page => {
                list.push({
                    id: page.dataValues.id,
                    title: page.dataValues.title,
                    description: page.dataValues.description,
                    url: page.dataValues.url,
                    createdAt: page.dataValues.createdAt,
                    updatedAt: page.dataValues.updatedAt
                });
            });
            resolve(list);
          }).catch(err => {reject(err)});
    });
}

// Get All Pages by Search Parameters
const SearchPages = async(title) => {
    return new Promise(async(resolve, reject) => {
        try {
            let searchTitle = '%' + title + '%';
            const pages = await Page.findAll({
                where: {
                    title: {
                        [Op.like]: searchTitle
                    }
                }
            }).catch(err => {reject(err)});
            let list = [];
            pages.forEach(page => {
                list.push({
                    id: page.dataValues.id,
                    title: page.dataValues.title,
                    description: page.dataValues.description,
                    url: page.dataValues.url,
                    createdAt: page.dataValues.createdAt,
                    updatedAt: page.dataValues.updatedAt
                });
            });
            resolve(list);
        } catch(err) { reject(err); }
    });
}




module.exports = {
    Page,
    CreateTableIfNonExistant,
    CreatePage,
    CreatePageByTitle,
    GetPageByID,
    GetPageByTitle,
    UpdatePage,
    DeletePageByID,
    DeletePageByTitle,
    GetAllPages,
    TitleExists,
    ValidateTitle,
    ValidateURL,
    GetPageWhere,
    SearchPages
};