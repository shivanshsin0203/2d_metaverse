export default function Loading() {
  return (
    <div className=" w-screen h-screen bg-[#464B6B] flex-col flex justify-center items-center">
      <div className=" animate-spin">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3054/3054881.png"
          alt="Gather Logo"
          className="w-9 h-9"
        />
      </div>
      <p className=" text-gray-300 text-2xl font-bold">Loading...</p>
    </div>
  );
}
