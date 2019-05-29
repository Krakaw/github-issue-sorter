import React, {Component} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import './App.css';
import Repos from './components/repos';
import Repo from './components/repo';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import moment from "moment";

class App extends Component {
    state= {
        since: moment().startOf('day'),
        repos: [
            'big-neon/bigneon',
            'big-neon/bn-api',
            'big-neon/bn-web',
            'big-neon/bn-ios',
            'big-neon/bn-android-doorperson',
            'big-neon/bn-mobile-react',
        ]
    };

    onDateChange(since) {
        this.setState({since});
    }
    render() {
        const {since, repos} = this.state;
        return (
            <React.Fragment>
                <CssBaseline/>
                <Container maxWidth="xl">
                    <Repos since={since} onDateChange={this.onDateChange.bind(this)}></Repos>
                    <Grid container spacing={1} style={{display: 'flex'}}>
                        {repos.map(repo => (<Repo since={since} key={repo} repo={repo}></Repo>))}
                    </Grid>
                </Container>
            </React.Fragment>
        );
    }

}

export default App;
