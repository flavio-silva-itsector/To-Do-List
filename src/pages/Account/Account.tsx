import { useState } from "react";
import { Input } from "./Components";
import useAccount from "./hook";
import { Form, FormsContainer, Wrapper } from "./styled";

export function Account() {
  const { user, setUser, onSubmitLogin, onSubmitSingUp } = useAccount();
  const [beep, setBeep] = useState("");

  console.log(beep);

  return (
    <Wrapper>
      <h2>Account</h2>
      <FormsContainer>
        <Form>
          <h3>Login</h3>

          <Input
            label="Beep"
            title="Beep"
            placeholder="Beep"
            value={beep}
            onChange={(e) => console.log(e)}
          />

          <Input
            label="Username"
            title="Username"
            placeholder="Username"
            value={user.username}
            onChange={(newValue) => setUser({ ...user, username: newValue })}
          />

          <Input
            type="password"
            label="Password"
            title="Password"
            placeholder="Password"
            value={user.password}
            onChange={(newValue) => setUser({ ...user, password: newValue })}
          />

          <button onClick={onSubmitLogin}>Login</button>
        </Form>

        <Form>
          <h3>Sign Up</h3>

          <Input
            label="User Name"
            title="User Name"
            placeholder="Name"
            property="name"
            value={user.name || ""}
            onChange={(newValue) => setUser({ ...user, name: newValue })}
          />

          <Input
            label="Username"
            title="Username"
            placeholder="Username"
            property="username"
            value={user.username}
            onChange={(newValue) => setUser({ ...user, username: newValue })}
          />

          <Input
            type="password"
            label="Password"
            title="Password"
            placeholder="Password"
            property="password"
            value={user.password}
            onChange={(newValue) => setUser({ ...user, password: newValue })}
          />

          <button onClick={onSubmitSingUp}>Create</button>
        </Form>
      </FormsContainer>
    </Wrapper>
  );
}
