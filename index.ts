import express, { Request, Response } from "express";
import dotenv from "dotenv";
import sqlite3 from "sqlite3";
import cors from "cors";


dotenv.config();

type Todo = {
  content: string;
  complete: boolean;
  schedule: string;
  priority: number;
}

const db = new sqlite3.Database('./todos.db');


const app = express();
app.use(express.json());
app.use(cors());


app.get('/', (req: Request, res: Response) => {
  res.send("Server Online");
});

app.get("/todos", (req:Request, res:Response)=>{
  db.all("SELECT * FROM Todos", (err, rows)=> {
    if(err) {
      console.error(err.message);
      res.status(500).send(err);
    } else {
      res.send(rows);
    }
  })
});

app.post("/todos/add", (req:Request, res:Response)=>{
  const todo = req.body;
  console.log(todo);
  const sql = "INSERT INTO Todos (content, complete, schedule, priority) VALUES (?,?,?,?)"
  db.run(sql, [todo.content, todo.complete, todo.schedule, todo.priority], (err) => {
    if(err){
      console.log(err);
      res.status(500).send(err);
    }
    else{
      res.send("Todo Added");
    }
  })
});

app.post("/todos/update", (req:Request, res:Response)=>{
  const {id, todo}: {id: number, todo: Todo} = req.body;
  const sql = "UPDATE Todos SET content=?, complete=?, schedule=?, priority=? WHERE id=?;"
  db.run(sql, [todo.content, todo.complete, todo.schedule, todo.priority, id], 
    (err) => {
      if(err) {
        console.log(err);
        res.status(500).send(err);
      }
      else{
        res.send("Todo Updated");
      }
    })
});

app.post('/todos/delete', (req:Request, res:Response) => {
  const{id}: {id: number}= req.body;
  const sql = "DELETE FROM Todos WHERE id=?"
  db.run(sql, [id], (err)=>{
    if(err) {
      console.error(err.message);
      res.status(500).send(err);
    } else {
      res.send("Todo Deleted");
    }
  })
})

app.listen(8080, () => console.log("Server online on port 8080"))
