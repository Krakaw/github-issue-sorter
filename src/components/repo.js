import React, {Component} from 'react';
import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import axios from 'axios';
import moment from 'moment';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardHeader from '@material-ui/core/CardHeader';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const ReactMarkdown = require('react-markdown')

const styles = theme => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
        flexDirection: 'row'
    },
    cardColumn: {
        display: 'flex',
        flexDirection: 'column'
    },
    card: {
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        paddingTop: '56.25%', // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    flex: {
        display: 'flex'
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
    padding:{
        padding: '5px'
    }
});

const Label = props => {
    return (
        <span style={{backgroundColor: `#${props.backgroundColor}`, borderRadius: '5px', padding: '2px'}}>{props.label}</span>
    )
}

class Repo extends Component {

    state = {
        issues: [],
        expand: {}
    };

    async componentDidMount() {
        await this.fetchIssues();
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.since != this.props.since) {
            await this.fetchIssues();
        }
    }

    async fetchIssues() {
        const {repo, since} = this.props;
        const sort = 'updated';
        const direction = 'desc';
        const username = localStorage.getItem('username');
        const password = localStorage.getItem('password');
        const config = {
            params: {since, sort, direction}
        };
        if (username && password) {
            const Authorization = `Basic ${btoa(username + ":" + password)}`;
            config.headers = {
                Authorization
            };
        } else {
            console.log("Attempting without auth")
        }
        let issues = await axios.get(`https://api.github.com/repos/${repo}/issues`, config);
        this.setState({issues: issues.data});
    }


    render() {
        const {classes, repo} = this.props;
        const {issues, since} = this.state;
        const {expand} = this.state;
        return (
            <Grid xs={12} sm={6} md={4} lg={3} item className={classes.cardColumn}>

                <Typography gutterBottom variant="h5">{repo}</Typography>
                {issues.map(issue => {
                    const key = repo + '#' + issue.number;
                    const title = `#${issue.number}`;
                    const updatedAt = moment(issue.updated_at).format('YYYY-MM-DD HH:mm');
                    return (
                        <Card key={key} className={classes.card}>

                            <div className={classes.padding}>
                                <Typography variant="h6" className={classes.flex}>
                                    <Link href={issue.html_url} target="_blank">{title}</Link>
                                    <span style={{flex: 1}}></span>
                                    <span>{issue.state}</span>
                                </Typography>
                                {issue.labels.map((label, index) => <Label key={index} label={label.name} backgroundColor={label.color}></Label>)}
                                <Typography variant="caption" className={classes.flex}>
                                    <span>{issue.user.login}</span>
                                    <span style={{flex: 1}}></span>
                                    <span>{updatedAt}</span>
                                </Typography>
                            </div>
                            <CardContent className={classes.cardContent} onClick={e => {
                                expand[key] = !expand[key];
                                this.setState({expand});
                            }}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {issue.title}
                                </Typography>
                                {expand[key] ?
                                    <ReactMarkdown source={issue.body}/> : issue.body.substr(0, 100)}
                            </CardContent>


                        </Card>
                    )
                })}
            </Grid>

        )
    }
}

Repo.propTypes = {
    repo: PropTypes.string.isRequired,
    since: PropTypes.object.isRequired
};
export default withStyles(styles)(Repo);
