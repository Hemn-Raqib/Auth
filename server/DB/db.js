import mysql from 'mysql2';
import dotenv  from "dotenv";
dotenv.config();

const db = mysql.createConnection({
host:process.env.HOST,
user:process.env.USER,
password:process.env.PASSWORD,
database:process.env.DATABASE
});

db.connect((error, res) => {
    if (error) {
        console.error('Database connection failed:', error.stack);
        return;
      }
      console.log('Database connected as id ' + db.threadId);
});



export default db;

