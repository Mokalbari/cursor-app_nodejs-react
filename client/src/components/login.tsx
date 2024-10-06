import { useState } from "react";

type Props = {
  onSubmit: (username: string) => void;
};

export default function Login({ onSubmit }: Props) {
  const [username, setUsername] = useState("");

  return (
    <>
      <h1>Bienvenue !</h1>
      <p>Sélectionner un nom d'utilisateur</p>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(username);
        }}
      >
        <input
          type="text"
          value={username}
          placeholder="username"
          onChange={(event) => setUsername(event.target.value)}
        />
        <input type="submit" />
      </form>
    </>
  );
}
