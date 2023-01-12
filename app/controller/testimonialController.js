const express = require('express');
const logger = require('../logger/logger');
const db = require('../dbConnection/db');
const { testimonialValidate } = require('../validation/tValidation');


exports.addTestimonial = async(req, res) => {
    try {
        console.log(req.body);
        let { error } = testimonialValidate(req.body);
        if (error) {
            console.log(error);
            return res.status(400).send(error.details[0].message);
        } if (!req.file) {
            res.send("image is required...");
         } else {
            const name = req.body.name;
            const designation = req.body.designation;
            const description = req.body.description;
            const image = req.file.filename;

            const sql = `INSERT INTO testimonial(name, designation, description, image)VALUES('${name}', '${designation}', '${description}', '${image}')`;
            db.query(sql, (err, result) => {
                if (result) {
                    res.send("Testimonial Data inserted...");
                } else {
                    res.send("Testimonial Data not inserted....");
                }
            })
        }
    } catch (err) {
        logger.error("err", err);
        res.send(err);
    }
};

exports.viewTestimonial = async(req, res) => {
    try {

        db.query(`SELECT * FROM testimonial`, async(err, response1) => {
            if (response1) {
                res.send(response1);
            } else {
                res.send('Testimonial Not found....');
            }
        });


    } catch (err) {
        logger.error("err", err);
        res.send(err);
    }
}

exports.updateTestimonial = async(req, res) => {
    try {
        let { error } = testimonialValidate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        } if (!req.file) {
            res.send("image is required...");
         } else {

            const id = req.params.id;

            const name = req.body.name;
            const designation = req.body.designation;
            const description = req.body.description;
            const image = req.file.filename;

            db.query(`UPDATE testimonial set name = '${name}', designation = '${designation}', description = '${description}', image = '${image}' WHERE id = ?`, [id], (err, response1) => {
                if (response1) {
                    res.send("Testimonial Updated...");
                } else {
                    res.send('Testimonial Not Updated...');
                }
            })


        }
    } catch (err) {
        logger.error("err", err);
        res.send(err);
    }
}

exports.deleteTestimonial = async(req, res) => {
    try {

        const id = req.params.id;


        db.query(`DELETE FROM testimonial WHERE id = ? `, [id], (err, response1) => {
            if (response1) {
                res.send("Testimonial Deleted...");
            } else {
                res.send('Testimonial Not Deleted....');
            }
        })


    } catch (err) {
        logger.error("err", err);
        res.send(err);
    }
}

exports.multiDeleteTestimonial = async(req, res) => {
    try {
        const id = req.query.id;

        db.query("DELETE FROM testimonial WHERE id IN ('" + id.join("','") + "') ", (err1, response1) => {
            if (response1) {
                res.send("Selected Testimonial Deleted...");
            } else {
                res.send('Selected testimonial Not Deleted.....');
            }
        })

    } catch (err) {
        logger.error("err", err);

    }
}