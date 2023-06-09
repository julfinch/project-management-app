# PROJECT MANAGEMENT APP
- This project was made using GraphQL.

# SERVER
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
1. Paste code under `RootQueryType`
    ```shell
        client: {
            type: ClientType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return clients.find(client => client.id === args.id);
            }
        }
    ```
1. To be able to access `graphql` using `graphiql`, we need to set-up our schema:
    ```shell
        const { projects, clients } = require('../sampleData')

        const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLSchema } = require('graphql');

        # Client Type
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
1. Paste code under `RootQueryType`
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

        # Client Type
        # Base the fields from the sampleData.js
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

## GRAPHQL - QUERY TO GET SINGLE PROJECT
1. Paste code under `RootQueryType`
    ```shell
        # SINGLE PROJECT
        project: {
            type: ProjectType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return projects.find(project => project.id === args.id);
            }
        },
    ```
1. Add the code above to our `schema.js` to be able to get all the clients.
    ```shell
        const { projects, clients } = require('../sampleData')

        const { GraphQLObjectType, GraphQLID, GraphQLList, GraphQLString, GraphQLSchema } = require('graphql');

        # Project Type
        # Base the fields from the sampleData.js
        const ProjectType = new GraphQLObjectType({
            name: 'Project',
            fields: () => ({
                id: { type: GraphQLID },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                status: { type: GraphQLString },
            })
        });

        const RootQuery = new GraphQLObjectType({
            name: 'RootQueryType',
            fields: {
                # SINGLE PROJECT
                project: {
                    type: ProjectType,
                    args: { id: { type: GraphQLID } },
                    resolve(parent, args) {
                        return projects.find(project => project.id === args.id);
                    }
                },
                # ALL CLIENTS
                clients: {
                    type: new GraphQLList(ClientType),
                    resolve(parent, args) {
                        return clients;
                    }
                },
                # SINGLE CLIENT
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
            project (id: "1") {
                id
                name
                description
                status
            }
            }
        ```
    - The result of our query would be like this:
        ```shell
            {
            "data": {
                "project": {
                "id": "1",
                "name": "eCommerce Website",
                "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu.",
                "status": "In Progress"
                }
            }
            }
        ```

## GRAPHQL - QUERY TO GET ALL PROJECTS
1. Paste code under `RootQueryType`
    ```shell
        # ALL PROJECTS
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args) {
                return projects;
            }
        },
    ```
1. Add the code above to our `schema.js` to be able to get all the clients.
    ```shell
        const { projects, clients } = require('../sampleData')

        const { GraphQLObjectType, GraphQLID, GraphQLList, GraphQLString, GraphQLSchema } = require('graphql');

        # Project Type
        # Base the fields from the sampleData.js
        const ProjectType = new GraphQLObjectType({
            name: 'Project',
            fields: () => ({
                id: { type: GraphQLID },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                status: { type: GraphQLString },
            })
        });

        const RootQuery = new GraphQLObjectType({
            name: 'RootQueryType',
            fields: {
                # ALL PROJECTS
                projects: {
                    type: new GraphQLList(ProjectType),
                    resolve(parent, args) {
                        return projects;
                    }
                },
                # SINGLE PROJECT
                project: {
                    type: ProjectType,
                    args: { id: { type: GraphQLID } },
                    resolve(parent, args) {
                        return projects.find(project => project.id === args.id);
                    }
                },
                # ALL CLIENTS
                clients: {
                    type: new GraphQLList(ClientType),
                    resolve(parent, args) {
                        return clients;
                    }
                },
                # SINGLE CLIENT
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
1. We can now get all the projects.
    - If we try to query the name, id, description and status of all projects:
        ```shell
            {
            projects {
                id
                name
                description
                status
            }
            }
        ```
    - The result of our query would be like this:
        ```shell
            {
            "data": {
                "projects": [
                {
                    "id": "1",
                    "name": "eCommerce Website",
                    "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu.",
                    "status": "In Progress"
                },
                {
                    "id": "2",
                    "name": "Dating App",
                    "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu.",
                    "status": "In Progress"
                },
                ]
            }
            }
        ```

## GRAPHQL - QUERY TO GET A PROJECT USING ID IN RELATION TO CLIENT ID 
1. Paste code:
    ```shell
        # Project Type
        # Base the fields from the sampleData.js
        const ProjectType = new GraphQLObjectType({
            name: 'Project',
            fields: () => ({
                id: { type: GraphQLID },
                name: { type: GraphQLString },
                description: { type: GraphQLString },
                status: { type: GraphQLString },
                client: {
                    type: ClientType,
                    resolve(parent, args) {
                        return clients.find(client => client.id === parent.clientId);
                    }
                }
            })
        });
    ```

1. We can now get the project with the corresponding client.
    - If we try to query the name, id and email of all clients:
        ```shell
            {
            {
            project (id: "1") {
                id
                name
                description
                status
                client {
                name
                id
                }
            }
            }
        ```
    - The result of our query would be like this:
        ```shell
            {
            "data": {
                "project": {
                "id": "1",
                "name": "eCommerce Website",
                "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu.",
                "status": "In Progress",
                "client": {
                    "name": "Tony Stark",
                    "id": "1"
                }
                }
            }
            }
        ```

## MONGODB
1. Follow the steps from the link on how to set-up a new Database in MongoDB - [https://github.com/julfinch/finch-restaurant#backend](https://github.com/julfinch/finch-restaurant#backend)
1. Under `Collections`, click `Add My Own Data`. Set the following info below and then click Create.
    - Database name: project_mgmt_db
    - Collection name: clients
1. Open `MongoDB Compass` or download it if you haven't installed it yet.
1. In `Mongo Atlas`, click `Overview` then `Connect`, lastly, `Compass`. 
1. Choose `I have MongoDB installed`, copy the connection string: `mongodb+srv://julfinch:<password>@cluster0.5xsupqs.mongodb.net/`
1. Open `Compass` and paste the connection string on the input tab, replace `<password>` with your password and at the end of the connection string, add the database name `project_mgmt_db` so it would look like this one now: `mongodb+srv://julfinch:thisismypassword@cluster0.5xsupqs.mongodb.net/project_mgmt_db`. Click `Connect`. We should now be able to see that `project_mgmt_db` is already connected.
1. Open `Atlas` and click `Go Back`. Choose `Drivers` and copy the connection string like this one - `mongodb+srv://julfinch:<password>@cluster0.5xsupqs.mongodb.net/?retryWrites=true&w=majority` and close.
1. Go to `.env file` and add the connectiion string with the provided password and database name - `MONGO_URI = 'mongodb+srv://julfinch:yourPasswordHere@cluster0.5xsupqs.mongodb.net/project_mgmt_db?retryWrites=true&w=majority'`.
1. If we restart the server, we should have access to that environment variable already.
1. Under `server folder`, create a folder called `config` and inside it is `db.js` file.
    ```shell
        const mongoose = require('mongoose')
        const connectDB = async () => {
            const conn = await mongoose.connect(process.env.MONGO_URI);

            console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold)
        }
        module.exports = connectDB;
    ```
1. Under `index.js`, import `MONGODB connection` and `COLORS` and invoke it.
    ```shell
        const connectDB = require('./config/db');
        const color = require('colors')

        connectDB();
    ```
1. Restart server and we should see in the terminal: 
    ```shell
        Server runnnig on port 5000
        MongoDB Connected: ac-fy51cq6-shard-00-00.5xsupqs.mongodb.net
    ```

## MODELS
1. Under `server folder`, create a folder named `models` and inside it is `Client.js` file.
    ```shell
        const mongoose = require('mongoose');

        const ClientSchema = new mongoose.Schema({
            name: {
                type: String,
            },
            email: {
                type: String,
            },
            phone: {
                type: String,
            },
        });

        module.exports = mongoose.model('Client', ClientSchema);
    ```
1. Under `models` folder, create `Client.js` file.
    ```shell
        const mongoose = require('mongoose');

        const ProjectSchema = new mongoose.Schema({
            name: {
                type: String,
            },
            description: {
                type: String,
            },
            status: {
                type: String,
                enum: ['Not Started', 'In Progress', 'Completed']
            },
            clientId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Client',
            }
        });

        module.exports = mongoose.model('Project', ProjectSchema);
    ```
1. Open `schema.js` and import both `project` and `client` models.
    ```shell
        const Project = require('../models/Project');
        const Client = require('../models/Client');
    ```
1. Under our `RootQuery` for each methods, change the data that we are going to return:
    ```shell
        return Project.find();
        return Project.findById(args.id);
        return Client.find();
        return Client.findById(args.id);
    ```
1. Under `ProjectType`, change the data to return under client to `Client.findById(parent.clientId);` 

### ADD A CLIENT
1. At the bottom of `schema.js`, add the method for `Mutations`. Also, don't forget to add `mutation` to our `module.exports`:
    ```shell
        const mutation = new GraphQLObjectType({
            name: 'Mutation',
            fields: {
                addClient: {
                    type: ClientType,
                    args: {
                        name: { type: GraphQLNonNull(GraphQLString) },
                        email: { type: GraphQLNonNull(GraphQLString) },
                        phone: { type: GraphQLNonNull(GraphQLString) },
                    },
                    resolve(parent, args) {
                        const client = new Client({
                            name: args.name,
                            email: args.email,
                            phone: args.phone,
                        });
                        // We will take evertyhing that is sent 
                        // from the client and save it to our database
                        return client.save()
                    }
                }
            }
        })

        module.exports = new GraphQLSchema({
            query: RootQuery,
            mutation
        })
    ```
1. Now, go to [https://gist.github.com/bradtraversy/fc527bc9a4659ab8de8e8066f3498723](https://gist.github.com/bradtraversy/fc527bc9a4659ab8de8e8066f3498723) and find the method for adding a client.
1. Go to `GraphiQL` and write the method to add a new client:
    ```shell
        mutation {
        addClient(name: "Tony Stark", email: "ironman@gmail.com", phone: "555-555-555") {
            id
            name
            email
            phone
        }
        }
    ```
1. We should get the results upong checking the right side of `GraphiQL` and also on the `Compass`.
    ```shell
        {
        "data": {
            "addClient": {
            "id": "645660457044ae2f013a0522",
            "name": "Tony Stark",
            "email": "ironman@gmail.com",
            "phone": "555-555-555"
            }
        }
        }
    ```
### DELETE A CLIENT
1. At the bottom of `schema.js`, add the method for `Mutations`. Also, don't forget to add `mutation` to our `module.exports`:
    ```shell
        const mutation = new GraphQLObjectType({
            name: 'Mutation',
            fields: {
                addClient: {
                },
                deleteClient: {
                    type: ClientType,
                    args: {
                        id: { type: GraphQLNonNull(GraphQLID) },
                    },
                    resolve(parent, args) {
                        # DELETE CLIENT ASSOCIATED TO A 
                        # PROJECT WHEN WE DELETE IT
                        Project.find({ clientId: args.id }).then(
                            (projects) => {
                                projects.forEach((project) => {
                                    project.remove();
                                })
                            }
                        )
                        return Client.findByIdAndRemove(args.id);
                    },
                },
            }
        })
    ```
1. Go to `GraphiQL` and write the method to add a new client:
    ```shell
        mutation {
            deleteClient(id: "64566914392d5a8c6b10b8e9") {
                name
            }
        }
    ```
1. We should get the results upong checking the right side of `GraphiQL` and also on the `Compass`.
    ```shell
        {
        "data": {
            "deleteClient": {
            "name": "Lara Turner"
            }
        }
        }
    ```
### ADD A PROJECT
1. At the bottom of `schema.js`, add the method for `Mutations`. Also, don't forget to add `mutation` to our `module.exports`:
    ```shell
        const mutation = new GraphQLObjectType({
            name: 'Mutation',
            fields: {
                addClient: {
                },
                deleteClient: {
                },
                addProject: {
                type: ProjectType,
                args: {
                    name: { type: GraphQLNonNull(GraphQLString) },
                    description: { type: GraphQLNonNull(GraphQLString) },
                    status: {
                        type: new GraphQLEnumType({
                            name: 'ProjectStatus',
                            values: {
                                'new': { value: 'Not Started' },
                                'progree': { value: 'In Progress' },
                                'completed': { value: 'Completed' },
                            }
                        }),
                        defaultValue: 'Not Started',
                    },
                    clientId: {  type: GraphQLNonNull(GraphQLID) },
                },
                resolve(parent, args) {
                    const project = new Project({
                        name: args.name,
                        description: args.description,
                        status: args.status,
                        clientId: args.clientId,
                    });

                    return project.save();
                }
            }
            }
        })
    ```
1. Go to `GraphiQL` and write the method to add a new client:
    ```shell
        mutation {
        addProject(name: "Mobile App", description: "This is the description", status: new, clientId: "645660457044ae2f013a0522") {
            name
            id
        }
        }
    ```
1. We should get the results upong checking the right side of `GraphiQL` and also on the `Compass`.
    ```shell
        {
        "data": {
            "addProject": {
            "name": "Mobile App",
            "id": "64566741392d5a8c6b10b8e7"
            }
        }
        }
    ```
### DELETE A PROJECT
1. At the bottom of `schema.js`, add the method for `Mutations`. Also, don't forget to add `mutation` to our `module.exports`:
    ```shell
        const mutation = new GraphQLObjectType({
            name: 'Mutation',
            fields: {
                addClient: {
                },
                deleteClient: {
                },
                addProject: {
                },
                deleteProject: {
                    type: ProjectType,
                    args: {
                        id: { type: GraphQLNonNull(GraphQLID) },
                    },
                    resolve(parent, args) {
                        return Project.findByIdAndRemove(args.id);
                    }
                    }
                }
        })
    ```
1. Go to `GraphiQL` and write the method to add a new client:
    ```shell
        mutation {
                deleteProject(id: "64574c409a3d27a1976b6313") {
                    id
                }
        }
    ```
1. We should get the results upong checking the right side of `GraphiQL` and also on the `Compass`.
    ```shell
        {
        "data": {
            "deleteProject": {
            "id": "64574c409a3d27a1976b6313"
            }
        }
        }
    ```
### UPDATE A PROJECT
1. At the bottom of `schema.js`, add the method for `Mutations`. Also, don't forget to add `mutation` to our `module.exports`:
    ```shell
        const mutation = new GraphQLObjectType({
            name: 'Mutation',
            fields: {
                addClient: {
                },
                deleteClient: {
                },
                addProject: {
                },
                deleteProject: {
                },
                updateProject: {
                type: ProjectType,
                args: {
                    id: { type: GraphQLNonNull(GraphQLID) },
                    name: { type: GraphQLString },
                    description: { type: GraphQLString },
                    status: {
                        type: new GraphQLEnumType({
                            // name ProjectStatus is already used above
                            // must give a new name or this will throw an error
                            name: 'ProjectStatusUpdate',
                            values: {
                                'new': { value: 'Not Started' },
                                'progree': { value: 'In Progress' },
                                'completed': { value: 'Completed' },
                            }
                        }),
                    },
                },
                resolve(parent, args) {
                    return Project.findByIdAndUpdate(
                        args.id,
                        {
                            $set: {
                                name: args.name,
                                description: args.description,
                                status: args.status,
                            },
                        },
                        { new: true }
                    );
                }
            }
        })
    ```
1. Go to `GraphiQL` and write the method to add a new client:
    ```shell
        mutation {
                updateProject(id: "64566741392d5a8c6b10b8e7", name: "Mobile Application", status: completed) {
                    name
                            status
                }
        }
    ```
1. We should get the results upong checking the right side of `GraphiQL` and also on the `Compass`.
    ```shell
        {
        "data": {
            "updateProject": {
            "name": "Mobile Application",
            "status": "Completed"
            }
        }
        }
    ```
# CLIENT
1. Initialize project and install dependencies
    ```shell
        cd project-management-app
        npx create-react-app client
        cd client
        npm i @apollo/client graphql react-router-dom react-icons
    ```
1. During a CORS Problem, import `cors` in the `index.js` of our `server`.
    ```shell
        const cors = require('cors');

        app.use(cors());
    ```