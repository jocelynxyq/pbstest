var fs=require('fs');
var path=require('path');
var SSH2Promise = require('ssh2-promise');
const uuidv1 = require('uuid/v1');
var config = require('../config/secrets');
var Client = require('ssh2').Client;

var taskSubmitController = function(req, res) {
    res.render('submit');
};

var uploadFileController = function(req, res, next){
    var file = req.files.file_data;
    var foldeName = req.body.folderName;

    var path = process.cwd() + '/client/uploads/';
    var pathDir = path + foldeName +'/';
    
    if(!fs.existsSync(path)){
        fs.mkdirSync(path);
    }

    var buffer = file.buffer, //Note: buffer only populates if you set inMemory: true.
        fileName = file.name;
    var stream =fs.createWriteStream(pathDir + fileName);
    
    stream.write(buffer);

    stream.on('error', function(err) {
        console.log('Could not write file to memory.');
        res.status(400).send({
            message: 'Problem saving the file. Please try again.'
        });
    });
    
    stream.on('finish', function() {
        console.log('File saved successfully.');
        var data={"name":fileName,res:'success'};
        res.json(data);
    });

    stream.end();
}

var savaScriptController = function(req, res) {
    try {
        var scriptContent = req.body.scriptContent;
        var scriptFolderName = uuidv1();
        var scriptName = (req.body.scriptName ||  scriptFolderName ) + '.pbs'
        
        var path = process.cwd() + '/client/uploads/';
        var pathDir = path + scriptFolderName + '/';
    
        if(!fs.existsSync(path)){
            fs.mkdirSync(path);
        }
    
        if(!fs.existsSync(pathDir)){
            fs.mkdirSync(pathDir);
        }
    
        var filePath = pathDir + scriptName;
    
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, scriptContent);
        }
        res.json({result: 'success', path: scriptFolderName, scriptName: scriptName});
    } catch(error) {
        console.log(error);
        res.json({result: 'error'});
    }
};


var launchTaskController = async function(req, res) {
    try {
        var folderName = req.body.folderName;
        var scriptName = 'sample.pbs';

        var path = process.cwd() + '/client/uploads/';
        //var path = './client/uploads/';
        var pathDir = path + folderName + '/';

        let files = fs.readdirSync(pathDir);

        console.log(files);

        var sshconfig = {
            host: config.pbs.host,
            port: config.pbs.port,
            username: config.pbs.user,
            password: config.pbs.pass
        }

        var ssh = new SSH2Promise(sshconfig);
       
        var sftp = ssh.sftp(); //or new SSH2Promise.SFTP(ssh);
        
        sftp.mkdir('./' + folderName + '/');

        for(let i = 0;i < files.length;i++) {
            await sftp.fastPut(pathDir + files[i],'./' + folderName + '/' + files[i]);
            console.log("Upload file: " + files[i] + ' successfully')
        }
     
        await ssh.connect();
        console.log("Connection established");
        
        //var data = await ssh.exec("python new.py");
        var data = await ssh.exec("cd " + folderName +"&& qsub sample.pbs");
        console.log(data); 

        await ssh.close();
        console.log("Connection closed");

        res.json({result: 'success'});
        
    } catch(error) {
        console.log(error);
        res.json({result: 'error'});
    }
};


module.exports = {
    taskSubmit: taskSubmitController,
    uploadFile: uploadFileController,
    savaScript: savaScriptController,
    launchTask: launchTaskController
};
