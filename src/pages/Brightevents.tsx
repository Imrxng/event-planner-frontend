import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useContext, useEffect, useState } from 'react';
import { IoIosSearch } from "react-icons/io";
import { Link } from 'react-router-dom';
import EventListItem from '../components/events/EventListItem';
import { UserContext } from '../context/context';
import '../styles/brightEvents.component.css';
import { Event } from '../types/types';
import FullscreenLoader from '../components/spinner/FullscreenLoader';
import { MdOutlineKeyboardBackspace } from 'react-icons/md';

const Brightevents = () => {
    const [events, setEvents] = useState<Event[]>();
    const [loading, SetLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 6;
    const server = import.meta.env.VITE_SERVER_URL;
    const userMongoDb = useContext(UserContext);
    const { getAccessTokenSilently, isLoading } = useAuth0();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                SetLoading(true);
                const token = await getAccessTokenSilently();
                const response = await fetch(`${server}/api/events/${userMongoDb?.location}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setEvents(data.events);
                SetLoading(false);
            } catch (error) {
                console.log(error);
            }
        }
        fetchEvents();
    }, [getAccessTokenSilently, server, userMongoDb]);

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = events?.slice(indexOfFirstEvent, indexOfLastEvent);

    return (
        <div className="brightEvents_container">
            {loading && !isLoading ? <FullscreenLoader content='Gathering data...' /> : <></>}
            <div className="brightEvents_top">
                <div id='link-terug-container'>
                <MdOutlineKeyboardBackspace />
                <Link to={"/"} className='Link-terug'>Back</Link>
                </div>
                <div className="brightEvents_Search">
                    <input type="search" name="" id="" className="searchBar" placeholder='search...' />
                    <button className="submitButton"><IoIosSearch className="submitButton-icon" /></button>
                </div>
                <p></p>
            </div>
            <div className="eventItems_container">
                {currentEvents ? currentEvents.map((event, index) => {
                    return <EventListItem event={event} key={index} />
                })
                    : <p>Loading...</p>
                }
            </div>
            <div className="pagination">
                {currentPage > 1 && <button onClick={handlePreviousPage}>Previous</button>}
                {events && indexOfLastEvent < events.length && <button onClick={handleNextPage}>Next</button>}
            </div>
        </div>
    );
};

const BrighteventsPage = withAuthenticationRequired(Brightevents, {
    onRedirecting: () => <FullscreenLoader content='Redirecting...' />
});

export default BrighteventsPage;