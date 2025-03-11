import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import FullscreenLoader from '../components/spinner/FullscreenLoader';
import '../styles/BrightEventDetail.component.css';
import { useParams } from 'react-router-dom';
import { Event, MongoDbUser } from '../types/types';
import { useEffect, useState } from 'react';
import LinkBack from '../components/LinkBack';
import { IoDownloadOutline } from 'react-icons/io5';
import { MdOutlineEdit } from 'react-icons/md';
import { RiDeleteBinLine } from 'react-icons/ri';
import { CiCalendar, CiClock1, CiLocationOn } from 'react-icons/ci';
import { PiArrowRightThin } from 'react-icons/pi';

const BrightEventDetail = () => {
  const [event, setEvent] = useState<Event>();
  const [createdBy, setCreatedBy] = useState<MongoDbUser>();
  const [loading, setLoading] = useState<boolean>(false);
  const { id } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const server = import.meta.env.VITE_SERVER_URL;
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const token = await getAccessTokenSilently();

        const response = await fetch(`${server}/api/events/detail/${id}`, {
          method: 'GET',
          headers: {
            'authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch event data');
        }

        const data = await response.json();
        setEvent(data.event);

        const userResponse = await fetch(`${server}/api/users/${data.event?.createdBy}`, {
          method: 'GET',
          headers: {
            'authorization': `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await userResponse.json();
        setCreatedBy(userData.user);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [getAccessTokenSilently, id, server]);

  if (!event || loading || !createdBy) {
    <FullscreenLoader content='Gathering data...' />
    return;
  }
  const formatName = (name: string) => {
    if (name.includes('@')) {
      const namePart = name.split('@')[0];
      return namePart.replace(/\./g, ' ');
    }
    return name;
  };

  const startDate = new Date(event.startDate);
  return (
    <div id='brightEventDetail-container'>
      <div id='brightEventDetail-top-buttons-container'>
        <LinkBack href={'/brightevents'} />
        <div id='brightEventDetail-top-right'>
          <button className='brightEventDetail-top-buttons'><IoDownloadOutline />Download Attendance</button>
          <button className='brightEventDetail-top-buttons'><MdOutlineEdit />Edit</button>
          <button className='brightEventDetail-top-buttons'><RiDeleteBinLine />Delete</button>
        </div>
      </div>
      <div id='brightEventDetail-content'>
        <button id='report-button'>Report</button>
        <div id='brightEventDetail-content-top'>
          <span>{event.emoji}</span>
          <div>
            <p>
              <CiCalendar />
              {startDate.toLocaleDateString('nl-NL', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </p>
            <p>
              <CiClock1 />
              {startDate.toLocaleTimeString('nl-NL', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p>
              <CiLocationOn />
              {event.address}
            </p>
          </div>
        </div>
        <h1>{event.title}</h1>
        <p id='brightEventDetail-content-description'>{event.description}</p>
        <p id='brightEventDetail-content-payedBrightest'>{event.paidByBrightest ? 'This event is covered by Brightest' : 'This event is self-funded'}</p>
        <div id='brightEventDetail-content-bottom'>
          <div id='brightEventDetail-deny-join'>
            <button className='brightEventDetail-bottom-buttons'>Participate<PiArrowRightThin /></button>
            <button className='brightEventDetail-bottom-buttons'>Refuse <PiArrowRightThin  /></button>
          </div>
          <div id='brightEventDetail-createdBy'>
            <p>Event created by: {formatName(createdBy.name)}</p>
            <img src={createdBy.picture} alt='createdby-picture' />
          </div>
        </div>
      </div>
    </div>
  )
}

const BrighteventsDetailPage = withAuthenticationRequired(BrightEventDetail, {
  onRedirecting: () => <FullscreenLoader content='Redirecting...' />,
});

export default BrighteventsDetailPage;