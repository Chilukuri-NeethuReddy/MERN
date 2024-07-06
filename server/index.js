const express = require('express')
const {ApolloServer,gql} = require('apollo-server-express')
const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const cors= require('cors')
const mongoose = require('mongoose')
const userApiFromRouter = require('./routes/userRoutes')
const app = express();  
const port=3001;
app.use(express.json());  //middleware
app.use(cors())

const url = 'mongodb+srv://chilukurineethureddy2004:QIdPrjSgSP9JjkUu@cluster0.hi0dqlx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
//connecting my express app to my mongodb server
mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{console.log('DB connected')}).catch((err)=>console.log(err));

//start my apollo express server
const server = new ApolloServer({typeDefs,resolvers});
app.get('/users', async (req,res)=> {
    try {
        const {data,errors} = await server.executeOperation({
            query:gql`query{
            getUsers{
            name email
            }
            }`//we will write out queries here
        });
        if(errors) {
            res.status(500).send({errors});
        }
        res.status(201).send(data)

    }catch(err) {
        res.status(500).send({message:err})

    }
})

app.get('/users/search/:name',async (req,res)=> {
    try{
        const name = req.params.name;
        const {data,error} = await server.executeOperation({
            query:gql`query{ searchUsers(name:${name}){id name email}}`
        });
        if(error) {
            res.status(500).send({error});
        }
        res.status(201).send(data)
    }
    catch(err) {
        res.status(500).send({message:err})
         
    }
})
app.use('/users',userApiFromRouter)
async function StartServer() {
    await server.start();
    server.applyMiddleware({app});  //run my express code
    app.listen(port,()=> {
        console.log('Server live');
    })
}
StartServer();