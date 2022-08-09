const express = require("express");
const bodyPareser=require("body-parser");
const mongoose=require("mongoose");
const Date=require(__dirname+"/Date.js");
const app = express();
const _ = require("lodash");


app.set('view engine', 'ejs');// use ejs as view engine
app.use(bodyPareser.urlencoded({extended:true}));//to get data from html in dom
app.use(express.static("public"));//some extra file load in server....
//const DB=mongodb+srv://RaghavPatel:ragh123@cluster0.n1yemjk.mongodb.net/todoDB?retryWrites=true&w=majority
mongoose.connect("mongodb+srv://RaghavPatel:ragh123@cluster0.n1yemjk.mongodb.net/todoDB").then(()=>{
console.log("connection sucess fully");
}).catch((err)=>console.log("connectio FAILid"));
//mongoose.connect("mongodb://localhost:27017/todoDB");



//let items=["wake up","bath","breakfat","reading news_paper"];//main todo list
let workitems=[];
const itemSchema={
    name:String
}
const Item=mongoose.model("Item",itemSchema);

const item1=new Item({
    name:"welcome to todolist"
})
const item2=new Item({
    name:"Enter + button to add new list-item"
})
const item3=new Item({
    name:"click check-box to delete your  item form list"
})
const defaultitems=[item1,item2,item3];
const listSchema={
    name:String,
    itemsofsaperateList:[itemSchema]
}
const List=mongoose.model("List",listSchema);




//home route   start journey from here...
app.get("/",function(req,res){
        let day=Date.getDay();           //also  use Date.geteDate()
         
        Item.find({},function(err,founditems){
             //console.log(founditems);
             if(founditems.length==0)
             {
                Item.insertMany(defaultitems,function(err){
                        if(err){
                                 console.log(err);
                                }
                        else{
                            console.log("default items push sucessfully");
                            }
                 })
                //res.redirect("/");
                res.render("list", {listtitle: "Today", newlistitems:founditems});
             }
             else{
                  res.render("list", {listtitle: "Today", newlistitems:founditems});
             }
    
        })

});
 
app.get("/:coustomListName",function(req,res){
    const coustomlistname=_.capitalize(req.params.coustomListName);



    List.findOne({name:coustomlistname},function(err,foundlist){
        if(!err){//
            if(foundlist){
                console.log("Exist");
                res.render("list", {listtitle:foundlist.name , newlistitems:foundlist.itemsofsaperateList});
               
            }
            else{
                 console.log("Not Exist");
                 const newpage=new List({
                         name:coustomlistname,
                         itemsofsaperateList:defaultitems
                    })
                  newpage.save();
                  res.redirect("/"+coustomlistname);
                  

            }
        }
    })
  
})








app.post("/", function (req, res) {
 
    //console.log(req.body);
    const itemName=req.body.newitem;
    const listname=req.body.list;
    const iteminmainpage=new Item({
        name:itemName
    })
    if(listname=="Today")
    {
         iteminmainpage.save();
         res.redirect("/");
    }
    else{
           List.findOne({name:listname},function(err,foundlist){
            foundlist.itemsofsaperateList.push(iteminmainpage);
            foundlist.save();
            res.redirect("/"+foundlist.name);
           })
    }

    //iteminmainpage.save();
    //res.redirect("/");
})

app.post("/delete",function(req,res){
   const deleteid=req.body.checkbox.trim();
   const nameofpage=req.body.ListName;
   if(nameofpage=="Today"){
           Item.findByIdAndRemove(deleteid,function(err){
                if(err){
                   console.log(err);
                }
                else{
                   console.log("delete sucessfully")
                    res.redirect("/");
                }
           })
   }
   else {
    List.findOneAndUpdate({name: nameofpage}, {$pull: {itemsofsaperateList: {_id: deleteid}}}, function(err, foundList){
      if (!err){
        res.redirect("/" + nameofpage);
      }
    });
  }


    
   

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








app.listen(3000,function()
{
    console.log("server start...")
});






































 /*   FIRST COMMENT for add style....
 
 <% if(kindofday!="tuse") {%>
    
    <h1 style="color: red;">today is <%=kindofday%></h1>
    <% } else{ %>
         <h1 style="color:green;">today is <%=kindofday%></h1>
   <% } %> */