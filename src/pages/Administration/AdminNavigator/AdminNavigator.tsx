import {Outlet} from "react-router-dom";
import './AdminNavigator.css';

function AdminNavigator() {
  return (
    <div className="container items-center h-screen w-full max-w-full">
        <Outlet/>
    </div>
  );
}

export default AdminNavigator;
