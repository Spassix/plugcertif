'use client'

import { useState, useEffect } from 'react'
import { countriesData, getCountryDepartments } from '@/lib/countries-data'
import { CheckIcon } from '@heroicons/react/24/outline'

interface CountryDepartmentSelectorProps {
  selectedCountries: string[]
  selectedDepartments: string[]
  onCountriesChange: (countries: string[]) => void
  onDepartmentsChange: (departments: string[]) => void
  showDepartments?: boolean
}

interface CountryData {
  [key: string]: {
    name: string
    flag: string
    departments: string[]
  }
}

export default function CountryDepartmentSelector({
  selectedCountries,
  selectedDepartments,
  onCountriesChange,
  onDepartmentsChange,
  showDepartments = false
}: CountryDepartmentSelectorProps) {
  const [availableDepartments, setAvailableDepartments] = useState<string[]>([])
  const [departmentSearch, setDepartmentSearch] = useState('')

  useEffect(() => {
    if (showDepartments && selectedCountries.length > 0) {
      const departments = getCountryDepartments(selectedCountries)
      setAvailableDepartments(departments)
    } else {
      setAvailableDepartments([])
    }
  }, [selectedCountries, showDepartments])

  const toggleCountry = (countryCode: string) => {
    if (selectedCountries.includes(countryCode)) {
      onCountriesChange(selectedCountries.filter(c => c !== countryCode))
    } else {
      onCountriesChange([...selectedCountries, countryCode])
    }
  }

  const toggleDepartment = (dept: string) => {
    if (selectedDepartments.includes(dept)) {
      onDepartmentsChange(selectedDepartments.filter(d => d !== dept))
    } else {
      onDepartmentsChange([...selectedDepartments, dept])
    }
  }

  const selectAllDepartments = () => {
    onDepartmentsChange(availableDepartments)
  }

  const clearDepartments = () => {
    onDepartmentsChange([])
  }

  const filteredDepartments = departmentSearch
    ? availableDepartments.filter(dept => 
        dept.toLowerCase().includes(departmentSearch.toLowerCase())
      )
    : availableDepartments

  return (
    <div className="space-y-4">
      {/* Sélection des pays */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          Pays disponibles
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(countriesData).map(([code, country]) => (
            <button
              key={code}
              type="button"
              onClick={() => toggleCountry(code)}
              className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                selectedCountries.includes(code)
                  ? 'border-blue-500 bg-blue-500/20 text-white'
                  : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'
              }`}
            >
              <span className="text-xl">{country.flag}</span>
              <span className="text-sm font-medium">{country.name}</span>
              {selectedCountries.includes(code) && (
                <CheckIcon className="w-4 h-4 ml-auto" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Sélection des départements */}
      {showDepartments && availableDepartments.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-300">
              Départements de livraison ({selectedDepartments.length}/{availableDepartments.length})
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={selectAllDepartments}
                className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Tout sélectionner
              </button>
              <button
                type="button"
                onClick={clearDepartments}
                className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                Tout effacer
              </button>
            </div>
          </div>

          <input
            type="text"
            placeholder="Rechercher un département..."
            value={departmentSearch}
            onChange={(e) => setDepartmentSearch(e.target.value)}
            className="w-full px-4 py-2 mb-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          />

          <div className="max-h-60 overflow-y-auto bg-gray-800 border border-gray-700 rounded-lg p-2">
            {selectedCountries.map(countryCode => {
              const country = (countriesData as CountryData)[countryCode];
              if (!country) return null;
              
              const countryDepts = filteredDepartments.filter(dept => 
                country.departments.includes(dept)
              );
              
              if (countryDepts.length === 0) return null;
              
              return (
                <div key={countryCode} className="mb-4 last:mb-0">
                  <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-400 sticky top-0 bg-gray-800 py-1">
                    <span className="text-lg">{country.flag}</span>
                    <span>{country.name}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1 pl-6">
                    {countryDepts.map((dept) => (
                      <label
                        key={dept}
                        className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedDepartments.includes(dept)}
                          onChange={() => toggleDepartment(dept)}
                          className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-300">{dept}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  )
}