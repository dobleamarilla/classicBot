require('dotenv').config({path: __dirname + '/parametros.env'})
require('source-map-support').install();
require('./bot');
require('./componentes/lectorArchivo');
require('./componentes/encuestas');