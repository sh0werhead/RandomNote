import { randomInt } from 'crypto';
import express, { Express, Request, Response } from 'express';
import { Pool } from 'pg';
import { sanitize } from "sanitizer";
import { template } from "./field_template"

const app: Express = express();
app.use(express.json());

const pool = new Pool({
    user : "postgres",
    password : "kye040109",
    database: "mydb",
    host: "localhost",
    port:5432
})

app.get("/", (req: Request, res: Response)=>{
    res.send("hello world!!");
})

app.post("/post", async(req : Request, res : Response) => {
    try{
        if(req.body){
            var {dirty_title, dirty_bodytxt} = req.body;
            var title : string = sanitize(dirty_title);
            var bodytxt : string = sanitize(dirty_bodytxt);

            pool.query(`INSERT INTO note VALUES ('${title}', '${bodytxt}');`);
            return res.status(201).json({
                code: 201,
            });
        }
        else{
            throw 0;
        }
    }
    catch{
        return res.status(418).json({
            code: 418,
            value: "{}"
        });
    }
});



app.get("/get", async(req : Request, res : Response) => {
    try{
        if(req.body){
            const value = await pool.query(`SELECT * FROM note;`);
            if(value.rowCount){
                const i:number = randomInt(value.rowCount);
                return res.status(200).json({
                    code: 200,
                    value: value.rows[i]
                });
            }
            else{
                return res.status(204).json({
                    code: 204,
                    value: "{}"
                });
            }
        }
        else{
            throw 0;
        }
    }
    catch{
        return res.status(418).json({
            code: 418,
            value: "{}"
        });
    }
});

app.get("/field", (req: Request, res: Response)=>{
    console.log(template());
    res.send(template());
})


app.listen(4000, ()=>{
    console.log("RN on 4000");
})