/* eslint-disable */

import {vi} from 'vitest'
import {mockDeep} from 'vitest-mock-extended'

const colorThiefInstanceMock = mockDeep<import('colorthief').default>()
const ColorThiefMock = vi.fn(() => colorThiefInstanceMock)

;(ColorThiefMock as any).instanceMock = colorThiefInstanceMock

export default ColorThiefMock
