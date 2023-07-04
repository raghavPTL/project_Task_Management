require('dotenv').config();
const express = require("express");
const bodyPareser=require("body-parser");
const mongoose=require("mongoose");
const Date=require(__dirname+"/Date.js");
const app = express();
const _ = require("lodash");


app.set('view engine', 'ejs');// use ejs as view engine
app.use(bodyPareser.urlencoded({extended:true}));//to get data from html in dom
app.use(express.static("public"));//some extra file load in server....
mongoose.connect(process.env.mongoUrl).then(()=>{
console.log("connection sucess fully");
}).catch((err)=>console.log("connectio FAILid"));
//mongoose.connect("mongodb://localhost:27017/todoDB");



//let items=["wake up","bath","breakfat","reading news_paper"];//main todo list

const listSchema={
    name:String,
    itemsofsaperateList:[]
}
const List=mongoose.model("List",listSchema);





app.get("/",function(req,res){
    List.find()
    .then((lists) => {
      res.render('home', { lists : lists});
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
    

          

});


app.get('/but', (req, res) => {
   List.find()
    .then((lists) => {
      res.render('home', { lists : lists});
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Internal Server Error');
    });
});


app.get("/posts/:postid",function(req,res){
     
     
      const requestedPostId = req.params.postid;
      List.findOne({_id: requestedPostId}, function(err, postt){
      
         console.log(postt);
         res.render("list", { cur:postt});
      
       });
      

});




app.post("/delete",function(req,res){
   const deletename=req.body.checkbox.trim();
   const idofpage=req.body.pageid;
   
    List.findOneAndUpdate({_id: idofpage}, {$pull: {itemsofsaperateList: {name: deletename}}}, function(err, foundList){
      if (!err){
       console.log("delete sucess fully ");
      const requestedPostId = idofpage;
      console.log(deletename);
      List.findOne({_id: requestedPostId}, function(err, postt){
      
         console.log(postt);
         res.render("list", { cur:postt});
      
       });


      }
    });
   

})

app.post("/delete_sec",function(req,res){
   const deleteid=req.body.checkbox.trim();
   
    List.findOneAndDelete({ _id: deleteid })
  .then((deletedList) => {
    if (deletedList) {
      console.log("Document deleted successfully:", deletedList);
    } else {
      console.log("Document not found.");
    }
  })
  .catch((error) => {
    console.error(error);
  });
  
    res.redirect("/");

    
   

})







app.post("/addnewtask", function (req, res) {
 
    //console.log(req.body);
    const itemName=req.body.newsec.toUpperCase();
   // const listname=req.body.list;
 
   const newList = new List({
  name: itemName,
  itemsofsaperateList: []
});

// Save the new instance to the database
newList.save()
  .then(() => {
    console.log("New list instance created successfully.");
    res.redirect("/");
  })
  .catch((error) => {
    console.error(error);
  });
    

    //iteminmainpage.save();
    //res.redirect("/");
})


app.post("/addnewgoal", function (req, res) {
 
    const listId = req.body.sub;
const newItem = {
 
  name:  capitalizeFirstLetter(req.body.newgoal),
  // Additional properties of the item
};

// Find the document by list ID and push the new element to itemsofsaperateList
List.findOneAndUpdate(
  { _id: listId },
  { $push: { itemsofsaperateList: newItem } },
  { new: true }
)
  .then((updatedList) => {
    if (updatedList) {
      console.log("New element added successfully:", updatedList);
      const requestedPostId = listId;
      List.findOne({_id: requestedPostId}, function(err, postt){
      
         console.log(postt);
         res.render("list", { cur:postt});
      
       });


    } else {
      console.log("List not found.");
    }
  })
  .catch((error) => {
    console.error(error);
  });
    
})


//app.get("/work",function(req,res){
//    res.render("list", {listtitle:"Work_list", newlistitems:workitems});
//})
//
//app.post("/work", function (req, res) {
//
//    let itemofwork=req.body.newitem;
//    workitems.push(itemofwork);
//
//    res.redirect("/work");
//})

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}



let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
//app.listen(port);



app.listen(port,function()
{
    console.log("server start...")
});






































 /*   FIRST COMMENT for add style....
 
 <% if(kindofday!="tuse") {%>
    
    <h1 style="color: red;">today is <%=kindofday%></h1>
    <% } else{ %>
         <h1 style="color:green;">today is <%=kindofday%></h1>
   <% } %> */





   // <li><%= item.name %></li>




/*
   <%for(var i=0;i < list.length ;i++){ %>
         <form action="/delete" method="post"autocomplete="false" >
        <div class="item">
          
            <input type="checkbox" name="checkbox" value="<%=list[i].name %>" onChange="this.form.submit()">
           
            <a href = "/posts/<%=list[i].name %> " ><p> <%= list[i].name %> </p></a>  
         
          
        </div>
        </form>
        <%}%> */