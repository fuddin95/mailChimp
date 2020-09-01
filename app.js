/*
the signup page was copied from bootstrap
inorder for css to work--add bootstrap CDN in core css line
move the css and image file to public folder
load up the signup html page as get request
as part of post request first use
    1-body parser to retrive the data
    2- then covert the data into java object
    3- convert it into JSON data
    4-
*/

const express = require("express");
const bodyParser = require("body-parser");
//const request = require("request");
const https = require("https");// requesting https module
const { response } = require("express");


const app = express();
app.use(bodyParser.urlencoded({extended:true}));

//setting express to public will help run html load javascript and css and images
app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
   // res.send("Server is up and running");
});

app.post("/",function(req,res){
// storing all the user data values 
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.inputEmail;
//**********converting  the data into Java Object */
//the data structure was determined by the mailchimp dev docs
    const data = {
        members: [
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME: lastName,
                }
            }
        ]
    };
//Coverting the java data into JSON object
const jsonData = JSON.stringify(data);

//setting url list ID goes at the end
const url="https://us17.api.mailchimp.com/3.0/lists/b35ea9535e";
const options ={
    method: "POST",
    auth:"fahad:1defeff053da74611cd00d5396bab499-us17"
}
//adding the members to list
const requestMailChimp = https.request(url,options,function(response){
//will direct the success page and failure page respectively
    if (response.statusCode===200){
        res.sendFile(__dirname+"/success.html");
    }
    else{
        res.sendFile(__dirname+"/failure.html");
    }

   //if you want to access the data u need to use response.on
    response.on("data",function(data){
        console.log(JSON.parse(data));
    })
})
//I think this is writing the data on hyper terminal
requestMailChimp.write(jsonData);
requestMailChimp.end();
})

app.post("/failure",function(req,res){
    //as soon as the button is clicked the page is sent back to home page
    res.redirect("/");
})
//setting up dynamic port setup with heroku
app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000.");
})


//API key
//1defeff053da74611cd00d5396bab499-us17

//List ID
//b35ea9535e