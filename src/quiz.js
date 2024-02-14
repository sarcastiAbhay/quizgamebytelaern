import React, { useState, useRef ,useEffect} from 'react'
import "./quiz.css"


const Quizgame = () => {
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(false);
  const dragging = useRef(null);
  const swap = useRef(false)
  const [options, setOptions] = useState([]);
  const [inputState, setInputState] = useState({});


  useEffect(() => {
    generateRandomNumbers();
  }, []);
  
  const generateRandomNumbers = () => {
    const randomNumbers = Array.from({ length: 5 }, () => Math.floor(Math.random() * 100));
    setOptions(randomNumbers);
 
  };
  const onDragStart = (e, value, isSwap) => {
    dragging.current = value;
    swap.current = isSwap
  }
  const onDrop = (e, destination) => {
    if (dragging.current !== null && destination !== undefined) {
      if (typeof destination === "number") {
        if (swap.current) {
          setInputState(old => ({
            ...old,
            [destination]: old[dragging.current],
            [dragging.current]: old[destination]
          }))
        } else {
          setInputState(old => ({
            ...old,
            [destination]: dragging.current
          }))
        }
      } else {

        setInputState(old => ({

          ...old,
          [dragging.current]: undefined
        }))
      }
    }
  }

  const handleOnReset = () => {
    setInputState({});
    generateRandomNumbers();
    setShowResult(false);
    setResult(false);
  }

  const checkResult = () => {
    const answer = options.map((v, i) => inputState[i])
    let sorted = true;
    for (let i = 0; i < answer.length - 1; i++) {
      if (answer[i] > answer[i + 1]) {
        sorted = false;
        break;
      }
    }

    setShowResult(true);
    setResult(sorted);
  }

  const onDragEnd = () => {
    dragging.current = null;
    swap.current = false;
  }

  const onDragOver = (e) => {
    e.preventDefault()
  }

  const inputStateArr = Object.values(inputState)

  const enableCheckBtn = !options.map((v, i) => inputState[i]).includes(undefined);

  return (
    <div className='homeContainer'>
      <h1>Arrange the Numbers in Accending Order</h1>
      {
        showResult ?
          <div className='resultContainer'>
            <div className='resultHeading'>{result ? <>Correct Answer </> : <>X Wrong Answer X</>}</div>
            <button onClick={handleOnReset} className={result ? "correctBtn" : "resetBtn"}>RESET</button>
          </div>
          :
          <>
            <div className="dropContainer">
              {options.map((item, index) => (
                <div key={index}
                  draggable={inputState[index] !== undefined}
                  onDragStart={e => onDragStart(e, index, true)}
                  onDrop={e => onDrop(e, index)}
                  onDragOver={onDragOver}
                  className={inputState[index] ? "hideBorder" : "value"}
                >
                  <div className={inputState[index] ? "Dot" : "hideDot"}>
                    <div className='dot'></div>
                    <div className='dot'></div>
                    <div className='dot'></div>
                    <div className='dot'></div>
                    <div className='dot'></div>
                    <div className='dot'></div>
                  </div>
                  <>{inputState[index] || "Drop"}</>
                </div>
              ))}
            </div>
            <div className="values" onDrop={e => onDrop(e, "bucket")} onDragOver={onDragOver}>
              {options.filter(item => !inputStateArr.includes(item)).map((item, index) => (
                <div key={index}
                  className={index === -1 ? "dragStarting" : "options"}
                  draggable
                  onDragEnd={onDragEnd}
                  onDragStart={e => onDragStart(e, item)}
                >
                  <div className='Dot'>
                    <div className='dot'></div>
                    <div className='dot'></div>
                    <div className='dot'></div>
                    <div className='dot'></div>
                    <div className='dot'></div>
                    <div className='dot'></div>
                  </div>
                  <>{item}</>
                </div>
              ))}
            </div>
            <button className="button" onClick={checkResult} disabled={enableCheckBtn ? false : true}>Check Answer</button>
          </>
      }
    </div >
  )
}

export default Quizgame;