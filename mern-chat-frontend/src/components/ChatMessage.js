import React, { useState } from 'react';
import axios from 'axios';

const ChatMessage = ({ message }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editMessage, setEditMessage] = useState(message.message);

  const handleEdit = async () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    await axios.put(`/messages/${message._id}`, { message: editMessage });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    await axios.delete(`/messages/${message._id}`);
  };

  return (
    <div>
      {isEditing ? (
        <input value={editMessage} onChange={(e) => setEditMessage(e.target.value)} />
      ) : (
        <div>{message.message}</div>
      )}
      <button onClick={handleEdit}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
      {isEditing && <button onClick={handleSave}>Save</button>}
    </div>
  );
};

export default ChatMessage;
