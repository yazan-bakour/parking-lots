import { useEffect, useState, useRef } from "react";
import { useAPI } from "../../api/apiContext";
import { formatNumber, convertDate } from "../../helper/helper"
import Modal from "../../common/modal/Modal";
import "./Sessions.css"
    
const Sessions = () => {
  const { fetchSessionsList, sessionsList, loading, endParkingSession } = useAPI()
  const [filteredSessions, setFilteredSessions] = useState(sessionsList?.data?.parkingSessions || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [plateNumber, setPlateNumber] = useState('');

  // I used effect run ref to limit the api calls to one only, this happens because of StrictMode on development mode
  const effectRan = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!effectRan.current) {
          await fetchSessionsList(0, 0, null, null, null, null, null, null, null);
        }
      } catch (error) {
        console.error("Error fetching new session list", error.message);
      }
    };
    fetchData();
    return () => {
      effectRan.current = true
    }
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
    const residence = sessionsList?.data?.parkingSessions.filter( e => e.parkingSpaceId === 1)
    const nonResidenceCar = sessionsList?.data?.parkingSessions.filter( e => e.parkingSpaceId === 2)
    const nonResidenceMoto = sessionsList?.data?.parkingSessions.filter( e => e.parkingSpaceId === 3)
    
    if (value === 1) {
      setFilteredSessions(residence);
    } else if (value === 2) {
      setFilteredSessions(nonResidenceCar)
    } else if (value === 3) {
      setFilteredSessions(nonResidenceMoto)

    } else {
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

  const handleSessionStartDateChange = (value) => {
    if (value === "") {
      setFilteredSessions(sessionsList?.data?.parkingSessions || []);
    } else {
      const targetDate = (value)
  
      const filteredByStartDate = sessionsList?.data?.parkingSessions.filter((session) => {
        const sessionDate = convertDate(session.sessionStartedAt);
        return targetDate <= sessionDate;
      });

      setFilteredSessions(filteredByStartDate || []);
    }
  };
  
  const handleSessionEndDateChange = (value) => {
    if (value === "") {
      setFilteredSessions(sessionsList?.data?.parkingSessions || []);
    } else {
      const targetDate = convertDate(value);
  
      const filteredByStartDate = sessionsList?.data?.parkingSessions.filter((session) => {
        const sessionDate = convertDate(session.sessionEndedAt);
        return targetDate <= sessionDate;
      });

      setFilteredSessions(filteredByStartDate || []);
    }
  };

  const handleSessionStatusChange = (value) => {
    const ended = sessionsList?.data?.parkingSessions.filter((session) => session.isSessionEnded === true)
    const active = sessionsList?.data?.parkingSessions.filter((session) => session.isSessionEnded === false)
    if (value === 'true') {
      setFilteredSessions(ended)
    }  
    if (value === 'false') {
      setFilteredSessions(active)
    }
    if (value === '') {
      setFilteredSessions(sessionsList?.data?.parkingSessions || [])
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

    return formatNumber(price)
  }

  const getTotalPrice = () => {
    let total = 0
    for (let i = 0; i < filteredSessions?.length; i++) {
      const element = filteredSessions[i];
      const price = calcPrice(element.parkingSpaceId, element.sessionLengthInHoursMinutes);
      total += parseFloat(price.replace(/,/g, ''));
    }
    return formatNumber(total)
  }

  const handleEndSession = (sessionId, vehicleLicensePlate) => {
    setIsModalOpen(true)
    setSelectedId(sessionId)
    setPlateNumber(vehicleLicensePlate)
  }

  const handleModalEndSession = async () => {
    try {
      if (selectedId) {
        await endParkingSession(selectedId)
      }
      await fetchSessionsList(0, 0, null, null, null, null, null, null, null);
      setIsModalOpen(false);
      setSelectedId('');
    } catch (error) {
      console.error("Error ending session:", error.message);
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const renderTableRows = () => {
    return filteredSessions?.map((session) => (
      <tr key={session.parkingSessionId}>
        <td>
          <img src={`/assets/${converParkingIdToType(session.parkingSpaceId)}.svg`} alt={converParkingIdToType(session.parkingSpaceId)} />
        </td>
        <td>
          <p className={session.isSessionEnded ? 'b-red circle' : 'b-green circle'} ></p>
        </td>
        <td>{session.vehicleType}</td>
        <td>{session.vehicleLicensePlate}</td>
        <td>{convertSessionLengthFormat(session.sessionLengthInHoursMinutes)}</td>
        <td>{convertDate(session.sessionStartedAt)}</td>
        <td>{convertDate(session.sessionEndedAt) || 'N/A'}</td>
        <td>€ {calcPrice(session.parkingSpaceId, session.sessionLengthInHoursMinutes)}</td>
        <td>
          <button className="end t-white b-red" onClick={() => handleEndSession(session.parkingSessionId, session.vehicleLicensePlate)}>End</button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="table">
      <div className="filters">
        <div>
          <p>Session Type</p>
          <select
            className="session"
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
          <select className="status" onChange={(e) => handleSessionStatusChange(e.target.value)}>
            <option value="">Session Status</option>
            <option value={true}>Ended</option>
            <option value={false}>Active</option>
          </select>
        </div>
        <div>
          <p>Total sessions: <b>{filteredSessions?.length}</b></p>
          <p>Total revanue: <b>€ {getTotalPrice()}</b></p>
        </div>
      </div>

      <table className="card">
        <thead>
          <tr>
            <th>Parking Type</th>
            <th>Session Status</th>
            <th>Vehicle Type</th>
            <th>Vehicle License Plate</th>
            <th>Session Length</th>
            <th>Session Started At</th>
            <th>Session Ended At</th>
            <th>Prices</th>
            <th>End session</th>
          </tr>
        </thead>
        {loading && <div className="loader-container"><img className="loader" src="/assets/loader.gif" alt="loader" /></div>}
        <tbody>{renderTableRows()}</tbody>
      </table>

      {isModalOpen  && (
        <Modal
          sessionEnding={true}
          handleModalClose={handleModalClose}
          plateNumber={plateNumber}
          handleModalEndSession={handleModalEndSession}
        />
      )}
    </div>
  );
};

export default Sessions;