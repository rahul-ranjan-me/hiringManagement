# Hiring Management (ReactJS)
A simple tool to manage the hiring process. It comes up with following feature
* Candidate list
* Search of candidate with various filters
* Panel to schedule interview which shoot emails to both interviewer and interviewee
* Update records
* Different panels for different interviews rounds

## Technology stack 
* NodeJS for Server
* MongoDB for database
* React JS for UI

## Setting up server
* Navigate to server folder
* run npm install
* run node srver.js

## Setting up mongodb
* Download mongodb
* navigate to downloaded folder/Server/{version}/bin
* run mongod --dbpath {path where you want to store your db}
* Crete two collections

### Collection name (candidates)

```javascript
{
    "firstName" : "Lorem",
    "lastName" : "Lipsum",
    "skill" : "Javascript, HTML, CSS",
    "position" : "Frontend Developer",
    "email" : "loremlipsum@gmail.com",
    "mobile" : "9711464514",
    "status" : "Selected",
    "screening" : {
        "screening_date" : "2/12/2016",
        "screening_feedback" : "Good in understanding situations"
    },
    "technical" : {
        "technical_date" : "30/12/2015",
        "technical_feedback" : "Very good technically. Well known"
    },
    "management" : {
        "management_date" : "2/12/2016",
        "management_feedback" : "management feedback"
    }
}
```

### Collection name (recruiter)
```javascript
{
    "recruiterName" : "Madhvi"
}
```

## Setting up client
* Navigate to client folder
* run npm install
* run npm dev
* Open browser and hit http://localhost:8081/
