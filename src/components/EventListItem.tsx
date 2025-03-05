import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';
import { MdOutlineCalendarMonth } from "react-icons/md";
import { CiClock2 } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import { AiOutlineRight } from "react-icons/ai";
import '../styles/brightListItem.component.css';

const EventListItem = () => {
    
    return (
        <>
            <div className='eventItem_container'>
                <div className='eventItem_header'>
                    <FaCalendarAlt className='eventItem_image'/>
                    <div>
                    <p><MdOutlineCalendarMonth height={10} width={10}/> 15 maart 2024</p>
                    <p><CiClock2 height={10} width={10}/> 18:30</p>
                    </div>
                </div>
                <div className='eventItem_content'>
                    <h1>Amsterdam Tech Meetup</h1>
                    <p><IoLocationOutline/>Amsterdam Netherlands</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.  </p>
                    <Link to={''} className='eventItem_button'>See more<AiOutlineRight/></Link>
                </div>

            </div>
        </>
    );
};

export default EventListItem;