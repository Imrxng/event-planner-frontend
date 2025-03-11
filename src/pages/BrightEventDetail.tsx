import { withAuthenticationRequired } from '@auth0/auth0-react';
import FullscreenLoader from '../components/spinner/FullscreenLoader';
import '../styles/BrightEventDetail.component.css';
import { useLocation, useParams } from 'react-router-dom';
import { Event } from '../types/types';
import { useEffect, useState } from 'react';

const BrightEventDetail = () => {
  const location = useLocation();
  const [event, setEvent] = useState<Event | null>(location.state?.event || null);
  const [loading, setLoading] = useState<boolean>(false);
  const { id } = useParams(); 
  const server = import.meta.env.BASE_URL;

  useEffect(() => {
    if (!event && id) {
      setLoading(true);
      const fetchEvent = async () => {
        setLoading(true);
        const response = await fetch(`${server}/api/event/${id}`);
        const data = await response.json();
        setEvent(data);
        setLoading(false);
      }
      fetchEvent();
    }
  }, [event, id, server]);
    
  return (
    <div>
      {loading ?? <FullscreenLoader content='Gathering data...'/>}
            {/* <h1>{event.title}</h1>
            <p>{event.description}</p>
            <p>{event.type}</p>
            <p>{new Date(event.startDate).toLocaleDateString()}</p> */}
        </div>
  )
}

const BrighteventsDetailPage = withAuthenticationRequired(BrightEventDetail, {
  onRedirecting: () => <FullscreenLoader content='Redirecting...'/>,
});

export default BrighteventsDetailPage;