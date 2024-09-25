import "./App.css";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  ListGroup,
  Row,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { UsernameModal } from "./components/UsernameModal/UsernameModal";
import { useChat } from "./context/ChatContext";

function App() {
  const { isSettedUsername, socket, username } = useChat();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socket.on("chat-history", (chatHistory) => {
      setMessages(chatHistory);
    });

    socket.on("online-users", (users) => {
      setOnlineUsers(users);
    });

    socket.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // return () => {
    //   socket.disconnect();
    // };
  }, [socket]);

  if (!isSettedUsername) {
    return <UsernameModal show={true} />;
  }

  const handleMessageSend = () => {
    if (message.trim() !== "") {
      socket.emit("send-message", { username, message });
      setMessage("");
    }
  };

  return (
    <Container fluid className="p-3 vh-100">
      <Row className="h-100">
        <Col md={3} className="border-end">
          <h5 className="text-center">Online Users</h5>
          <ListGroup variant="flush" className="mt-5 overflow-auto">
            {onlineUsers.map((u, index) => (
              <ListGroup.Item key={index}>{u}</ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={9} className="d-flex flex-column">
          <h2 className="text-center text-primary">Chat App</h2>
          <Card className="mb-3 flex-grow-1">
            <Card.Body style={{ maxHeight: "70vh" }} className="overflow-auto">
              {messages.map((msg, index) => (
                <div key={index} className="mt-3">
                  <strong>{msg.username}: </strong>
                  <span>{msg.message}</span>
                </div>
              ))}
            </Card.Body>
          </Card>

          <Form>
            <Row>
              <Col>
                <Form.Control
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a Message...!"
                />
              </Col>
              <Col xs="auto">
                <Button
                  variant="primary"
                  type="button"
                  onClick={handleMessageSend}
                >
                  Send
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
