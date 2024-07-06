const express = require('express')
const router = express.Router()
const {ApolloServer,gql} = require('apollo-server-express');
const typeDefs = require('../schema');
const resolvers = require('../resolvers');
const server = new ApolloServer({typeDefs,resolvers});
router.get('/',async (req,res)=>{
    try{
        const {data,errors}= await  server.executeOperation({
            query:gql`query{ getUsers{id name email password} }`
        });if(errors){
            console.log(errors)
            return res.status(500).send(errors);
        }res.status(201).send(data)
    }catch(err){
        console.log()
       res.status(500).send({message:err})
    }
})
router.get('/search/:name',async(req,res)=>{
    try{
        const name = req.params.name;
        const {data,error}= await server.executeOperation({
            query:gql`query{ searchUsers(name:${name}){id name email}}`
        });
        if(error){return res.status(500).send(error)}
        res.status(201).send(data)
    }catch(err){
        res.status(500).send(err);
    }
})//http://localhost:3001/users/search/%22ravi%22
router.post('/register', async (req,res)=>{
    //req -> name,email,password
    const {name,email,password}= req.body;
    try{
        const {data,error} = await server.executeOperation({
            query:gql`mutation {
                createUser(input:{name:"${name}",
                email:"${email}",password:"${password}"}){
                    id
                    name
                    email
                    password
                }
            }`
        });
        if(error){return res.status(500).send({message:error})}
        res.status(201).send(data)
    }catch(err){
        res.status(500).send({message:err});
    }
})
router.put('/changepass/:id', async(req,res)=>{
    const id = req.params.id;
    const {password}= req.body;
    try{
        const {data,error} = await server.executeOperation({
            query:gql`mutation{
                changePass(id:"${id}",password:"${password}"){
                  id
                   name 
                   password
                }
              } `
        });
        if(error){ return res.status(500).send({message:error})};
        res.status(201).send({message:data});
    }catch(err){res.status(500).send({message:err})};
})
router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const { data, errors } = await server.executeOperation({
        query: gql`
          query login($email: String!, $password: String!) {
            login(email: $email, password: $password) {
              id
              name
              email
            }
          }
        `,
        variables: { email, password },
      });
  
      if (errors) {
        return res.status(400).json({ errors });
      }
  
      res.status(200).json(data.login);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


module.exports =router