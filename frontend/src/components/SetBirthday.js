/*8.11: Kirjailijan syntymävuosi
Tee sovellukseen mahdollisuus asettaa kirjailijalle syntymävuosi.
Voit tehdä syntymävuoden asettamista varten oman näkymän tai sijoittaa sen kirjailijat näyttävälle sivulle
*/
import React, { useState } from 'react'

const SerBirthday = (props) => {
  const [name, setName] = useState('')
  const [born, setBornTo] = useState('')
 

  if (!props.show) {
    return null
  }

  const submit = async (e) => {
    e.preventDefault()

    await props.addBook({
        variables: { name, born }
      })
  
      props.setPage( 'authors' )

    console.log('change born date ...', props)

    setName('')
    setBornTo('')
   
  }


  return (
    <div>
      <h2>Set birthday</h2>
      <form onSubmit={submit}>
        <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBornTo(target.value)}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default SerBirthday