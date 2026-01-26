import { useAuthStore } from '~/stores/auth'
import { pinia } from '~/stores/pinia'

const getBinding = (binding) => {
  // v-perm="'user:create'"
  if (typeof binding.value === 'string') return { code: binding.value, mode: 'hide' }
  // v-perm="{ code: 'user:create', mode: 'disable' }"
  if (binding.value && typeof binding.value === 'object') {
    return { code: binding.value.code, mode: binding.value.mode || 'hide' }
  }
  // v-perm.disable="'user:create'"
  if (binding.modifiers?.disable) return { code: binding.value, mode: 'disable' }
  return { code: '', mode: 'hide' }
}

const apply = (el, code, mode) => {
  const auth = useAuthStore(pinia)
  const allowed = auth.hasPerm(code)

  if (allowed) {
    if (el.dataset.permPrevDisplay != null) {
      el.style.display = el.dataset.permPrevDisplay
      delete el.dataset.permPrevDisplay
    }
    el.classList.remove('perm-disabled')
    el.removeAttribute('disabled')
    el.removeAttribute('aria-disabled')
    return
  }

  if (mode === 'disable') {
    el.classList.add('perm-disabled')
    el.setAttribute('disabled', 'true')
    el.setAttribute('aria-disabled', 'true')
    return
  }

  if (el.dataset.permPrevDisplay == null) {
    el.dataset.permPrevDisplay = el.style.display || ''
  }
  el.style.display = 'none'
}

export const permDirective = {
  mounted(el, binding) {
    const { code, mode } = getBinding(binding)
    apply(el, code, mode)
  },
  updated(el, binding) {
    const { code, mode } = getBinding(binding)
    apply(el, code, mode)
  }
}

