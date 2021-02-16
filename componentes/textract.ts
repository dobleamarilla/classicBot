const _ = require("lodash");
import AWS from 'aws-sdk';
AWS.config.region = 'eu-west-1';
AWS.config.update({
  accessKeyId: process.env['accessKeyId'],
  secretAccessKey: process.env['secretAccessKey'],
  region: process.env['region']
});

AWS.config.region = 'eu-west-1';
var textract = new AWS.Textract();


const getText = (result, blocksMap) => {
  let text = "";

  if (_.has(result, "Relationships")) {
    result.Relationships.forEach(relationship => {
      if (relationship.Type === "CHILD") {
        relationship.Ids.forEach(childId => {
          const word = blocksMap[childId];
          if (word.BlockType === "WORD") {
            text += `${word.Text} `;
          }
          if (word.BlockType === "SELECTION_ELEMENT") {
            if (word.SelectionStatus === "SELECTED") {
              text += `X `;
            }
          }
        });
      }
    });
  }

  return text.trim();
};

const findValueBlock = (keyBlock, valueMap) => {
  let valueBlock;
  keyBlock.Relationships.forEach(relationship => {
    if (relationship.Type === "VALUE") {
      relationship.Ids.every(valueId => {
        if (_.has(valueMap, valueId)) {
          valueBlock = valueMap[valueId];
          return false;
        }
      });
    }
  });

  return valueBlock;
};

const getKeyValueRelationship = (keyMap, valueMap, blockMap) => {
  const keyValues = {};

  const keyMapValues = _.values(keyMap);

  keyMapValues.forEach(keyMapValue => {
    const valueBlock = findValueBlock(keyMapValue, valueMap);
    const key = getText(keyMapValue, blockMap);
    const value = getText(valueBlock, blockMap);
    keyValues[key] = value;
  });

  return keyValues;
};

const getKeyValueMap = blocks => {
  const keyMap = {};
  const valueMap = {};
  const blockMap = {};

  let blockId;
  blocks.forEach(block => {
    blockId = block.Id;
    blockMap[blockId] = block;

    if (block.BlockType === "KEY_VALUE_SET") {
      if (_.includes(block.EntityTypes, "KEY")) {
        keyMap[blockId] = block;
      } else {
        valueMap[blockId] = block;
      }
    }
  });

  return { keyMap, valueMap, blockMap };
};

module.exports = async buffer => {
  const params = {
    Document: {
      /* required */
      Bytes: buffer
    },
    FeatureTypes: ["FORMS"]
  };

  const request = textract.analyzeDocument(params);
  const data = await request.promise();

  if (data && data.Blocks) {
    const { keyMap, valueMap, blockMap } = getKeyValueMap(data.Blocks);
    const keyValues = getKeyValueRelationship(keyMap, valueMap, blockMap);

    return keyValues;
  }

  return undefined;
};

module.exports = async (buffer,nom) => {
console.log('Ep ' + nom )

// Create S3 service object
var s3 = new AWS.S3({apiVersion: '2006-03-01'});
var bucketParams = {
  Bucket : 'pdftotext627582130'
};

    // call S3 to retrieve upload file to specified bucket
    var uploadParams = {Bucket: 'pdftotext627582130', Key: nom, Body: buffer};
    // call S3 to retrieve upload file to specified bucket
    s3.upload (uploadParams, function (err, data) {
      if (err) {
        console.log("Error", err);
      } if (data) {
console.log("Upload Success", data.Location);
                // Set parameters for the API
        var params = {
            DocumentLocation: { /* required */
            S3Object: {
            Bucket: 'pdftotext627582130',
            Name: 'arn:aws:s3:::pdftotext627582130/prova.pdf'
            }
        },
        FeatureTypes: [ /* required */
          'TABLES','FORMS'
        ],
        NotificationChannel: {
          RoleArn: 'RoleArn', /* required */
          SNSTopicArn: 'SNSTopicArn'/* required */
        }
        };
console.log(params)
        textract.startDocumentAnalysis(params, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else     console.log(data);           // successful response
        });
      }
    });


  
};












