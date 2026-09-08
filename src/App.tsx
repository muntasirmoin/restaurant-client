import { Outlet } from "react-router-dom";
import { TopBar } from "./components/layout/TopBar";

function App() {
  return (
    <div className="w-full mx-auto min-h-svh bg-background">
      <TopBar /> <Outlet />
    </div>
  );
}
export default App;
