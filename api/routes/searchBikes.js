const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const searchHelpers = require('../helpers/searchBikesHelpers.js');
const pool = require('../dbcon').pool;

//add dotenv functionality
require('dotenv').config();

//get bikes by location search
router.get('/location', (req, res) => {
    // pass user search query to get the coords for it
    searchHelpers.getCoords(req.query.loc).then(location => {
        // get the searchs lat/lng from the location return
        const lat = location.lat;
        const lng = location.lng;

        // query by closest match to coordinates of search
        // formula source: https://stackoverflow.com/questions/11112926

        let query = 'SELECT b.id,b.price,b.bike_details,b.bikeName,b.brand,b.penalty,b.user_id,' +
                        'u.user_name,u.email,h.id as host_id,' +
                        'l.address,l.city,l.state,l.zip,l.latitude,l.longitude,' +
                        'c.name,' +
                        ' ( 3959 * acos( cos( radians(l.latitude) ) * cos( radians(?) ) * cos( radians(?) - radians(l.longitude) ) + sin( radians(l.latitude) ) * sin( radians(?) ) ) )' +
                        ' AS distance' +
                    ' FROM bike b inner join user u on b.user_id = u.id' + 
                    ' inner join location l on b.location_id = l.id ' +
                    ' inner join bike_category bc on b.id = bc.bike_id ' +
                    ' inner join category c on bc.category_id = c.id' +
                    ' inner join host h on h.user_id = u.id' +
                    //' ORDER BY distance LIMIT 0, 10' +
                    ' HAVING distance < 50 ORDER BY distance LIMIT 0, 10;'

        //pool.query(query, [loc, loc, loc], (err, result)=>{
        pool.query(query, [lat, lng, lat], async (err, result)=>{
            if(err){
                console.log(err);
                res.send({data:[],err:err,hasError:1});
                
            }else{
                let items = [];
                for (let i = 0; i < result.length; i++){
                    let item = {
                        ...result[i],
                    }

                    // add rating and images to bike obj
                    item.rating = await searchHelpers.calcBikeAvgRating(item.id, pool);
                    item.images = await searchHelpers.getBikeImages(item.id, pool);
                    
                    items.push(item);
                }

                //console.log(items)
                res.send(JSON.stringify({data:items,err:"",hasError:0}));
            }
        });
    });
});


// get bikes by user id
router.get('/bikes' , (req, res) => {
    let query = 'SELECT b.id, b.price, b.bike_details, b.bikeName, b.brand, b.penalty, b.user_id,'+
                'u.user_name,u.email,h.id as host_id,' +
                'l.address,l.city,l.state,l.zip,l.latitude,l.longitude,' +
                'c.name'+
                ' FROM bike b inner join user u on b.user_id = u.id' +
                ' inner join location l on b.location_id = l.id '+
                ' inner join bike_category bc on b.id = bc.bike_id ' +
                ' inner join category c on bc.category_id = c.id' +
                ' inner join host h on h.user_id = u.id' + 
                ' WHERE u.id = ?';
    pool.query(query,[req.query.userId], async(err, result) => {
        if(err){
            res.send({data:[],err:err,hasError:1});
        }else{
            let items = [];
            for(let i = 0; i < result.length; i++){
                let item = {
                    ...result[i],
                }

                // add rating and images to bike obj
                item.rating = await searchHelpers.calcBikeAvgRating(item.id, pool);
                item.images = await searchHelpers.getBikeImages(item.id, pool);

                items.push(item);
            }

            res.send(JSON.stringify({data:items,err:"",hasError:0}));
        }
    })
});


// get bikes by category
router.get('/category', (req, res) => {
    const category = req.query.cat;
    const lat = req.query.lat;
    const lng = req.query.lng;

    // get bikes in this category that are the closest to users current location
    let query = 'SELECT b.id,b.price,b.bike_details,b.bikeName,b.brand,b.penalty,b.user_id,' +
                    'u.user_name,u.email,h.id as host_id,' +
                    'l.address,l.city,l.state,l.zip,l.latitude,l.longitude,' +
                    'c.name' +
                    ', ( 3959 * acos( cos( radians(l.latitude) ) * cos( radians(?) ) * cos( radians(?) - radians(l.longitude) ) + sin( radians(l.latitude) ) * sin( radians(?) ) ) )' +
                    ' AS distance' +
                ' FROM bike b inner join user u on b.user_id = u.id' + 
                ' inner join location l on b.location_id = l.id' +
                ' inner join bike_category bc on b.id = bc.bike_id' +
                ' inner join category c on bc.category_id = c.id' +
                ' inner join host h on h.user_id = u.id' +
                ' WHERE c.name = ?' +
                //' ORDER BY distance LIMIT 0, 10;'
                ' HAVING distance < 50 ORDER BY distance LIMIT 0, 10;'

    pool.query(query, [lat, lng, lat, category], async (err, result)=>{
        if(err){
            console.log(err);
            res.send({data:[],err:err,hasError:1});
            
        }else{
            let items = [];
            for (let i = 0; i < result.length; i++){
                let item = {
                    ...result[i],
                }

                item.rating = await searchHelpers.calcBikeAvgRating(item.id, pool);
                item.images = await searchHelpers.getBikeImages(item.id, pool);
                items.push(item);
            }
            //console.log(items)
            res.send(JSON.stringify({data:items,err:"",hasError:0}));
        }
    });
});


// get bike features
router.get('/features', (req, res) => {
    const bike_id = req.query.id;

    // get features for bike with passed in id
    let query = 'SELECT f.name,f.pic_filename' +
                ' FROM feature f inner join bike_feature bf on f.id = bf.feature_id' +
                ' WHERE bf.bike_id = ?;'

    pool.query(query, [bike_id], (err, result)=>{
        if(err){
            console.log(err);
            res.send({data:[],err:err,hasError:1});
            
        }else{
            let items = [];
            for (let i = 0; i < result.length; i++){
                let item = {
                    ...result[i],
                }
                items.push(item);
            }
            //console.log(items)
            res.send(JSON.stringify({data:items,err:"",hasError:0}));
        }
    });
});


router.post('/advanced', async (req, res) => {
    /*search obj
    {
        category("Choose..." as all categories),
        features{featureKey:T/F, -1:any, -2:none},
        location{
            city ("Choose..." as any city),
            miles ("Choose..." as all miles),
            mode ("any" as no location option selected),
            zip ("any" as all zip code)
        }},
        matchMode("Choose..." will be not exact match, (Exact Match/Contains)),
        minPrice: (negative should be zero, not going to check, leave for frontend to check)
        maxPrice: "99999999" equals no highest
        searchTerms:
    */
    
    //build up the query

    let {category, features, location, matchMode, maxPrice, minPrice, searchTerms} = req.body;

    let whereConstrains = [];
    let havingConstrains = [];

    //base query without filters to select all bikes combining category and features, but group by bike.id
    let baseQueryColumns = 'SELECT b.id, b.price, b.bike_details, b.brand, b.bikeName,b.penalty,' +
                            'u.user_name, u.email,h.id as host_id,' +
                            'l.address, l.city, l.state, l.zip, l.latitude, l.longitude,';
    
    let baseQueryColumnEnd = ' t.feature_id, t2.category_id, t2.name, count(*) as matched_feature_count, t.total_feature_count FROM bike b '
    let baseQueryJoins = ' inner join user u on b.user_id = u.id' +
                         ' inner join location l on l.id = b.location_id' +
                         ' inner join host h on h.user_id = u.id' +
                         ' left join (SELECT bf.feature_id, bf.bike_id, f.name, t3.total_feature_count FROM bike_feature bf ' + 
                                'inner join feature f on bf.feature_id = f.id ' +
                                'inner join (SELECT bf2.bike_id, count(*) as total_feature_count FROM bike_feature bf2 group by bf2.bike_id) '+
                                'as t3 on t3.bike_id = bf.bike_id) as t on t.bike_id = b.id' +
                         ' left join (SELECT bc.category_id, bc.bike_id, c.name from bike_category bc inner join category c on c.id = bc.category_id) as t2 on t2.bike_id = b.id'
    let queryEnd1 = ' group by b.id';
    let queryEnd2 = ' order by b.id';
    let whereClause = "";
    let havingClause = "";

    //get lat/long
    let distanceQuery = "";
    if(location.mode == "radius" && location.zip != "any"){
        let zipGeocode = await searchHelpers.getCoords(location.zip);
        console.log(zipGeocode);
        if(zipGeocode.err !== undefined){
            res.send({data:[],err:"zipcode error",hasError:1});
            return;
        }
        distanceQuery = ` ST_DISTANCE_SPHERE(POINT(${zipGeocode.lng},${zipGeocode.lat}),POINT(l.longitude,l.latitude)) * .000621371192 as distance,`;
        havingConstrains.push(` distance < ${location.miles}`);
        queryEnd2 = ' order by b.id,distance';
        
    }else if(req.body.location.mode == "city" && req.body.location.city != "Choose..."){
        whereConstrains.push(` l.city = '${req.body.location.city}'`);
    }
    
    //get feature constrain
    if(features["-1"] === true){
        //if(features["-2"] === true){
          //  whereConstrains.push( ' t.feature_id is null');
        //}
    }else{
        let temp = "";
        let featureCt = 0;
        for(let featureKey in features){
            if(features[featureKey]){
                if(featureCt === 0){
                    temp = ` (t.feature_id = ${featureKey}`;
                }else{
                    temp = ` ${temp} or t.feature_id = ${featureKey}`;
                }
                featureCt++;
            }         
        }
        temp = temp + ")";
        if(featureCt > 0){
            whereConstrains.push(temp);
            havingConstrains.push(` matched_feature_count = total_feature_count and matched_feature_count = ${featureCt}`);
        }else{
            whereConstrains.push(' t.feature_id is null');
        }    
    }

    //set category constrain
    if(category !== "Choose..."){
        whereConstrains.push(` t2.name = '${category}'`);
    }

    //set prices
    whereConstrains.push(` b.price >= ${minPrice}`);
    if(maxPrice < 99999999){
        whereConstrains.push( ` b.price <= ${maxPrice}`);
    }

    //set search term (bikeName or brand)
    searchTerms = searchTerms.replace(/^\s+/,'');
	searchTerms = searchTerms.replace(/\s+$/,'');
    if(searchTerms !== ""){
        let connector = "like";
        let sign = "%";
        if(matchMode === "Exact Match"){
            connector = "=";
            sign = "";
        }
        whereConstrains.push(` (b.bikeName ${connector} '${sign}${searchTerms}${sign}' or b.brand ${connector} '${sign}${searchTerms}${sign}')`);
    }

    //construct where and having clauses
    for(let i = 0; i < whereConstrains.length; i++){
        if(i == 0){
            whereClause = ` where${whereConstrains[i]}`;
        }else{
            whereClause = whereClause + " and" + whereConstrains[i];
        }
    }

    for(let i = 0; i < havingConstrains.length; i++){
        if(i == 0){
            havingClause = ` having${havingConstrains[i]}`;
        }else{
            havingClause = havingClause + " and" + havingConstrains[i];
        }
    }

    //construct the final query
    let finalQuery = baseQueryColumns + distanceQuery + baseQueryColumnEnd + baseQueryJoins + whereClause + queryEnd1 + havingClause + queryEnd2;
    
    pool.query(finalQuery, async (err, result) => {
        if(err){
            console.log(err);
            res.send({data:[],err:err,hasError:1});
        }else{
            let items = [];
            for(let i = 0; i < result.length; i++){
                let item = {
                    ...result[i],
                }

                item.rating = await searchHelpers.calcBikeAvgRating(item.id, pool);
                item.images = await searchHelpers.getBikeImages(item.id, pool);
                items.push(item);
            }
            res.send(JSON.stringify({data:items,err:"",hasError:0}));
        }
    })

    //res.send(JSON.stringify(finalQuery));
})

module.exports = router;