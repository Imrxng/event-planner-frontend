import { Link } from 'react-router-dom';
import sfeerbeeld from "../assets/images/sfeerbeeld2.png"
import '../styles/home.component.css';
import { useAuth0 } from '@auth0/auth0-react';
import UserDataCompleter from '../components/auth/userDataCompleter';


const Index = () => {
  const { isAuthenticated } = useAuth0();
  return (
    <div className='home_container'>
      <div className='home_Textcontent'>
        <h1>Discover Join Enjoy</h1>
        <h2>Find your next event or share your own!</h2>
        <p>A unique event platform from Brightest just for YOU. From workshops to team outings, from networking events to casual meetups, our platform connects you with exciting opportunities tailored to your interests.</p>
        <h3>Join the fun!</h3>
        <Link to={''} className='home_Link'>BrightEvents</Link>
        <Link to={''} className='home_Link'>BrightPolls</Link>
    </div>
    <img src={sfeerbeeld} alt="" width={600} height={600}/>
    {isAuthenticated && <UserDataCompleter />}
</div>
  )
}

export default Index