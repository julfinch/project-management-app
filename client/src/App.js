import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

const client  = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  cache: new InMemoryCache(),
})

function App() {
  return (
    <>
      <ApolloProvider client={client}>
        <Header>
          <div className="container">
            <h2>Hellow WOrld</h2>
          </div>
        </Header>
      </ApolloProvider>
    </>
    
  );
}

export default App;
