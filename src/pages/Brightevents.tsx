import React from 'react';
import { Link } from 'react-router-dom';
import EventListItem from '../components/events/EventListItem';
import '../styles/brightEvents.component.css';

const Brightevents = () => {

    return (
        <div className="brightEvents_container">

            <div className="brightEvents_top">
                <Link to={"/"}><p>Back</p></Link>

                <div className="brightEvents_Search">
                    <input type="search" name="" id="" />
                    <input type="submit" value="submit" />
                </div>
                <p></p>
            </div>
            <div className="eventItems_container">
                <EventListItem />
                <EventListItem />
                <EventListItem />
                <EventListItem />
                <EventListItem />
                <EventListItem />
            </div>
        </div>
    );
};

export default Brightevents;