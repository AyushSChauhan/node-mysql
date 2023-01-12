const express = require('express');
const logger = require('../logger/logger');
const db = require('../dbConnection/db');
const { categoryValidate } = require('../validation/catValidation');

exports.addCategory = async(req, res) => {
    try {
        let { error } = categoryValidate(req.body);
        if (error) {
            res.status(400).send(error.details[0].message);
        } else {
            const categoryName = req.body.categoryName;

            const sql = `INSERT INTO category(categoryName)VALUES('${categoryName}')`;

            db.query(sql, (err, result) => {
                if (err) {
                    logger.error('Error', err);
                } else {
                    res.send("record Inserted....");
                }

            });


        }
    } catch (err) {
        logger.error("err", err);
    }
};



exports.viewCategory = async(req, res) => {
    try {
        db.query(`SELECT * FROM category`, async(err, response) => {
            if (err) {
                logger.error("error", err);
            } else {

                res.send(response);

            }
        });

    } catch (err) {
        logger.error("err", err);
    }
};

exports.updateCategory = async(req, res) => {
    try {

        const id = req.params.id;
        const categoryName = req.body.categoryName;

        db.query(`UPDATE category set categoryName='${categoryName}' WHERE id=?`, [id], async(err, response) => {
            if (response) {
                res.send('Category is Updated...');
            } else {
                res.send('Category Not Updated');
            }
        });
    } catch (err) {
        logger.error("err", err);
    }
};

exports.deleteCategory = async(req, res) => {
    try {
        const id = req.params.id;
        db.query('DELETE FROM category WHERE id=?', [id], async(err, response) => {
            if (response) {
                res.send('Delete Done...');
            } else {
                res.send('Not Deleted....');
            }
        });
    } catch (err) {
        logger.error("err", err);
    }
};



exports.multiDeleteCategory = async(req, res) => {
    try {

        const id = req.query.id;
        db.query("DELETE FROM category WHERE id IN ('" + id.join("','") + "') ", (err, response1) => {
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