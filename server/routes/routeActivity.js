const express = require('express');
var router = express.Router();
const Activity = require('../models/activity');
const Project = require('../models/project');

router.get('/projects/:id', (req, res) => {
    console.log(req.decoded.id);
    Activity
        .find({
            belong_project: req.params.id
        })
        .populate({
            path: 'belong_user',
            select: 'email username image'
        })
        .sort({'createdAt': -1})
        .skip(parseInt(req.query.offset) || 0)
        .limit(parseInt(req.query.limit) || 30)
        .exec((err, activities) => {
            if (err) console.log(err);
            if (!activities) {
                return res.json({
                    success: false,
                    message: 'Something wrong.'
                });
            }
            return res.json({
                success: true,
                message: 'Your activities info',
                activities: activities
            });
        });
   
});

module.exports = router;