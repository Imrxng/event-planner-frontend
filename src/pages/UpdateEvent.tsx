import { useEffect, useState } from 'react';
import FullscreenLoader from '../components/spinner/FullscreenLoader';
import '../styles/CreateEvent.component.css';
import FormEvent from '../components/events/requests/FormEvent';
import { useNavigate, useParams } from 'react-router-dom';
import { EventFormData } from '../types/types';
import useAccessToken from '../utilities/getAccesToken';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import Unauthorized from '../components/Unauthorized';


const UpdateEvent = () => {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [succesMessage, setSuccessMessage] = useState<string>('');
  const [eventData, setEventData] = useState<EventFormData>();
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAccessToken } = useAccessToken();
  const server = import.meta.env.VITE_SERVER_URL;
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const token = await getAccessToken();

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
        setEventData(data.event);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, server]);


  const updateEvent = async (eventData: EventFormData) => {
    try {
      setLoading(true);
      setErrorMessage('');
      const token = await getAccessToken();
      const response = await fetch(`${server}/api/events/${id}`, {
        method: 'PUT',
        headers: {
          'authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          eventData
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }
      const data = await response.json();

      setEventData(data.updatedEvent);
      setSuccessMessage('The event has been updated successfully');
      setErrorMessage('');
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        console.log(error);

      } else {
        setErrorMessage('An unknown error occurred');
      }
      setTimeout(() => {
        navigate('/brightevents');
      }, 500);
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }
  if (!eventData) {
    return;
  }
  return (
    <>

      <AuthenticatedTemplate>
        <FormEvent event={eventData} _id={id} onSubmit={updateEvent} setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage} succesMessage={succesMessage} errorMessage={errorMessage} method='update' />
        {loading && <FullscreenLoader content='Updating event...' />}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Unauthorized />
      </UnauthenticatedTemplate>
    </>
  );
};

export default UpdateEvent;