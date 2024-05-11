import LoginComponent from "./components/login";
import { useState } from "react";
import ManagerComponent from "./components/manager/index";

function App() {
  const [email, setEmail] = useState("danviles92@gmail.com");

  return (
    <section className="">
      {email === "" ? (
        <div className="flex justify-center items-center relative h-screen">
          <LoginComponent setEmail={setEmail} />
        </div>
      ) : (
        <div className="h-screen">
          <ManagerComponent email={email} />
        </div>
      )}
    </section>
  );
}

export default App;
