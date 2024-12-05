import {
  AppBar,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Container from "@mui/material/Container";
import MessageBubble from "./components/MessageBubble";
import { gql, useMutation, useSubscription } from "@apollo/client";
import { useState } from "react";
import UserInput from "./components/UserInput";

const MESSAGES_SUBSCRIPTION = gql`
  subscription OnMessageSent {
    messageSent {
      id
      content
      sender
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($content: String!, $sender: String!) {
    sendMessage(content: $content, sender: $sender) {
      content
      sender
    }
  }
`;

function App() {
  const [userName, setUserName] = useState("");
  const [logged, setLogged] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageInput, SetMessageInput] = useState("");
  const [sendMessage, { data, loading, error }] = useMutation(SEND_MESSAGE);

  useSubscription(MESSAGES_SUBSCRIPTION, {
    onData: (d) => {
      setMessages([d.data.data.messageSent, ...messages]);
    },
  });

  const handleClick = () => {
    SetMessageInput("");
    sendMessage({ variables: { content: messageInput, sender: userName } });
  };

  return (
    <Container>
      {logged ? (
        <>
          <AppBar position="static">
            <Typography variant="h4" component="div" sx={{ m: 2 }}>
              Chat App - Bienvenido {userName}
            </Typography>
          </AppBar>
          <Stack
            direction="column-reverse"
            sx={{
              padding: 4,
              width: "auto",
              height: "70vh",
              backgroundColor: "#eee",
              overflow: 'auto'
            }}
          >
            {messages.map((m) => (
              <MessageBubble
                key={m.id}
                content={m.content}
                userName={m.sender}
                mine={m.sender === userName}
              />
            ))}
          </Stack>
          <Box component="div" sx={{ p: 2, backgroundColor: "#bbb" }}>
            <TextField
              placeholder="Ingrese su mensaje..."
              variant="outlined"
              size="small"
              sx={{ width: "90%" }}
              value={messageInput}
              onChange={(e) => {
                SetMessageInput(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleClick();
              }}
            />
            <Button
              variant="contained"
              sx={{ marginLeft: 2, paddingY: 1 }}
              onClick={handleClick}
            >
              Enviar
            </Button>
          </Box>
        </>
      ) : (
        <Container
          component={Stack}
          direction="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
        >
          <UserInput setLogged={setLogged} setUserName={setUserName} />
        </Container>
      )}
    </Container>
  );
}

export default App;
