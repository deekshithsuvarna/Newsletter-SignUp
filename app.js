const express = require("express");
const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const https = require("https");

const app = express();

app.use(express.static("public")); //specifies static folder for all of the files

//to parse data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {

    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us8.api.mailchimp.com/3.0/lists/ea3e36abb4";

    const options = {
        method: "POST",
        auth: "bunnyboxer470:ad0519582e10531b4a27386e09cd39d3-us8"
    }

    const request =  https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.sendFile( __dirname + "/success.html");
        } else {
            res.sendFile( __dirname + "/failure.html");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })

    // request.write(jsonData);
    request.end();
});

app.post("/failure", function (req,res) {
    res.redirect("/");
})

// API Key
// ad0519582e10531b4a27386e09cd39d3-us8

// List Id
// ea3e36abb4


app.listen(3000, function () {
    console.log('Express app listening on port 3000');
});
