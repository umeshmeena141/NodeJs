var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var server = http.createServer((req,res)=>{
    res.statusCode = 200;
    var page = url.parse(req.url,(err)=>{
        res.statusCode = 400;
        res.end("Try some other File");
    })
    if(path.extname(page.pathname)=='.csv'){
    let lineNum=0;
    let colIds=[];
    let jsonfile=[];
    var fileName= path.join(__dirname,page.pathname);
    
    var file = require('readline').createInterface({
        input: fs.createReadStream(fileName)
      });
    file.on('line',function(line){
        let columns= line.split(',');
        if(lineNum == 0){
            colIds=columns;
        }
        else{
            jsonfile.push(JsonObj(colIds,columns)); 
        }
        lineNum=lineNum+1;  
        
    });
    function JsonObj(colIds,columns){
        let i=0;
        let arr={};
        for(i=0;i<colIds.length;i++){
            arr[colIds[i]]=columns[i];
        }
        return arr;
    }
    file.on('close',function(){
        res.write(JSON.stringify(jsonfile));
        res.end();
    }) 
    }
    else{
        res.statusCode=400;
        res.write('<h1>Only Csv Files can be converted </h1>')
        res.end();
    }
});
server.listen(3030);