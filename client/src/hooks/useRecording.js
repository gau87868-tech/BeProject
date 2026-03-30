import { useState, useRef, useEffect } from "react";

export default function useRecording(onResult, onResetAfterComplete) {
  const [state, setState] = useState("idle");
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      clearTimeout(timerRef.current);
    };
  }, []);

  const supportsRecognition = () =>
    "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

  const start = () => {
    if (!supportsRecognition()) {
      alert("Speech recognition not supported. Use Chrome.");
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      console.log(" Started recording");
      setState("recording");

      
      timerRef.current = setTimeout(() => {
        console.log(" Auto-stopping after 10s");
        recognition.stop();
      }, 10000);
    };

    recognition.onresult = (e) => {
      clearTimeout(timerRef.current);
      console.log(" Speech recognized");
      const text = e.results[0][0].transcript;

      setState("processing");
      setTimeout(() => {
        setState("completed");
        onResult?.(text);

        
        setTimeout(() => {
          console.log(" Resetting to idle for next question");
          setState("idle");
          onResetAfterComplete?.(); 
        }, 1500);
      }, 500);
    };

    recognition.onerror = (err) => {
      console.error(" Speech recognition error:", err);
      clearTimeout(timerRef.current);
      setState("idle");
    };

    recognition.onend = () => {
      console.log(" Recording stopped (onend triggered)");
      clearTimeout(timerRef.current);
      setState((prev) => (prev === "recording" ? "completed" : prev));
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stop = () => {
    if (recognitionRef.current) {
      console.log(" Manual stop clicked");
      setState("processing"); 
      recognitionRef.current.stop();
    } else {
      console.log(" No active recognition instance");
    }
  };

  return { state, start, stop, supportsRecognition };
}
