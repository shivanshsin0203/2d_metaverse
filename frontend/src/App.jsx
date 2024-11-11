import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Home';
import Space from './components/Space';
import {KindeProvider} from "@kinde-oss/kinde-auth-react";
const App = () => {
  console.log(import.meta.env.VITE_CLIENT_ID);
  return (
    <KindeProvider
		clientId={import.meta.env.VITE_CLIENT_ID}
		domain={import.meta.env.VITE_DOMAIN}
		redirectUri="http://localhost:5173"
		logoutUri="http://localhost:5173"
	>
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path='/space' element={<Space />} />
       </Routes>
    </Router>
    </KindeProvider>
  );
};

export default App;