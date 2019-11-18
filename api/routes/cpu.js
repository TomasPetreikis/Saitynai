const express = require('express');
const router = express.Router({mergeParams : true});
const mysql = require('mysql'); 
const db = require('../../db');
const checkAdminAuth = require('../middleware/adminAuthorization');
const checkUserAuth = require('../middleware/userAuthorization');

router.get('/', checkUserAuth ,(req, res, next) =>{ 
    let architectureId = req.params.architectureId;
    let sql;
    if(architectureId != undefined){
        sql = `SELECT * FROM cpu where architecture_id = ${architectureId}`;
    }
    else{
        sql = `SELECT * FROM cpu`;
    }
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
router.post('/', (req, res, next) =>{
    let cpuId = req.params.cpuId;
    let cpu = {architecture_id: req.body.architectureId ,spec: req.body.spec,price: req.body.price,price_link: req.body.priceLink,image_link: req.body.imageLink,brand: req.body.brand, socket: req.body.socket }
        let sql = 'INSERT INTO cpu SET ?';
        let query = db.query(sql, cpu, (err,result) =>{
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
router.get('/:cpuId', (req, res, next) =>{
    let sql = `SELECT * FROM cpu WHERE id = ${req.params.cpuId}`;
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
router.patch('/:cpuId', (req, res, next) =>{
    let cpuId = req.params.cpuId;
    let updatedCpu = {architecture_id: req.body.architectureId ,spec: req.body.spec,price: req.body.price,price_link: req.body.priceLink,image_link: req.body.imageLink,brand: req.body.brand, socket: req.body.socket }
         let sql = `UPDATE cpu SET? WHERE id = ${req.params.cpuId}`;
         let query = db.query(sql, updatedCpu, (err, result) => {
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
router.delete('/:cpuId', (req, res, next) =>{
     let sql = `DELETE FROM cpu WHERE id = ${req.params.cpuId}`;
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

module.exports = router;
