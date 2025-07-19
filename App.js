import React, { useState, useCallback } from "react";
import { createEditor } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { withYjs } from "@slate-yjs/core";

const WS_ENDPOINT = "ws://localhost:1234";
const DOC_NAME = "my-doc";

export default function App() {
  const [editor] = useState(() => {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(WS_ENDPOINT, DOC_NAME, ydoc);
    const sharedType = ydoc.get("content", Y.XmlFragment);

    const e = withReact(createEditor());
    const yjsEditor = withYjs(e, sharedType);

    provider.on("status", (event) => {
      console.log("Connection status:", event.status);
    });

    return yjsEditor;
  });

  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  return (
    <div style={{ maxWidth: 720, margin: "auto", padding: 20 }}>
      <h1>Collaborative Document Editor</h1>
      <Slate editor={editor} onChange={() => {}}>
        <Editable
          renderLeaf={renderLeaf}
          placeholder="Start typing..."
          spellCheck
          autoFocus
        />
      </Slate>
    </div>
  );
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  return <span {...attributes}>{children}</span>;
};
