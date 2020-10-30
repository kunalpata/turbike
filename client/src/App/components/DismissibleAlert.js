import React, { useState, useEffect } from 'react';
import '../bootstrap/bootstrap.min.css';
import { Redirect } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';

function DismissibleAlert(props){
    console.log(props)
    const[show, setShow] = useState(true);
    const[redir, setRedir] = useState(false);

    const autoDismissRedirect = (second, closeAlert) => {
        if(closeAlert) setShow(!closeAlert);
        console.log("outside");
        setTimeout(()=>{
            console.log("I was called")
            setShow(false);
            props.parentCleanup();
            setRedir(props.shouldRedirect);
        },second);
    }

    
    useEffect(() => {
        autoDismissRedirect(props.duration,false);
    },[])
    

        return (
            
            <div>
                {show?
                <Alert variant={props.type} style={{position:"relative",zIndex:10}} onClose={()=>autoDismissRedirect(500,true)} dismissible>
                    <Alert.Heading>{props.title}</Alert.Heading>
                    <p>
                        {props.message}
                    </p>
                   
                </Alert>:null} 
                
                {redir?<Redirect to={props.redirectLink}/>:null} 
            </div>     

        );
    

}

export default DismissibleAlert;