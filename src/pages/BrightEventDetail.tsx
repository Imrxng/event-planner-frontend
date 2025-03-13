import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import FullscreenLoader from '../components/spinner/FullscreenLoader';
import '../styles/BrightEventDetail.component.css';
import { useNavigate, useParams } from 'react-router-dom';
import { Attendance, Event, MongoDbUser } from '../types/types';
import { useContext, useEffect, useState } from 'react';
import LinkBack from '../components/LinkBack';
import { IoDownloadOutline } from 'react-icons/io5';
import { MdOutlineEdit } from 'react-icons/md';
import { RiDeleteBinLine } from 'react-icons/ri';
import { CiCalendar, CiClock1, CiLocationOn } from 'react-icons/ci';
import { PiArrowRightThin } from 'react-icons/pi';
import FormModal from '../modals/FormModal';
import { UserContext } from '../context/context';
import { RxCross1 } from 'react-icons/rx';
import CancelAttendanceModal from '../modals/CancelAttendanceModal';
import { GoPeople } from 'react-icons/go';
import RejectEventModal from '../modals/RejectEventModal';
import CancelRejectEventModal from '../modals/CancelRejectEventModal';
import ReportModal from '../modals/ReportModal';
import DeleteEventModal from '../modals/DeleteEventModal';
import { saveAs } from "file-saver";
import { formatName } from '../utilities/formatName';

const BrightEventDetail = () => {
  const [event, setEvent] = useState<Event>();
  const [createdBy, setCreatedBy] = useState<MongoDbUser>();
  const [attendances, setAttendances] = useState<Attendance[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [rejectEventOpen, setRejectEventOpen] = useState<boolean>(false);
  const [cancelAttendanceOpen, setCancelAttendanceOpen] = useState<boolean>(false);
  const [cancelRejectEventOpen, setCancelRejectEventOpen] = useState<boolean>(false);
  const [deleteEventOpen, setDeleteEventOpen] = useState<boolean>(false);
  const [reportOpen, setReportOpen] = useState<boolean>(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAccessTokenSilently } = useAuth0();
  const mongoDbUser = useContext(UserContext);
  const server = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        resetStates();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const resetStates = () => {
    setFormOpen(false);
    setRejectEventOpen(false);
    setCancelAttendanceOpen(false);
    setCancelRejectEventOpen(false);
    setDeleteEventOpen(false);
    setReportOpen(false);
  };

  

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
        console.log(userData);
        
        setCreatedBy(userData.user);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [getAccessTokenSilently, id, server]);

  if (loading) {
    return <FullscreenLoader content='Gathering data...' />;
  }

  if (!event || !createdBy) {
    navigate('/not-found');
    return;
  }
 
  if (!mongoDbUser) {
    return;
  };
  const handleDownloadCSV: React.MouseEventHandler<HTMLButtonElement> = () => {
    if (!event.attendances.length) {
      alert("Er zijn geen aanwezige deelnemers om te exporteren.");
      return;
    }

    const fetchAttendances = async () => {
      setLoading(true);
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`${server}/api/events/participants/${event._id}`, {
          method: 'GET',
          headers: {
            'authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch event data');
        }

        const data = await response.json();
        
        setAttendances(data.participants);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendances();
    let csvContent = '';

    csvContent += "Naam;";
    csvContent += event.form.map((q) => q.question).join(";");
    csvContent += "\n";
    if (!attendances) {
      return;
    }
    
    attendances.forEach((attendee) => {
      csvContent += `${formatName(attendee.userName)};`; 
      csvContent += attendee.answers.map((answer) => answer).join(";");  
      csvContent += "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${event.title}_aanwezigen.csv`);
  };
  
  const startDate = new Date(event.startDate);
  return (
    <div id='brightEventDetail-container'>
      {formOpen && <FormModal onClose={setFormOpen} event={event} form={event.form} setEvent={setEvent} />}
      {cancelAttendanceOpen && <CancelAttendanceModal onClose={setCancelAttendanceOpen} event={event} setEvent={setEvent} />}
      {rejectEventOpen && <RejectEventModal onClose={setRejectEventOpen} event={event} setEvent={setEvent} />}
      {cancelRejectEventOpen && <CancelRejectEventModal onClose={setCancelRejectEventOpen} event={event} setEvent={setEvent} />}
      {reportOpen && <ReportModal onClose={setReportOpen} event={event} />}
      {deleteEventOpen && <DeleteEventModal onClose={setDeleteEventOpen} event={event} setEvent={setEvent} />}
      <div id='brightEventDetail-top-buttons-container'>
        <LinkBack href={'/brightevents'} />
        <div id='brightEventDetail-top-right'>
          <button className='brightEventDetail-top-buttons' onClick={handleDownloadCSV}><IoDownloadOutline />Download Attendance</button>
          <button className='brightEventDetail-top-buttons'><MdOutlineEdit />Edit</button>
          <button className='brightEventDetail-top-buttons' onClick={() => setDeleteEventOpen(true)}><RiDeleteBinLine />Delete</button>
        </div>
      </div>
      <div id='brightEventDetail-content'>
        <button id='report-button' onClick={() => setReportOpen(true)}>Report</button>
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
            <p>
              <GoPeople />
              {event.attendances.length} {event.attendances.length !== 1 ? 'attendees' : 'attendee'}
            </p>
          </div>
        </div>
        <h1>{event.title}</h1>
        <p id='brightEventDetail-content-description'>{event.description}</p>
        <p id='brightEventDetail-content-payedBrightest'>{event.paidByBrightest ? 'This event is covered by Brightest' : 'This event is self-funded'}</p>
        <div id='brightEventDetail-content-bottom'>
          <div id='brightEventDetail-deny-join'>
            {event.attendances.includes(mongoDbUser._id) ? (
              <>
                <button
                  className="brightEventDetail-bottom-buttons"
                  onClick={() => setCancelAttendanceOpen(true)}
                >
                  Cancel participation <RxCross1 />
                </button>
              </>
            ) : event.declinedUsers.includes(mongoDbUser._id) ? (
              <>
                <button
                  className="brightEventDetail-bottom-buttons"
                  onClick={() => setCancelRejectEventOpen(true)}
                >
                  Undo Refusal <PiArrowRightThin />
                </button>
              </>
            ) : (
              <>
                <button
                  className="brightEventDetail-bottom-buttons"
                  onClick={() => setFormOpen(true)}
                >
                  Participate <PiArrowRightThin />
                </button>
                <button
                  className="brightEventDetail-bottom-buttons"
                  onClick={() => setRejectEventOpen(true)}
                >
                  Refuse <PiArrowRightThin />
                </button>
              </>
            )}

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