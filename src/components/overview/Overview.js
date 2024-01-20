import { useState, useEffect, useRef } from "react"
import { useAPI } from "../../apiContext";
import "./Overview.css"

const Overview = () => {
  const { spacesList, userInfo, startParkingSession, fetchSpacesList } = useAPI()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [vehicleType, setVehicleType] = useState("");
  const [plateNumber, setPlateNumber] = useState("");

  //TODO listen to fetchSpaces if any new space added
  //TODO create Card and Modal components
  //Add loading
  //Handle errors

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
  }, []);

  const handleSession = (cardId) => {
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
      console.error("Error submitting modal:", error.message);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCardId(null);
  };

  return (
    <div className="container">
      <div className="stepper">
      <button>floor 1</button>
      <button>floor 2</button>
      </div>

      <div className="cards">
        {
          spacesList?.parkingSpaces?.map((space, index) => (
            <div className="card-body" key={space.parkingSpaceId}>
              <div>
                <p>{space.vehicleType === null ? 'Residence' : space.vehicleType}</p>
                <p>{space.occupancy}/{space.capacity}</p>
              </div>
              <div><button onClick={() => handleSession(space.vehicleType === null ? 'residence' : space.vehicleType)}>Start session</button></div>
            </div>
          ))
        }
      </div>

      {isModalOpen && (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={handleModalClose}>
            &times;
          </span>
          <div>
            <label>Vehicle Type:</label>
            <input
              type="text"
              value={vehicleType}
              readOnly={selectedCardId !== 'residence'}
              onChange={(e) => setVehicleType(e.target.value)}
            />
          </div>
          <div>
            <label>Plate Number:</label>
            <input
              type="text"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
            />
          </div>
          <button onClick={handleModalSubmit}>Start Session</button>
        </div>
      </div>
      )}
    </div>
  );
};
export default Overview;