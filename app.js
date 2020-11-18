  // imports
  const express = require("express");
  const request = require("request");
  const bodyParser = require("body-parser");
  const https = require("https");

  // instance of the express
  const app = express();

  app.use(bodyParser.urlencoded({extended: true})); // leveage the body parser
  app.use(express.static("public")); // render static files

  // get request setup
  app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
  });

  // Post request setup
  app.post("/", function(req, res){

    // retrieve data from HTML
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    // Data object for key-value pairs for mailchimp API
    const data = {
      members: [
        {
          email_address: email,
          status: "subscribed",
          merge_fields:{
            FNAME: firstName,
            LNAME: lastName
          }
        }
      ]
    }

    // Send to mailchimp
    const jsonData = JSON.stringify(data);

    // Url to communicate with mailchimp API
    const url = "https://us2.api.mailchimp.com/3.0/lists/a09a1ff57b";

    // Request options
    const options = {
      method: "POST",
      auth: "{username}:{API_KEY}" // Authentication to mailchimp API
    }

    // Make the request
    const request = https.request(url, options, function(response){

      if(response.statusCode === 200){
        res.sendFile(__dirname + "/success.html"); // if sign up is successful
      }else{
        res.sendFile(__dirname + "/failure.html"); // if sign up is unsuccessful
      }

      // log response obj from mailchimp
       response.on("data", function(data){
         console.log(JSON.parse(data));
       })
     })

     // send JSON data to mailchimp 
     request.write(jsonData);
     request.end();

  });

  // Post request for redirecting to signup page
  app.post("/failure", function(req, res){
    res.redirect("/");
  });

  // Listening port to serve the application
  app.listen(process.env.PORT || 3000, function(){
    console.log("Server started on port 3000.");
  });
