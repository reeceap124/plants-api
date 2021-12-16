const pool = require('./pool')

function sum () {console.log('args', arguments); return arguments[0] + arguments[1]}
function callingSum(){console.log('calling sum'); let total = sum.apply(this, arguments); console.log('got total', tot
al)}
callingSum(1, 2)
/*
const connect = async () => {
    const client = await pool.connect()
    try {
    
    }
}
*/