import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';

const CodeEditor = () => {
  const editorRef = useRef(null); // Ref to store the CodeMirror instance

  useEffect(() => {
    // Initialize CodeMirror
    const editor = Codemirror.fromTextArea(
      document.getElementById('realtimeEditor'),
      {
        mode: { name: 'javascript', json: true },
        theme: 'dracula',
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
      }
    );

    // Store the CodeMirror instance in the ref
    editorRef.current = editor;

    // Set the height of the editor
    editor.setSize(null, '100%');

    // Cleanup function to destroy the CodeMirror instance
    return () => {
      if (editorRef.current) {
        editorRef.current.toTextArea(); // Revert the textarea back to its original state
        editorRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs only once

  return <textarea id="realtimeEditor" />;
};

export default CodeEditor;