import React, { useState, useEffect } from 'react';
import '../bootstrap/bootstrap.min.css';
import { Redirect } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function DismissibleAlert(props){
    //console.log(props)
    const[show, setShow] = useState(true);
    const[redir, setRedir] = useState(false);

    const autoDismissRedirect = (second, closeAlert) => {
        if(closeAlert) setShow(!closeAlert);
        //console.log("outside");
        setTimeout(()=>{
            //console.log("I was called")
            setShow(false);
            setRedir(props.shouldRedirect);
        },second);
    }

    
    useEffect(() => {
        autoDismissRedirect(props.duration,false);
    },[])
    

        return (
            
            <div>
                {show?
                <Row>
                    <Col md={2}></Col>
                    <Col md={8}>
                        <Alert variant={props.type} style={{position:"relative",zIndex:10}} onClose={()=>autoDismissRedirect(500,true)} dismissible>
                            <Alert.Heading>{props.title}</Alert.Heading>
                            <p>
                                {props.message}
                            </p>
                    
                        </Alert>
                    </Col>
                    
                </Row>
                :null} 
                
                {redir?<Redirect to={{
                                          pathname: props.redirectLink,
                                          state: {
                                              ...props.payload
                                          }
                                       }}/>:null} 
            </div>     

        );
    

}

export default DismissibleAlert;