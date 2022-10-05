import { render } from '@testing-library/react'
import React from 'react'
import Spinner from './Spinner'


// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.

test('renders props', () => {
  render(<Spinner on={true} />)
})
