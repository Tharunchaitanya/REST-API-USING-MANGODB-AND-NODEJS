const express=require("express")
const app=express()
const mongoose=require("mongoose")

const port=3115
app.use(express.json())
let p=mongoose.connect("mongodb://localhost/movie")
 p.then(()=>{console.log("connected to DB...")})
 p.catch(()=>{console.log("error occured...")})
 const genreShema= new mongoose.Schema({
    name:{type:String,required:true,minlength:3}
})
 const Genre=mongoose.model("genres",genreShema)
 
app.get("/api", async (req,res)=>{
    const genre=await Genre.find().sort({name:1})                      
    res.send(genre)
})
app.get("/api/vidly/:genre",async (req,res)=>{
    const genre= await Genre.find({name:req.params.genre})
      if(!genre || genre.length===0){
        return res.status(404).send("genre not found")
    }
    res.send(genre)
})


app.post("/api/vidly",async (req,res)=>{
    if(req.body.name=="" || req.body.name.length<3){
        return res.status(404).send("invalid")
    }

    let genre=new Genre({
        name:req.body.name
    })
    const genr= await genre.save()
    res.send(genr)
   
})
app.put("/api/vidly/:id",async (req,res)=>{
    if(req.body.name=="" || req.body.name.length<3 || typeof(req.body.name)!=="string"  ){
        return res.status(404).send("invalid")
        
    }
    
   try{
       const genre= await Genre.findByIdAndUpdate({_id:req.params.id},{name:req.body.name},{new:true})
       res.send(genre) 
   }
   catch(err){
       res.send("genre not found")
   }
    
    
})
app.delete("/api/vidly/:id",async (req,res)=>{
  
     try{
       const genre= await Genre.findByIdAndRemove({_id:req.params.id})
       res.send(genre) 
   }
   catch(err){
       res.send("genre not found")
   }
    
    
})

app.listen(port,()=>{
    console.log(`server is running on ${port}`)
})
