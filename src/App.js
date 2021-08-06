import "./App.css";
import { Container } from "@material-ui/core";
import { Transaction } from "./transaction";

function App() {
  return (
    <Container maxWidth="md">
      <Transaction />
    </Container>
  );
}

export default App;
