import { Button, Form, Modal } from "react-bootstrap";
import { useChat } from "../../context/ChatContext";

export const UsernameModal = ({ show }) => {
  const { username, setUName, setIsSettedUsername, socket } = useChat();

  const handleJoinRoom = () => {

    if (username.trim() !== "") {
      socket.emit("join", username);
      setIsSettedUsername(true);
    }
  };

  return (
    <Modal show={show} backdrop="static" keyboard={false} centered>
      <Modal.Header>
        <Modal.Title>Enter Username</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Control
            type="text"
            value={username}
            placeholder="Please Enter Name"
            onChange={(e) => setUName(e.target.value)}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleJoinRoom}>
          Join Room
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
