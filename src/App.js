import './App.css';
import Header from './components/Header'
import TableHead from "./components/TableHead";
import TableContent from "./components/TableContent";


function App() {

    return (
        
        <div className="page">
            <Header/>
            <div className="container">
                <TableHead/>
                <TableContent/>
            </div>
        </div>
    );
}

export default App;
