import type {Locator} from '@playwright/test'

/**
 * Wait for a modal component that wraps a <dialog> element to be fully opened.
 * WebKit has timing issues where the React component renders but the dialog's
 * showModal() hasn't completed yet, leaving it in a 'hidden' state.
 *
 * This helper waits for the element to be visible, giving WebKit time to
 * complete the showModal() call.
 */
export async function waitForModal(locator: Locator, timeout = 15000) {
  // Wait for the element to be attached AND visible
  // Longer timeout for WebKit's slower modal rendering
  await locator.waitFor({state: 'visible', timeout})
}
