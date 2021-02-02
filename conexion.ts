var sql = require("mssql");

async function recHitOld(database, consultaSQL) {
    var config =
    {
        user: 'sa',
        password: 'LOperas93786',
        server: 'silema.hiterp.com',
        database: database,
		options: {
                "enableArithAbort": true
            }
    };
console.log('recHit_1');	
	let pool = await new sql.connect(config);
console.log('recHit_2');	
	let devolver = await pool.request().query(consultaSQL);
console.log('recHit_3');	
	sql.close();
console.log('recHit_4');	
    return devolver;
}


async function recHit(database, consultaSQL) {
    var config =
    {
        user: 'sa',
        password: 'LOperas93786',
        server: 'silema.hiterp.com',
        database: database,
		options: {
                "enableArithAbort": true
            }
    };
    var devolver = new Promise((dev, rej) => {
        new sql.ConnectionPool(config).connect().then(pool => {
            return pool.request().query(consultaSQL);
        }).then(result => {
            dev(result);
            sql.close();
        }).catch(err => {
//            console.log(err);
            console.log("SQL: ", consultaSQL)
            sql.close();
        });
    });
    return devolver;
}

module.exports.recHit = recHit;


function Rs(database, consultaSQL) {
    var config =
    {
        user: 'sa',
        password: 'LOperas93786',
        server: 'silema.hiterp.com',
        database: database
    };
	
    var pool = new sql.ConnectionPool(config).connect();
    var result = pool.query(consultaSQL);

    return pool.request().query(consultaSQL);
}
module.exports.Rs = Rs;