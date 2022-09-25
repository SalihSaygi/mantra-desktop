/* eslint-disable react-hooks/exhaustive-deps */
import { default as React, useEffect, useRef, useState } from 'react';
import EditorJS, { LogLevels, OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import { nanoid, random } from 'nanoid';
import { useParams } from 'react-router-dom';
import { Checkbox, CheckboxGroup } from '@mantine/core';
import { Category, Editor, Note} from '../utils/storage';
import * as localForage from "localforage";

const blockID = nanoid(6)

function DEFAULT_INITIAL_EDITOR_DATA(id: any) {
  const editorData = {
    blocks: [
      {
        type: 'header',
        data: {
          text: 'My Mantra',
          level: 1,
        },
        id: blockID,
      },
    ],
    id: id,
  };
  return editorData
};

const DEFAULT_INITIAL_NOTE_DATA = (id: any) => {
  return {
    id: id,
    title: 'My Mantra',
    content: '',
    category: '',
  };
};

// const [noteText, setNoteText] = useState('');
// const characterLimit = 200;

// const handleChange = event => {
//   if (characterLimit - event.target.value.length >= 0) {
//     setNoteText(event.target.value);
//   }
// };

// const handleSaveClick = () => {
//   if (noteText.trim().length > 0) {
//     handleAddNote(noteText);
//     setNoteText('');
//   }
// };

function getItem(key: string, stateSetter: React.SetStateAction<any>, defaultValue: any) { 
  return new Promise<void>((res) => {
    localForage.getItem(key).then(value => stateSetter(value).catch((_: any) => {
      stateSetter(defaultValue);
      localForage.setItem(key, defaultValue) 
    }))
    res()
  })

}

const EDITTOR_HOLDER_ID = 'editorjs';

const EditorComponent = () => {
  let { id } = useParams();
  id = String(id);
  const ejInstance = useRef<EditorJS | null>();
  const [editorInstance, setEditorInstance] = useState<EditorJS>()
  const [noteData, setNoteData] = useState<Note[]>();
  const [editorData, setEditorData] = useState<Editor[]>();
  const [viewEditorData, setViewEditorData] = useState<Editor>();
      
  useEffect(() => {
    getItem('editor', setEditorData, [])
  }, [])

  useEffect(() => {
    getItem('notes', setNoteData, [])
  }, [])

  useEffect(() => {
    console.log(noteData, "noteData in Editor");
    if (noteData) {
      console.log(noteData, "noteData in Editor2");

      localForage.setItem('notes', noteData).then(() => {
        console.log('localSetNotes Done', noteData)
      })
    }
  }, [noteData]);
  
  useEffect(() => {
    console.log(editorData, "editorData in Editor");
    if (editorData) {
      console.log(editorData, "editorData in Editor2");
      localForage.setItem("editor", editorData).then(() => {
        console.log('localSetEditor Done', editorData)
        const selectedEditorData = editorData.find(data => {
          if(data.id === id) {
            return data
          }
        })
        setViewEditorData(selectedEditorData)
      })
    }
  }, [editorData]);

  function getNotes() {
        console.log(id, "IDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDd")
        let savedEditorData: Array<Editor>
        localForage.getItem("editor", function(err, editorResult: any) {
          savedEditorData  = editorResult ?? []
        console.log(savedEditorData, 'saved');
        if (savedEditorData && savedEditorData.length > 1) {
          console.log('array');
          const note = savedEditorData.filter(
            savedNote => savedNote.id === String(id)
          );
          console.log(note, 'note', note === undefined);
          if (note.length) {
            console.log('alo1');
            setViewEditorData(note[0])
          } else {
            console.log("I AM A PUSSY")
            let savedNotes: Array<Note>
        localForage.getItem("notes", function(err, notesResult: any) {
              savedNotes = notesResult ?? []
              setNoteData([...savedNotes, DEFAULT_INITIAL_NOTE_DATA(id)]);
              setEditorData([
                ...savedEditorData,
                DEFAULT_INITIAL_EDITOR_DATA(id),
              ]);
            })
          }
          console.log('alo2');
        } else if (savedEditorData && savedEditorData.length === 1) {
          let savedNotes
          console.log(savedEditorData, 'savedEditorData')
          if (savedEditorData[0].id === id) {
            console.log('noteDIR');
            setViewEditorData(savedEditorData[0])
          } else {
            localForage.getItem("notes", function(err, noteResult: any) {
              savedNotes = noteResult ?? []
              console.log('one item', savedNotes, id);
              setEditorData([
                ...savedEditorData,
                DEFAULT_INITIAL_EDITOR_DATA(id),
              ]);
              setNoteData([...savedNotes, DEFAULT_INITIAL_NOTE_DATA(id)]);
          })
          }
        } else if(savedEditorData && savedEditorData.length === 0) {
          console.log('no notes');
          setEditorData([DEFAULT_INITIAL_EDITOR_DATA(id)]);
          setNoteData([DEFAULT_INITIAL_NOTE_DATA(id)]);
          // setCurrentEditorData(DEFAULT_INITIAL_EDITOR_DATA())
          return DEFAULT_INITIAL_EDITOR_DATA(id)
        }
        console.log('alo3');
        
        })
  }

  useEffect(() => {
    console.log("initEditor1")
    if (ejInstance.current === undefined || !ejInstance.current) {
          console.log("initEditor2", ejInstance)
          console.log(id, "IDDDD")
      const note = getNotes();
      console.log(note, 'note')
    }
    return () => {
      console.log(ejInstance.current, "initEditor3");
      ejInstance.current?.destroy();
      ejInstance.current = null;
    };
  }, []);


  useEffect(() => {
    console.log(viewEditorData, 'editorData');
    if(viewEditorData) {
      console.log(editorInstance, 'editorInstance')
      if(!editorInstance) {

        const editor = new EditorJS({
          holder: EDITTOR_HOLDER_ID,
          // logLevel: LogLevels.VERBOSE,
          data: viewEditorData,
          onReady: () => {
            console.log("READYYYYY TO WORK")
            ejInstance.current = editor;
          },
          onChange: async () => {
            console.log('on change')
            let content = await ejInstance.current?.saver.save();
            console.log(content);
            setContent(content);
            updateNotesContent(content);
          },
          autofocus: true,
          tools: {
            header: Header,
          },
        });
        setEditorInstance(editor)
        console.log(editor, "EDITORYOOOOOOOOOOO")
      }
      }
  },[viewEditorData])

  const debounce = (cb: any, space = 3000) => {
    let timeout: ReturnType<typeof setTimeout>;

    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        cb(...args);
      }, space);
    };
  };

  const [content, setContent] = useState<OutputData>();

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let savedCategories: Category[]
      localForage.getItem("categories", function(err, storedEditorData: any) {
        console.log(storedEditorData, "storedEditorData")
        savedCategories = storedEditorData ?? []
        console.log(savedCategories, 'savedCategories');
        if (Array.isArray(savedCategories)) {
          console.log('check');
          setCategories(savedCategories);
        }
    })


  }, []);

  const [categoryButtons, setCategoryButtons] = useState<Array<string>>();

  useEffect(() => {
    console.log(categoryButtons, categories, 'OK??');
    if (categoryButtons && categories) {
      console.log('check?', content);
      updateNotesContent(content);
    }
  }, [categoryButtons]);

  const updateNotesContent = debounce((content: { blocks: any[]; time: any; }) => {
    const header = content.blocks[0].data.text.substring(0, 12);
    console.log(header, 'header');
    console.log(content.blocks.slice(1), 'nice');
    const texts = content.blocks.map(block => {
      if (block.type === 'paragraph') {
        console.log(block.data.text, 'blockDataText');
        return block.data.text;
      } else {
        console.log(block.data.text, 'blockDataText');
        return '';
      }
    });
    const note: Note = {
      id: id!,
      title: header,
      content: texts.join(" "),
      category: categoryButtons ? categoryButtons : '',
    };
    console.log(note, 'note');
    let savedNotes: Note[];
      localForage.getItem("notes", function(err, storedEditorData: any) {
        savedNotes = storedEditorData ?? []
        console.log(savedNotes, 'noteData-savedNotes');

        if (savedNotes) {
          let updatedNotes = savedNotes.map(data => {
            if (data.id == id) {
              return note; //gets everything that was already in item, and updates "done"
            }
            return data; // else return unmodified item
          });
          console.log(updatedNotes, "updatedNotes")
          if (updatedNotes) {
            console.log('1-updatedNotes')
            setNoteData(updatedNotes);
          } else {
                    console.log('2-updatedNotes')
            setNoteData([...savedNotes, note]);
          }
        } else {
                  console.log('3-updatedNotes')
          setNoteData([note]);
        }
            })

    console.log(content, 'content');

    const newEditorData = {
      id: id,
      time: content.time,
      blocks: content.blocks,
    };
    console.log(newEditorData, 'newEditorData');
        let savedEditorData: Array<Editor>
      localForage.getItem("editor", function(err, storedEditorData: any) {
          savedEditorData  = storedEditorData ?? []
          console.log(savedEditorData, 'savedEditorData');

    if (savedEditorData) {
      let updatedEditorData = savedEditorData.map(data => {
        if (data.id !== id) {
          return data; //gets everything that was already in item, and updates "done"
        }
        return newEditorData; // else return unmodified item
      });
      console.log('updatedEditorData', updatedEditorData)
      if (updatedEditorData) {
        console.log('1-updatedEditorData')
        setEditorData(updatedEditorData);
      } else {
                console.log('2-updatedEditorData')

        setEditorData([...savedEditorData, newEditorData]);
      }
    } else {
              console.log('3-updatedEditorData')

      setEditorData([newEditorData]);
    }
        })

  });

  // const initEditor = () => {
  //   getNotes()
  //     .then(editData => {
  //       console.log(editData, 'editorData');
  //       const editor = new EditorJS({
  //         holder: EDITTOR_HOLDER_ID,
  //         logLevel: LogLevels.VERBOSE,
  //         data: currentEditorData ??  editData,
  //         onReady: () => {
  //           console.log("READYYYYY TO WORK")
  //           ejInstance.current = editor;
  //         },
  //         onChange: async () => {
  //           let content = await ejInstance.current.saver.save();
  //           console.log(content);
  //           setContent(content);
  //           updateNotesContent(content);
  //         },
  //         autofocus: true,
  //         tools: {
  //           header: Header,
  //         },
  //       });
  //       console.log(editor, "EDITORYOOOOOOOOOOO")
  //     })
  //     .catch(e => {
  //       console.log(e, 'errAMK COCUGU');
  //     });
  // };

  return (
    <>
      <div id={EDITTOR_HOLDER_ID}></div>
      {categories.length ? (
        <div>
          <CheckboxGroup
            value={categoryButtons}
            onChange={setCategoryButtons}
            label="Select which categories this note should lead."
            required
          >
            {categories.map((category, index) => {
              return (
                <Checkbox
                  key={index}
                  value={category.title}
                  label={category.title}
                />
              );
            })}
          </CheckboxGroup>
        </div>
      ) : (
        <p>
          No Categories. You should first create categories or create categories
          later and then edit this note to choose that category.
        </p>
      )}
    </>
  );
};

export default EditorComponent;
