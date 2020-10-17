// Table.js

import React from "react";
import './Table.css';
import TableItem from "./TableItem.js";

const Table = ({data}) => {
    return(
        <table className="bikeTable1">
            <thead>
                <tr>
                    <th>Price</th>
                    <th>Owner</th>
                    <th>Bike Location</th>
                    <th>Contact</th>
                </tr>
            </thead>
            <tbody>
                {data.map((bike) => (
                    <TableItem 
                        price = {"$"+bike.price}
                        owner = {bike.user_name}
                        location = {`${bike.address}, ${bike.city}, ${bike.state}, ${bike.zip}`}
                        contact = {bike.email}
                        key = {bike.bike_id}
                    />
                ))}
            </tbody>
            
        </table>
    );
};

export default Table;