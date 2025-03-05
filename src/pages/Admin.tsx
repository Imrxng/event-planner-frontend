import { useContext } from 'react'
import { UserRoleContext } from '../context/context';

const Admin = () => {
  const role = useContext(UserRoleContext);
  if (role !== 'admin') {
    window.history.back();
  }
  return (
    <div style={{ height: '100vh' }}>

    </div>
  )
}

export default Admin;