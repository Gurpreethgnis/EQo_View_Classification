var express = require('express');
var router = express.Router();
const fs = require('fs');
var imgPath = './public/dataset/';
var path = require('path');


router.get('/section', function(req, res, next) {
    var id = req.param('id');
    var path = req.param('path');
    result = JSON.stringify({"id":id});
    fs.writeFile('public/dataset/'+path+"-selected.json", result, 'utf8');

    res.status(200);
    res.send('success');
});

/* GET home page. */
router.get('/', function(req, res, next) {
    var files =  fs.readdirSync(imgPath);
    var result = [];
    for(var i in files){
        var key = files[i];
        subPath = path.join(imgPath,key);
        if(fs.lstatSync(subPath).isDirectory()){
            var subfiles = fs.readdirSync(subPath);
            var img_arr=[]
            for(var j in subfiles){
                subFile = path.join(key,subfiles[j]);
                if (/\.gif$/.test(subFile)){
                    img_arr.push(subFile)
                }

                // if(fs.lstatSync(subFile).isDirectory()){
                //     id = key+"/"+subfiles[j];
                //     var imgs = fs.readdirSync(subFile);
                //     var length = 0;
                //     var img_arr = []
                //     var marked = false;
                //     for(var k in imgs){
                //         if (/\.gif/.test(imgs[k])){
                //             img_arr.push(imgs[k])
                //         }
                //     }
                // }

            }
            result.push({"id":subPath,"len":img_arr.length,"arr":img_arr});

        }

    }

    res.render('index', { title: 'Express', list:result});
});



module.exports = router;

// Return a list of files of the specified fileTypes in the provided dir,
// with the file path relative to the given dir
// dir: path of the directory you want to search the files for
// fileTypes: array of file types you are search files, ex: ['.txt', '.jpg']
function getFilesFromDir(dir, fileTypes) {
    var filesToReturn = [];
    function walkDir(currentPath) {
        var files = fs.readdirSync(currentPath);
        for (var i in files) {
            var curFile = path.join(currentPath, files[i]);
            if (fs.statSync(curFile).isFile() && fileTypes.indexOf(path.extname(curFile)) != -1) {
                filesToReturn.push(curFile.replace(dir, ''));
            } else if (fs.statSync(curFile).isDirectory()) {
                walkDir(curFile);
            }
        }
    };
    walkDir(dir);
    return filesToReturn;
}