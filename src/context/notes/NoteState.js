import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState =(props)=>{
    const notesInitial =[
         {
           "_id": "681770a4b1e727e08edaa841",
           "user": "68172a6f62197dd7047004ee",
           "title": "My First Blog",
           "description": "It is about changing weather rapidly",
           "tag": "private",
           "date": "2025-05-04T13:50:28.605Z",
           "__v": 0
         },
         {
           "_id": "681ad36359d5c18b30c4b3b8",
           "user": "68172a6f62197dd7047004ee",
           "title": "My 2nd Blog",
           "description": "It is about changing  lifestyle",
           "tag": "personal",
           "date": "2025-05-07T03:28:35.283Z",
           "__v": 0
         }
       ]

       const [notes, setNotes]= useState(notesInitial);
    
   
    return(
             <NoteContext.Provider value={{notes, setNotes}}>
                {props.children}
             </NoteContext.Provider>
     )
}

export default NoteState; 