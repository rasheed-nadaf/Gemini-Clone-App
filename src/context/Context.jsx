import { useState } from "react";
import run from "../config/gemini";

import { createContext } from "react";

export const Context = createContext();

const ContextProvider = (props) => {

    const [input,setInput] = useState("");
    const [recentPrompt,setRecentPrompt] = useState("");
    const [prevPrompts,setPrevPrompts] = useState([]);
    const [showResult,setShowResult] = useState(false);
    const [loading,setLoading] = useState(false);
    const [resultData,setResultData] = useState("");

    const delayPara = (index,nextWord) => {
        setTimeout(function(){
            setResultData(prev => prev+nextWord);
        },75*index);
    }

    const newChat = ()=>{
        setLoading(false)
        setShowResult(false)
    }

    const onSent = async (prompt) => {

        setResultData("");
        setLoading(true);
        setShowResult(true);
        let response;
        if(prompt !==undefined){
            setRecentPrompt(prompt);
            response = await run(prompt);
        } else {
            setPrevPrompts(prev => [...prev,input])//adds the input field to the recent chats
            setRecentPrompt(input)
            response = await run(input)
        }
        const responseText = typeof response === 'string' ? response : JSON.stringify(response);
        let responseArray = responseText.split("**");
        let newResponse = "";
        for(let i=0;i<responseArray.length;i++){
            if(i===0 || i%2 !==1){
                newResponse +=responseArray[i];
            } else {
                newResponse += "<b>" + responseArray[i] + "</b>";
            }
        }
        let newResponse2 = newResponse.split("*").join("</br>")
        let newResponseArray = newResponse2.split(" ");
        for(let i=0;i<newResponseArray.length;i++){
            const newWord = newResponseArray[i];
            delayPara(i,newWord + " ");
        }
        setResultData(newResponse2);
        setLoading(false);
        setInput("");
    }

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        recentPrompt,
        setRecentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat
    }
    
    return (
        <Context.Provider value = {contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider