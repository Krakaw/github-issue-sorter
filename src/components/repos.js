import React, {Component} from 'react';
import PropTypes from "prop-types";
import Grid from '@material-ui/core/Grid';
import {withStyles} from "@material-ui/core";
import MomentUtils from '@date-io/moment';
import {
    MuiPickersUtilsProvider,
    DateTimePicker
} from '@material-ui/pickers';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
    grid: {
        width: '60%',
    },
});

class Repos extends Component {

    state = {
        selectedDate: moment().startOf('day'),
        username: localStorage.getItem('username') || '',
        password: localStorage.getItem('password') || ''
    };

    componentDidMount() {
        const {since} = this.props;
        this.setState({since})
    }

    handleDateChange(selectedDate) {
        const {onDateChange} = this.props;
        this.setState({selectedDate});
        onDateChange(selectedDate);
    }

    render() {
        const {classes} = this.props;
        const {selectedDate, username, password} = this.state;




        return (
            <React.Fragment>
                <Grid container className={classes.grid} justify="space-around">
            <MuiPickersUtilsProvider utils={MomentUtils}>

                    <DateTimePicker
                        value={selectedDate}
                        onChange={this.handleDateChange.bind(this)}
                        label="Starting From"
                        ampm={false}
                        />

            </MuiPickersUtilsProvider>
                <TextField type="text" value={username} label="Github Username" onChange={(e) => {

                    let username = e.target.value.trim();
                    localStorage.setItem("username", username);
                    this.setState({username});
                }}/>
                <TextField type="password" value={password} label="Github Password" onChange={(e) => {

                    let password = e.target.value.trim();
                    localStorage.setItem("password", password);
                    this.setState({password});
                }}/>
                </Grid>
            </React.Fragment>
        );
    }
}
Repos.propTypes = {
    since: PropTypes.object.isRequired,
    onDateChange: PropTypes.func.isRequired
};
export default withStyles(styles)(Repos);
