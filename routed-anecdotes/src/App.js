import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
  useHistory,
  Redirect
} from "react-router-dom";
import { useField } from "./hooks";
// import { Table, Form, Button, Alert, Navbar, Nav } from "react-bootstrap";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TextField,
  Button,
  AppBar,
  Toolbar
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const Menu = () => {
  const padding = {
    paddingRight: 5
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          Anecdotes
        </Button>
        <Button color="inherit" component={Link} to="/create">
          Create New
        </Button>
        <Button color="inherit" component={Link} to="/about">
          About
        </Button>
      </Toolbar>
    </AppBar>
  );
};

const Anecdote = ({ anecdotes }) => {
  const id = useParams().id;
  console.log(typeof id, "ID");
  const anecdote = anecdotes.find((n) => Number(n.id) === Number(id));
  console.log(anecdote, " this work?");
  return (
    <div>
      <h2>{anecdote.content}</h2>
      <h3>{`Has ${anecdote.votes} votes`}</h3>
    </div>
  );
};

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {anecdotes.map((anecdote) => (
            <TableRow key={anecdote.id}>
              <TableCell>
                <Link to={`/notes/${anecdote.id}`}>{anecdote.content}</Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
);

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>
      An anecdote is a brief, revealing account of an individual person or an
      incident. Occasionally humorous, anecdotes differ from jokes because their
      primary purpose is not simply to provoke laughter but to reveal a truth
      more general than the brief tale itself, such as to characterize a person
      by delineating a specific quirk or trait, to communicate an abstract idea
      about a person, place, or thing through the concrete details of a short
      narrative. An anecdote is "a story with a point."
    </em>

    <p>
      Software engineering is full of excellent anecdotes, at this app you can
      find the best and add more.
    </p>
  </div>
);

const Footer = () => (
  <div>
    Anecdote app for{" "}
    <a href="https://courses.helsinki.fi/fi/tkt21009">
      Full Stack -websovelluskehitys
    </a>
    . See{" "}
    <a href="https://github.com/fullstack-hy/routed-anecdotes/blob/master/src/App.js">
      https://github.com/fullstack-hy2019/routed-anecdotes/blob/master/src/App.js
    </a>{" "}
    for the source code.
  </div>
);

const Notification = ({ anecdote }) => {
  return (
    <div>
      {/* <div>{`A new anecdote ${anecdote.content} has been created`}</div> */}
      <div>{<Alert variant="success">{anecdote.content}</Alert>}</div>
    </div>
  );
};

const CreateNew = (props) => {
  const content = useField("text");
  const author = useField("text");
  const info = useField("text");

  const handleSubmit = (e) => {
    e.preventDefault();
    props.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    });
  };

  const handleReset = (e) => {
    // e.preventDefault();
    content.onReset();
    author.onReset();
    info.onReset();
  };

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <TextField label="content" {...content} />
        </div>
        <div>
          <TextField label="author" {...author} />
        </div>
        <div>
          <TextField label="url for more info" {...info} />
        </div>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          onClick={handleSubmit}
        >
          create
        </Button>
      </form>
      <Button
        variant="contained"
        color="primary"
        type="submit"
        onClick={handleReset}
      >
        reset
      </Button>
    </div>
  );
};

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: "If it hurts, do it more often",
      author: "Jez Humble",
      info: "https://martinfowler.com/bliki/FrequencyReducesDifficulty.html",
      votes: 0,
      id: "1"
    },
    {
      content: "Premature optimization is the root of all evil",
      author: "Donald Knuth",
      info: "http://wiki.c2.com/?PrematureOptimization",
      votes: 0,
      id: "2"
    }
  ]);
  const [notification, setNotification] = useState("");

  const handleNotification = (erase) => {
    setTimeout(() => {
      setNotification(erase);
    }, 10000);
  };

  const addNew = (anecdote) => {
    anecdote.id = (Math.random() * 10000).toFixed(0);
    setAnecdotes(anecdotes.concat(anecdote));
    setNotification(anecdote);
    handleNotification("");
  };

  const anecdoteById = (id) => anecdotes.find((a) => a.id === id);

  const vote = (id) => {
    const anecdote = anecdoteById(id);

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    };

    setAnecdotes(anecdotes.map((a) => (a.id === id ? voted : a)));
  };
  return (
    <Container>
      <h1>Software anecdotes</h1>
      <Router>
        <Menu />
        <Switch>
          <Route path="/notes/:id">
            <Anecdote anecdotes={anecdotes} />
          </Route>
          <Route path="/create">
            {!notification ? (
              <CreateNew addNew={addNew} />
            ) : (
              <Redirect to="/" />
            )}
          </Route>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/">
            {notification && <Notification anecdote={notification} />}
            <AnecdoteList anecdotes={anecdotes} />
          </Route>
        </Switch>
      </Router>
      <Footer />
    </Container>
  );
};

export default App;
