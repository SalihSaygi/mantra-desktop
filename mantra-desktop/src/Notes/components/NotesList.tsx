import React from 'react';
import Note from './Note';
import { Note as NoteI } from '../../utils/storage';
 
interface Props {
  notes: NoteI[];
}

const NotesList: React.FC<Props> = ({ notes }) => {
  return (
    <div className="notes-list">
      {notes.map((note, i) => (
        <Note
          key={i}
          id={note.id}
          title={note.title}
          content={note.content}
          category={note.category}
        />
      ))}
    </div>
  );
};

export default NotesList;
