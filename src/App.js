import React, { Component } from "react";
import moment from "moment";
import CircularProgress from "@material-ui/core/CircularProgress";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import CardMedia from "@material-ui/core/CardMedia";
import axios from "axios";
import { ReactComponent as LikeSvg } from "./image2vector.svg";

import "animate.css";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      offset: 0,
      posts: null,  // Post pool.
      limit: 5,     // N° of posts to fetch per API call.
      index: 0,     // Index of the post in the pool to render.
      lazyOffset: 2 // Threshold value before a new API call is made
    };
  }

  async fetchPosts() {
    // Requesting posts via state's API parameters.
    const { limit, offset } = this.state;

    this.setState({ classAnim: "" }, () => {
      axios({
        method: "get",
        url: `https://api.slstice.com/mock/posts?offset=${offset}&limit=${limit}&api_key=ZkUvF7GBqc0l1Ou6DSPf`,
        headers: {
          "Content-Type": "application/json"
        }
      }).then(async ({ data: { response } }) => {
        // Mapping the responses to request the /medias/ endpoint
        const postArray = await Promise.all(
          // with the propper parameters, for every retrieved post.
          response.posts.map(async post => {
            const {
              data: {
                response: { media }
              }
            } = await axios({
              method: "get",
              url: `https://api.slstice.com/mock/medias/${post.mediaId}?api_key=ZkUvF7GBqc0l1Ou6DSPf`,
              headers: {
                "Content-Type": "application/json"
              }
            });
            const {
              data: {
                response: { user }
              }
            } = await axios({
              method: "get",
              url: `https://api.slstice.com/mock/users/${media.owner.username}?api_key=ZkUvF7GBqc0l1Ou6DSPf`,
              headers: {
                "Content-Type": "application/json"
              }
            });
            media.user = user; // Saving freshly fetched media and user object into post's properties.
            post.media = media;
            return post;
          })
        );
        // Assignation of the newly fetched array of posts to the component's state.
        // If post is null, return this.setState({ posts: postArray }). Else concatenate old state with new posts.
        return this.state.posts === null
          ? this.setState({ posts: postArray })
          : this.setState({ posts: [...this.state.posts, ...postArray] });
      });
    });
  }

  // The state loader is builded as a method that will handle :
  // I   - The lazy loading of the API requests.
  // II  - The cyclcling through API fetched posts.
  // III - The resulting compoponent's state assignation.
  async stateLoader() {
    // If the post pool is empty, or if theres no more post to render, minus the lazy offset trigger.
    // Assign the correct value to the offset parameter, then fetch new posts :
    if (
      this.state.posts === null ||
      this.state.index >= this.state.posts.length - 1 - this.state.lazyOffset
    ) {
      // Thus we need to load the posts in the component's state. At this point in any cases,
      // states have been properly updated.
      return this.setState({ offset: this.state.index }, () =>
        this.fetchPosts()
      );
    }
    this.setState({
      // Trigerring the render of the new post by a setChange() of the incremented post pool index.
      index: this.state.index + 1
    });
  }

  componentDidMount() {
    this.stateLoader(); // Call upon component mounting.
    setInterval(() => {
      this.stateLoader(); // Timer regulating the call to the stateLoader() method.
    }, 6000);
  }

  render() {
    const { posts, index } = this.state;

    if (!posts)
      // Rendering a spinner while there is no post to consume.
      return (
        <div className="loaderContainer">
          <CircularProgress />
        </div>
      );

    const mediaUrl = posts[index].media.urls.regular; // Assignation of the var needed
    const avatar = posts[index].media.user.profile_images.medium || ""; // for string interpolation.
    const likeCount = posts[index].media.statistics.likes || "0";
    const personnePersonnes = likeCount < 2 ? "personne" : "personnes";
    const lastName = posts[index].media.user.last_name || "";
    const firstName = posts[index].media.user.first_name || "";
    const title = posts[index].title || "Sans Titre";
    const description = posts[index].description || "Sans déscriptions";
    const timeElapsed =
      moment(posts[index].media.statistics.created).format("D") || "";
    const jourJours = timeElapsed < 2 ? "jour" : "jours";

    return (
      <div className="App">
        <Card className={"card " + this.state.classAnim}>
          <Grid container spacing={0} direction="row">
            <Grid
              item
              lg={7}
              md={7}
              xl={7}
              xs={7}
              className="gridPicWrapper"
              style={{ overflow: "hidden" }}
            >
              <img
                style={{ width: "100%" }}
                title="lorem ipsum"
                src={mediaUrl}
                className="media"
                alt=""
              />
              <CardMedia
                style={{ width: "100%", height: "100%" }}
                title="lorem ipsum"
                image={mediaUrl}
                className="canvaPic"
              />
            </Grid>
            <Grid item lg={5} md={5} xl={5} xs={5} className="grid">
              <CardHeader
                action={
                  <div className="actionWrapper">
                    <Typography className="name">
                      {`${lastName} ${firstName}`}
                    </Typography>
                    <Avatar className="avatar" src={avatar} />
                  </div>
                }
              />
              <CardContent className="vAlign">
                <Typography variant="h4" color="textSecondary">
                  <b>{title}</b>
                </Typography>
                <Typography variant="h6" color="textSecondary" component="p">
                  {description}
                </Typography>
              </CardContent>
              <CardActions disableSpacing className="like">
                <IconButton aria-label="Like the slide">
                  <LikeSvg height="25px" width="25px" />
                </IconButton>
                <Typography>
                  {likeCount} {personnePersonnes}
                </Typography>
              </CardActions>
              <Typography className="date">
                Il y a {timeElapsed} {jourJours}
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </div>
    );
  }
}

export default App;
