import React from 'react';
import { Link } from 'react-router-dom';
import EventListItem from '../components/EventListItem';
import '../styles/brightEvents.component.css';

const Brightevents = () => {
    
    return (
        <>
            <div>
                <Link to={""}><p>Back</p></Link>
                <input type="search" name="" id="" />
                <input type="submit" value="" />
            </div>
            <div className="event_container">
                <EventListItem/>
                <EventListItem/>
                <EventListItem/>
                <EventListItem/>
                <EventListItem/>
                <EventListItem/>
            </div>
        </>
    );
};

export default Brightevents;