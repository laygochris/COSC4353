import {BrowserRouter, Routes, Route} from 'react-router-dom';
import EventManagement from './pages/EventManagement';
import Home from './pages/Home';
import Login from './pages/Login';
import Notifications from './pages/Notifications';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import VolunteerHistory from './pages/VolunteerHistory';
import VolunteerMatching from './pages/VolunteerMatching';


const AppRoutes = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/notifications" element={<Notifications/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/userProfile" element={<UserProfile/>}/>
                <Route path="/volunteerHistory" element={<VolunteerHistory/>}/>
                <Route path="/volunteerMatching" element={<VolunteerMatching/>}/>
                <Route path="/eventManagement" element={<EventManagement/>}/>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
