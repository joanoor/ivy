import { canUseDom } from '@ivy/core'

export default function isDocumentVisible(): boolean {
  if (canUseDom()) {
    return document.visibilityState !== 'hidden'
  }
  return true
}
