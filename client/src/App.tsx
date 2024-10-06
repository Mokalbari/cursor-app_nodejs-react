import { useState } from "react";
import Login from "./components/login";
import Home from "./home";

function App() {
  const [username, setUsername] = useState("");

  return username ? (
    <Home username={username} />
  ) : (
    <Login onSubmit={setUsername} />
  );
  // return <Login onSubmit={setUsername} />;
}

export default App;
