const User = require("../Schema/users");
const neo = require("../neo");

/*
async function makeFriends(req, res) {
    const session = neo.session()
    
    const result = await session.run(query, {  
        _id: req.params.id,
    })

    // we only expect 1 row with results, containing an array of product ids in the field 'productIds'
    // see the queries in neo.js for what is returned
    const productIds = result.records[0].get('_id')
    
    session.close()
    
    const recommendations = await User)
    
    res.status(200).json(recommendations)
}
*/
module.exports = {
  simple,
  similar,
  reviewed,
};
