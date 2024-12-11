import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  useEditor,
  EditorContent,
  BubbleMenu as TipTapBubbleMenu,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { toast } from "react-hot-toast";
import BubbleMenu from "./BubbleMenu";
import "./tiptapStyles.scss"; 

const Editor = () => {
  const [loading, setLoading] = useState(false);
  const [originalText, setOriginalText] = useState("");
  const [wordCount, setWordCount] = useState(0);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
  });

  useEffect(() => {
    if (editor) {
      const updateWordCount = () => {
        const text = editor.getText().trim();
        const count = text ? text.split(/\s+/).length : 0;
        setWordCount(count);
      };

      editor.on("update", updateWordCount);

      return () => {
        editor.off("update", updateWordCount);
      };
    }
  }, [editor]);

  const processText = async (text, action) => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/process-text", {
        text,
        action,
      });
      setLoading(false);
      return response.data.result;
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      return "Error processing text. Please try again.";
    }
  };

  const handleAction = async (action) => {
    if (!editor) return;

    const selection = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to
    );

    if (!selection.trim()) {
      toast.error("Please select valid text to perform the action.");
      return;
    }

    setOriginalText(selection);
    const processedText = await processText(selection, action);
    editor.commands.insertContentAt(
      editor.state.selection,
      processedText || selection
    );

    toast.success(
      action === "shorten"
        ? "The text has been successfully shortened!"
        : "The text has been successfully lengthened!"
    );
  };

  const handleRestoreOriginal = () => {
    if (!editor) return;

    editor.commands.setContent(originalText);

    const text = editor.getText().trim();
    const count = text ? text.split(/\s+/).length : 0;
    setWordCount(count);

    toast.success("The original text has been restored!");
  };

  const clearText = () => {
    if (!editor) return;
    editor.commands.clearContent();
    setWordCount(0); 
    toast.success("Text cleared successfully!");
  };

  const copyAllText = () => {
    if (!editor) return;
    const allText = editor.getText();
    if (allText) {
      navigator.clipboard
        .writeText(allText)
        .then(() => toast.success("Text copied successfully!"))
        .catch((error) => {
          console.error("Error copying text: ", error);
          toast.error("Failed to copy text. Please try again.");
        });
    }
  };

  const selectAllText = () => {
    if (!editor) return;
  
    editor.commands.selectAll();
  
    const editorContent = document.querySelector(".tiptap");
    if (editorContent) {
      const range = document.createRange();
      range.selectNodeContents(editorContent);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
  
      const lastChild = editorContent.lastChild;
      const rangeForCursor = document.createRange();
      rangeForCursor.setStart(lastChild, lastChild.length);
      rangeForCursor.collapse(true);
      selection.removeAllRanges();
      selection.addRange(rangeForCursor);
  
      document.getSelection().focusNode && document.getSelection().getRangeAt(0);
  
      toast.success("All text has been selected!");
    }
  };
  
  
  

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
    
      <div className="absolute inset-0 bg-gradient-to-r from-teal-400 via-blue-400 to-pink-400 opacity-30 blur-3xl"></div>

      {/* Heading*/}
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
        <span className="typing-effect bg-gradient-to-r from-blue-900 to-teal-700 text-transparent bg-clip-text">
          AI-Powered Text Editor
        </span>
      </h1>

      {/* Editor Container */}
      <div className="editor-container relative p-6 bg-gradient-to-r from-teal-500 via-blue-500 to-pink-500 rounded-lg shadow-2xl w-full max-w-3xl mx-auto hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-400 to-blue-400 opacity-50 rounded-lg blur-lg"></div>

        {editor && (
          <TipTapBubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
            <BubbleMenu
              onShorten={() => handleAction("shorten")}
              onLengthen={() => handleAction("lengthen")}
            />
          </TipTapBubbleMenu>
        )}

        {loading && (
          <p className="text-white mt-4 text-center text-lg animate-bounce">
            Processing...
          </p>
        )}

        <div className="relative">
          {!editor?.getText().trim() && (
            <p className="absolute top-6 left-6 text-gray-400 pointer-events-none">
              Select some text to see the AI-powered actions!
            </p>
          )}
          <EditorContent
            editor={editor}
            className="tiptap prose max-w-none bg-white text-black p-6 rounded-lg shadow-md mt-4"
            style={{
              height: "30vh",
              overflowY: "auto"
            }}
          />
        </div>

        <p className="text-white mt-4 text-center text-lg">
          Word Count: <span className="font-bold">{wordCount}</span>
        </p>

        <div className="mt-6 p-2 flex flex-wrap justify-center space-x-4">
          <button
            onClick={handleRestoreOriginal}
            className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-5 py-3 rounded-lg shadow-lg hover:from-gray-700 hover:to-gray-800 hover:shadow-2xl transition-all duration-300 transform hover:scale-110"
          >
            Restore Original Text
          </button>

          <button
            onClick={clearText}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-3 rounded-lg shadow-lg hover:from-red-500 hover:to-red-600 hover:shadow-2xl transition-all duration-300 transform hover:scale-110"
          >
            Clear Text
          </button>

          <button
            onClick={copyAllText}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-3 rounded-lg shadow-lg hover:from-blue-500 hover:to-blue-600 hover:shadow-2xl transition-all duration-300 transform hover:scale-110"
          >
            Copy All Text
          </button>

          <button
            onClick={selectAllText}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-5 py-3 rounded-lg shadow-lg hover:from-green-500 hover:to-green-600 hover:shadow-2xl transition-all duration-300 transform hover:scale-110"
          >
            Select All Text
          </button>
        </div>
      </div>
    </div>
  );
};

export default Editor;
