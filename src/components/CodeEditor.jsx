import React, { useEffect, useRef} from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/fold/foldgutter.css';
import ACTIONS from '../Actions';
import './CodeEditor.css';

const CodeEditor = ({ socketRef, roomId, onCodeChange }) => {
    const editorRef = useRef(null);
    useEffect(() => {
        async function init() {
            const editor = Codemirror.fromTextArea(
                document.getElementById('realtimeEditor'),
                {
                    mode: { name: 'javascript', json: true },
                    theme: 'dracula',
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true,
                    lineWrapping: true,
                    foldGutter: true,
                    matchBrackets: true,
                   
                }
            );
            editorRef.current = editor;

            editor.setSize(null, '100%');

            editorRef.current.on('change', (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                onCodeChange(code);
                if (origin !== 'setValue') {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code,
                    });
                }
            });
        }
        init();
    }, [socketRef, roomId, onCodeChange]);

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null) {
                    editorRef.current.setValue(code);
                }
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.off(ACTIONS.CODE_CHANGE);
            }
        };
    }, [socketRef.current]);

    return (
        <div className="editor-container">
            <textarea id="realtimeEditor"></textarea>
        </div>
    );
};

export default CodeEditor;