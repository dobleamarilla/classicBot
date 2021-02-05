const Fs = require('fs')  
const Path = require('path')  
const Axios = require('axios')

function getExtension(filePath: string)
{
    var eze = filePath.split('.');
    return eze[eze.length-1];
}

async function downloadImage (url, idUsuario, filePath, timestamp) 
{  
  const path = Path.resolve(__dirname, 'upload', idUsuario + '_' +  timestamp + '.' + getExtension(filePath))
  const writer = Fs.createWriteStream(path, {flags:'w'})

  const response = await Axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

export {downloadImage, getExtension}