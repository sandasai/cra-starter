import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import logo from './logo.svg'
import RectangleButton from './RectangleButton'
import './App.css'

type Gender = 'Male' | 'Female' | 'Droid'

const PeopleLocalStorageKey = 'swpeople'

const attributeMapping: Record<Gender, string> = {
  Male: 'male',
  Female: 'female',
  Droid: 'n/a',
}

export interface ApiResult {
  count: number
  next: string
  previous: null
  results: Person[]
}

// https://app.quicktype.io/
export interface Person {
  name: string
  height: string
  mass: string
  hair_color: string
  skin_color: string
  eye_color: string
  birth_year: string
  gender: 'male' | 'female'
  homeworld: string
  films: string[]
  species: string[]
  vehicles: string[]
  starships: string[]
  created: Date
  edited: Date
  url: string
}

const numberTolerance = 8

const numericCompareFilter = (persons: Person[], attribute: keyof Person, value: string) => {
  return persons.filter(person => {
    const inputNumber = Number(value)
    const numberLowerThreshold = inputNumber - numberTolerance
    const numberHigherThreshold = inputNumber + numberTolerance

    const personsNumber = Number(person[attribute])
    return personsNumber >= numberLowerThreshold && personsNumber < numberHigherThreshold
  })
}

const stringCompareFilter = (persons: Person[], attribute: keyof Person, value: string) => {
  return persons.filter(person => {
    return person[attribute] === value
  })
}

function App() {
  const [people, setPeople] = useState<Person[]>([])
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([])
  const { register, errors, handleSubmit } = useForm()

  useEffect(() => {
    async function fetchPeople() {
      const localStoragePeople = localStorage.getItem(PeopleLocalStorageKey)
      if (localStoragePeople) {
        setPeople(JSON.parse(localStoragePeople))
      } else {
        let next = 'https://swapi.dev/api/people/'
        let results: Person[] = []

        while (next) {
          const response = await fetch(next, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          const apiJson: ApiResult = await response.json()

          next = apiJson.next?.replace('http', 'https')
          results = results.concat(apiJson.results)
        }

        localStorage.setItem(PeopleLocalStorageKey, JSON.stringify(results))
        setPeople(results)
      }
    }

    fetchPeople()
  }, [])

  function handleFormSubmit(formData: any, e: any) {
    e.preventDefault()
    console.log(formData)
    const inputGender: Gender = formData['gender']

    let filtered: Person[] = people

    const keys = Object.keys(formData)
    keys.forEach(key => {
      if (!formData[key]) {
        console.log('here', key)
        return
      }
      if (key === 'height' || key === 'mass') {
        filtered = numericCompareFilter(filtered, key as keyof Person, formData[key])
      } else {
        filtered = stringCompareFilter(filtered, key as keyof Person, formData[key])
      }
    })

    setFilteredPeople(filtered)
  }

  return (
    <div className="container mx-4">
      <h1 className="is-size-1">Star Wars Cosplay Selector</h1>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="field">
          <label className="label">Gender</label>
          <div className="control">
            <div className="select">
              <select name="gender" ref={register}>
                <option>male</option>
                <option>female</option>
                <option>n/a</option>
              </select>
            </div>
          </div>
        </div>

        <div className="field">
          <label className="label">Height (cm)</label>
          <div className="control">
            <input className="input" name="height" type="number" ref={register} min={0} />
          </div>
        </div>

        <div className="field">
          <label className="label">Mass (kg)</label>
          <div className="control">
            <input className="input" name="mass" type="number" ref={register} />
          </div>
        </div>

        <div className="field">
          <label className="label">hair_color</label>
          <div className="control">
            <input className="input" name="hair_color" type="string" ref={register} />
          </div>
        </div>

        <div className="field">
          <label className="label">skin_color</label>
          <div className="control">
            <input className="input" name="skin_color" type="string" ref={register} />
          </div>
        </div>

        <div className="field">
          <label className="label">eye_color</label>
          <div className="control">
            <input className="input" name="eye_color" type="string" ref={register} />
          </div>
        </div>

        <button className="button mb-4 is-primary" type="submit">
          Submit
        </button>
      </form>
      <div>
        <table
          style={{
            width: '100%',
          }}
          className="table"
        >
          <thead>
            <tr>
              <th>name</th>
              <th>height</th>
              <th>mass</th>
              <th>hair_color</th>
              <th>skin_color</th>
              <th>eye_color</th>
              <th>birth_year</th>
            </tr>
          </thead>
          <tbody>
            {filteredPeople.map(person => {
              return (
                <tr key={person.name}>
                  <td>{person['name']}</td>
                  <td>{person['height']}</td>
                  <td>{person['mass']}</td>
                  <td>{person['hair_color']}</td>
                  <td>{person['skin_color']}</td>
                  <td>{person['eye_color']}</td>
                  <td>{person['birth_year']}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
