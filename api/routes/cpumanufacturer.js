const express = require('express');
const router = express.Router({mergeParams : true});
const mysql = require('mysql'); 
const db = require('../../db');
const architecture = require('./architecture');


router.get('/',(req, res, next) =>{ 
    let sql = 'SELECT * FROM cpumanufacturer';
         let query = db.query(sql, (err, results) => {
            if(err)
            {
                res.status(400).json({
                    error: err
                })
                return
            }
             res.send(results);
         });
});
router.post('/' ,(req, res, next) =>{
    let cpumanufacturer = {name: req.body.name}
        let sql = 'INSERT INTO cpumanufacturer SET ?';
        let query = db.query(sql, cpumanufacturer, (err,result) =>{
            if(err)
            {
                res.status(400).json({
                    error: err
                })
                return
            }
        res.send(result);
        });
});
router.get('/:manufacturerId', (req, res, next) =>{
    let sql = `SELECT * FROM cpumanufacturer WHERE id = ${req.params.manufacturerId}`;
     let query = db.query(sql, (err, result) => {
        if(err)
        {
            res.status(400).json({
                error: err
            })
            return
        }
        res.send(result);
     });
});
router.patch('/:manufacturerId', (req, res, next) =>{
    let updatedManufacturer = {name: req.body.name}
         let sql = `UPDATE cpumanufacturer SET? WHERE id = ${req.params.manufacturerId}`;
         let query = db.query(sql, updatedManufacturer, (err, result) => {
            if(err)
            {
                res.status(400).json({
                    error: err
                })
                return
            }
             res.send(result);
        });
});
router.delete('/:manufacturerId', (req, res, next) =>{
    let sql = `DELETE FROM cpu WHERE cpu.architecture_id = ANY (SELECT id from architecture WHERE architecture.manufacturer_id=${req.params.manufacturerId})`;
     let query = db.query(sql, (err, result) => {
        if(err)
        {
            res.status(400).json({
                error: err
            })
            return
        }
        res.send(result);
     });
     sql = `DELETE FROM architecture WHERE architecture.manufacturer_id = ${req.params.manufacturerId}`;
     query = db.query(sql, (err, result) => {
        if(err)
        {
            res.status(400).json({
                error: err
            })
            return
        }
        res.send(result);
     });
     sql = `DELETE FROM cpumanufacturer WHERE id = ${req.params.manufacturerId}`;
     query = db.query(sql, (err, result) => {
        if(err)
        {
            res.status(400).json({
                error: err
            })
            return
        }
        res.send(result);
     });
});

router.use ('/:manufacturerId/architecture',architecture);

module.exports = router;
