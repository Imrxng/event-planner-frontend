import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import EventListItem from '../components/events/EventListItem';
import '../styles/brightEvents.component.css';
import { IoIosSearch,IoIosArrowRoundBack } from "react-icons/io";
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/context';
import { Event } from '../types/types';

const Brightevents = () => {
    const [events, setEvents] = useState<Event[]>();
    const server= import.meta.env.VITE_SERVER_URL;
    const userMongoDb = useContext(UserContext);
    const {getAccessTokenSilently } = useAuth0();
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token= await getAccessTokenSilently();
                const response = await fetch(`${server}/api/events/${userMongoDb?.location}`,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }   
                });
                const data = await response.json();
                setEvents(data.events);
            } catch (error) {
                console.log(error);
            }
        }
        fetchEvents();
    }, [getAccessTokenSilently, server, userMongoDb]);

    return (
        <div className="brightEvents_container">

            <div className="brightEvents_top">
                <Link to={"/"} className='Link-terug'><IoIosArrowRoundBack/>Back</Link>

                <div className="brightEvents_Search">
                    <input type="search" name="" id="" className="searchBar" placeholder='search...'/>
                    <button className="submitButton"><IoIosSearch className="submitButton-icon"/></button>
                </div>
                <p></p>
            </div>
            <div className="eventItems_container">
                { events ? events.map((event,index) => {
                    return <EventListItem event={event} key={index} />
                })
                : <p>Loading...</p>
            }

            </div>
        </div>
    );
};

const BrighteventsPage = withAuthenticationRequired(Brightevents)

export default BrighteventsPage;