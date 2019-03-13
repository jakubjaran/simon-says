import React, { Component } from 'react';

import styles from './App.module.css';

import Modal from '../components/Modal/Modal';

class App extends Component {
  state = {
    gameSteps: [],
    userSteps: [],
    userMove: -1,
    canClick: false,
    level: 0,
    gameOver: false,
    highest: 0
  };

  componentWillMount = () => {
    const lvl = localStorage.getItem('hilvl');
    if (lvl !== null) {
      this.setState({highest: lvl});
    };
  };

  generateNextStep = () => {
    this.setState({canClick: false});
    const nextStep = Math.ceil(Math.random() * 4);
    const gameSteps = [...this.state.gameSteps];
    gameSteps.push(nextStep);
    this.setState({gameSteps: gameSteps});
    this.showMoves();
  };

  handleUserMove = (event) => {
    if (this.state.canClick) {
      const audio = new Audio(require('../assets/sounds/' + event.target.id + '.mp3'));
      audio.play();
      const userSteps = [...this.state.userSteps];
      let userMove = this.state.userMove;
      userSteps.push(Number(event.target.id));
      userMove += 1;
      this.setState({
        userSteps: userSteps,
        userMove: userMove,
        canClick: false
      });
      setTimeout(() => this.checkCorrect(), 200);
    };
  };

  checkCorrect = () => {
    if (this.state.userSteps[this.state.userMove] === this.state.gameSteps[this.state.userMove]) {
      this.setState({canClick: true});
      if (this.state.userSteps.length === this.state.gameSteps.length) {
        this.nextRound();
      }
    } else {
      this.setState({gameOver: true});
      if (this.state.level > this.state.highest) {
        const lvl = this.state.level
        this.setState({highest: lvl});
        localStorage.setItem('hilvl', lvl);
      };
    };
  };

  shwoMove = (id) => {
    const audio = new Audio(require('../assets/sounds/' + id + '.mp3'));
    audio.play();
    document.getElementById(id).classList.add(styles.active);
    setTimeout(() => {
      document.getElementById(id).classList.remove(styles.active);
    }, 500);
  };

  showMoves = () => {
    let i = 0;
    let moves = setInterval(() => {
      this.setState({canClick: false});
      this.shwoMove(this.state.gameSteps[i]);
      i++;
      if (i >= this.state.gameSteps.length) {
        clearInterval(moves);
        this.setState({canClick: true});
      }
    }, 600)
  }

  nextRound = () => {
    this.generateNextStep();
    this.setState(prevState => {
      return {
        userMove: -1,
        userSteps: [],
        level: prevState.level + 1
      }});
  };

  restartGame = () => {
    this.setState({
      userMove: -1,
      userSteps: [],
      gameSteps: [],
      canClick: false,
      level: 0,
      gameOver: false
    });
  };

  render() {
    return (
      <div className={styles.App}>
        { this.state.gameOver &&
          <Modal level={this.state.level} click={this.restartGame}/> }
        <h1>Simon Says</h1>
        { this.state.level === 0 ?
          <p>Click play to start the game!</p> :
          <p>Current level: <strong>{this.state.level}</strong></p> }
        <div className={styles.Game}>
          <div>
            <button id="1"
              className={styles.st}
              disabled={!this.state.canClick}
              onClick={this.handleUserMove}>
            </button>
            <button id="2"
              className={styles.nd}
              disabled={!this.state.canClick}
              onClick={this.handleUserMove}>
            </button>
          </div>
          <div>
            <button id="3"
              className={styles.rd}
              disabled={!this.state.canClick}
              onClick={this.handleUserMove}>
            </button>
            <button id="4"
              className={styles.th}
              disabled={!this.state.canClick}
              onClick={this.handleUserMove}>
            </button>
          </div>
        </div>
        <p>Highest level: <strong>{this.state.highest}</strong></p>
        <button
          className={styles.playBtn}
          onClick={this.state.level === 0 ? this.nextRound : this.restartGame}
          disabled={this.state.level === 0 ? false : !this.state.canClick}>
          {this.state.level === 0 ? 'start' : 'restart'}
        </button>
        <p className={styles.signature}>jakubjaran 2019</p>
      </div>
    );
  };
};

export default App;
