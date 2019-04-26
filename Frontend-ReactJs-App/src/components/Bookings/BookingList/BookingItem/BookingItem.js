import React from 'react';

import './BookingItem.css';

const bookingItem = props => {
    return <li className="booking_list_item">
        <div>
            {props.booking.event.title} - {' '} {new Date(props.booking.createdAt).toLocaleDateString()}
        </div>
        <div>
            <button className="btn" onClick={props.onDelete.bind(this, props.booking._id)} >Cancel Booking</button>
        </div>
    </li>
}

export default bookingItem;