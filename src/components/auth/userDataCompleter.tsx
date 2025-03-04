import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';

type Props = {
  setUserLocation?: React.Dispatch<React.SetStateAction<string>>,
}

const UserDataCompleter = ({ setUserLocation }: Props) => {
  const [currentUser, setCurrentUser] = useState<{ user: null | object }>({ user: null });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [location, setLocation] = useState<string>('');
  const [errors, setErrors] = useState<{ location?: string }>({});
  const server = import.meta.env.VITE_SERVER_URL;
  const { user, getAccessTokenSilently } = useAuth0();
  const userId = user?.sub;

  useEffect(() => {
    const fetchPosts = async () => {
      const token = await getAccessTokenSilently();
      try {
        const response = await fetch(`${server}/api/users/${user?.sub}`, {
          method: 'GET',
          headers: {
            authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        setCurrentUser(data);
        setIsLoading(false);
        setUserLocation && setUserLocation(data.user.location);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPosts();
  }, [server, user?.sub]);

  const locationOptions = [
    { value: '', label: '-Select location-' },
    { value: 'Brightest HQ', label: 'Brightest HQ (Kontich)' },
    { value: 'Brightest West', label: 'Brightest West (Gent)' },
    { value: 'Brightest East', label: 'Brightest East (Genk)' },
  ];

  const validate = () => {
    const newErrors: { location?: string } = {};
    if (!location) {
      newErrors.location = 'This field is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    // Get the user's access token for the api-endpoint from Auth0.
    const token = await getAccessTokenSilently();
    // Sends the user's data to be saved in the mongoDatabase.
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        "_id": userId,
        "location": values.location,
        "picture": user?.picture,
        "name": user?.name,
      })
    });
    const userData = await response.json();
    window.location.reload();
  };

  if (isLoading) {
    return null;
  } else {
    if (currentUser.user === null) {
      return (
        <div>
          <div>
            <div>
              <div>
                <h2>First login</h2>
              </div>
            </div>

            <div>
              <p>Welcome! Please finish your profile by adding your location.</p>
              <form onSubmit={handleSubmit}>
                <div>
                  <select
                    value={location}
                    id="location"
                    name="location"
                    onChange={(e) => setLocation(e.target.value)}
                    onBlur={() => validate()}
                  >
                    {locationOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.location ? (<div>{errors.location}</div>) : null}
                </div>

                <div>
                  <button type="submit">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
};

export default UserDataCompleter;