import {BrowserRouter, Routes, Route} from "react-router-dom"
import Login from "./login";
import Admin from "./admin";
import Classroom from "./classroom";
import Teacher from "./teacher";
import Timetable from "./timetable";
import Student from "./student";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/Principal" element ={<Admin/>}/>
      <Route path="/Teacher" element ={<Teacher/>}/>
      <Route path="/Classroom" element ={<Classroom/>}/>
      <Route path="/Timetable" element ={<Timetable/>}/>
      <Route path="/Student" element ={<Student/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
