
import React, { useEffect, useState } from 'react'
import { ManagementTokenContext, UserContext, UserRoleContext } from '../context/context';
import { useAuth0 } from '@auth0/auth0-react';
import { RootObjectMongoDbUser } from '../types/types';

interface Props {
  children: React.ReactNode;
};

const UserProvider = ({ children }: Props) => {
  const [userRole, setuserRole] = useState<string>('')
  const [managementToken, setManagementToken] = useState<string>('')
  const { user, getAccessTokenSilently } = useAuth0();
  const server = import.meta.env.VITE_SERVER_URL;
  
  useEffect(() => {
    if (user) {
      const fetchuserRole = async () => {
        try {
          const token = await getAccessTokenSilently();
          const response = await fetch(`${server}/api/users/${user.sub}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          const data: RootObjectMongoDbUser = await response.json();
          data.user.picture = user.picture!;
          
          await fetch(`${server}/api/users/${user.sub}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',  
            },
            method: 'PATCH',
            body: JSON.stringify({
              ...data.user
            }),
          });
                 
          setuserRole(data.user.role)
        } catch (error) {
          console.error(error)
        }
      }
      fetchuserRole();
    }
  }, [user])

  useEffect(() => {
    if (window.onload) {
      window.onload = () => {
        fetchToken()
      }
      
    }
    const fetchToken = async () => {
      const response = await fetch(`https://${import.meta.env.VITE_AUTH0_DOMAIN}/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: import.meta.env.VITE_AUTH0_CLIENT_ID,
          client_secret: import.meta.env.VITE_AUTH0_CLIENT_SECRET,
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        }),
        
      })
      const data = await response.json()
      
      setManagementToken(data.access_token)
    };
  }, [userRole])

  return (
    <UserContext.Provider value={user}>
      <UserRoleContext.Provider value={userRole}>
        <ManagementTokenContext.Provider value={managementToken}>
          {children}
        </ManagementTokenContext.Provider>
      </UserRoleContext.Provider>
    </UserContext.Provider>
  )
}

export default UserProvider