import GatherLikeGame from "./components/Game";

function App() {
  return (
    <div className='flex flex-col w-screen h-screen '>
        <div  className=" w-[100%] h-[7%] bg-red-500">
           Up Bar
        </div>
        <div className=" h-[88%] w-screen flex  ">
           <div className=" w-[75%] bg-yellow-300">
               <GatherLikeGame/>
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

export default App;
