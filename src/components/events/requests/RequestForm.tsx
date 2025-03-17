import React from 'react';

const RequestForm= () => {
    return (
        <div className='form-container'>
            <label htmlFor="">Event Title</label><br />
            <input type="text" name="" id="" /><br />
            <label htmlFor="">Event Description</label><br />
            <input type="text" name="" id="" />

            <div className="date-time">
            <label htmlFor="">Date</label>
            <input type="date" name="" id="" />
            <label htmlFor="">Time</label>
            <input type="time" name="" id="" />
            </div>
            
            <label htmlFor="">Location</label>
            <input type="text" name="" id="" />
            <label htmlFor="">Event Emoji</label>
            <input type="text" name="" id="" />
            <label htmlFor="">Co-organizers</label>
            <select name="" id="">
                <option value=""></option>
            </select>
            
            <label htmlFor="">Selpay</label>
            <select name="" id="">
                <option value="" selected>ja</option>
                <option value="">nee</option>
            </select>

        </div>
    );
};

export default RequestForm;