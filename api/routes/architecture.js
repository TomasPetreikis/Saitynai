const express = require('express');
const router = express.Router({mergeParams : true});
const mysql = require('mysql'); 
const db = require('../../db');
const cpu = require('./cpu');
const jwt = require('jsonwebtoken');

router.get('/', (req, res, next) =>{ 
    let manufacturerId = req.params.manufacturerId;
    let sql;
    if(manufacturerId != undefined){
        sql = `SELECT * FROM architecture where manufacturer_id = ${manufacturerId} `;
    }
    else{
        sql = `SELECT * FROM architecture`;
    }
         let query = db.query(sql, (err, results) => {
            if(err)
            {
                res.status(500).json({
                    error: err
                })
                return
            }
             res.send(results);
         });
});
router.post('/', (req, res, next) =>{
    let architecture = {name: req.body.name ,manufacturer_id: req.body.manufacturer}
        let sql = 'INSERT INTO architecture SET ?';
        let query = db.query(sql, architecture, (err,result) =>{
            if(err)
            {
                res.status(500).json({
                    error: err
                })
                return
            }
        res.send(result);
        });
});
router.get('/:architectureId', (req, res, next) =>{
    let sql = `SELECT * FROM architecture WHERE id = ${req.params.architectureId}`;
     let query = db.query(sql, (err, result) => {
        if(err)
            {
                res.status(500).json({
                    error: err
                })
                return
            }
        res.send(result);
     });
});
router.patch('/:architectureId',  (req, res, next) =>{
    let updatedArchitecture = {name: req.body.name ,manufacturer_id: req.body.manufacturer}
         let sql = `UPDATE architecture SET? WHERE id = ${req.params.architectureId}`;
         let query = db.query(sql, updatedArchitecture, (err, result) => {
            if(err)
            {
                res.status(500).json({
                    error: err
                })
                return
            }
             res.status(200).json({
                 results: result
             });
        });
});
router.delete('/:architectureId', (req, res, next) =>{
     let sql = `DELETE FROM cpu WHERE cpu = ${req.params.architectureId}`;
     let query = db.query(sql, (err, result) => {
        if(err)
        {
            res.status(500).json({
                error: err
            })
            return
        }
        res.send(result);
     });
     sql = `DELETE FROM architecture WHERE id = ${req.params.architectureId}`;
     query = db.query(sql, (err, result) => {
        if(err)
        {
            res.status(500).json({
                error: err
            })
            return
        }
        res.send(result);
     });
});

router.use ('/:architectureId/cpu',cpu);
module.exports = router;
