
import data from './data.json'
function App() {
  return (
    <>
      {data.map((row) => { return <h1>{row.login}</h1> })}
    </>
  );
}

export default App;
