import React, { Component } from 'react';

import './App.css';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// components
import Calendar from './components/Calendar';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
        calendarWidth:window.innerWidth,
        calendarHeight:window.innerHeight
    }
  }

  componentDidMount(){
      window.addEventListener('resize', ()=>{
          this.setState({
            calendarWidth:window.innerWidth,
            calendarHeight:window.innerHeight
          })
      })
  }

  componentWillUnmount(){
    window.removeEventListener('resize')
  }

  render() {
    return (
      <div className="App">
        <MuiThemeProvider>
          <Calendar
            // monthNames={["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]}
            // dayNames={["일", "월", "화", "수", "목", "금", "토"]}
            // daySectionWidth={40}

            // isVertical={true}

            // isEditable={false}

            calendarWidth={this.state.calendarWidth}
            calendarHeight={this.state.calendarHeight}

            // dayNamesHeight={30}
            // taskHeight={14}

            // dayNamesBackgroundColor={"gray"}
            // primaryColor={"#ff8d00"}
            // defaultTaskColor={"#ddd"}

            // clickTask={()=>{}}
          />
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
