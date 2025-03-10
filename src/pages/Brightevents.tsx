import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useContext, useEffect, useState } from 'react';
import { IoIosArrowRoundBack, IoIosSearch } from "react-icons/io";
import { Link } from 'react-router-dom';
import EventListItem from '../components/events/EventListItem';
import { UserContext } from '../context/context';
import '../styles/brightEvents.component.css';
import { Event } from '../types/types';

const Brightevents = () => {
    const [events, setEvents] = useState<Event[]>();
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 6;
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
                console.log(data);
                setEvents(data.events);
            } catch (error) {
                console.log(error);
            }
        }
        fetchEvents();
    }, []);

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
            <div className="brightEvents_top">
                <Link to={"/"} className='Link-terug'><IoIosArrowRoundBack/>Back</Link>
                <div className="brightEvents_Search">
                    <input type="search" name="" id="" className="searchBar" placeholder='search...'/>
                    <button className="submitButton"><IoIosSearch className="submitButton-icon"/></button>
                </div>
                <p></p>
            </div>
            <div className="eventItems_container">
                { currentEvents ? currentEvents.map((event, index) => {
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

const BrighteventsPage = withAuthenticationRequired(Brightevents)

export default BrighteventsPage;