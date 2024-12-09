import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Home';
import Space from './components/Space';
import {KindeProvider} from "@kinde-oss/kinde-auth-react";
import MySpace from './components/Myspace';
import { Toaster } from 'react-hot-toast';
const App = () => {
 console.log(import.meta.env.VITE_CLIENT_ID)
 
  return (
    <KindeProvider
		clientId={import.meta.env.VITE_CLIENT_ID}
		domain={import.meta.env.VITE_DOMAIN}
		redirectUri="http://localhost:5173/space"
		logoutUri="http://localhost:5173"
	>
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path='/space' element={<MySpace />} />
        <Route path="/myspace" element={<Space />} />
       </Routes>
    </Router>
    <Toaster position='top-right'/>
    </KindeProvider>
  );
};

export default App;