import {afterEach, vi} from 'vitest'
import {cleanup} from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import 'vitest-canvas-mock'

// runs a clean after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup()
  vi.resetAllMocks()
})
