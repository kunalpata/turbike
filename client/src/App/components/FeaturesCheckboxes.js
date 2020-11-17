import React, { useState, useEffect } from 'react';
import '../bootstrap/bootstrap.min.css';
import Form from 'react-bootstrap/Form';

/*{features.map((feature) => 
    (<Form.Check type="checkbox" name="features" id={feature.id} value={feature.name} label={feature.name} key={feature.id} onClick={textChangeHandler} />)
)}*/

const FeaturesCheckboxes = (props) => {

    const [features, setFeatures] = useState([]);
    const [selectedFeatures, setSelectedFeatures] = useState({});  //feature id from db : true/false

    const fetchFeature = async () => {
        await fetch('/api/get/features')
		.then((res) => {return res.json()})
		.then((res) => {
            console.log(res);
            if(props.extraOptions){
                res.data.push({id:-1,name:"any"});
                res.data.push({id:-2,name:"none"});
            }
            setFeatures(res.data)
        })
		.catch((err) => {console.log(err)});

    }

    const updateSelectedFeatures = (e) => {
        let oldFeatures = {...selectedFeatures};
        oldFeatures[e.target.id] = e.target.checked?true:false;
        props.getUpdatedFeatures(oldFeatures);
        setSelectedFeatures(oldFeatures)
    }

    useEffect(()=>{
        fetchFeature();
    },[]);

    return(
        <>
            {features.map((feature) => 
                (<Form.Check type="checkbox" name="features" id={feature.id} value={feature.name} label={feature.name} key={feature.id} onClick={updateSelectedFeatures} />)
            )}
        </>
    )

}

export default FeaturesCheckboxes;