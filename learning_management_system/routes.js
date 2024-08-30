const express = require("express");
const router = express.Router();
const bodyParse = require("body-parser")
const {tokenValidate, validateHeader} = require('./Middleware/TokenVerify')
const {verifyRole} = require("./Middleware/AccessControl");
const {userCreate, userLogin}= require('./Controllers/User')
const {saveQuestion, getById, getAll, deleteQuestion}= require('./Controllers/Questions')
const {registerUserForTest, getUserTestByUrl, startTest, userAnswer, testResultByTestId}= require('./Controllers/UsersTest')


router.use(express.static("public"))
router.use(bodyParse.json())

router.post("/sign-up", userCreate)
router.post("/auth/login", userLogin)

// users routes
router.use('/auth/', [tokenValidate, validateHeader])
router.use('/auth', verifyRole('user'));
router.post("/auth/register", registerUserForTest)

// user routes
router.use('/user', [tokenValidate, validateHeader])
router.use('/user', verifyRole('user'));
router.get("/user/tests/:url", getUserTestByUrl)
router.get("/user/tests/:test_id/start", startTest)
router.post("/user//:testId/questions/:questionId/answer", userAnswer)

// admin routes
router.use('/admin', [tokenValidate, validateHeader])
router.use('/admin', verifyRole('admin'));
router.post('/admin/questions', saveQuestion)
router.get('/admin/questions/:id', getById)
router.get("/admin/questions", getAll)
router.delete("/admin/questions/:id", deleteQuestion)
router.get("/admin/tests/:testId", testResultByTestId)


router.get('/exit',  (req, res) => {
    console.log("Existing server...")
    process.exit(111)
})

process.on("exit", (code) => {
    console.log("Code", code)
})


router.get("*", (req, res) => {
    res.render('404', {
        title: "Page Not Found"
    })
});



module.exports = router;