const express=require('express');
const app=express();
app.get('/',(req,res)=>res.json({message:'Payroll Analytics API'}));
app.listen(5000);
