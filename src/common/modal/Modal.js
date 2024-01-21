import './Modal.css';
    
const Modal = ({isEnding, handleModalClose, selectedCardId, onChangeVehicleType, vehicleType, plateNumber, onChangePlateNumber, handleModalSubmit, searchTerm, handleInputChange, suggestions, data, handleSuggestionSelect, handleModalEndSession, sessionEnding}) => {
  return (
    <>
      {!isEnding && !sessionEnding ? (
        <div className="modal-wrapper">
          <div className="modal-out" onClick={handleModalClose}></div>
          <div className="modal card">
            <div className="modal-content">
              <button className="close" onClick={handleModalClose}>
                &times;
              </button>
              <div>
                <label>Vehicle Type:</label>
                {selectedCardId === "residence" ? (
                  <select onChange={onChangeVehicleType}>
                    <option value="">Vehicle type</option>
                    <option value="CAR">Car</option>
                    <option value="MOTOR">Motorbike</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={vehicleType}
                    readOnly
                    onChange={onChangeVehicleType}
                  />
                )}
              </div>
              <div>
                <label>Plate Number:</label>
                <input
                  type="text"
                  value={plateNumber}
                  onChange={onChangePlateNumber}
                />
              </div>
              <button
                className="cta b-green t-white"
                onClick={handleModalSubmit}
              >
                Start Session
              </button>
            </div>
          </div>
        </div>
      ) : (
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
                {suggestions && data?.length > 0 && (
                  <ul className="suggestions">
                    {data?.map((suggestion) => (
                      <li
                        key={suggestion.parkingSessionId}
                        onClick={() =>
                          handleSuggestionSelect(suggestion.parkingSessionId)
                        }
                      >
                        {suggestion.plateNumber + ", " + suggestion.spaceType}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                className="cta b-red t-white"
                onClick={handleModalEndSession}
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      )}
      {
        sessionEnding &&
        (
        <div className="modal-wrapper">
          <div className="modal-out" onClick={handleModalClose}></div>
          <div className="modal card">
            <div className="modal-content">
              <button className="close" onClick={handleModalClose}>
                &times;
              </button>
              <div className="search">
                <label>Are you sure you want to end this session for this plate number <b>{plateNumber}</b></label>
              </div>
              <button
                className="cta b-red t-white"
                onClick={handleModalEndSession}
              >
                End Session
              </button>
            </div>
          </div>
        </div>
        )
      }
    </>
  );
};
export default Modal;