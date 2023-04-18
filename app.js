const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.set("views", path.join(__dirname, "views","registrar"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/home", (req, res) => {
  const index = path.join(__dirname, "./views/index.html");
  res.sendFile(index);
});

app.get("/", (req, res) => {
  const loginPage = path.join(__dirname, "./views/login/index.html");
  res.sendFile(loginPage);
});

app.post("/login", async (req, res) => {
  const user = req.body;
  console.log(user);
  const filePath = path.join(__dirname, "data", "users.json");
  const fileData = fs.readFileSync(filePath);
  const storedUsers = JSON.parse(fileData);

  var userExists = 0;

  for (let existingUser of storedUsers) {
    if (
      user.username === existingUser.username &&
      user.password === existingUser.password
    ) {
      userExists = 1;
    }
  }

  if (userExists === 1) {
    res.redirect("/home");
  } else {
    res.send("<script>alert('Username or password do not match');</script>");
  }
});

app.get("/create", (req, res) => {
  const createCase = path.join(__dirname, "./views/registrar/create-case.html");
  res.sendFile(createCase);
});

app.post("/create",(req,res)=>{
  const caseDetails = req.body;
  const filePath = path.join(__dirname, "data", "case.json");
  const fileData = fs.readFileSync(filePath);
  const storedCases = JSON.parse(fileData);
  storedCases.push(caseDetails);
  fs.writeFileSync(filePath, JSON.stringify(storedCases));
  res.redirect("/home");
})

app.get("/list-cases", (req, res) => {
  const filePath = path.join(__dirname, "data", "case.json");
  const fileData = fs.readFileSync(filePath);
  const storedCases = JSON.parse(fileData);

  res.render("case-view", {storedCases:storedCases});
});

app.post("/list-cases", (req, res) => {
  const caseNumber = req.body.Casenumber;
  const filePath = path.join(__dirname, "data", "case.json");
  const fileData = fs.readFileSync(filePath);
  const storedCases = JSON.parse(fileData);

  var newCase = [];

  for(const cases of storedCases){
    if(caseNumber == cases.Casenumber){
      newCase.push(cases);
    }
  }
  

  res.render("case-view", {storedCases: newCase});
});

app.get("/payment",(req,res)=>{
  const paymentPage = path.join(__dirname, "./views/payment.html");
  res.sendFile(paymentPage);
})

app.listen(3000);
