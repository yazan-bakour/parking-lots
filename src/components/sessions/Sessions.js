import { useEffect, useState } from "react";
import { useAPI } from "../../api/apiContext";
import "./Sessions.css"
    
const Sessions = () => {
  const { fetchSessionsList, sessionsList, loading } = useAPI()
  const [filteredSessions, setFilteredSessions] = useState(sessionsList?.data?.parkingSessions || []);
  const [selectedSpaceId, setSelectedSpaceId] = useState("");
  const [sessionStartedAt, setSessionStartedAt] = useState(null);
  const [sessionEndedAt, setSessionEndedAt] = useState(null);
  const [isSessionEnded, setIsSessionEnded] = useState(false);
  const [listLimit, setListLimit] = useState(0)
  const [offset, setOffset] = useState(0)
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchSessionsList(0, 0, null, null, null, null, null, null, null);
      } catch (error) {
        console.error("Error fetching new session list", error.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        setFilteredSessions(sessionsList?.data?.parkingSessions || []);
      } catch (error) {
        console.error("Error fetching new session list", error.message);
      }
    }
    fetchFilteredData()
  }, [sessionsList]);

  const handleSessionTypeChange = (value) => {
    const residenceVehicleType = sessionsList?.data?.parkingSessions.filter( e => e.parkingSpaceId === 1)[0].vehicleType
    const nonResidenceCarVehicleType = sessionsList?.data?.parkingSessions.filter( e => e.parkingSpaceId === 2)[0].vehicleType
    const nonResidenceMotoVehicleType = sessionsList?.data?.parkingSessions.filter( e => e.parkingSpaceId === 3)[0].vehicleType
    const residence = sessionsList?.data?.parkingSessions.filter( e => e.parkingSpaceId === 1)
    const nonResidenceCar = sessionsList?.data?.parkingSessions.filter( e => e.parkingSpaceId === 2)
    const nonResidenceMoto = sessionsList?.data?.parkingSessions.filter( e => e.parkingSpaceId === 3)
    
    if (value === 1) {
      setSelectedSpaceId(residenceVehicleType);
      setFilteredSessions(residence);
    } else if (value === 2) {
      setSelectedSpaceId(nonResidenceCarVehicleType);
      setFilteredSessions(nonResidenceCar)
    } else if (value === 3) {
      setSelectedSpaceId(nonResidenceMotoVehicleType);
      setFilteredSessions(nonResidenceMoto)

    } else {
      setSelectedSpaceId("");
      setFilteredSessions(sessionsList?.data?.parkingSessions);
    }
  };

  const converParkingIdToType = (data) => {
    const car = 'car'
    const motor = 'motor'
    const residence = 'residence'

    switch (data) {
      case 1:
        return residence
      case 2:
        return car
      default: 
      return motor
    }
  }

  const convertSessionLengthFormat = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  const convertDate = (date) => {
    return new Date(date).toISOString().slice(0, 16)
  }

  const handleSessionStartDateChange = (value) => {
    if (value === "") {
      setFilteredSessions(sessionsList?.data?.parkingSessions || []);
    } else {
      const targetDate = new Date(value).toISOString().slice(0, 16);
  
      const filteredByStartDate = sessionsList?.data?.parkingSessions.filter((session) => {
        const sessionDate = new Date(session.sessionStartedAt).toISOString().slice(0, 16);
        return targetDate <= sessionDate;
      });

      setFilteredSessions(filteredByStartDate || []);
    }
  };
  
  const handleSessionEndDateChange = (value) => {
    if (value === "") {
      setFilteredSessions(sessionsList?.data?.parkingSessions || []);
    } else {
      const targetDate = new Date(value).toISOString().slice(0, 16);
  
      const filteredByStartDate = sessionsList?.data?.parkingSessions.filter((session) => {
        const sessionDate = new Date(session.sessionEndedAt).toISOString().slice(0, 16);
        return targetDate <= sessionDate;
      });

      setFilteredSessions(filteredByStartDate || []);
    }
  };

  const handleSessionStatusChange = (value) => {
    const ended = sessionsList?.data?.parkingSessions.filter((session) => session.isSessionEnded === true)
    const active = sessionsList?.data?.parkingSessions.filter((session) => session.isSessionEnded === false)
    if (value) {
      setFilteredSessions(ended)
    } else {
      setFilteredSessions(active)
    }
  };

  const calcPrice = (id, time) => {
    let price = 0
    const hours = Math.floor(time / 60)
    if (id === 3) {
      price = 3 * hours
    } else if (id === 2) {
      price = 5 * hours
    } else {
      price = 0
    }

    return price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

  const renderTableRows = () => {
    return filteredSessions.map((session) => (
      <tr key={session.parkingSessionId}>
        <td>
          <img src={`/assets/${converParkingIdToType(session.parkingSpaceId)}.svg`} alt={converParkingIdToType(session.parkingSpaceId)} />
        </td>
        <td>
          <div className={session.isSessionEnded ? 'b-red circle' : 'b-green circle'} />
        </td>
        <td>{session.vehicleType}</td>
        <td>{session.vehicleLicensePlate}</td>
        <td>{convertSessionLengthFormat(session.sessionLengthInHoursMinutes)}</td>
        <td>{convertDate(session.sessionStartedAt)}</td>
        <td>{convertDate(session.sessionEndedAt) || 'N/A'}</td>
        <td>€ {calcPrice(session.parkingSpaceId, session.sessionLengthInHoursMinutes)}</td>
      </tr>
    ));
  };

  // const handlePreviousPage = () => {
  //   const newOffset = Math.max(offset - 10, 0);
  //   setOffset(newOffset);
  // };

  // const handleNextPage = () => {
  //   // const newOffset = Math.min(offset + 10, listLimit - 10);
  //   setOffset(offset + 5);
  // };
  

  return (
    <div className="table">
      <div className="filters">
        <div>
          <p>Session Type</p>
          <select
            onChange={(e) => handleSessionTypeChange(Number(e.target.value))}
          >
            <option value="">Session Type</option>
            <option value={1}>Residence</option>
            <option value={2}>Non-residence CAR</option>
            <option value={3}>Non-residence MOTORCYCLE</option>
          </select>
        </div>
        <div>
          <p>Start date</p>
          <input
            type="datetime-local"
            onChange={(e) => handleSessionStartDateChange(e.target.value)}
          />
        </div>
        <div>
          <p>End date</p>
          <input
            type="datetime-local"
            onChange={(e) => handleSessionEndDateChange(e.target.value)}
          />
        </div>
        <div>
          <p>Status</p>
          <select onChange={(e) => handleSessionStatusChange(e.target.value)}>
            <option value="">Session Status</option>
            <option value={true}>Ended</option>
            <option value={false}>Active</option>
          </select>
        </div>
      </div>
      <table className="card">
        <thead>
          <tr>
            <th>Parking Space ID</th>
            <th>Session Status</th>
            <th>Vehicle Type</th>
            <th>Vehicle License Plate</th>
            <th>Session Length</th>
            <th>Session Started At</th>
            <th>Session Ended At</th>
            <th>Prices</th>
          </tr>
        </thead>
        {loading && <div className="loader-container"><img className="loader" src="/assets/loader.gif" alt="loader" /></div>}
        <tbody>{renderTableRows()}</tbody>
      </table>
      {/* <div className="pagination">
        <button 
          onClick={handlePreviousPage} 
          // disabled={offset === 0}
        >
          Previous
        </button>
        <span>
          {`Page ${Math.ceil((offset + 1) / 10)} of ${Math.ceil(
            listLimit / 10
          )}`}
        </span>
        <button 
          onClick={handleNextPage} 
          // disabled={offset + 10 >= listLimit}
        >
          Next
        </button>
      </div> */}
    </div>
  );
};

export default Sessions;