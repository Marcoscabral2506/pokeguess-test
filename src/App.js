import React, { useState, useEffect, useRef } from 'react';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';
import './style.css';
import 'nes.css/css/nes.min.css';
const MAX_ID = 905;

function App() {
  const [word, setWord] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [guesses, setGuesses] = useState([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);
  const [won, setWon] = useState(false);
  const [esDark, setEsDark] = useState(!true);
  const [lifes, setLifes] = useState(3);
  const [isHardMode, setIsHardMode] = useState(false);

  function handleGuess(guess) {
    if (guesses.includes(guess)) return;
    if (word.name.includes(guess)) {
      setGuesses([...guesses, guess]);
    } else {
      if (lifes - 1 == 0) {
        document.getElementById('lost-dialog').showModal();
        return;
      }
      setLifes(lifes - 1);
    }
  }

  useEffect(() => {
    if (!word.name) return;
    if (word.name.split('').every((letter) => guesses.includes(letter))) {
      setWon(true);
      setIncorrectGuesses(incorrectGuesses + 1);
      setTimeout(() => {
        reset();
        setWon(false);
      }, 2700);
    }
  }, [guesses]);

  async function llamarApi() {
    let randomId = Math.floor(Math.random() * MAX_ID + 1);
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const res = await data.json();

    var obj = {
      img: res.sprites,
      name: res.name,
      id: randomId,
    };
    setWord(obj);
    setIsLoading(false);
  }
  useEffect(() => {
    llamarApi();
  }, []);
  function reset() {
    setIsLoading(true);
    setLifes(isHardMode ? 1 : 3);
    setWord({});
    setGuesses([]);
    llamarApi();
  }
  function reload() {
    setIsLoading(true);
    setWord({});
    setGuesses([]);
    llamarApi();
  }
  function resetGame() {
    reset();
    setIncorrectGuesses(0);
  }
  const { width, height } = useWindowSize();
  function levantarmodal() {
    document.getElementById('settings-dialog').showModal();
  }

  return (
    <>
      <button
        style={{
          position: 'absolute',
          top: '20px',
          zIndex: 11,
          left: width >= 900 ? '90%' : '81%',
        }}
        type="button"
        className="nes-btn"
        onClick={() => levantarmodal()}
      >
        <img
          width="40px"
          height="40px"
          src="https://static.thenounproject.com/png/2758641-200.png"
        />
      </button>
      <div
        className={
          esDark
            ? 'mx is-centered nes-container with-title is-dark'
            : 'is-centered nes-container with-title coso'
        }
        style={{ minHeight: '100vh' }}
      >
        <div
          style={{
            position: 'relative',
            right: '0',
            display: 'flex',
            gap: '10px',
          }}
        >
          {[...Array(lifes)].map((i, index) => {
            return (
              <i
                key={index}
                className={`nes-icon ${
                  width <= 550 ? 'is-small' : 'is-medium'
                } heart ${esDark && 'is-empty'}`}
              ></i>
            );
          })}
        </div>

        {won && <Confetti width={width} height={height} />}
        <p className="title">Pokeguess</p>
        {isLoading ? (
          <p>Cargando ...</p>
        ) : (
          <>
            <p>Aciertos: {incorrectGuesses}</p>
            <img
              src={
                !isHardMode
                  ? word.img.other['official-artwork'].front_default
                  : word.img['back_default']
              }
              style={{
                width: 200,
                pointerEvents: 'none',
                filter: won
                  ? null
                  : esDark
                  ? 'brightness(0) invert(1)'
                  : 'brightness(0)',
              }}
            />
            <p style={{ fontSize: 20, margin: 15 }}>
              {word.name
                .split('')
                .map((letter) =>
                  guesses.includes(letter) ? ' ' + letter + ' ' : ' _ '
                )}
            </p>
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0px 1% 0px 0px',
              }}
            >
              <p className="buttons">
                {'qwertyuiop'.split('').map((letter, index) => (
                  <button
                    key={index}
                    className={
                      guesses.includes(letter)
                        ? 'nes-btn is-disabled'
                        : 'nes-btn'
                    }
                    onClick={() => handleGuess(letter)}
                  >
                    {letter.toUpperCase()}
                  </button>
                ))}
              </p>
              <p className="buttons">
                {'asdfghjklñ'.split('').map((letter, index) => (
                  <button
                    key={index}
                    className={
                      guesses.includes(letter)
                        ? 'nes-btn is-disabled'
                        : 'nes-btn'
                    }
                    onClick={() => handleGuess(letter)}
                  >
                    {letter.toUpperCase()}
                  </button>
                ))}
              </p>
              <p className="buttons">
                {'zxcvbnm'.split('').map((letter, index) => (
                  <button
                    key={index}
                    className={
                      guesses.includes(letter)
                        ? 'nes-btn is-disabled'
                        : 'nes-btn'
                    }
                    onClick={() => handleGuess(letter)}
                  >
                    {letter.toUpperCase()}
                  </button>
                ))}
              </p>
            </div>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <button
                type="button"
                className="nes-btn"
                onClick={() => resetGame()}
              >
                <img
                  width="40px"
                  height="40px"
                  src="https://static.thenounproject.com/png/170019-200.png"
                />
              </button>
            </div>
          </>
        )}
        <section>
          <dialog className="nes-dialog" id="settings-dialog">
            <form method="dialog">
              <p className="title">Opciones</p>
              <div
                style={{
                  width: '100%',
                  background: '#212529',
                  margin: '20px 0',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 30,
                }}
              >
                <label>
                  <input
                    type="radio"
                    className="nes-radio is-dark"
                    name="mode"
                    value={isHardMode}
                    defaultChecked={isHardMode ? false : true}
                    onClick={(e) => {
                      setIsHardMode(false);
                      setLifes(3);
                      reload();
                    }}
                  />
                  <span>Modo normal</span>
                </label>

                <label>
                  <input
                    type="radio"
                    className="nes-radio is-dark"
                    name="mode"
                    value={isHardMode}
                    defaultChecked={isHardMode ? true : false}
                    onClick={(e) => {
                      setIsHardMode(true);
                      setLifes(1);
                      reload();
                    }}
                  />
                  <span>Modo difícil</span>
                </label>
              </div>
              <div
                style={{
                  width: '100%',
                  background: '#212529',
                  margin: '20px 0',
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 30,
                }}
              >
                <label>
                  <input
                    type="radio"
                    className="nes-radio is-dark"
                    name="answer-dark"
                    value={esDark}
                    defaultChecked={esDark ? false : true}
                    onClick={(e) => setEsDark(false)}
                  />
                  <span>Modo claro</span>
                </label>
                <label>
                  <input
                    type="radio"
                    className="nes-radio is-dark"
                    name="answer-dark"
                    value={esDark}
                    defaultChecked={esDark ? true : false}
                    onClick={(e) => setEsDark(true)}
                  />
                  <span>Modo Oscuro</span>
                </label>
              </div>
              <menu
                className="dialog-menu"
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <button className="nes-btn" style={{ marginRight: '40px' }}>
                  Cerrar
                </button>
              </menu>
            </form>
          </dialog>
        </section>

        <section>
          <dialog className="nes-dialog" id="lost-dialog">
            <form method="dialog">
              <p className="title">Has perdido</p>
              <menu
                className="dialog-menu"
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <button
                  className="nes-btn"
                  onClick={resetGame}
                  style={{ marginRight: '40px' }}
                >
                  Volver a jugar
                </button>
              </menu>
            </form>
          </dialog>
        </section>
      </div>
    </>
  );
}

export default App;
