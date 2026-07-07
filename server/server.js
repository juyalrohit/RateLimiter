import express from 'express'

const app = express();

const requests = new Map();



app.get("/", (req, res)=>{

    const userIp = req.ip;
    
    if(! userIp in hashMap){
         requests[userIp]  = {counter : 5, timeStamp : Date.now()};
    }
    if(requests[userIp] <= 0){
      const timeStampDiff =  Date.now() - requests[userIp]
      if(timeStampDiff >= 10000){
          requests[userIp] = {counter : 5 , timeStamp : Date.now() };
      }
      else{
       return res.status(429).json({message : "Too Many Request"});
      }
    }
    requests[userIp]--;
    console.log("This is req", req.socket.remoteAddress);
    res.send(`Your Ip is${req.socket.remoteAddress}`);
})

app.listen(3000, ()=>{
    console.log("Server Running on Port");
})