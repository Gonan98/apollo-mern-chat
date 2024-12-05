import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { PubSub } from 'graphql-subscriptions';

const app = express();
const httpServer = createServer(app);
const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql'
});

const typeDefs = `#graphql
    type Message {
        id: ID!
        content: String
        sender: String
    }

    type Query {
        getMessages: [Message]
    }

    type Mutation {
        sendMessage(content: String!, sender: String!): Message!
    }

    type Subscription {
        messageSent: Message!
    }
`
const messages = [];
const pubsub = new PubSub();
const resolvers = {
    Query: {
        getMessages: () => messages
    },

    Mutation: {
        sendMessage: (_, { content, sender }) => {
            const msg = { id: Date.now().toString(), content, sender };
            messages.push(msg);
            pubsub.publish('MESSAGE_SENT', { messageSent: msg });
            return msg;
        }
    },

    Subscription: {
        messageSent: {
            subscribe: () => pubsub.asyncIterableIterator(['MESSAGE_SENT'])
        }
    }
}

const schema = makeExecutableSchema({ typeDefs, resolvers });

const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
    schema,
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup.dispose();
                    },
                };
            },
        },
    ],
});

await server.start();

app.use('/graphql', cors(), express.json(), expressMiddleware(server));

const PORT = 4000;

httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/graphql`);
});