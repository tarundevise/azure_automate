const { BlobServiceClient, StorageSharedKeyCredential } = require("@azure/storage-blob");

var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var azure = require('azure-storage');
async function main() {
    // Enter your storage account name and shared key
    const account = 'restraildiag';
    const accountKey = "8emk1EfjQk5KLfRQCBTQ/wutXLoSYKtBYf4xOXbbrCcjSt3SLvYtq16C8bWzgvfqiei0gcGq79SFmBEt085U5w==";
  
    var tableSvc = azure.createTableService(account, accountKey);

    tableSvc.createTableIfNotExists('mytable', function(error, result, response){
        if(!error){
          // Table exists or created
        }

        //insert data into table
        var task1 = {
            PartitionKey: {'_':'hometasks'},
            RowKey: {'_': '1'},
            description: {'_':'Take out the trash'},
            dueDate: {'_':new Date(2015, 6, 20)}
          };
          var task2 = {
            PartitionKey: {'_':'hometasks'},
            RowKey: {'_': '2'},
            description: {'_':'Wash the dishes'},
            dueDate: {'_':new Date(2015, 6, 20)}
          };
          
        //   var batch = new azure.TableBatch();
          
        //   batch.insertEntity(task1, {echoContent: true});
        //   batch.insertEntity(task2, {echoContent: true});
          
        //   tableSvc.executeBatch('mytable', batch, function (error, result, response) {
        //     if(!error) {
        //       // Batch completed
        //     }
        //   });

        tableSvc.retrieveEntity('mytable', 'hometasks', '1', function(error, serverEntity) {
            if(!error) {
              // Entity available in serverEntity variable
            }
          });
      });
  }
  
  // A helper method used to read a Node.js readable stream into string
  async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on("data", (data) => {
        chunks.push(data.toString());
      });
      readableStream.on("end", () => {
        resolve(chunks.join(""));
      });
      readableStream.on("error", reject);
    });
  }
  
  main().catch((err) => {
    console.error("Error running sample:", err.message);
  });

http.createServer(function (req, res) {
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.filetoupload.path;
      var newpath = 'C:/Users/Your Name/' + files.filetoupload.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.write('File uploaded and moved!');
        res.end();
      });
 });
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
  }
}).listen(8080);