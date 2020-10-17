// TableItem.js

import React from "react";

const TableItem = ({price, owner, location, contact}) => {
    return(
        <tr>
            <td>{price}</td>
            <td>{owner}</td>
            <td>{location}</td>
            <td>{contact}</td>
        </tr>

    );
};

export default TableItem;