import React from 'react';

import EventItem from './EventItem/EventItem';
import './EventList.css';

const eventItem = props => {
    const events = props.events.map(event => {
        return <EventItem
            key={event._id}
            event={event}
            userId={props.authUserId}
            onDetailsClicked={props.onViewDetailsClicked}
        >
        </EventItem>
    })

    return <ul className="event_list">{events}</ul>
}

export default eventItem;