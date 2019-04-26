import React from 'react';

import BookingItem from './BookingItem/BookingItem';
import './BookingList.css';

const bookingItem = props => {
    const bookings = props.bookings.map(booking => {
        return <BookingItem
            key={booking._id}
            booking={booking}
            onDelete={props.onDeleteClicked}
        >
        </BookingItem>
    })

    return <ul className="booking_list">{bookings}</ul>
}

export default bookingItem;