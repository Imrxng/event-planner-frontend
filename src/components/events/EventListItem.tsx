import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';
import { MdOutlineCalendarMonth } from "react-icons/md";
import { CiClock2 } from "react-icons/ci";
import { IoLocationOutline } from "react-icons/io5";
import { AiOutlineRight } from "react-icons/ai";
import '../../styles/brightListItem.component.css';
import { Event } from '../../types/types';
interface EventItemProps {
event: Event;
}

const EventListItem = ( {event}:EventItemProps) => {
    
    return (
        <>
            <div className='eventItem_container'>
                <div className='eventItem_header'>
                    <p className='eventItem_emoji'>{event.emoji}</p>
                    <p></p>
                    <div className='eventItem_header_content'>
                    <p><MdOutlineCalendarMonth height={10} width={10}/> {}</p>
                    <p><CiClock2 height={10} width={10}/> {}</p>
                    </div>
                </div>
                <div className='eventItem_content'>
                    <h1>{event.title}</h1>
                    <p><IoLocationOutline/>{event.location}</p>
                    <p></p>
                    <Link to={''} className='eventItem_button'>See more<AiOutlineRight className='eventItem_iconbutton'/></Link>
                </div>

            </div>
        </>
    );
};

export default EventListItem;