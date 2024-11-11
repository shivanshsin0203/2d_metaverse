import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Home';
import Space from './components/Space';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path='/space' element={<Space />} />
       </Routes>
    </Router>
  );
};

export default App;