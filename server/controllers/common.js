var fs=require('fs');
var path=require('path');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms)); 



var viewFileController = async function(req, res) {
    if(!req.query.file){
        res.redirect('/error')
        return;
    }
    var taskid = req.params.id;
    if (taskid) {
        try {
            //const task = await Task.findById(taskid);
            //const data = await req.scgrid.fileContent(task.gid,req.query.file,0,100);
            await delay(2000);
            console.log(req.query.file);
            var data;
            if(req.query.file == "H2O.chk"){
                data = ["# BLASTP 2.2.26 [Sep-21-2011]","# Query: S0GBSA_10670","# Database: All.pep","# Query: S0GBSA_10670","# Database: All.pep","# Query: S0GBSA_10670","# Database: All.pep","# Query: S0GBSA_10670","# Database: All.pep","# Query: S0GBSA_10670","# Database: All.pep","# Query: S0GBSA_10670","# Database: All.pep","# Query: S0GBSA_10670","# Database: All.pep","# Query: S0GBSA_10670","# Database: All.pep","# Query: S0GBSA_10670","# Database: All.pep","# Query: S0GBSA_10670","# Database: All.pep"];

            } else {
                data = ["this is just an another test","i want to know the test","can it work"]
            }
            console.log(data);
            if (data.length >1){
                res.json({ result: 'success',data: data.join('\r\n')});
            } else {
                res.json({ result: 'success',data: data});
            }
            
        } catch (error) {
            console.log(error);
            res.end();
        }
    }
};


module.exports = {
    viewFile: viewFileController
};
