import { withAuthenticationRequired } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import EventListItem from '../components/events/EventListItem';
import '../styles/brightEvents.component.css';
import { IoIosSearch,IoIosArrowRoundBack } from "react-icons/io";

const Brightevents = () => {

    return (
        <div className="brightEvents_container">

            <div className="brightEvents_top">
                <Link to={"/"}><IoIosArrowRoundBack/>Back</Link>

                <div className="brightEvents_Search">
                    <input type="search" name="" id="" className="searchBar" placeholder='search...'/>
                    <button className="submitButton"><IoIosSearch className="submitButton-icon"/></button>
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

const BrighteventsPage = withAuthenticationRequired(Brightevents)

export default BrighteventsPage;