import React, { useEffect, useState } from 'react';
import { UserContext, UserRoleContext } from '../context/context';
import { MongoDbUser, RootObjectMongoDbUser } from '../types/types';
import { useAccount, useMsal } from '@azure/msal-react';
import useAccessToken from '../utilities/getAccesToken';
import { uploadImage } from '../utilities/uploadImage';

interface Props {
  children: React.ReactNode;
};

const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<MongoDbUser>();
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string>('');
  const { accounts } = useMsal();
  const { getAccessToken } = useAccessToken();

  const account = useAccount(accounts[0] || {});

  const server = import.meta.env.VITE_SERVER_URL;
  
  useEffect(() => {
    const fetchUserRole = async () => {
      setLoadingUser(true);
      if (account && account?.idTokenClaims?.oid) {
        try {
          const token: string = await getAccessToken();
  
          const photoResponse = await fetch("https://graph.microsoft.com/v1.0/me/photo/$value", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const photoBlob = await photoResponse.blob();
          const response = await fetch(`${server}/api/users/${account.idTokenClaims.oid}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data: RootObjectMongoDbUser = await response.json();

          if (data.user.picture === 'not-found' && photoBlob.size === 0) {
            data.user.picture = await uploadImage(photoBlob, account.idTokenClaims.oid);
            await fetch(`${server}/api/users/${account.idTokenClaims.oid}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              method: 'PATCH',
              body: JSON.stringify({ ...data.user }),
            });
          }
  
          if (!user || user._id !== data.user._id || user.role !== data.user.role) {
            setUser(data.user);
            setUserRole(data.user.role);
          }
          
        } catch (error) {
          console.error(error);
        }
      }
      setLoadingUser(false);
    };
    if (account?.idTokenClaims?.oid) {
      fetchUserRole();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, account?.idTokenClaims?.oid, server]); 
  

  return (
    <UserContext.Provider value={{ user, loadingUser, setUser}}>
      <UserRoleContext.Provider value={userRole}>
        <div> 
          {children}
        </div>
      </UserRoleContext.Provider>
    </UserContext.Provider>
  );
}

export default UserProvider;
