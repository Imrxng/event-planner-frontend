import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useContext, useEffect, useState } from 'react';
import { CiCalendar, CiClock1, CiLocationOn } from 'react-icons/ci';
import { GoPeople } from 'react-icons/go';
import { IoDownloadOutline } from 'react-icons/io5';
import { MdOutlineEdit } from 'react-icons/md';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useNavigate, useParams } from 'react-router-dom';
import LinkBack from '../components/LinkBack';
import FullscreenLoader from '../components/spinner/FullscreenLoader';
import { UserContext } from '../context/context';
import '../styles/BrightEventDetail.component.css';
import { Attendance, Event, MongoDbUser } from '../types/types';
import { formatName } from '../utilities/formatName';
import FormModal from '../modals/FormModal';
import CancelAttendanceModal from '../modals/CancelAttendanceModal';
import RejectEventModal from '../modals/RejectEventModal';
import CancelRejectEventModal from '../modals/CancelRejectEventModal';
import ReportModal from '../modals/ReportModal';
import DeleteEventModal from '../modals/DeleteEventModal';
import DownloadModal from '../modals/DownloadModal';

const AdminDetailEvent = () => {
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
  const [downloadOpen, setDownloadOpen] = useState<boolean>(false);
  const { id } = useParams();
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const mongoDbUser = useContext(UserContext);
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

        console.log(data.event);

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

  
  return (<div className="AdminEventDetail-container">
    {formOpen && event && <FormModal onClose={setFormOpen} event={event} form={event.form} setEvent={setEvent} />}
    {cancelAttendanceOpen && event && <CancelAttendanceModal onClose={setCancelAttendanceOpen} event={event} setEvent={setEvent} />}
    {rejectEventOpen && event && <RejectEventModal onClose={setRejectEventOpen} event={event} setEvent={setEvent} />}
    {cancelRejectEventOpen && event && <CancelRejectEventModal onClose={setCancelRejectEventOpen} event={event} setEvent={setEvent} />}
    {reportOpen && event && <ReportModal onClose={setReportOpen} event={event} />}
    {deleteEventOpen && event && <DeleteEventModal onClose={setDeleteEventOpen} event={event} setEvent={setEvent} />}
    {downloadOpen && <DownloadModal onClose={setDownloadOpen} />}
      <div id='brightEventDetail-top-buttons-container'>
        </div>
    <h1>hey</h1>
  </div>
  );
};

const AdminDetailEventPage = withAuthenticationRequired(AdminDetailEvent, {
  onRedirecting: () => <FullscreenLoader content='Redirecting...' />,
});

export default AdminDetailEventPage;