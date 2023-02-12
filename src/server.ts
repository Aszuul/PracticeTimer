import * as express from "express"
import * as path from "path"
import { connectToDatabase } from "./services/db.service";
import { userRouter } from "./routes/user.router";

const app = express();
const port = process.env.PORT || 3000;
const router = userRouter;

connectToDatabase() 
    .then(() => {
        app.use("/api/users", router);
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit();
    });

router.use('/dist',express.static(__dirname + './../dist'));

router.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'./../View/index.html'));
});

router.get('/index.css',function(req,res){
    res.sendFile(path.join(__dirname+'./../View/index.css'));
});

router.get('/favicon.ico',function(req,res){
    res.sendFile(path.join(__dirname+'./../View/favicon.ico'));
});

// sendFile will go here
app.use('/',router);
app.listen(port);
console.log('Server started at http://localhost:' + port);
