import { useState } from "react"
import confetti from "canvas-confetti";

//Componentes
import { Square } from "./assets/componentes/Square";
//Constantes
import { Winner_combos, turnos } from "./assets/componentes/constantes";



function App() {
  //Estados
  const [tablero, setTablero] = useState(()=>{
    const tableroFromStorage = window.localStorage.getItem('tablero')
    if (tableroFromStorage) return JSON.parse(tableroFromStorage)
      return Array(9).fill(null)
  })

  const [turno, setTurno] = useState(() => {
    const turnoFromStorage = window.localStorage.getItem('turnos')
    return turnoFromStorage ?? turnos.x 
  })
  //ganador, null no hay ganador, false empate 
  const [winner, setWinner] = useState(null)
  
  //Nombre del jugador
  const nameWinner =(winner) =>{

    if(winner === turnos.x){
      return 'Taino'
    }
    else if(winner === turnos.o){
      return 'Caribe'
    }
    else{
      return 'Empate'
    }
  }
  const checkWinner = (newTablero) => {
    for (const combo of Winner_combos) {
      const [a, b, c] = combo
      if(
        newTablero[a] && 
        newTablero[a] === newTablero[b] && 
        newTablero[a] === newTablero[c]
      ){
        return newTablero[a]
      }
    }
    return null
  }

  const resetearGame = () => {
    setTablero(Array(9).fill(null))
    setTurno(turnos.x)
    setWinner(null)

    window.localStorage.removeItem('tablero')
    window.localStorage.removeItem('turnos')    
  }

  const checkEndGame = (newTablero) => {
    //Revisar si hay algun null
    return newTablero.every(square => square !== null)
  }
  const updateBoard = (index) => {
    //No actualizar si ya hay algo
    if(tablero[index] || winner) return

    //Actualizar el tablero
    const newTablero = [...tablero]
    newTablero[index] = turno
    setTablero(newTablero)

    const newTurno = turno === turnos.x ? turnos.o : turnos.x
    setTurno(newTurno)
    //guardae partida
    window.localStorage.setItem('tablero', JSON.stringify(newTablero))
    window.localStorage.setItem('turno', JSON.stringify(newTurno))
    //Revisar si hay ganador
    const newWinner = checkWinner(newTablero)
    if(newWinner){
      setWinner(newWinner) //actualiza el estado
      confetti()
    }
    else if(checkEndGame(newTablero)){
      setWinner(false) //empate
    }
  }

  //Programa en si
  return(
  <main className="tablero">
    <h1>Juego Tic tac toe</h1>
     <button className="btnreiniciar" onClick={resetearGame}>Reiniciar</button>
    <section className="game">
      {
        tablero.map((_, index) => {
         return (
          <Square 
            key={index} 
            index={index} 
            updateBoard={updateBoard} 
          >
            {tablero[index]}
          </Square>
          )
        })
      }
    </section>
    <section className="turnos">
      <Square isSelected={turno === turnos.x}> {turnos.x}</Square>
      <Square isSelected={turno === turnos.o}>{turnos.o}</Square>
    </section>

      {
        winner !== null && (
          <section className="winner">
              <div className="text">
                <h2>
                  {
                    winner === false
                    ? 'Empate'
                    : 'Ha ganado el jugador:'
                  }
                </h2>
                <header className="win">
                  { winner && <Square>{nameWinner(winner)}</Square> }
                </header>

                <footer>
                  <button className="btnempezar" onClick={resetearGame}>Empezar de nuevo</button>
                </footer>
              </div>
          </section>
        )
      }

          
  
    </main>
  )
}

export default App
