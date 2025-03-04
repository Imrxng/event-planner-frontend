import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { MongoDbUser } from '../../types/types';
import '../../styles/userdatacompleter.component.css';  

const UserDataCompleter = () => {
  const [currentUser, setCurrentUser] = useState<{ user: null | MongoDbUser }>({ user: null });
  const [location, setLocation] = useState<string>('');
  const [errors, setErrors] = useState<{ location?: string }>({});
  const server = import.meta.env.VITE_SERVER_URL;
  const { user, getAccessTokenSilently } = useAuth0();
  const userId = user?.sub;

  useEffect(() => {
    const fetchUser = async () => {
      const token = await getAccessTokenSilently();
      try {
        const response = await fetch(`${server}/api/users/${user?.sub}`, {
          method: 'GET',
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setCurrentUser(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (user?.sub) fetchUser();
  }, [getAccessTokenSilently, server, user?.sub]);

  const validate = () => {
    const newErrors: { location?: string } = {};
    if (!location) {
      newErrors.location = 'Please fill in a location';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClick = async () => {
    if (!validate()) return;
    const token = await getAccessTokenSilently();
    try {
      await fetch(`${server}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          _id: userId,
          location,
          picture: user?.picture,
          name: user?.name,
        }),
      });
      window.location.reload();
    } catch (error) {
      console.error('Error submitting user data:', error);
    }
  };

  const getNameFromEmail = (email: string | undefined) => {
    if (email) {
      const namePart = email.split('@')[0]; 
      const name = namePart.split('.').map(part => 
        part.charAt(0).toUpperCase() + part.slice(1) 
      ).join(' ');
      return name;
    } 
  };

  if (currentUser.user === null) {
    return (
      <div className="overlay">
        <div className="modal">
          <h2>Welcome, {getNameFromEmail(user?.name)}!</h2>
          <p>Please complete your profile by selecting your location:</p>
          <div>
            <label htmlFor="location">Location:</label>
            <select
              id="location"
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onBlur={validate}
              className="location-select"  
            >
              <option value="" selected disabled hidden>-Select location-</option>
              <option value="Brightest HQ">Brightest HQ (Kontich)</option>
              <option value="Brightest West">Brightest West (Gent)</option>
              <option value="Brightest East">Brightest East (Genk)</option>
            </select>
            {errors.location && <div className="error">{errors.location}</div>} 
          </div>
          <div>
            <button type="button" onClick={handleClick} className="submit-button"> 
              Submit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default UserDataCompleter;
