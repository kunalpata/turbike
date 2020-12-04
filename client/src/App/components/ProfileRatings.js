// ProfileRating.js

import React from "react";


const ProfileRatings = ({ratingsList, userName, scores, reviewerNames}) => {

    function getStars(scores) {
        // console.log(scores)

        let elements = [];
        for (let i = 0; i < scores; i++) {
            elements.push(<td><img key={i} id="star-img" alt="star" src={require("../images/star_200.png")} height="12vh" width="12vh"/></td>)
        }
        return elements;
    }

    return (
        <div style={{ height: '650px', overflowY: 'scroll'}}>
            <h2> People who left a review for {userName.first_name}</h2>
            {ratingsList.map((ratings, idx) => (
                <li key={ratings}>
                    {ratings}
                    <div style={{fontSize:"12px"}}>
                        <b><span>By {reviewerNames[idx]} </span>
                            <span>{getStars(scores[idx])}</span></b>
                    </div>
                    <br/>

                </li>
            ))}
        </div>
    )
};

export default ProfileRatings;