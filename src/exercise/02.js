// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

// Custom Hook - create reusable code. Customary to start a custom hook name with use (aka useNewHook)
// Extra Credit 3
// function useLocalStorageState(key, defaultValue = '') {
//   const [state, setState] = React.useState(() => window.localStorage.getItem(key) ?? defaultValue)

//   React.useEffect(() => {
//     window.localStorage.setItem(key, state)
//   }, [key, state])

//   return [state, setState]
// }
// Extra Credit 4 
function useLocalStorageState(key, defaultValue = '') {
  const [state, setState] = React.useState(
    () => {
      const valueInLocalStorage = window.localStorage.getItem(key)
      if (valueInLocalStorage) {
        return JSON.parse(valueInLocalStorage)
      }
      return typeof defaultValue === 'function' ? defaultValue() : defaultValue
    }
  )
  // check key if the key changes. Does not change on rerender. This shows if the key changed from the previous key
  const prevKeyRef = React.useRef(key)
  React.useEffect(() => {
    const prevKey = prevKeyRef.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyRef.current = key
    window.localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])
  return [state, setState]
}
function Greeting({ initialName = '' }) {
  const [name, setName] = useLocalStorageState('name', initialName)

  // Extra Credit 2 - Without custom hook
  /*
  const [name, setName] = React.useState(() => window.localStorage.getItem('name') ?? initialName)
  React.useEffect(() => {
    window.localStorage.setItem('name', name)
  }, [name])
  */

  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting initialName='Felicia' />
}

export default App
