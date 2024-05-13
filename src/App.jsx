import LoginComponent from "./components/login";
import { useEffect, useState } from "react";
import ManagerComponent from "./components/manager/index";

function App() {

  const [email, setEmail] = useState(() => {
    const storedValue = localStorage.getItem("email");
    return storedValue !== null ? storedValue : "";
  });

  useEffect(() => {
    if (email !== "") {
      localStorage.setItem("email", email);
    }
  }, [email]);


  return (
    <section className="">
      {email === "" ? (
        <div className="flex justify-center items-center relative h-screen">
          <LoginComponent setEmail={setEmail} />
        </div>
      ) : (
        <div className="h-screen">
          <ManagerComponent email={email} setEmail={setEmail}/>
        </div>
      )}
    </section>
  );
}

export default App;
