import React from "react";
import "../../styles/LocationSelector.component.css";

export interface LocationSelectorProps {
  locatiefilter: string;
  setLocatiefilter: React.Dispatch<React.SetStateAction<string>>;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  locatiefilter,
  setLocatiefilter,
}) => {
  const locations = [
    "All",
    "Brightest North",
    "Brightest West",
    "Brightest East",
  ];

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLocatiefilter(event.target.value);
  };
  return (
    <div>
      <label htmlFor="location-selector">Region: </label>
      <select
        id="location-selector"
        value={locatiefilter}
        onChange={handleChange}
      >
        {locations.sort().map((location) => (
          <option key={location} value={location === "All" ? "all" : location}>
            {location}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationSelector;
