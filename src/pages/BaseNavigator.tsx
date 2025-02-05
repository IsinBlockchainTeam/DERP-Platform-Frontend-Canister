import { Outlet } from "react-router";
import Header from "../components/Header/Header";

function BaseNavigator() {
  return (
    <main>
      <Header/>
        <div className="container-fluid items-center h-screen w-full max-w-full">
            <Outlet/>
        </div>
    </main>
  );
}

export default BaseNavigator;
