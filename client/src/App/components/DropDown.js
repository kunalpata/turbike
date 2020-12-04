import React, { useState, useEffect } from 'react';
import '../bootstrap/bootstrap.min.css';
import Form from 'react-bootstrap/Form';



const DropDown = (props) => {
    //console.log(props);

    //props has label, name, sendSelected (function)

    const [options, setOptions] = useState([]);

    const fetchCategory = async ()=>{
        await fetch('/api/get/categories')
        .then((res) => {return res.json()})
        .then((res) => {
            //console.log(res); 
            setOptions(res.data);
        })
        .catch((err) => {console.log(err)});
    }

    const fetchState = ()=>{
        const USstates = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA",
                          "MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN",
                          "TX","UT","VT","VA","WA","WV","WI","WY"];
        setOptions(USstates.map((eachState, index) => {
            return {id:index,name:eachState};
        }));
    }

    const fetchCity = async ()=>{
        await fetch('/api/get/cities')
        .then((res) => {return res.json()})
        .then((res) => {
            //console.log(res);
            setOptions(res.data.map((item, index) => {
                return {id:index,name:item.city};
            }))
            //setOptions(res.data)
        })
        .catch((err) => {console.log(err)});
    }

    const textChangeHandler = (e) => {
        props.sendSelected(e.target.name,e.target.value);
    }

    const fillOptions = (name) => {
        switch(name){
            case "category":
                fetchCategory();
                break;
            case "state":
                fetchState();
                break;
            case "city":
                fetchCity();
                break;
            default:
                setOptions(props.customEntries);
                break;
        }
    }

    useEffect(()=>{
        fillOptions(props.name); //retrieve options according to name
    },[]);

    return (
        
            <Form.Control size={props.size} as="select" name={props.name} defaultValue="Choose..." onChange={textChangeHandler}>
                <option>Choose...</option>
                {options.map((option) =>
                     (<option key={option.id} selected={option.name==props.selectedValue}>{option.name}</option>)   
                )}
            </Form.Control>
       
    )
}

export default DropDown;