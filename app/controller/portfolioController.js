const express = require('express');
const moment = require('moment');
const logger = require('../logger/logger');
const db = require('../dbConnection/db');
const { portfolioValidate } = require('../validation/portfolioValidation');
const { Logform } = require('winston');

exports.addPortfolio = async(req, res) => {
    try {
        let { error } = portfolioValidate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } else {
            if (req.files.length === 0) {
                res.send("image is required...");
             } else {

            const category = req.body.projectCategory;
            db.query(`SELECT id FROM category WHERE categoryName = '${category}'`, (err, result) => {
               
                if (result) {
                    const image = req.files.map((image) => image.filename);

                    const projectCategory = result[0].id;
                    const projectName = req.body.projectName;
                    const projectTitle = req.body.projectTitle;
                    const projectDate = moment().format('YYYY-MM-DDTHH:mm:ss.SSS000');
                    const projectDescription = req.body.projectDescription;
                    const projectImage = image;
                    
                    const sql = `INSERT INTO portfolio ( projectCategory,projectName,projectTitle,projectDate,projectDescription,projectImage) VALUES('${ projectCategory}', '${projectName}', '${projectTitle}', '${projectDate}', '${projectDescription}','${projectImage}')`;
                    
                    db.query(sql, (err1, response1) => {
                        if (response1) {
                            res.send("Data inserted...");
                        } else {
                            res.send("Data not inserted!");
                        }
                    })
                } else {
                    res.send("Category Data not found!");
                }
            })
        }
    }
    } catch (err) {
        logger.error("err", err);

    }
};


exports.viewPortfolio = async(req, res) => {
    try {
        db.query(`SELECT portfolio.id,category.categoryName,portfolio.projectName,portfolio.projectTitle,portfolio.projectImage,portfolio.projectDate,portfolio.projectDescription FROM portfolio INNER JOIN category ON category.id = portfolio.projectCategory`, async(err, response1) => {
            if (response1) {
                console.log("adsfsd",response1);
                res.send(response1);
            } else {
                res.send('Portfolio Not found!');
            }
        });
    } catch (err) {
        logger.error("err", err);
    }
}


    exports.updatePortfolio = async(req, res) => {
        try {
            let { error } = portfolioValidate(req.body);
            if (error) {
                return res.status(400).send(error.details[0].message);
            } if (req.files.length === 0) {
                res.send("image is required...");
             } else {
                
                const id = parseInt(req.params.id);
                const category = req.body.projectCategory;
                
                db.query(`SELECT id FROM category WHERE categoryName = '${category}'`, (err, result) => {
                    if (result) {
                        const image = req.files.map((image) => image.filename);

                        
                        const projectCategory = result[0].id;
                        const projectName = req.body.projectName;
                        const projectTitle = req.body.projectTitle;
                        const projectDate = moment().format('YYYY-MM-DDTHH:mm:ss.SSS000');
                        const projectDescription = req.body.projectDescription;
                        const projectImage = image;
                        
                        db.query(`UPDATE portfolio set projectCategory= '${projectCategory}', projectName = '${projectName}',projectTitle = '${projectTitle}',projectDate = '${projectDate}', projectDescription= '${projectDescription}', projectImage = '${ projectImage}' WHERE id = ${id}`,  (err1, response1) => {
                            if (response1) {
                                res.send("Portfolio updated...");
                            } else {
                                res.send("Portfolio not updated...");
                            }
                        })
                    } else {
                        res.send("Category Data not found!");
                    }
                })
    
    
            }
        } catch (err) {
            logger.error("err", err);
    
        }
    };
    

    exports.deletePortfolio = async(req, res) => {
        try {
    
            const id = req.params.id;
    
    
            db.query(`DELETE FROM portfolio WHERE id = ${id} `, (err, response1) => {
                if (response1) {
                    res.send("Portfolio Deleted...");
                } else {
                    res.send('Portfolio Not Deleted.......');
                }
            })
    
    
        } catch (err) {
            logger.error("err", err);
    
        }
    }
    
    exports.multiDelportfolio = async(req, res) => {
        try {
    
            const id = req.query.id;
            
            db.query("DELETE FROM portfolio WHERE id IN ('" + id.join("','") + "') ", (err, response1) => {
                if (response1) {
                    res.send("Selected Category Deleted...");
                } else {
                    res.send('Selected Category Not Deleted!.....');
                }
            });
    
    
        } catch (err) {
            logger.error("err", err);
            res.send(err);
        }
    
    };