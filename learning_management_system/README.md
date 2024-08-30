# learning_management_system

Project focus on creating and evaluating testing by and admin and users. Admin will able to create tests for user  with different topic with different difficulty levels.
## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
- 
## Installation
Follow these steps to install and set up the project on your local machine.

Prerequisites
Before you begin, ensure you have the following installed on your system:

Node.js: Download and install Node.js (https://nodejs.org/en)
npm: npm is installed automatically with Node.js.
MongoDB: Install MongoDB (https://www.mongodb.com/docs/manual/installation/) (either locally or using a cloud service like MongoDB Atlas)

Steps to Install
# git clone https://github.com/your-username/your-repo-name.git
Install Dependencies
# npm install
Set Up Environment Variables
LOGGING = true
LOG_FOLDER = 'logs'
MONGO_DB = 'question_management'
MONGO_HOST = 'localhost'
PASSWORD_ENCRYPT_KEY = 'K2K3K5K2'
JWT_SECRET_KEY = '34B3VH4VH3J3B'
TEST_EXPIRE_TIME_IN_HOURS = 4
TEST_START_TIME_IN_HOURS = 8

## Usage
# Running the Project
nodemon index.js

## Features
1. User Authentication using JWT token.
2. User able to login, register and logout.
3. Admin also able to login , register and logout.
4. Admin can create questions with difficulty level, get single question and all question, remove also.
5. User will able to generate test link, able to give answers of questions.


## API Endpoints
# Login and Register Endpoints
1. GET http://localhost:3000/sign-up
   curl --location 'http://localhost:3002/sign-up' \
   --header 'Content-Type: application/json' 
   --data-raw '{
   "name":"Nitesh Mangla",
   "email":"nitesh.mangla@myparkplus.com",
   "contact_no": 8860315256,
   "status": 1,
   "role_name" :"user",
   "password": "Nitesh@8860"
   }'
2. POST http://localhost:3000/auth/login
   curl --location 'http://localhost:3002/auth/login' \
   --header 'Content-Type: application/json' \
   --data-raw '{
   "email": "kanishk128.kumar@gmail.com",
   "password" :"1234@qwsedf"
   }'

# Admin User Endpoints
1. POST http://localhost:3000/admin/questions (create questions)
curl --location 'http://localhost:3002/admin/questions' \
   --header 'authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDA1Y2VmNjY0ZTEzNWYyZmNhM2M2ZiIsIm5hbWUiOiJLdXNoYWwgS3VtYXIiLCJlbWFpbCI6ImthbmlzaGsxMjgua3VtYXJAZ21haWwuY29tIiwiY29udGFjdF9ubyI6OTk4ODc3NjU1OCwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzI0OTMxNTEyLCJleHAiOjE3Mjc1MjM1MTJ9.vFd4hVm3lA9vo4TVqhAZRQZ-vvScplVZKEDLTcGd_AM' \
   --header 'Content-Type: application/json' \
   --data '{
   "title": "What is the full range of UHF SYROTECH reader?",
   "topic" :"Reader",
   "description": " What is the color of server LED?",
   "difficulty_level": 5,
   "correct_answer": 1,
   "option1": "12V 3A dc",
   "option2": "12V 2A DC",
   "option3": "10V 3ADC",
   "option4": "12V 1A DC"

}'
2. GET http://localhost:3002/admin/questions (get all question)
 curl --location 'http://localhost:3002/admin/questions' \
   --header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDA1Y2VmNjY0ZTEzNWYyZmNhM2M2ZiIsIm5hbWUiOiJLdXNoYWwgS3VtYXIiLCJlbWFpbCI6ImthbmlzaGsxMjgua3VtYXJAZ21haWwuY29tIiwiY29udGFjdF9ubyI6OTk4ODc3NjU1OCwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzI0OTMxNTEyLCJleHAiOjE3Mjc1MjM1MTJ9.vFd4hVm3lA9vo4TVqhAZRQZ-vvScplVZKEDLTcGd_AM' \
   --header 'Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDA1Y2VmNjY0ZTEzNWYyZmNhM2M2ZiIsIm5hbWUiOiJLdXNoYWwgS3VtYXIiLCJlbWFpbCI6ImthbmlzaGsxMjgua3VtYXJAZ21haWwuY29tIiwiY29udGFjdF9ubyI6OTk4ODc3NjU1OCwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzI1MDEzOTQxLCJleHAiOjE3Mjc2MDU5NDF9.joO1nbbRp3IkC0Q-qDyrtQBPahkG6nknGnXCmLIIJ94'
3. GET http://localhost:3002/admin/questions/:id (question by id)
   curl --location 'http://localhost:3002/admin/questions/66d0645130dab08b59c9503b' \
   --header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDA1Y2VmNjY0ZTEzNWYyZmNhM2M2ZiIsIm5hbWUiOiJLdXNoYWwgS3VtYXIiLCJlbWFpbCI6ImthbmlzaGsxMjgua3VtYXJAZ21haWwuY29tIiwiY29udGFjdF9ubyI6OTk4ODc3NjU1OCwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzI0OTMxNTEyLCJleHAiOjE3Mjc1MjM1MTJ9.vFd4hVm3lA9vo4TVqhAZRQZ-vvScplVZKEDLTcGd_AM' \

4. GET http://localhost:3002/admin/tests/:test_id (test result)
   curl --location 'http://localhost:3002/admin/tests/66d16649fda78c3c2c3b8ccf/questions/66d06d5e97543aa125217e29/answer' \
   --header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDE2MjdkMWZjNDJmZDBlZjgyYmYyMyIsIm5hbWUiOiJOaXRlc2ggTWFuZ2xhIiwiZW1haWwiOiJuaXRlc2gubWFuZ2xhQG15cGFya3BsdXMuY29tIiwiY29udGFjdF9ubyI6ODg2MDMxNTI1Niwicm9sZSI6InVzZXIiLCJpYXQiOjE3MjQ5OTgyODksImV4cCI6MTcyNzU5MDI4OX0.TQ5olYhtccTxTSMOvnIkel-SG47kN2K7cQbp1FbqBGg' \
   --header 'Content-Type: application/json' \
   --data '{
   "answer_id": 1
   }'
5. DELETE http://localhost:3002/questions/:id (soft delete)
   curl --location --request DELETE 'http://localhost:3002/admin/questions/66d06d5e97543aa125217e29' \
   --header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDA1Y2VmNjY0ZTEzNWYyZmNhM2M2ZiIsIm5hbWUiOiJLdXNoYWwgS3VtYXIiLCJlbWFpbCI6ImthbmlzaGsxMjgua3VtYXJAZ21haWwuY29tIiwiY29udGFjdF9ubyI6OTk4ODc3NjU1OCwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzI0OTMxNTEyLCJleHAiOjE3Mjc1MjM1MTJ9.vFd4hVm3lA9vo4TVqhAZRQZ-vvScplVZKEDLTcGd_AM' \


# End User Endpoints
1. POST http://localhost:3002/auth/register (to generate unique url for test)
   curl --location --request POST 'http://localhost:3002/auth/register' \
   --header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDE2MjdkMWZjNDJmZDBlZjgyYmYyMyIsIm5hbWUiOiJOaXRlc2ggTWFuZ2xhIiwiZW1haWwiOiJuaXRlc2gubWFuZ2xhQG15cGFya3BsdXMuY29tIiwiY29udGFjdF9ubyI6ODg2MDMxNTI1Niwicm9sZSI6InVzZXIiLCJpYXQiOjE3MjQ5OTgyODksImV4cCI6MTcyNzU5MDI4OX0.TQ5olYhtccTxTSMOvnIkel-SG47kN2K7cQbp1FbqBGg' \
   
2. GET http://localhost:3002/user/tests/:url
   curl --location 'http://localhost:3002//user/tests/491e5147efbebf9eb279b9bfb968b3ff' \
   --header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDE2MjdkMWZjNDJmZDBlZjgyYmYyMyIsIm5hbWUiOiJOaXRlc2ggTWFuZ2xhIiwiZW1haWwiOiJuaXRlc2gubWFuZ2xhQG15cGFya3BsdXMuY29tIiwiY29udGFjdF9ubyI6ODg2MDMxNTI1Niwicm9sZSI6InVzZXIiLCJpYXQiOjE3MjQ5OTgyODksImV4cCI6MTcyNzU5MDI4OX0.TQ5olYhtccTxTSMOvnIkel-SG47kN2K7cQbp1FbqBGg' \

3. GET http://localhost:3002/user/tests/:test_id/start
   curl --location 'http://localhost:3002/user/tests/66d16649fda78c3c2c3b8ccf/start' \
   --header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDE2MjdkMWZjNDJmZDBlZjgyYmYyMyIsIm5hbWUiOiJOaXRlc2ggTWFuZ2xhIiwiZW1haWwiOiJuaXRlc2gubWFuZ2xhQG15cGFya3BsdXMuY29tIiwiY29udGFjdF9ubyI6ODg2MDMxNTI1Niwicm9sZSI6InVzZXIiLCJpYXQiOjE3MjQ5OTgyODksImV4cCI6MTcyNzU5MDI4OX0.TQ5olYhtccTxTSMOvnIkel-SG47kN2K7cQbp1FbqBGg' \
   
4. POST http://localhost:3002/user/tests/:test_id/questions/:question_id/answer
   curl --location 'http://localhost:3002/user/tests/66d16649fda78c3c2c3b8ccf/questions/66d06d5e97543aa125217e29/answer' \
   --header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDE2MjdkMWZjNDJmZDBlZjgyYmYyMyIsIm5hbWUiOiJOaXRlc2ggTWFuZ2xhIiwiZW1haWwiOiJuaXRlc2gubWFuZ2xhQG15cGFya3BsdXMuY29tIiwiY29udGFjdF9ubyI6ODg2MDMxNTI1Niwicm9sZSI6InVzZXIiLCJpYXQiOjE3MjQ5OTgyODksImV4cCI6MTcyNzU5MDI4OX0.TQ5olYhtccTxTSMOvnIkel-SG47kN2K7cQbp1FbqBGg' \
   --header 'Content-Type: application/json' \
   --data '{
   "answer_id": 1
   }'



