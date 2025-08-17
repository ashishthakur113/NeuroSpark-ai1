import { createContext, useState } from "react";
import run from "../config/gemini";
import { marked } from "marked";
import DOMPurify from "dompurify";

export const Context = createContext();

const ContextProvider = (props) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [result, setResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const delayPara = (index, nextWord) => {
        setTimeout(function () {
            setResultData((prev) => prev + nextWord);
        }, 75 * index);
    };

    const newChat = () => {
        setLoading(false);
        setResult(false);
    };

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setResult(true);

        let response;

        const formatInstruction = `
        Please provide a clear, concise, and well-structured answer.
        If the answer includes code, return it inside proper Markdown code blocks (with language).
        Do not add unnecessary comments or explanations beyond what is needed.`;

        if (prompt !== undefined) {
            const finalPrompt = `${prompt}\n\n${formatInstruction}`;
            response = await run(finalPrompt);
            setRecentPrompt(prompt);
        } else {
            setPrevPrompts((prev) => [...prev, input]);
            setRecentPrompt(input);
            const finalPrompt = `${input}\n\n${formatInstruction}`;
            response = await run(finalPrompt);
        }

        const safeHtml = DOMPurify.sanitize(marked.parse(response));

        const newRespArray = safeHtml.split(" ");

        for (let i = 0; i < newRespArray.length; i++) {
            const nextWord = newRespArray[i];
            delayPara(i, nextWord + " ");
        }

        setLoading(false);
        setInput("");
    };

    const contexValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        result,
        loading,
        resultData,
        input,
        setInput,
        newChat,
    };

    return (
        <Context.Provider value={contexValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
