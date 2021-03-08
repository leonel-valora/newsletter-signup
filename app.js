const express = require('express');
const bodyParse = require('body-parser');
const request = require('request');
const https = require('https');
const mailchimp = require('@mailchimp/mailchimp_marketing');
const { response } = require('express');

const app = express();
app.use(express.static("public"));
app.use(bodyParse.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    
    const myApiKey = 'enter your api key'
    const myIdList = 'enter your id list';
    const myServer = 'enter your server id';

    const data = {
        members:[{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                    FNAME:firstName,
                    LNAME:lastName
            }
        }]
    };

    mailchimp.setConfig({
        apiKey: myApiKey,
        server: myServer,
    });

    const run = async () => {
        try {
            const response = await mailchimp.lists.batchListMembers(myIdList, data);
            console.log(response);
            if(response.error_count > 0) {
                res.sendFile(__dirname + '/failure.html');
            } else {
                res.sendFile(__dirname + "/success.html");
            }
        } catch(exception) {
            console.log(exception);
        }
    };

    run();
});

app.post("/failure",  (req, res) => {
    res.redirect("/");
});

app.listen(3000, () => {
    console.log('Server running');
});