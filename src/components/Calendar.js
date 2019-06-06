import React , { Component, PropTypes }  from 'react';
import ReactDOM from 'react-dom';

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';

import AddIcon from 'material-ui/svg-icons/content/add-circle';
import RemoveIcon from 'material-ui/svg-icons/content/remove-circle';
import DoneIcon from 'material-ui/svg-icons/action/done';
import AllDoneIcon from 'material-ui/svg-icons/action/done-all';
import TriangleIcon from 'material-ui/svg-icons/action/change-history';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import SwapIcon from 'material-ui/svg-icons/action/swap-horiz';
import ArrowLeftIcon from 'material-ui/svg-icons/navigation/chevron-left';
import ArrowRightIcon from 'material-ui/svg-icons/navigation/chevron-right';

import DoneCircleIcon from 'material-ui/svg-icons/action/check-circle';
import MoreIcon from 'material-ui/svg-icons/navigation/more-horiz';

import moment from 'moment';

import _ from 'underscore'

class Calendar extends Component{
    constructor(props) {
        super(props);

        this.state = {
            isLoading:false,
            date:this.props.date,
            // tasks:this.props.tasks,
            isVertical:this.props.isVertical
        }

        this.clickDay = this.clickDay.bind(this)
        this.backEventHandler = this.backEventHandler.bind(this)
    }

    componentDidMount(){
        // console.log(moment().format("YYYY-MM-DD"))
        window.addEventListener('popstate', this.backEventHandler, false)     
    }

    componentWillUnmount(){
        window.removeEventListener('popstate', this.backEventHandler)
    }

    clickDay(clickedDay){
        this.setState({
            isVertical:!this.state.isVertical
        },()=>{
            // setTimeout(()=>{},1000)
            window.scrollTo(0,100)
        })
    }

    backEventHandler(){
        if(this.state.isVertical){
            this.setState({
                isVertical:false
            })
        }else{
            window.history.back();
        }

        window.history.pushState(null, null, window.location.pathname);
    }

    // componentWillUpdate(nextProps, nextState){
    //     if(this.state.tasks.length===nextProps.tasks.length){
    //         let det = false

    //         nextProps.tasks.forEach((task, key)=>{
    //             if(!_.isEqual(task, this.state.tasks[key])){
    //                 det = true
    //             }
    //         })

    //         if(det){
    //             this.setState({
    //                 tasks:nextProps.tasks
    //             })
    //         }
    //     }

    //     if(this.state.date!==nextProps.date||this.state.tasks.length!==nextProps.tasks.length){
    //         this.setState({
    //             date:nextProps.date,
    //             tasks:nextProps.tasks
    //         })
    //     }
    // }

    render(){
        let calendar = ()=>{
            let dateNow = new Date(this.props.date);
            let year = dateNow.getFullYear();
            let month = dateNow.getMonth();
            let day = dateNow.getDate();

            let FebNumberOfDays = 28;
            //Determing if February (28,or 29)  
            if ( (year%100!==0) && (year%4===0) || (year%400===0)){
                FebNumberOfDays = 29;
            }

            let dayPerMonth = [31, FebNumberOfDays, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            let numOfDays = dayPerMonth[month];

            let prevMonth = month - 1;
            if(prevMonth<0){
                prevMonth=11
            }
            let nextMonth = month + 1;
            if(nextMonth>11){
                nextMonth=0
            }
            let result = []
            let rowCount = 1;
            let dayCount = 1;
            let nextDayCount = 1;

            while(rowCount<7){
                let row = []
                let firstDay = new Date(year, month, 1).getDay();
                
                let colCount = 1;

                // 전 월의 날짜들
                if(rowCount===1){
                    while(colCount<firstDay+1){
                        let strYear = String(year)
                        let strMonth = String(month)
                        if(strMonth.length===1){strMonth = "0"+strMonth}
                        let strDay = String(dayPerMonth[prevMonth]-(firstDay-colCount))
                        if(strDay.length===1){strDay = "0"+strDay}

                        if(month===0){
                            strYear = String(parseInt(strYear) - 1)
                            strMonth = "12"
                        }

                        row.push({
                            date:strYear+"-"+strMonth+"-"+strDay,
                            dayNumber:dayPerMonth[prevMonth]-(firstDay-colCount),
                            dayNumberType:0
                        })
                        colCount++;
                    }
                }

                // 나머지 날짜들
                for(let i=0; i<8-colCount; i++){
                    // 이번 달 날짜들
                    if(dayCount<numOfDays+1){
                        let strYear = String(year)
                        let strMonth = String(month+1)
                        if(strMonth.length===1){strMonth = "0"+strMonth}
                        let strDay = String(dayCount)
                        if(strDay.length===1){strDay = "0"+strDay}
                        row.push({
                            date:strYear+"-"+strMonth+"-"+strDay,
                            dayNumber:dayCount,
                            dayNumberType:1
                        })
                        dayCount++;

                    // 다음 월의 날짜들
                    }else{
                        let strYear = String(year)
                        let strMonth = String(month+2)
                        if(strMonth.length===1){strMonth = "0"+strMonth}
                        let strDay = String(nextDayCount)
                        if(strDay.length===1){strDay = "0"+strDay}

                        if(month===11){
                            strYear = String(parseInt(strYear) + 1)
                            strMonth = "01"
                        }

                        row.push({
                            date:strYear+"-"+strMonth+"-"+strDay,
                            dayNumber:nextDayCount,
                            dayNumberType:2
                        })
                        nextDayCount++;
                    }
                }

                result.push(row)
                rowCount++;
            }

            let tdWidth = this.props.calendarWidth/7
            let tdHeight = Math.floor((this.props.calendarHeight-this.props.dayNamesHeight)/6)

            return (
                <div style={{height:this.props.calendarHeight, overflow:"hidden"}}>
                    <div 
                        className='calendar'
                        style={{
                            display:"flex", flexDirection:"column", 
                            width:this.props.calendarWidth, height:this.props.calendarHeight, 
                            transition:"all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms",
                            transform:this.state.isVertical?`translateY(0)`:`translateY(${window.innerHeight}px)`,
                            overflow:"hidden auto", fontSize:12, userSelect:"none", backgroundColor:"white"}}>
                        {
                            result.map((week,weekKey)=>{
                                return week.map((day, dayKey)=>{
                                    let dayName = this.props.dayNames[new Date(day.date).getDay()]
                                    return (
                                        <div key={`${weekKey}-${dayKey}`} style={{display:"flex", boxSizing:"border-box", padding:"10px 0", borderBottom:`1px solid #e1e1e1`}}>
                                            <div style={{display:"inline-flex", width:this.props.daySectionWidth, flexDirection:"column", alignItems:"center"}}>
                                                <div style={{marginBottom:2}}>
                                                    {dayName}
                                                </div>
                                                <div 
                                                    style={{
                                                        display:"inline-flex",
                                                        justifyContent:"center",
                                                        alignItems:"center",
                                                        color:day.dayNumberType!==1?"#ccc":day.date===moment().format("YYYY-MM-DD")?"white":"black",
                                                        backgroundColor:day.dayNumberType===1&&day.date===moment().format("YYYY-MM-DD")?this.props.primaryColor:"transparent",
                                                        width:24, height:24, 
                                                        borderRadius:"50%",
                                                    }}>
                                                    <span style={{fontSize:18, lineHeight:1, marginTop:-1}}>{day.dayNumber}</span>
                                                </div>
                                            </div>
                                            <div style={{display:"inline-flex", width:this.props.calendarWidth-this.props.daySectionWidth, flexDirection:"column", paddingRight:10, boxSizing:"border-box"}}>
                                                {
                                                    // tasks.map((task, taskKey)=>{
                                                    //     if(task.date===day.date){
                                                    //         return (
                                                    //             <div 
                                                    //                 onClick={()=>{this.props.clickTask(task)}}
                                                    //                 key={taskKey}
                                                    //                 style={{
                                                    //                     display:"inline-flex",
                                                    //                     alignItems:"center",
                                                    //                     padding:4,
                                                    //                     backgroundColor:task.color?task.color:this.props.defaultTaskColor,
                                                    //                     // height:this.props.taskHeight*1.4, 
                                                    //                     marginBottom:1,
                                                    //                     fontSize:12,
                                                    //                     borderRadius:4,
                                                    //                     }}>
                                                    //                 {
                                                    //                     <div style={{width:18, height:14}}>
                                                    //                         <DoneIcon color={"green"} style={{width:14, height:14, marginRight:4, /*borderRadius:"50%", border:"1px solid green",backgroundColor:"transparent", */boxSizing:"border-box"}}/>
                                                    //                     </div>
                                                    //                 }
                                                    //                 <div style={{width:"calc(100% - 14px)", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{task.title}</div>
                                                    //             </div>
                                                    //         )
                                                    //     }else{
                                                    //         return ""
                                                    //     }
                                                    // })
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            })
                        }
                    </div>
                    <div 
                        style={{
                            transition:"all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms",
                            transform:this.state.isVertical?`translateY(${window.innerHeight}px)`:`translateY(-${window.innerHeight}px)`,
                        }}>
                        <table height={this.props.calendarHeight} style={{borderCollapse:"collapse", fontSize:12, userSelect:"none"}}> 
                        <tbody>
                            {
                                <tr style={{textAlign:"center", backgroundColor:this.props.dayNamesBackgroundColor, color:"white"}}>  
                                    {
                                        this.props.dayNames.map((day, key)=>{
                                            return (
                                                <td 
                                                    key={key}
                                                    style={{width:tdWidth, boxSizing:"border-box", height:this.props.dayNamesHeight, verticalAlign:"middle", borderRight:this.props.dayNamesBorder}}>
                                                    <div>{day}</div>
                                                </td>
                                            )
                                        })
                                    }
                                </tr>
                            }
                            {
                                result.map((week,weekKey)=>{
                                    return (
                                        <tr key={weekKey} className='weekRow'>
                                            {
                                                week.map((day, dayKey)=>{
                                                    let taskCount = -1
                                                    return (
                                                        <td 
                                                            key={dayKey}
                                                            onClick={()=>{this.clickDay(day)}}
                                                            style={{
                                                                backgroundColor:"white",
                                                                height:tdHeight,
                                                                verticalAlign:"top",
                                                                border:"1px solid #ddd",
                                                                padding:"0 4px",
                                                                boxSizing:"border-box"
                                                            }}>
                                                            <div
                                                                style={{
                                                                    display:"flex",
                                                                    flexDirection:"column", justifyContent:"space-between",
                                                                    width:"100%",height:"100%"
                                                                }}>
                                                                <div style={{display:"flex", flexDirection:"column"}}>
                                                                    <div 
                                                                        style={{display:"flex", alignItems:"center", justifyContent:this.props.isEditable?"space-between":"center", height:this.props.dayNamesHeight}}>
                                                                        {
                                                                            // this.props.dayNamesHeight*7>=this.props.calendarHeight&&
                                                                            // <DoneIcon 
                                                                            //     color={"green"} 
                                                                            //     style={{
                                                                            //         marginRight:2, borderRadius:"50%", width:20, height:20, border:"1px solid green",
                                                                            //         backgroundColor:"transparent", boxSizing:"border-box"}}/>
                                                                        }
                                                                        <div 
                                                                            style={{
                                                                                display:"inline-flex",
                                                                                justifyContent:"center",
                                                                                alignItems:"center",
                                                                                color:day.dayNumberType!==1?"#ccc":day.date===moment().format("YYYY-MM-DD")?"white":"black",
                                                                                backgroundColor:day.dayNumberType===1&&day.date===moment().format("YYYY-MM-DD")?this.props.primaryColor:"transparent",
                                                                                width:20, height:20,
                                                                                borderRadius:"50%",
                                                                            }}>
                                                                            {day.dayNumber}
                                                                        </div>
                                                                        {this.props.isEditable&&this.props.addButton}
                                                                        {
                                                                            // this.props.dayNamesHeight*7>=this.props.calendarHeight&&
                                                                            // <DoneIcon 
                                                                            //     color={"green"} 
                                                                            //     style={{
                                                                            //         position:"relative", bottom:6, marginLeft:-6,
                                                                            //         borderRadius:"50%", width:14, height:14, //border:"2px solid green",
                                                                            //         backgroundColor:"transparent", boxSizing:"border-box"}}/>
                                                                        }
                                                                    </div>
                                                                    {
                                                                        // tasks.map((task, taskKey)=>{
                                                                        //     if(task.date===day.date){
                                                                        //         taskCount++
                                                                        //         let limit = Math.floor(((tdHeight-(this.props.dayNamesHeight+this.props.taskHeight))-this.props.taskHeight) / this.props.taskHeight)

                                                                        //         if(taskCount<limit){
                                                                        //             return (
                                                                        //                 <div 
                                                                        //                     key={taskKey}
                                                                        //                     style={{
                                                                        //                         backgroundColor:task.color?task.color:this.props.defaultTaskColor,
                                                                        //                         height:this.props.taskHeight, 
                                                                        //                         fontSize:10, 
                                                                        //                         lineHeight:1, 
                                                                        //                         whiteSpace:"nowrap", 
                                                                        //                         overflow:"hidden", 
                                                                        //                         padding:2,
                                                                        //                         boxSizing:"border-box",
                                                                        //                         marginBottom:1,
                                                                        //                         borderRadius:4,
                                                                        //                         maxWidth:(tdWidth)-10, }}>
                                                                        //                     <span>{task.title}</span>
                                                                        //                 </div>
                                                                        //             )
                                                                        //         }else if(taskCount===limit){
                                                                        //             return <div style={{height:this.props.taskHeight}}><MoreIcon style={{width:this.props.taskHeight, height:this.props.taskHeight}}/></div>
                                                                        //         }
                                                                        //     }else{
                                                                        //         return ""
                                                                        //     }
                                                                        // })
                                                                    }
                                                                    {
                                                                        // this.props.dayNamesHeight*7<this.props.calendarHeight&&
                                                                        // <div style={{position:"absolute", marginLeft:-4, display:"flex", width:tdWidth-1, height:tdHeight-1, justifyContent:"center", alignItems:"center", backgroundColor:"rgba(255, 255, 255, 0.5)"}}>
                                                                        //     <DoneIcon color={"green"} style={{borderRadius:"50%", width:(tdWidth>tdHeight?tdHeight:tdWidth)*0.8, height:(tdWidth>tdHeight?tdHeight:tdWidth)*0.8, backgroundColor:"transparent", border:"3px solid green", boxSizing:"border-box"}}/>
                                                                        // </div>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </td>
                                                    ) 
                                                })
                                            }
                                        </tr>
                                    )  
                                })
                            }
                        </tbody>
                        </table>
                    </div>
                </div>
            )
        }

        return (
            <div>
                <div>
                    {this.state.date&&calendar()}
                </div>
                <div 
                    onClick={this.backEventHandler}
                    style={{
                        position:"fixed", right:10, bottom:10, 
                        display:"flex", justifyContent:"center", alignItems:"center",
                        width:48, height:48,
                        transition:"all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms",
                        transform:this.state.isVertical?`translateY(0)`:`translateY(200px)`,
                        borderRadius:"50%",
                        backgroundColor:this.props.primaryColor,
                        boxShadow:"rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px"
                    }}>
                    <ArrowLeftIcon color="white" style={{width:30, height:30, transform:`rotate(-90deg)`}}/>
                </div>
            </div>
        );
    }
}

Calendar.propTypes={
}

Calendar.defaultProps={
    // names of months and week days.
    monthNames:["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    dayNames:["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],

    // default date.
    date:new Date(),

    // vertical layout.
    isVertical:false,

    // editable
    isEditable:true,

    daySectionWidth:40,

    calendarWidth:window.innerWidth,
    calendarHeight:window.innerHeight,

    dayNamesHeight:30,
    taskHeight:14,

    dayNamesBorder:"1px solid cornflowerblue",
    calendarBorder:"1px solid rgb(221, 221, 221)",

    dayNamesBackgroundColor:"cornflowerblue",
    primaryColor:"#ff8d00",
    addButton:(
        <IconButton 
            style={{width:18, height:18, padding:0}} 
            iconStyle={{width:18, height:18}}>
            <AddIcon color={"gray"}/>
        </IconButton>
    ),

    defaultTaskColor:"#ddd",

    clickTask:()=>{}
}

export default Calendar;