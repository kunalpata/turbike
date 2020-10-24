//this component can be used to show information through a span element
import React from "react";

const InformSpan = ({classname, textMsg}) => {
    return(
        <span className = {classname}>
            {textMsg}
        </span>

    );
};

export default InformSpan;