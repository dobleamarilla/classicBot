import AWS from 'aws-sdk';
import { S3Object } from 'aws-sdk/clients/textract';
var request = require('request');
AWS.config.update({
  accessKeyId: process.env['accessKeyId'],
  secretAccessKey: process.env['secretAccessKey'],
  region: process.env['region']
});
var s3 = new AWS.S3({apiVersion: '2006-03-01'});
const textract = new AWS.Textract();

const infoSNS = {
  TopicArn : 'arn:aws:sns:eu-west-1:118802092521:testEze.fifo'
}

function subirArchivo(url, bucket, key, callback) {
    request({
        url: url,
        encoding: null
    }, function(err, res, body) {
        if (err)
            return callback(err, res);

        s3.putObject({
            Bucket: bucket,
            Key: key,
            ContentType: res.headers['content-type'],
            ContentLength: res.headers['content-length'],
            Body: body // buffer
        }, callback);
    })
}

function analizarArchivo(nombreArchivo: string, nombreBucket: string)
{
  var devolver = new Promise((dev,rej)=>{
    var params = {
      DocumentLocation: { /* required */
        S3Object: {
          Bucket: nombreBucket,
          Name: nombreArchivo
        }
      },
      FeatureTypes: [ /* required */
        'TABLES', 'FORMS',
        /* more items */
      ],
      NotificationChannel: {
        RoleArn: 'arn:aws:iam::118802092521:role/ezeTestRol',
        SNSTopicArn: infoSNS.TopicArn
      }
    };
    textract.startDocumentAnalysis(params, function(err, data: any) {
      if(err) 
      {
        console.log(err, err.stack);
        rej();
      }
      else
      {
        var interval = setInterval(()=>{ 
          getPromesaAws(textract.getDocumentAnalysis(data)).then(data1=>{
            if(data1.JobStatus != 'IN_PROGRESS')
            {
              clearInterval(interval);
              var arrayInfo = [];
              for(let i = 0; i < data1.Blocks.length; i++)
              {
                if(data1.Blocks[i].Text != undefined)
                  arrayInfo.push(data1.Blocks[i].Text);
              }
              dev(arrayInfo)
            }
          });
        }, 2000);    
      }
    });
  });
  return devolver;
}

function getPromesaAws(req)
{
  return req.promise();
}

export {subirArchivo, analizarArchivo}