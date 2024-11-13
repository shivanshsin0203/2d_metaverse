import { useLocation } from "react-router-dom";
import CanvasGame from "./Game";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";

function Space() {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useKindeAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/');
    }
    
  }, [isAuthenticated, isLoading, navigate,user]);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }
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
               <CanvasGame name={user.given_name+" "+user.family_name} gameId={spaceId}/>
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