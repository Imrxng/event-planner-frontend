import { useContext } from 'react'
import { UserRoleContext } from '../context/context';

const Admin = () => {
  
  const userMongoDb = useContext(UserRoleContext);
  if ( userMongoDb && userMongoDb.userRole !== 'admin') {
    window.history.back();
  }
  return (
    <div style={{ height: '100vh' }}>

    </div>
  )
}

export default Admin;