import { useEffect, useState } from "react";
import { useAPI } from "../../apiContext";
import "./Sessions.css"
    
const Sessions = () => {
  const { fetchSessionsList, sessionsList } = useAPI()
  const [filteredSessions, setFilteredSessions] = useState(sessionsList?.data?.parkingSessions || []);
  const [selectedSpaceId, setSelectedSpaceId] = useState("");
  const [sessionStartedAt, setSessionStartedAt] = useState(null);
  const [sessionEndedAt, setSessionEndedAt] = useState(null);
  const [isSessionEnded, setIsSessionEnded] = useState(false);
  const [listLimit, setListLimit] = useState(sessionsList?.data?.parkingSessionsTotalCount || 0)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchSessionsList(offset, 0, null, null, null, null, null, null, null);
      } catch (error) {
        console.error("Error fetching new session list", error.message);
      }
    };
    fetchData();
    //if adding listLimit here api call will work, but filtering the data setFilteredSessions(residence) doesn't
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
      setListLimit(residence.length)
    } else if (value === 2) {
      setSelectedSpaceId(nonResidenceCarVehicleType);
      setFilteredSessions(nonResidenceCar)
      setListLimit(nonResidenceCar.length)
    } else if (value === 3) {
      setSelectedSpaceId(nonResidenceMotoVehicleType);
      setFilteredSessions(nonResidenceMoto)
      setListLimit(nonResidenceMoto.length)

    } else {
      setSelectedSpaceId("");
      setFilteredSessions(sessionsList?.data?.parkingSessions);
      setListLimit(0)
    }
  };

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

  const renderTableRows = () => {
    return filteredSessions.map((session) => (
      <tr key={session.parkingSessionId}>
        <td>{session.vehicleLicensePlate}</td>
        <td>{session.vehicleType}</td>
        <td>{session.parkingSpaceId}</td>
        {/* <td>{session.parkingSessionId}</td> */}
        <td>{session.isSessionEnded ? 'Ended' : 'Active'}</td>
        <td>{session.sessionLengthInHoursMinutes}</td>
        <td>{session.sessionStartedAt}</td>
        <td>{session.sessionEndedAt || 'N/A'}</td>
      </tr>
    ));
  };

  return (
    <div className="table">
      <div className="filters">
        <select onChange={(e) => handleSessionTypeChange(Number(e.target.value))}>
          <option value="">Session Type</option>
          <option value={1}>Residence</option>
          <option value={2}>Non-residence CAR</option>
          <option value={3}>Non-residence MOTORCYCLE</option>
        </select>
        <input type="datetime-local" onChange={(e) => handleSessionStartDateChange(e.target.value)} />
        <input type="datetime-local" onChange={(e) => handleSessionEndDateChange(e.target.value)} />
        <select onChange={(e) => handleSessionStatusChange(e.target.value)}>
          <option value="">Session Status</option>
          <option value={true}>Ended</option>
          <option value={false}>Active</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Vehicle Type</th>
            <th>Vehicle License Plate</th>
            <th>Parking Space ID</th>
            {/* <th>ID</th> */}
            <th>Session Status</th>
            <th>Session Length</th>
            <th>Session Started At</th>
            <th>Session Ended At</th>
          </tr>
        </thead>
        <tbody>
          {renderTableRows()}
        </tbody>
      </table>
    </div>
  );
};

export default Sessions;