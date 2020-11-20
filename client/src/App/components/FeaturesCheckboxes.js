import React, { useState, useEffect, useRef } from 'react';
import '../bootstrap/bootstrap.min.css';
import Form from 'react-bootstrap/Form';

/*{features.map((feature) => 
    (<Form.Check type="checkbox" name="features" id={feature.id} value={feature.name} label={feature.name} key={feature.id} onClick={textChangeHandler} />)
)}*/

const FeaturesCheckboxes = (props) => {

    const [features, setFeatures] = useState([]);
    const [selectedFeatures, setSelectedFeatures] = useState({});  //feature id from db : true/false
    const [hasAny, setHasAny] = useState(false);
    const anyRef = useRef(null);

    const fetchFeature = async () => {
        await fetch('/api/get/features')
		.then((res) => {return res.json()})
		.then((res) => {
            console.log(res);
            if(props.extraOptions){
                //res.data.push({id:-1,name:"any"});
                //res.data.push({id:-2,name:"none"});
                setHasAny(true);
            }
            setFeatures(res.data)
        })
		.catch((err) => {console.log(err)});

    }

    const updateSelectedFeatures = (e) => {
        let oldFeatures = {...selectedFeatures};
        oldFeatures[e.target.id] = e.target.checked?true:false;
        props.getUpdatedFeatures(oldFeatures);
        setSelectedFeatures(oldFeatures);
    }

    useEffect(()=>{
        async function fetchData(){
            await fetchFeature();
            if(props.extraOptions){
                anyRef.current.click();
            }
            
        }
        fetchData();
    },[]);

    return(
        <>
            {features.map((feature) => 
                (<Form.Check type="checkbox" name="features" id={feature.id} value={feature.name} label={feature.name} key={feature.id} onClick={updateSelectedFeatures} />)
            )}
            {
                hasAny?<Form.Check type="checkbox" name="features" id={-1} value="any" label="any" key="-1" ref={anyRef} onClick={updateSelectedFeatures}/>:null
            }
        </>
    )

}

export default FeaturesCheckboxes;