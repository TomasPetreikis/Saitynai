const express = require('express');
const router = express.Router();
const mysql = require('mysql'); 
const db = require('../../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAdminAuth = require('../middleware/adminAuthorization')

router.post('/register', (req, res, next) =>{

    bcrypt.hash(req.body.password, 10, (err, hash) =>{
        
        if(err){
            return res.status(500).json({ error : err });
               }
        else{            
            let user = {username: req.body.username , password: hash, role: 'user'}
            let name = user.username;
            let sql1 = 'SELECT * FROM users WHERE username = '+'\''+name+'\'';
            let query1 = db.query(sql1, (err,results1) =>{
            
            if(err)
            {
                res.status(500).json({
                    error: err
                })
                return
            }
            else if (results1.length===0)
            {
                
            let sql = `INSERT INTO users SET ?`;
            let query = db.query(sql, user, (err,result) =>{
                if(err)
                {
                    res.status(500).json({
                        error: err
                    })
                    return
                }
            res.send(result);
            });
        }
        else{
            res.status(500).json({
                message: "User exists"
            })
        }
    });
     }
});
});

router.post('/login', (req, res, next) =>{
    let sql1 = 'SELECT * FROM users WHERE username = '+'\''+req.body.username+'\'';
    let query1 = db.query(sql1, (err,results) =>{
        if (results.length <1)
        {
            return res.status(401).json({
                message: 'Authorization failed'
            });
        }
        bcrypt.compare(req.body.password,results[0].password,(err, result)=>{
            if(err)
            return res.status(401).json({
                message: 'Authorization failed'
            });
            if(result)
            {
                const token = jwt.sign({
                    username : results[0].username,
                    role : results[0].role,
                    userId: results[0].id
                }, 
                process.env.JWT_KEY, 
                {
                    expiresIn: "1h"
                }
                );
                return res.status(200).json({
                    message: 'Authorization successful',
                    token: token
                });
            }
            return res.status(401).json({
                message: 'Authorization failed'
            });
        });
    });
});

router.delete('/:userId', (req, res, next) =>{ 
    let sql = `DELETE FROM users WHERE id = ${req.params.userId}`;
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
router.get('/', (req, res, next) =>{ 
    let sql = `SELECT * FROM users `;
         let query = db.query(sql, (err, results) => {
             if(err) throw err;
             res.send(results);
         });
});
router.patch('/:userId',checkAdminAuth, (req, res, next) =>{
         let sql = 'UPDATE users SET role = '+'\''+req.body.role+'\' WHERE id = '+'\''+req.params.userId+'\'';
         let query = db.query(sql, (err, result) => {
            if(err)
            {
                res.status(401).json({
                    message: 'Auth failed'
                })
                return
            }
             res.send(result);
        });
});
module.exports = router;