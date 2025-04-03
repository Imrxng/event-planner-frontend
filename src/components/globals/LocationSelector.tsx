import React from 'react';

interface LocationSelectorProps {
    locatiefilter: string;
    setLocatiefilter: React.Dispatch<React.SetStateAction<string>>;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ locatiefilter, setLocatiefilter }) => {
    const locations = ["All", "Brightest North", "Brightest West", "Brightest East"];

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLocatiefilter(event.target.value);
    };

    return (
        <div>
            <label htmlFor="location-selector">Select Location: </label>
            <select
                id="location-selector"
                value={locatiefilter}
                onChange={handleChange}
            >
                {locations.map((location) => (
                    <option key={location} value={location}>
                        {location}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LocationSelector;