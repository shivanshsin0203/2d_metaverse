import { useLocation } from "react-router-dom";
import CanvasGame from "./Game";


function Space() {
  const location = useLocation();

  // Retrieve query parameters from the URL
  const searchParams = new URLSearchParams(location.search);
  const spaceId = searchParams.get('spaceId');
  return (
    <div className='flex flex-col w-screen h-screen '>
        <div  className=" w-[100%] h-[7%] bg-red-500">
           {`Up Bar ${spaceId}`}
        </div>
        <div className=" h-[88%] w-screen flex  ">
           <div className=" w-[75%] bg-yellow-300">
               <CanvasGame/>
           </div>
           <div className=" w-[25%] bg-purple-500">

           </div>
        </div>
        <div className=" w-screen h-[8%] bg-green-600">
            Down Bar
        </div>
    </div>
  );
}

export default Space;