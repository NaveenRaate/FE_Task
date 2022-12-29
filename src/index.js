import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import { Link as RouterLink } from "react-router-dom";
import { Route, BrowserRouter as Router } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";

function Home() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((resp) => resp.json())
      .then((resp) => {
        setUsers(resp);
      })
      .catch((err) => console(err));
  }, []);

  const handelUserSelect = (id) => {
    sessionStorage.setItem("userId", id);
  };

  return (
    <>
      {" "}
      <div>
        <h1> Users List </h1>{" "}
        <div>
          <Box>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              {users.map((user) => (
                <Grid
                  style={{
                    padding: "5px"
                  }}
                  item
                  xs={6}
                >
                  <RouterLink
                    style={{
                      textDecoration: "none"
                    }}
                    to="/Album"
                  >
                    <Button
                      variant="contained"
                      onClick={() => handelUserSelect(user.id)}
                    >
                      {user.name}
                    </Button>
                  </RouterLink>
                </Grid>
              ))}
            </Grid>
          </Box>
        </div>
      </div>
    </>
  );
}

function UserAlbum() {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/albums")
      .then((resp) => resp.json())
      .then((resp) => {
        const albumsList = resp.filter(
          (photo) =>
            photo.userId === JSON.parse(sessionStorage.getItem("userId"))
        );
        setAlbums(albumsList);
      })
      .catch((err) => console(err));
  }, []);

  const handelUserAlbumSelect = (id) => {
    sessionStorage.setItem("albumId", id);
  };
  return (
    <>
      <div>
        <h1> Albums </h1>
        <div>
          <Box>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              {albums.map((album) => (
                <Grid
                  style={{
                    padding: "5px"
                  }}
                  item
                  xs={6}
                >
                  <RouterLink
                    style={{
                      textDecoration: "none"
                    }}
                    to="/Album/Photos"
                  >
                    <Button
                      variant="contained"
                      onClick={() => handelUserAlbumSelect(album.id)}
                    >
                      {album.title}
                    </Button>
                  </RouterLink>
                </Grid>
              ))}
            </Grid>
          </Box>
        </div>
        <br />
        <RouterLink to="/">Go Home</RouterLink>
      </div>
    </>
  );
}

function UserPhotos() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/photos")
      .then((resp) => resp.json())
      .then((resp) => {
        const photoList = resp.filter(
          (photo) =>
            photo.albumId === JSON.parse(sessionStorage.getItem("albumId"))
        );
        setPhotos(photoList);
      })
      .catch((err) => console(err));
  }, []);

  return (
    <>
      <div>
        <h1> Photos </h1>
        <div>
          <Box>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              {photos.map((photo) => (
                <Grid item xs={6}>
                  <div>
                    <img alt={photo.title} src={photo.url} />
                  </div>
                </Grid>
              ))}
            </Grid>
          </Box>
        </div>
      </div>
    </>
  );
}

function SimpleBreadcrumbs() {
  return (
    <Route>
      {({ location }) => {
        const pathnames = location.pathname.split("/").filter((x) => x);
        return (
          <Breadcrumbs aria-label="Breadcrumb">
            <RouterLink color="inherit" to="/">
              Home
            </RouterLink>
            {pathnames.map((value, index) => {
              const last = index === pathnames.length - 1;
              const to = `/${pathnames.slice(0, index + 1).join("/")}`;

              return last ? (
                <Typography color="textPrimary" key={to}>
                  {value}
                </Typography>
              ) : (
                <RouterLink color="inherit" to={to} key={to}>
                  {value}
                </RouterLink>
              );
            })}
          </Breadcrumbs>
        );
      }}
    </Route>
  );
}

export default function App() {
  return (
    <div>
      <Router>
        <SimpleBreadcrumbs aria-label="breadcrumb" />

        <Route path="/" exact component={Home} />
        <Route path="/Album" exact component={UserAlbum} />
        <Route path="/Album/Photos" exact component={UserPhotos} />
      </Router>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
