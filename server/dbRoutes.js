/**
 *  This is the file where we will define the DB routes.
 */
 
var userDb = require('./models/user_db');
var debug  = require('debug')('dcDbRouter');
var express = require('express');

module.exports = function(app) {
    debug("setting up db routes.");
    dbRouter = express.Router();
    app.use('/DB', dbRouter);

    dbRouter.get('/testDbGet', function(req, res, next) {
        res.send("(D):  We can ping the db stuff!");
    })
    
    dbRouter.get('/participantData', function(req, res, next) {
        debug("(D):  Collecting some participant data.");
        var returnData = {}
        userDb.User.find(function(err, results) {
            if (err)
                debug("(E):  error querying for users.");
            debug("(D):  We've got some user results back - " + results)
            returnData.user = results;
            
            var part = userDb.Participant.find(function(err, results) {
                if (err)
                    debug("(E):  error querying for participants.");
                debug("(D):  We've got some participants results back - " + results)
                returnData.user = results;
                res.json(returnData.user);
            })
        });
    })

    dbRouter.post('/participantData', function(req, res) {
        debug("(D):  We're in the participantData post method.");
        debug(req.body);
//        debug(req.data);
        var pdata = req.body;
        var newUser = new userDb.User({fname: pdata.fname, lname: pdata.lname, email: pdata.email, participantId: pdata.participantId});
        var newParticipant = new userDb.Participant({participantId: pdata.participantId, ethnicity: pdata.ethnicity, gender: pdata.gender, faceHair: pdata.faceHair, faceMarks: pdata.faceMarks, comments: pdata.comments});
        
        newUser.save(function(err) {
            if (err)
                debug("(E):  Couldn't save the user.");
        });
        newParticipant.save(function(err) {
            if (err)
                debug("(E):  Couldn't save the participant.");
        });
    })
    
    dbRouter.post('/questionaireData', function(req, res) {
        debug("(D):  We're in the questionaireData post method.");
    })
    
    dbRouter.post('/uploadVideo', function(req, res) {
        debug("(D):  We're in the videoUpload post method.");
        var pId = req.body.participantId;
        debug("(D):  We're using pId: " + pId);
        var buff = req.body.video;
//        userDb.Participant.update({participantId: pId}, {video: buff}, function(err, results) {
//            if (err) {
//                debug("(E):  Couldn't get results for participantId=" + pId)
//                res.sendStatus(500);
//                return;
//            }
//            else
//                debug("(D):  Saved video!");
//        })
        userDb.Participant.find({participantId: pId}, function(err, results) {
            if (err) {
                debug("(E):  Couldn't get results.");
                res.sendStatus(500);
                return;
            }
            debug("(D):  Found participant document!");
            var pardoc = results[0];
            pardoc.video = buff;
            pardoc.save(function(err) {
                if (err) {
                    debug("(E):  DB save error - " + err);
                    res.sendStatus(500);
                    return;
                }
                debug("(D):  Saving video!");
                res.sendStatus(200);
            })
        })
    })
    
    return dbRouter;
}