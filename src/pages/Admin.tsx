import { useContext } from 'react'
import { UserRoleContext } from '../context/context';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import FullscreenLoader from '../components/spinner/FullscreenLoader';

const Admin = () => {
  
  const role = useContext(UserRoleContext);
  if ( role !== 'admin') {
    window.history.back();
  }
  return (
    <div style={{ height: '100vh' }}>

    </div>
  )
}

const AdminPage = withAuthenticationRequired(Admin, {
  onRedirecting: () => <FullscreenLoader content="Redirecting..." />,
});

export default AdminPage;