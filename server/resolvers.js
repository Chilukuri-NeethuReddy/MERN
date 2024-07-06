//resolvers.js 
//to pre process the queries 
//query -> to retrive the data (Exactly WHat data we want)
//mutation -> to update the data
const User = require('./model/userSchema');//parent
const resolvers ={
    Query:{
        getUser: async(_,{id})=>{return await User.findById(id);},
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email, password });
            if (user) {
              return user;
            }
            throw new Error('Invalid email or password');
          }
        
    },
    Mutation:{
        createUser: async (_,{input})=>{
            const {name,email,password}= input;
            try{
                if(!name || !email || !password){
                    throw new Error("Please enter all the fields");
                }
                const newUser = new User({name,email,password});
                return await newUser.save();
            }catch(err){ throw Error(`Error Creating User: ${err}`)}
        },
        changePass:async(_,{id,password})=>{
            
            try{
               
                const usernew= await User.findByIdAndUpdate(id,{password:password},{new:true});
                if(!usernew){
                    throw new Error("User not found");
                }
                console.log(usernew);
                return usernew;
            }catch(err){throw Error(`Error Occured :${err}`)}
       
        },
        /*updateUser: async(_,{id,input})=>{
            return await User.findByIdAndUpdate(id,input);
        },*/
        updateUser: async(_,{id,input})=>{
            const {name,email,password}= input;
          
            try{
                if(!name || !email || !password){
                    throw new Error("Please enter all the fields");
                }
                const newUser = await User.findByIdAndUpdate(id,{name:name,email:email,password:password},{new:true});
                if(!newUser){ throw Error('No User with the id')}
                console.log(newUser)
                return newUser;
            }catch(err){throw Error(`Error Occured :${err}`)}
        },
        deleteUser: async(_,{id})=>{
            return await User.findByIdAndDelete(id);
        }
    },
    User:{
        email:(parent)=> parent.email || '',
        name:(parent)=> parent.name || '',
        password:(parent)=> parent.password || ''
    },
};module.exports=resolvers;//export resolvers
//http://localhost:3001/graphql

/*
mutation{
    createUser(input:{name:"Rani",
    email:"rani@gmail.com",
    password:"123456"})
}
*/