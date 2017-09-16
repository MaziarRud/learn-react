import '../css/main.scss';

export default class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            greetins: "Hello World!"
        }
    }
    render(){
        return (
            <div className="main">
                {this.state.greetins}
            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
)

