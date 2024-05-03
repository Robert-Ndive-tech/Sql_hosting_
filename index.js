const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const multer = require("multer");
var fs = require("fs");
const cors = require("cors");

const router = express.Router();
const brandrouter = express.Router();
const categrouter = express.Router();
const itemorderRouter = express.Router();
const ordersrouter = express.Router();
const productrouter = express.Router();
const storesrouter = express.Router();
const stocksrouter = express.Router();
const customrouter = express.Router();
const staffrouter = express.Router();

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// DEFINING DATABASE

const Productiondb = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "production",
});
const Salesdb = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "sales",
});
const pool = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "Imagestore",
});

const Online = mysql.createConnection({
  host: "bepmjmvyyqzpkqn09gkw-mysql.services.clever-cloud.com",
  user: "u5yizoklwtbdszg8",
  password: "464LMhsXrxuJ5GY110gw",
  database: "bepmjmvyyqzpkqn09gkw",
});

//USING THE DIFFERENT ROUTES
app.use("/brands", brandrouter);
app.use("/store", storesrouter);
app.use("/stocks", stocksrouter);
app.use("/staffs", staffrouter);
app.use("/category", categrouter);
app.use("/products", productrouter);
app.use("/order_items", itemorderRouter);
app.use("/order", ordersrouter);
app.use("/customers", customrouter);

Salesdb.connect((err) => {
  if (err) {
    console.log("Not connected to db 2");
    throw err;
  }
  console.log("MySQL Connected.to db 2..");
});

Online.connect((err) => {
  if (err) {
    console.log("Not connected to db 4");
    throw err;
  }
  console.log("MySQL Connected.to db 4..");
});

pool.connect((err) => {
  if (err) {
    console.log("Not connected to db 3");
    throw err;
  }
  console.log("MySQL Connected.to db 3..");
});

Productiondb.connect((err) => {
  if (err) {
    console.log("Not connected");
    throw err;
  }
  console.log("MySQL Connected.to db 1..");
});




app.listen(4501, () => {
  console.log("Server started on port 4501");
});




//DEFININ THE CONTROLLERS AND ROUTES ININ THE CONTROLLERS AND ROUTES

// Replace with your actual database credentials


// Route to retrieve data from the database (replace 'your_table' with your actual table name)
app.get('/data', async (req, res) => {
  try {
    const [rows] = await Online.query('SELECT * FROM TEST');
    res.json(rows);
    console.log("data retrieve successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving data' });
    console.log("data retrieve unsuccessfully");
  }
});

// Route to insert data into the database (replace 'your_table' and column names with your actual data)
app.post('/data', async (req, res) => {
  try {
    const { name, email, ...otherData } = req.body; // Destructure incoming data
    const sql = `INSERT INTO PHOTO1 (id, title,content, ...) VALUES (?, ?,?, ...)`; // Use parameterized queries to prevent SQL injection
    const [result] = await Online.query(sql, [name, email, ...Object.values(otherData)]); // Pass data as separate values
    res.json({ message: `Data inserted successfully with ID: ${result.insertId}` });
    console.log("data sent successfully");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error inserting data' });
    console.log("data sent unsuccessfully");
  }
});



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./Assets"); // Change 'uploads/' to your desired directory path
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

app.post("/upload", upload.single("photo"), async (req, res) => {
  if (!req.file) {
    console.log("No photo was sent");
    return res.status(400).send("No photo uploaded");
  }

  const imagePath = `"./Assets${req.file.filename}"`; // Adjust path based on your storage location

  // Prepare SQL query to insert data
  const sql = `INSERT INTO PHOTO1 (PHOTONAME) VALUES (?)`;
  let query = Online.query(sql, [imagePath], (err, result) => {
    if (err) throw err;
    res.send(result);
    console.log(result);
  });
});

app.get("/download", (req, res) => {
  let sql = "SELECT * FROM  PHOTO1";
  let query = Online.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results);
    res.send(results);
  });
});
