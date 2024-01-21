import './Card.css';

const Card = ({parkingSpaceId, vehicleType, occupancy, capacity, handleStartSession, handleEndSession}) => {
  return (
    <div className="card-body card" key={parkingSpaceId}>
      <div className="card-header b-purple">
        <p>{vehicleType === null ? "RESIDENCE" : vehicleType}</p>
        <p>
          {occupancy}/{capacity}
        </p>
      </div>
      <div className="card-content">
        <div className="price"></div>
        <div className="buttons">
          <button
            className="start t-white b-green"
            onClick={() =>
              handleStartSession(
                vehicleType === null ? "residence" : vehicleType
              )
            }
          >
            Start session
          </button>
          <button
            className="end t-white b-red"
            onClick={() =>
              handleEndSession(
                vehicleType === null ? "residence" : vehicleType,
                parkingSpaceId
              )
            }
          >
            End session
          </button>
        </div>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill t-white"
          style={{ width: `${(occupancy / capacity) * 100}%` }}
        >
          {(occupancy / capacity) * 100 > 20 && (
            <p>{(occupancy / capacity) * 100}%</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default Card;