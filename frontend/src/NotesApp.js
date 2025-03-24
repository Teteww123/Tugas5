import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NotesApp.css';

function NotesApp() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);  // State untuk catatan yang dipilih

  useEffect(() => {
    // Fetch notes
    axios.get('http://localhost:5000/notes')
      .then(response => {
        setNotes(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the notes!', error);
      });
  }, []);

  const addNote = () => {
    axios.post('http://localhost:5000/notes', { title, content })
      .then(response => {
        setNotes([...notes, { title, content }]);
        setTitle('');
        setContent('');
      })
      .catch(error => {
        console.error('There was an error adding the note!', error);
      });
  };

  const deleteNote = (id) => {
    axios.delete(`http://localhost:5000/notes/${id}`)
      .then(() => {
        setNotes(notes.filter(note => note.id !== id));
      })
      .catch(error => {
        console.error('There was an error deleting the note!', error);
      });
  };

  const updateNote = (id) => {
    axios.put(`http://localhost:5000/notes/${id}`, { title, content })
      .then(response => {
        setNotes(notes.map(note => note.id === id ? { ...note, title, content } : note));
        setTitle('');
        setContent('');
        setSelectedNote(null);  // Reset selected note after update
      })
      .catch(error => {
        console.error('There was an error updating the note!', error);
      });
  };

  const handleEdit = (note) => {
    setSelectedNote(note);  // Set selected note for editing
    setTitle(note.title);  // Pre-fill the form with the note's title
    setContent(note.content);  // Pre-fill the form with the note's content
  };

  return (
    <div className="notes-container">
      <h1>Website Notes</h1>

      <div className="form-container">
        <input 
          type="text" 
          className="title-input"
          placeholder="Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
        />
        <textarea 
          className="content-input"
          placeholder="Content" 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
        />
        {selectedNote ? (
          <button className="update-note-button" onClick={() => updateNote(selectedNote.id)}>Update Note</button>
        ) : (
          <button className="add-note-button" onClick={addNote}>Add Note</button>
        )}
      </div>

      <div className="notes-list">
        {notes.map(note => (
          <div key={note.id} className="note-card">
            <h3 className="note-title">{note.title}</h3>
            <p className="note-content">{note.content}</p>
            <button className="edit-button" onClick={() => handleEdit(note)}>Edit</button>
            <button className="delete-button" onClick={() => deleteNote(note.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotesApp;
