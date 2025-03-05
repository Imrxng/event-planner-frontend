import React from 'react';
import { Link } from 'react-router-dom';
import EventListItem from '../components/EventListItem';
import '../styles/brightEvents.component.css';
import { withAuthenticationRequired } from '@auth0/auth0-react';

const Brightevents = () => {

    return (
        <div className="brightEvents_container">

            <div className="brightEvents_top">
                <Link to={""}><p>Back</p></Link>

                <div className="brightEvents_Search">
                    <input type="search" name="" id="" />
                    <input type="submit" value="" />
                </div>
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

const BrighteventsPage = withAuthenticationRequired(Brightevents)


export default BrighteventsPage;