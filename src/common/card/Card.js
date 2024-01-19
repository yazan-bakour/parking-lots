import './Card.css';

// export const Modal = (value) => {
//   const updatePlateNumber = () => {
//     //Add context action to store the value
//   }
//   return (
//     <div>
//       <p>Insert the plate number</p>
//       <input type="text" value={value} onChange={updatePlateNumber} />
//     </div>
//   )
// }
    
const Card = (name, capacity) => {
  return (
    <div className="">
      <div>
       <p>{name}</p>
       <p>{capacity}/{}</p>
      </div>
      <div><button>Start session</button></div>
    </div>
  );
};
export default Card;