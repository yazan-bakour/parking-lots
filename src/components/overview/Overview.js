import { useState, useEffect, useRef } from "react"
import { useAPI } from "../../api/apiContext";
import "./Overview.css"
import "../../common/modal/Modal.css"

const Overview = () => {
  const { loading, spacesList, getSessionNewList, endParkingSession, startParkingSession, fetchSpacesList } = useAPI()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [vehicleType, setVehicleType] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [isEnding, setIsEnding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [parkingId, setParkingId] = useState('');

  //TODO create Card and Modal components
  //Add loading
  //Handle errors
  //Add floor stepper

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchSpacesList();
        //Remove this and add toast
        console.log("Spaces list updated:", spacesList);
      } catch (error) {
        console.error("Error fetching spaces list:", error.message);
      }
    };
    fetchData();
  }, [parkingId]);

  const handleStartSession = (cardId) => {
    setIsEnding(false)
    setIsModalOpen(true);
    setSelectedCardId(cardId);
    if (cardId === "CAR") {
      setVehicleType("CAR");
    } else if (cardId === "MOTOR") {
      setVehicleType("MOTOR");
    } else {
      setVehicleType("");
    }
    setPlateNumber("");
  }

  const handleEndSession = (cardId, parkingSpaceId) => {
    setIsModalOpen(true);
    setSelectedCardId(cardId);
    setIsEnding(true)
    setParkingId(parkingSpaceId)
  }

  const handleSuggestionSelect = (selectedSuggestion) => {
    const selectedSearchTerm = suggestions.filter(session => session.parkingSessionId === selectedSuggestion)[0]
    setSearchTerm(selectedSearchTerm.plateNumber + ', ' + selectedSearchTerm.spaceType);
    setSelectedId(selectedSuggestion)
    setSuggestions([]);
  };

  const handleInputChange = async (e) => {
    try {
      const newSearchTerm = e.target.value;
      setSearchTerm(newSearchTerm);
  
      const sessionsList = await getSessionNewList(parkingId);
      const newSuggestions = sessionsList?.filter((session) =>
        Object.values(session).some((value) =>
          String(value).toLowerCase().includes(newSearchTerm.toLowerCase())
        )
      );
  
      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Error handling input change:', error.message);
    }
  };

  const handleModalEndSession = async () => {
    try {
      if (selectedId) {
        await endParkingSession(selectedId)
      }
      await fetchSpacesList();
      setIsModalOpen(false);
      setSelectedId('');
      setSearchTerm('');
    } catch (error) {
      console.error("Error ending session:", error.message);
    }
    //TODO add taost messge
  }

  const handleModalSubmit = async () => {
    try {
      let type;
      if (selectedCardId === 'residence') {
        type = true;
      } else {
        type = false;
      }

      await startParkingSession(vehicleType, type, plateNumber);
  
      await fetchSpacesList();
  
      setIsModalOpen(false);
      setSelectedCardId(null);
    } catch (error) {
      console.error("Error submitting session:", error.message);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCardId(null);
    setSuggestions([]);
  };

  const onChangeVehicleType = (e) => {
    setVehicleType(e.target.value)
  }

  const onChangePlateNumber = (e) => {
    setPlateNumber(e.target.value)
  }

  return (
    <div className="container">
      {loading && <div className="loader-container"><img className="loader" src="/assets/loader.gif" alt="loader" /></div>}
      <div className="cards">
        {
          spacesList?.parkingSpaces?.map((space) => (
            <div className="card-body card" key={space.parkingSpaceId}>
              <div className="card-header b-purple">
                <p>{space.vehicleType === null ? 'Residence' : space.vehicleType}</p>
                <p>{space.occupancy}/{space.capacity}</p>
              </div>
              <div className="card-content">
                <button className="start t-white b-green" onClick={() => handleStartSession(space.vehicleType === null ? 'residence' : space.vehicleType)}>Start session</button>
                <button className="end t-white b-red" onClick={() => handleEndSession(space.vehicleType === null ? 'residence' : space.vehicleType, space.parkingSpaceId)}>End session</button>
              </div>
              <div className="progress-bar">
                <div className="progress-fill t-white" style={{ width: `${(space.occupancy / space.capacity) * 100}%` }}>
                  { ((space.occupancy / space.capacity) * 100 > 20) && <p>{(space.occupancy / space.capacity) * 100}%</p>}
                </div>
              </div>
            </div>
          ))
        }
      </div>

      {(isModalOpen && !isEnding) && (
        <div className="modal-wrapper">
          <div className="modal-out" onClick={handleModalClose}></div>
          <div className="modal card">
            <div className="modal-content">
              <button className="close" onClick={handleModalClose}>
                &times;
              </button>
              <div>
                <label>Vehicle Type:</label>
                <input
                  type="text"
                  value={vehicleType}
                  readOnly={selectedCardId !== 'residence'}
                  onChange={onChangeVehicleType}
                />
              </div>
              <div>
                <label>Plate Number:</label>
                <input
                  type="text"
                  value={plateNumber}
                  onChange={onChangePlateNumber}
                />
              </div>
              <button className="cta b-green t-white" onClick={handleModalSubmit}>Start Session</button>
            </div>
          </div>

        </div>
      )}

      {(isModalOpen && isEnding) && (
        <div className="modal-wrapper">
          <div className="modal-out" onClick={handleModalClose}></div>
          <div className="modal card">
            <div className="modal-content">
              <button className="close" onClick={handleModalClose}>
                &times;
              </button>
              <div className="search">
                <label>Search for vehicle plate numbr :</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleInputChange}
                />
                {suggestions?.length > 0 && (
                  <ul className="suggestions">
                    {suggestions?.map((suggestion) => (
                      <li key={suggestion.parkingSessionId} onClick={() => handleSuggestionSelect(suggestion.parkingSessionId)}>
                        {suggestion.plateNumber + ', ' + suggestion.spaceType}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button className="cta b-red t-white" onClick={handleModalEndSession}>End Session</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Overview;