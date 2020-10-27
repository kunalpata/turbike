// BikeList.js

import React from "react";
//import TableItem from "./TableItem.js";

const BikeList = ({bikes}) => {
    return(
    	<h1>Bike List</h1>
    );
};

export default BikeList;

                // {data.map((bike) => (
                //     <TableItem 
                //         price = {"$"+bike.price}
                //         owner = {bike.user_name}
                //         location = {`${bike.address}, ${bike.city}, ${bike.state}, ${bike.zip}`}
                //         contact = {bike.email}
                //         key = {bike.id}
                //     />
                // ))}