# PROJECT MANAGEMENT APP
- This project was made using GraphQL.

## SET UP
1. Initialize project and install dependencies
    ```shell
        mkdir project-management-app
        cd project-management-app
        npm i express express-graphql graphql mongoose cors colors
        npm i -D nodemon dotenv
    ```
1. Under root, create the `server folder` and create a new file `index.js`.
    ```shell
        const express = require('express');
        require('dotenv').config();
        const { graphqlHTTP } = require('express-graphql');
        const schema = require('./schema/schema')
        const port = process.env.PORT || 5000;

        const app = express()

        app.use('/graphql', graphqlHTTP({
            schema,
            #graphiql will be true in a condition where node environment is in development
            #This will be false if our node environment inside .env is set to production
            graphiql: process.env.NODE_ENV === 'development'
        }))

        app.listen(port, console.log(`Server runnnig port ${port}`));
    ```
1. Under root, create a `.env file` and setup port and node environment:
    ```shell
        NODE_ENV = 'development'
        PORT = 5000
    ```
1. Change the scripts inside `package.json`
    ```shell
        "scripts": {
            "start": "node server/index.js",
            "dev": "nodemon server/index.js"
        },
    ```
1. Run `npm run dev` and we should see from the terminal saying `server running on port 5000`
1. Under `server folder`, create `schema folder` and a `schema.js` inside it.
```shell

```
1. Under `server folder`, create `sampleData.js` and paste the 2 array for our data.
    ```shell
        // Projects
        const projects = [
        {
            id: '1',
            clientId: '1',
            name: 'eCommerce Website',
            description:
            'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu.',
            status: 'In Progress',
        },
        {
            id: '2',
            clientId: '2',
            name: 'Dating App',
            description:
            'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu.',
            status: 'In Progress',
        },
        ];

        // Clients
        const clients = [
        {
            id: '1',
            name: 'Tony Stark',
            email: 'ironman@gmail.com',
            phone: '343-567-4333',
        },
        {
            id: '2',
            name: 'Natasha Romanova',
            email: 'blackwidow@gmail.com',
            phone: '223-567-3322',
        },
        ];

        module.exports = { projects, clients };
    ```
## GRAPHQL - QUERY TO GET A SINGLE CLIENT
1. To be able to access `graphql` using `graphiql`, we need to set-up our schema:
    ```shell
        const { projects, clients } = require('../sampleData')

        const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema } = require('graphql');

        //Client Type
        const ClientType = new GraphQLObjectType({
            name: 'Client',
            fields: () => ({
                id: { type: GraphQLID },
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                phone: { type: GraphQLString },
            })
        });

        const RootQuery = new GraphQLObjectType({
            name: 'RootQueryType',
            fields: {
                client: {
                    type: ClientType,
                    args: { id: { type: GraphQLID } },
                    resolve(parent, args) {
                        return clients.find(client => client.id === args.id);
                    }
                }
            }
        });

        module.exports = new GraphQLSchema({
            query: RootQuery
        })
    ```
1. We can now use `GraphiQL` by going to `localhost:5000/graphql`.
    - An example GraphQL query might look like:
        ```shell
            {
                field(arg: "value") {
                    subField
                }
            }
        ```
    - If we try to query the name, id and email of a client with an id of 1:
        ```shell
            {
                client(id: "1") {
                    name,
                    id,
                    email,
                }
            }
        ```
    - The result of our query would be like this:
        ```shell
            {
            "data": {
                "client": {
                "name": "Tony Stark",
                "id": "1",
                "email": "ironman@gmail.com"
                }
            }
            }
        ```

## GRAPHQL - QUERY TO GET ALL CLIENTS
    ```shell
            clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args) {
                return clients;
            }
        },
    ```
1. Add the code above to our `schema.js` to be able to get all the clients.
    ```shell
        const { projects, clients } = require('../sampleData')

        const { GraphQLObjectType, GraphQLID, GraphQLList, GraphQLString, GraphQLSchema } = require('graphql');

        //Client Type
        // Base the fields from the sampleData.js
        const ClientType = new GraphQLObjectType({
            name: 'Client',
            fields: () => ({
                id: { type: GraphQLID },
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                phone: { type: GraphQLString },
            })
        });

        const RootQuery = new GraphQLObjectType({
            name: 'RootQueryType',
            fields: {
                clients: {
                    type: new GraphQLList(ClientType),
                    resolve(parent, args) {
                        return clients;
                    }
                },
                client: {
                    type: ClientType,
                    args: { id: { type: GraphQLID } },
                    resolve(parent, args) {
                        return clients.find(client => client.id === args.id);
                    }
                }
            }
        });

        module.exports = new GraphQLSchema({
            query: RootQuery
        })
    ```
1. We can now uget all the clients.
    - If we try to query the name, id and email of all clients:
        ```shell
            {
            clients {
                id,
                name,
                email,
                phone
            }
            }
        ```
    - The result of our query would be like this:
        ```shell
            {
            "data": {
                "clients": [
                {
                    "id": "1",
                    "name": "Tony Stark",
                    "email": "ironman@gmail.com",
                    "phone": "343-567-4333"
                },
                {
                    "id": "2",
                    "name": "Natasha Romanova",
                    "email": "blackwidow@gmail.com",
                    "phone": "223-567-3322"
                },
                {
                    "id": "3",
                    "name": "Thor Odinson",
                    "email": "thor@gmail.com",
                    "phone": "324-331-4333"
                },
                {
                    "id": "4",
                    "name": "Steve Rogers",
                    "email": "steve@gmail.com",
                    "phone": "344-562-6787"
                },
                {
                    "id": "5",
                    "name": "Bruce Banner",
                    "email": "bruce@gmail.com",
                    "phone": "321-468-8887"
                }
                ]
            }
            }
        ```