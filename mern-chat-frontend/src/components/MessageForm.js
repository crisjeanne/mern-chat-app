import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { AppContext } from "../context/appContext";

import "./MessageForm.css";

function MessageForm() {
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.user);
  const { socket, currentRoom, setMessages, messages, privateMemberMsg } =
    useContext(AppContext);
  const messageEndRef = useRef(null);
  const [editMessage, setEditMessage] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();

    month = month.length > 1 ? month : "0" + month;
    let day = date.getDate().toString();

    day = day.length > 1 ? day : "0" + day;

    return month + "/" + day + "/" + year;
  }

  function scrollToBottom() {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const todayDate = getFormattedDate();

  socket.off("room-messages").on("room-messages", (roomMessages) => {
    setMessages(roomMessages);
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!message) return;
    const today = new Date();
    const minutes =
      today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    const time = today.getHours() + ":" + minutes;
    const roomId = currentRoom;
    if (editMessage !== null) {
      // Edit message
      const editedMsg = { ...messages[editMessage] };
      editedMsg.message = message;
      socket.emit("edit-message-room", roomId, editedMsg);
      setEditMessage(null);
    } else if (deleteMessage !== null) {
      // Delete message
      const deletedMsg = messages[deleteMessage];
      socket.emit("delete-message-room", roomId, deletedMsg);
      setDeleteMessage(null);
    } else {
      // Send new message
      socket.emit("message-room", roomId, message, user, time, todayDate);
    }
    setMessage("");
  }

  return (
    <Container
      style={{
        boxSizing: "border-box",
        margin: "0",
        padding: "12px",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
        borderRadius: "1em",
        overflow: "inset",
      }}
    >
      <div className="messages-output">
        {user && !privateMemberMsg?._id && (
          <div
            className="alert alert-info"
            style={{
              border: "none",
              backgroundColor: "white",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
            }}
          >
            You are in the {currentRoom} room
          </div>
        )}
        {user && privateMemberMsg?._id && (
          <>
            <div className="alert alert-info conversation-info">
              <div>
                Your conversation with {privateMemberMsg.name}{" "}
                <img
                  src={privateMemberMsg.picture}
                  className="conversation-profile-pic"
                />
              </div>
            </div>
          </>
        )}
        {!user && <div className="alert alert-danger">Please login</div>}

        {user &&
          messages.map(({ _id: date, messagesByDate }, idx) => (
            <div key={idx}>
              <p
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "rgba(0, 0, 0, 0.493)",
                }}
                className="alert alert-info text-center message-date-indicator"
              >
                {date}
              </p>
              {messagesByDate?.map(
                ({ content, time, from: sender }, msgIdx) => (
                  <div
                    className={
                      sender?.email == user?.email
                        ? "message"
                        : "incoming-message"
                    }
                    key={msgIdx}
                  >
                    <div className="message-inner">
                      <div className="d-flex align-items-center mb-1">
                        <img
                          src={sender.picture}
                          style={{
                            width: 35,
                            height: 35,
                            objectFit: "cover",
                            borderRadius: "50%",
                            marginRight: 10,
                          }}
                        />
                        <p className="message-sender">
                          {sender._id == user?._id ? "You" : sender.username}
                        </p>
                      </div>
                      <p className="message-content">{content}</p>
                      <p className="message-timestamp-left">{time}</p>
                      {sender._id == user?._id && (
                      <>
                        <Button
                          variant="primary"
                          type="submit"
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                            color: "rgba(0,0,0,0.5)",
                            padding: "0 1em",
                          }}
                          onClick={() => setEditMessage(idx)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="primary"
                          type="submit"
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                            color: "rgba(0,0,0,0.5)",
                            padding: "0 1em",
                          }}
                          onClick={() => setDeleteMessage(idx)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                    </div>
                  </div>
                )
              )}
            </div>
          ))}
        <div ref={messageEndRef} />
      </div>
      <Form style={{ padding: "0" }} onSubmit={handleSubmit}>
        <Row>
          <Col style={{ margin: "0", paddingRight: "0" }} md={11}>
            <Form.Group className="form">
              <Form.Control
                type="text"
                placeholder="Write your message here..."
                disabled={!user}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col style={{ margin: "0", paddingLeft: "0" }} md={1}>
            <Button
              variant="primary"
              type="submit"
              style={{
                width: "100%",
                backgroundColor: "#B70106",
                border: "1px solid #B70106",
              }}
              disabled={!user}
            >
              <i className="fas fa-paper-plane"></i>
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default MessageForm;
