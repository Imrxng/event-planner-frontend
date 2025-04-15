import { useContext} from 'react';
import { UserContext, UserRoleContext } from '../context/context';
import FullscreenLoader from '../components/spinner/FullscreenLoader';

const Admin = () => {
  const role = useContext(UserRoleContext);
  const mongoDbUser = useContext(UserContext);


  if ( !mongoDbUser || role !== 'admin') {
    window.location.href = '/';
    return <FullscreenLoader content="Redirecting..." />;
  }

  return (
    <div style={{ height: '100vh' }}>
    </div>
  );
};

export default Admin;
