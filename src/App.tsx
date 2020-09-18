import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import logo from './logo.svg'
import RectangleButton from './RectangleButton'
import SwSelectInput from './SwSelectInput'
import SwNumericInput from './SwNumericInput'
import './App.css'

const PeopleLocalStorageKey = 'swpeople'

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
  gender: string
  homeworld: string
  films: string[]
  species: string[]
  vehicles: string[]
  starships: string[]
  created: Date
  edited: Date
  url: string
}

type FilterableAttribute = 'hair_color' | 'skin_color' | 'eye_color' | 'birth_year' | 'gender'

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
    if (typeof attribute === 'string') {
      const personAttributeValue = person[attribute] as string
      return personAttributeValue.includes(value)
    }
    return person[attribute] === value
  })
}

const getOptionsForAttribute = (persons: Person[], attribute: FilterableAttribute): string[] => {
  const options: any = {}
  persons.forEach(person => {
    const value = person[attribute]

    // some options can be comma delimited
    const parsedOptions = value.split(', ')
    parsedOptions.forEach(parsedOption => {
      options[parsedOption] = true
    })
  })

  const sortedOptions = Object.keys(options).sort()
  sortedOptions.unshift('')
  return sortedOptions
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
    let filtered: Person[] = people

    const keys = Object.keys(formData)
    keys.forEach(key => {
      if (!formData[key]) {
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

  function handleReset() {
    setFilteredPeople([])
  }

  return (
    <div className="container mx-auto">
      <h1 className="is-size-1">Star Wars Cosplay Selector</h1>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <SwSelectInput
          label="Gender"
          name="gender"
          options={getOptionsForAttribute(people, 'gender')}
          ref={register}
        />

        <SwNumericInput label="Height (cm)" name="height" ref={register} />

        <SwNumericInput label="Mass (kg)" name="mass" ref={register} />

        <SwSelectInput
          label="Hair Color"
          name="hair_color"
          options={getOptionsForAttribute(people, 'hair_color')}
          ref={register}
        />
        <SwSelectInput
          label="Skin Color"
          name="skin_color"
          options={getOptionsForAttribute(people, 'skin_color')}
          ref={register}
        />
        <SwSelectInput
          label="Eye Color"
          name="eye_color"
          options={getOptionsForAttribute(people, 'eye_color')}
          ref={register}
        />

        <div className="mb-4">
          <button className="button mr-4 is-primary" type="submit">
            Submit
          </button>

          <button className="button is-secondary" type="reset" onClick={handleReset}>
            Reset
          </button>
        </div>
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
              <th>Name</th>
              <th>Gender</th>
              <th>Height (cm)</th>
              <th>Mass (kg)</th>
              <th>Hair Color</th>
              <th>Skin Color</th>
              <th>Eye Color</th>
              <th>Birth Year</th>
            </tr>
          </thead>
          <tbody>
            {filteredPeople.map(person => {
              return (
                <tr key={person.name}>
                  <td>{person['name']}</td>
                  <td>{person['gender']}</td>
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
