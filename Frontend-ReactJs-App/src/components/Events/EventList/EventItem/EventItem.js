import React from 'react';

import './EventItem.css';

const eventItem = props => {
    return <li className="event_list_item">
        <div>
            <h1>{props.event.title}</h1>
            <h2>${props.event.price} - {new Date(props.event.date).toLocaleDateString()}</h2>
        </div>
        <div>
            {props.event.creater._id === props.userId ?
                <p>Your are the owner of the event</p>
                :
                <button className="btn" onClick={props.onDetailsClicked.bind(this, props.event._id)}>View Details</button>
            }
        </div>
    </li>
}

export default eventItem;