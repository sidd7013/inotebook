const express =require('express');
const router =express.Router();
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const Note = require('../models/Note');

//ROUTE 1  : Get All the Notes using : GET "/api/notes/fetchallnotes". Login required.
router.get('/fetchallnotes', fetchuser ,async (req,res)=>{
     try {
          const notes = await Note.find({user: req.user.id});
          res.json(notes);
     
     } catch (error) {
          console.error(error.message);
          res.status(500).send("Internal error occured");

     }
   
})

//ROUTE 2  : Add a new Note using : POST "/api/notes/addnode". Login required.
router.post('/addnote', fetchuser ,[
        body('title', 'Enter a valid title').isLength({ min: 3 }),
        body('description', 'password must be at least 5 characters').isLength({ min: 5 }),
]    ,async (req,res)=>{
      //If there are errors, return bad request and the errors
             const errors = validationResult(req);
             if (!errors.isEmpty()) {
                     return res.status(400).json({ errors: errors.array() });
             }

             const {title,description,tag,}=req.body


             try {
               const note = new Note({
                    title,description,tag,user: req.user.id
               })
               const saveNote = await note.save();
               res.json(saveNote)
               
             } catch (error) {
               console.error(error.message);
               res.status(500).send("Internal error occured");
             }
   

})

//ROUTE 3  : Updte an existing Note using : PUT "/api/notes/updatenote". Login required.
//konse note ko update kar rahe ho uski id apko deni padegi
//you cannot update others note and others can't update your note
//yani wahi log notes update kar pye jo logggedin hain and apne hi notes update kar paye.
//aap update toh kar sakte ho lekin tab jab aap wahi user ho jiska ye note hain


router.put('/updatenote/:id', fetchuser ,async (req,res)=>{
  const {title,description,tag} = req.body;
  try {
  //Create a newNote object
  const newNote = {};
  //jo cheeeje update karni hain wahi newNote yani updated note main dalo.
  if(title){newNote.title=title};
  if(description){newNote.description=description};
  if(tag){newNote.tag=tag};

  //Find the note to be updated and update it.
  let note = await Note.findById(req.params.id); //req.params.id -yani jo aap update karna chahte hain uss note ki id
  //if note is not available in db
  if(!note){
     return res.status(404).send("Not Found");
  }
  //also check iss note ka user wahi hain ya nahi
  //note.user.toString()-iss note ki id dega.
  //note.user.toString() !== req.user.id -not match means jo banda loggedin hain woh kisi aur ka notes update karna chahta hain.
  if(note.user.toString() !== req.user.id){
     return res.status(401).send("Not Allowed");
  }

  note = await Note.findByIdAndUpdate(req.params.id, {$set:newNote}, {new:true})
  res.json({note});
  //new:true ka matlab agar koi naya contact ata hain toh woh create ho jayega
  }
  catch (error) {
     console.error(error.message);
     res.status(500).send("Internal error occured");
  }
})

//ROUTE 4  : Delete an existing Note using : DELETE "/api/notes/deletenote". Login required.
//konse note ko delete kar rahe ho uski id apko deni padegi
//you cannot delete others note and others can't delete your note
//yani wahi log notes delete kar pye jo logggedin hain and apne hi notes delete kar paye.
//aap delete toh kar sakte ho lekin tab jab aap wahi user ho jiska ye note hain.


router.delete('/deletenote/:id', fetchuser ,async (req,res)=>{
     try {
     //Find the note to be deleted and delete it.
     let note = await Note.findById(req.params.id); //req.params.id -yani jo aap delete karna chahte hain uss note ki id
     //if note is not available in db
     if(!note){
        return res.status(404).send("Not Found");
     }
     //also check iss note ka user wahi hain ya nahi
     //note.user.toString()-iss note ki id dega.
     //note.user.toString() !== req.user.id -not match means jo banda loggedin hain woh kisi aur ka notes delete karna chahta hain.
     //Allow deletion only if user owns this note
     if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
     }
   
     note = await Note.findByIdAndDelete(req.params.id)
     res.json({"Success":"Note has been deleted", note:note});
     //new:true ka matlab agar koi naya contact ata hain toh woh create ho jayega
  }
     catch (error) {
          console.error(error.message);
          res.status(500).send("Internal error occured");
     }
   })
   
module.exports = router