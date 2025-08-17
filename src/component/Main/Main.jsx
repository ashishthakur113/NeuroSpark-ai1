import { useContext, useState, useEffect } from 'react';
import './Main.css';
import { FaMicrophone, FaRegCopy, FaGlobe } from "react-icons/fa";
import { LuSend } from "react-icons/lu";
import { Context } from '../../context/Context';
import { SiGooglegemini } from "react-icons/si";
import { marked } from "marked";
import { BsMoonStars, BsSun } from "react-icons/bs";
import DOMPurify from "dompurify";



export default function Main() {
  const { onSent, recentPrompt, result, loading, resultData, setInput, input } = useContext(Context);
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const handleSpeech = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser doesn't support voice");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    let gotResult = false;

    recognition.onresult = (event) => {
      gotResult = true;
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.onerror = (event) => {
      alert(`Voice recognition error: ${event.error}`);
    };

    recognition.onend = () => {
      if (!gotResult) {
        alert("No voice input detected — your browser or mic may be blocking it.");
      }
    };

    recognition.start();
  };



  const formatAIResponse = (text) => {
    if (!text) return "";
    return DOMPurify.sanitize(marked.parse(text));
  };



  return (
    <div className='main'>
      <div className="nav">
        <p className='Ai-name'><FaGlobe className='search-icons' /> <span className='brand-text'>NeuroSpark</span> </p>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button
            onClick={() => setDarkMode(prev => !prev)}
            style={{ padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}
          >
            {darkMode ? (
              <div className='mode'>
                <BsSun size={18} /> <span>Light </span>
              </div>
            ) : (
              <div className='mode'>
                <BsMoonStars size={18} /> <span>Dark </span>
              </div>
            )}
          </button>
        </div>
      </div>

      <div className="main-container">
        {!result ? (
          <>
            <div className="greet">
              <p><span> Hey there!</span></p>
              <p>I’m your smart assistant. <br></br> Ask me anything </p>
            </div>

          </>
        ) : (
          <div className="result">
            {/* User message */}
            <div className="message ">
              <div className="user-message">
                <pre><code>{recentPrompt}</code></pre>
              </div>

            </div>

            {/* AI message */}
            <div className="message ai-message">
              <SiGooglegemini className='ai-icon' size={30} />
              {loading ? (
                <div className='loader'>
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <div className="ai-message-content">
                  <div
                    className="ai-message-text"
                    dangerouslySetInnerHTML={{ __html: formatAIResponse(resultData) }}
                  ></div>
                  <button
                    className={`copy-btn ${copied ? "copied" : ""}`}
                    onClick={() => {
                      navigator.clipboard.writeText(resultData)
                        .then(() => {
                          setCopied(true);
                          setTimeout(() => setCopied(false), 1500);
                        })
                        .catch(() => alert("Failed to copy!"));
                    }}
                  >
                    {copied ? "Copied" : <><FaRegCopy /> Copy</>}
                  </button>

                </div>

              )}
            </div>
          </div>
        )}

        {/* Input box */}
        <div className="main-bottom">
          <div className="search-box">
            <textarea
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && input.trim()) {
                  e.preventDefault();
                  onSent();
                }
              }}
              value={input}
              placeholder="Enter a Prompt Here"
              rows={1}
            />

            <div>
              <FaMicrophone className='search-icons' onClick={handleSpeech} />
              {input ? <LuSend onClick={() => onSent()} className='search-icons' /> : null}
            </div>
          </div>
          <p className='bottom-info'>
            NeuroSpark  may display inaccurate info, including about people, so double-check its responses.
          </p>
        </div>
      </div>
    </div>
  );
}
