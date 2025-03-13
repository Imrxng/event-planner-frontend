import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { useContext, useEffect, useRef, useState } from "react";
import { MongoDbUser } from "../types/types";
import { formatName } from "../utilities/formatName";
import { UserContext } from "../context/context";
import FullscreenLoader from "../components/spinner/FullscreenLoader";
import LinkBack from "../components/LinkBack";
import '../styles/CreateEvent.component.css';

const CreateEvent = () => {
  const [users, setUsers] = useState<MongoDbUser[]>();
  const [selectedUsers, setSelectedUsers] = useState<MongoDbUser[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [eventTitle, setEventTitle] = useState<string>('');
  const [eventDescription, setEventDescription] = useState<string>('');
  const [eventEmoji, setEventEmoji] = useState<string>('');
  const [eventStartDate, setEventStartDate] = useState<string>('');
  const [eventEndDate, setEventEndDate] = useState<string>('');
  const [eventAddress, setEventAddress] = useState<string>('');
  const [eventLocation, setEventLocation] = useState<string>('');
  const [isSelfPay, setIsSelfPay] = useState<boolean>();
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { getAccessTokenSilently } = useAuth0();
  const mongoDbUser = useContext(UserContext);
  const server = import.meta.env.VITE_SERVER_URL;

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`${server}/api/users`, {
          method: 'GET',
          headers: {
            'authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch event data');
        }

        const data: { users: MongoDbUser[] } = await response.json();
        setUsers(data.users.filter((user) => user._id !== mongoDbUser?._id));

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [getAccessTokenSilently, mongoDbUser?._id, server]);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading || !users) {
    return <FullscreenLoader content="Gathering data..." />;
  }

  const handleSelect = (user: MongoDbUser) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.some((selectedUser) => selectedUser._id === user._id)) {
        return prevSelected.filter((selectedUser) => selectedUser._id !== user._id);
      } else {
        return [...prevSelected, user];
      }
    });
  };

  const handleSelectNobody = () => {
    setSelectedUsers([]);
    setDropdownVisible((prevState) => !prevState)
  };

  const clickHandler: React.MouseEventHandler<HTMLButtonElement> = () => {
    setDropdownVisible((prevState) => !prevState);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 200) {
      setEventDescription(e.target.value);
    }
  };

  const handleSubmit = () => {
  
    
  
    if (eventDescription === '' || eventAddress === '' || eventEmoji === '' || eventLocation === '' || isSelfPay === null || eventStartDate === '' || eventTitle === '') {
      setErrorMessage("Please fill in all required fields.");
      return;
    }
    if (  eventTitle.length < 10 || eventTitle.length > 50) {
      setErrorMessage("Event title must be between 10 and 50 characters.");
      return;
    }
    if (  eventDescription.length < 50 || eventTitle.length > 500) {
      setErrorMessage("Event description must be between 50 and 500 characters.");
      return;
    }
   
    const emojiRegex = /(?:[\uD83C][\uDDE6-\uDDFF]|[\uD83D][\uDE00-\uDE4F]|[\uD83D][\uDE80-\uDEFF]|[\uD83E][\uDD00-\uDDFF]|[\u2600-\u26FF]|[\u2700-\u27BF]|[\u2300-\u23FF]|[\u2B00-\u2BFF]|[\u2100-\u214F])+/g;
  
    if (!emojiRegex.test(eventEmoji)) {
      setErrorMessage("Please enter a valid emoji.");
      return;
    }
    if (eventEndDate && new Date(eventEndDate) < new Date(eventStartDate)) {
      setErrorMessage("End date cannot be earlier than start date.");
      return;
    }
    const eventData = {
      title: eventTitle,
      description: eventDescription,
      emoji: eventEmoji,
      startDate: eventStartDate,
      endDate: eventEndDate === '' ? undefined : eventEndDate,
      address: eventAddress,
      location: eventLocation,
      paidByBrightest: isSelfPay,
      organizors: selectedUsers.map(user => user._id),
    };
    setErrorMessage('');
    console.log("Event Data:", eventData);
  };
  
  return (
    <div id="create-event-container">
      <div id="create-event-container-top">
        <LinkBack href={'/'} />
        <div id="links-create-event">
          <p>Recent requests</p>
          <p>Denied requests</p>
          <p>new request</p>
        </div>
        <p></p>
      </div>
      <div id="create-event-form">
        <div className="create-event-item">
          <label htmlFor="create-event-title">Event title <span id="red">*</span></label>
          <input
            type="text"
            name="create-event-title"
            id="create-event-title"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
          />
        </div>
        <div className="create-event-item">
          <label htmlFor="create-event-description">Event description <span id="red">*</span></label>
          <textarea
            name="create-event-description"
            id="create-event-description"
            value={eventDescription}
            onChange={handleDescriptionChange}
          />
          <p>{eventDescription.length}/200</p>
        </div>
        <div className="create-event-item-dates">
          <div className="create-event-item-date">
            <label htmlFor="create-event-start-date">Start date <span id="red">*</span></label>
            <input
              type="date"
              name="create-event-start-date"
              id="create-event-start-date"
              value={eventStartDate}
              onChange={(e) => setEventStartDate(e.target.value)}
            />
          </div>
          <div className="create-event-item-date">
            <label htmlFor="create-event-end-date">End date</label>
            <input
              type="date"
              name="create-event-end-date"
              id="create-event-end-date"
              value={eventEndDate}
              onChange={(e) => setEventEndDate(e.target.value)}
            />
          </div>
        </div>
        <div className="create-event-item">
          <label htmlFor="create-event-address">Event address <span id="red">*</span></label>
          <input
            type="text"
            name="create-event-address"
            id="create-event-address"
            value={eventAddress}
            onChange={(e) => setEventAddress(e.target.value)}
          />
        </div>
        <div className="create-event-item">
          <label htmlFor="create-event-emoji">Event emoji <span id="red">*</span></label>
          <input
            type="text"
            name="create-event-emoji"
            id="create-event-emoji"
            value={eventEmoji}
            onChange={(e) => setEventEmoji(e.target.value)}
          />
        </div>
        <div className="create-event-item">
          <label htmlFor="create-event-co-organizors">Co-Organizers</label>
          <div className="custom-dropdown" ref={dropdownRef}>
            <button className="custom-dropdown-button" onClick={clickHandler}>
              Select co-organizers {dropdownVisible ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
            </button>
            <div id="user-dropdown-list" className={`dropdown-list ${dropdownVisible ? 'show' : ''}`}>
              <div
                className="dropdown-item"
                onClick={handleSelectNobody}
                style={{ display: 'flex', alignItems: 'center', padding: '8px', cursor: 'pointer' }}
              >
                <span>No one (Nobody)</span>
              </div>
              {users.map((user) => (
                <div
                  key={user._id}
                  className="dropdown-item"
                  onClick={() => handleSelect(user)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px',
                    cursor: 'pointer',
                    backgroundColor: selectedUsers.some((selectedUser) => selectedUser._id === user._id) ? '#e0e0e0' : 'transparent',
                  }}
                >
                  {selectedUsers.some((selectedUser) => selectedUser._id === user._id) && (
                    <span style={{ marginRight: '10px', color: '#4caf50' }}>✔</span>
                  )}
                  <img
                    src={user.picture}
                    alt={formatName(user.name)}
                    style={{ width: '30px', height: '30px', marginRight: '10px' }}
                  />
                  {formatName(user.name)}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="create-event-item">
          <label htmlFor="create-event-location">Location <span id="red">*</span></label>
          <select
            name="create-event-location"
            id="create-event-location"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
          >
            <option value="" selected hidden disabled>
              -- Select --
            </option>
            <option value="Brightest North">Brightest North</option>
            <option value="Brightest East">Brightest East</option>
            <option value="Brightest West">Brightest West</option>
            <option value="all">Everyone</option>
          </select>
        </div>
        <div className="create-event-item">
          <label htmlFor="create-event-selfpay">Is self-pay required? <span id="red">*</span></label>
          <select
            name="create-event-selfpay"
            id="create-event-selfpay"
            value={isSelfPay ? 'true' : 'false'}
            onChange={(e) => setIsSelfPay(e.target.value === "true")}
          >
            <option value="" selected hidden disabled>
              -- Please select --
            </option>
            <option value="true">Yes, self-pay is required</option>
            <option value="false">No, self-pay is not required</option>
          </select>
        </div>

        {errorMessage && <div id="error-message">{errorMessage}</div>}

        <button id="create-event-submit" onClick={handleSubmit}>
          Create Event
        </button>
      </div>
    </div>
  );
};

const CreateEventPage = withAuthenticationRequired(CreateEvent, {
  onRedirecting: () => <FullscreenLoader content="Redirecting..." />,
});
export default CreateEventPage;
//https://kzmgtcv92869d0nsupug.lite.vusercontent.net/