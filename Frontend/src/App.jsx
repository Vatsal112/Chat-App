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
  const { isSettedUsername, socket, username,onlineUsers,setContextOnlineUsers,setUName,setIsSettedUsername } = useChat();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState("");

  useEffect(() => {
    socket.on("chat-history", (chatHistory) => {
      setMessages(chatHistory);
    });

    socket.on("online-users", (users) => {
      const sortedUsers = users.filter((u) => u !== username);
      setContextOnlineUsers([username, ...sortedUsers]);
    });

    socket.on("message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("display-typing", (message) => {
      setIsTyping(message);
    });
  
    socket.on("remove-typing", () => {
      setIsTyping("");
    });

    socket.on("username-taken", (message) => {
      alert(message); // Alert the user that the username is taken
      setIsSettedUsername(false)
      setUName(""); // Reset username in case user needs to re-enter
    });

    return () => {
      socket.off("chat-history");
      socket.off("online-users");
      socket.off("message");
      socket.off("user-joined");
      socket.off("user-left");
      socket.off("display-typing");
      socket.off("remove-typing");
      socket.off("username-taken");
    };
  }, [socket]);

  const handleTyping = () => {
    socket.emit("typing", username);
  };
  
  const handleStopTyping = () => {
    setTimeout(()=>{
      socket.emit("stop-typing");
    },2000)
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes; 
    const day = date.getDate();
    const month = date.getMonth() + 1; 
    const year = date.getFullYear();

    return `${formattedHours}:${formattedMinutes} ${ampm}, ${month}/${day}/${year}`;
  };

  if (!isSettedUsername) {
    return <UsernameModal show={true} />;
  }

  const handleMessageSend = () => {
    if (message.trim() !== "") {
      const timestamp = new Date();
      socket.emit('send-message', { username, message, timestamp });

      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      handleMessageSend();
    }
  };

  return (
    <Container fluid className="p-3 vh-100">
      <Row className="h-100">
        <Col md={3} className="border-end">
          <h5 className="text-center">Online Users</h5>
          <ListGroup variant="flush" className="mt-5 overflow-auto">
            {onlineUsers.map((u, index) => (
              <ListGroup.Item key={index}
              className={u === username ? "text-primary" : ""}
              >{u === username ? `${u} (You)` : u}</ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={9} className="d-flex flex-column">
          <h2 className="text-center text-primary">Chat App</h2>
          <Card className="mb-3 flex-grow-1">
            <Card.Body style={{ maxHeight: "80vh" }} className="overflow-auto">
              {messages.map((msg, index) => (
                 <p key={index}>
                 <strong>{msg.username}: </strong>{msg.message}
                 <span style={{ fontSize: '0.8rem', color: 'gray' }}>
                   {' '} - {formatTimestamp(msg.timestamp)}
                 </span>
               </p>
              ))}
            </Card.Body>
          </Card>

          {/* Typing Notification */}
        {isTyping && <p style={{ fontStyle: 'italic', color: 'gray' }}>{isTyping}</p>}

          <Form>
            <Row>
              <Col>
                <Form.Control
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a Message...!"
                  onKeyPress={handleKeyPress}
                onKeyDown={handleTyping}
                onKeyUp={handleStopTyping}
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
