import React from 'react';
import ReactDOM from 'react-dom';

class PageForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            'nameValue': '',
            'descValue': ''
        }
    }

    handleChange(event, fieldName) {


        this.setState({
            [fieldName]: event.target.value,
        })


        // edit this out if i wanna stop being funni
        // whatever you type into 1st field appends to 2nd, does not count for backspaces tho
        // ------------
        if (fieldName === 'nameValue') {

            const prevState = Object.assign({}, this.state)
            const whatChanged = event.target.value.slice(prevState.nameValue.length /*, till the end */)


            this.setState(prevState => ({descValue: prevState.descValue + whatChanged}))
        }
        // ------------

    }

    render() {
        return (
            <div>
                <form>
                    <input type="text" onChange={(e) => this.handleChange(e, 'nameValue')} value={this.state.nameValue}></input>
                    <input type="text" onChange={(e) => this.handleChange(e, 'descValue')} value={this.state.descValue}></input>
                </form>
                <p>{this.state.nameValue}, {this.state.descValue}</p>
            </div>
        )
    }
}

ReactDOM.render(
    <PageForm />,
    document.getElementById('root')
)