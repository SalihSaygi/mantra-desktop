import { Typography, Container, Box } from '@material-ui/core';
import { default as React, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EditorComponent from './Editor';
import { Editor, Note } from '../utils/storage';

function EditorMain() {
  console.log('render');


  return (
    <React.Fragment>
      <Container
        style={{ backgroundColor: '#d4ecff', minHeight: '100vh' }}
        maxWidth="xl"
      >
        <Box p={5}>
          <Box
            mt={2}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cccccc',
            }}
          >
            <EditorComponent/>
          </Box>
        </Box>

        <Link to="/notes">Notes</Link>
      </Container>
    </React.Fragment>
  );
}

export default EditorMain;
