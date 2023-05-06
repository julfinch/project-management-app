// 1
const express = require('express');
require('dotenv').config();
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema')
const port = process.env.PORT || 5000;
// 2 Import Color and MongoDB
const connectDB = require('./config/db');
const color = require('colors')
// 1
const app = express()

// 3 Connect to database
connectDB();
// 1
app.use('/graphql', graphqlHTTP({
    schema,
    //graphiql will be true in a condition where node environment is in development
    //This will be false if our node environment inside .env is set to production
    graphiql: process.env.NODE_ENV === 'development'
}))
app.listen(port, console.log(`Server runnnig on port ${port}`));