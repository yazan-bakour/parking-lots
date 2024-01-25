import { useState, useEffect, useRef } from "react"
import { useAPI } from "../../api/apiContext";
import "./Overview.css"
import "../../common/modal/Modal.css"
import Modal from "../../common/modal/Modal";
import Card from "../../common/card/Card";
import Loader from "../../common/loader/Loader";

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

  // I used effect run ref to limit the api calls to one only, this happens because of StrictMode on development mode
  const effectRan = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!effectRan.current) {
          await fetchSpacesList();
        }
      } catch (error) {
        console.error("Error fetching spaces list:", error.message);
      }
    };
    fetchData();
    return () => {
      effectRan.current = true
    }
  }, []);

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
    setSearchTerm('')
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
      {loading && <Loader />}
      <div className="cards">
        {
          spacesList?.parkingSpaces?.map((space) => (
            <Card 
              key={space.parkingSpaceId} 
              parkingSpaceId={space.parkingSpaceId} 
              vehicleType={space.vehicleType} 
              occupancy={space.occupancy} 
              capacity={space.capacity} 
              handleStartSession={handleStartSession} 
              handleEndSession={handleEndSession} 
            />
          ))
        }
      </div>

      {(isModalOpen && !isEnding) && (
        <Modal
          isEnding={false}
          handleModalClose={handleModalClose} 
          selectedCardId={selectedCardId} 
          onChangeVehicleType={onChangeVehicleType} 
          vehicleType={vehicleType} 
          plateNumber={plateNumber} 
          onChangePlateNumber={onChangePlateNumber} 
          handleModalSubmit={handleModalSubmit}
        />
      )}

      {(isModalOpen && isEnding) && (
        <Modal
          isEnding={true}
          handleModalClose={handleModalClose}
          searchTerm={searchTerm} 
          handleInputChange={handleInputChange} 
          suggestions={true} 
          data={suggestions || []} 
          handleSuggestionSelect={handleSuggestionSelect}
          handleModalEndSession={handleModalEndSession}
        />
      )}
    </div>
  );
};
export default Overview;