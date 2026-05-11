// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getApiUrl } from '@/config/api'

export const useAuthStore = defineStore('auth', () => {
  const token   = ref(null)
  const usuario = ref(null)

  const estaAutenticado = computed(() => !!token.value)

  async function login(nombre_de_usuario, password) {
    const API_URL = await getApiUrl()
    const res = await fetch(`${API_URL}/auth/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre_de_usuario, password })
    })
    const data = await res.json()
    if (data.success) {
      token.value   = data.token
      usuario.value = data.usuario
    }
    return data
  }

  async function registrar(formData) {
    const API_URL = await getApiUrl()
    const res = await fetch(`${API_URL}/auth/registrar.php`, {
      method: 'POST',
      body: formData   // multipart/form-data para soportar foto
    })
    return await res.json()
  }

  async function obtenerPerfil() {
    const API_URL = await getApiUrl()
    const res = await fetch(`${API_URL}/auth/perfil.php`, {
      headers: { 'Authorization': `Bearer ${token.value}` }
    })
    const data = await res.json()
    if (data.success) {
      usuario.value = data.usuario
    }
    return data
  }

  async function editarPerfil(formData) {
    const API_URL = await getApiUrl()
    const res = await fetch(`${API_URL}/auth/editar.php`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token.value}` },
      body: formData
    })
    const data = await res.json()
    if (data.success) {
      usuario.value = data.usuario
    }
    return data
  }

  async function logout() {
    const API_URL = await getApiUrl()
    try {
      await fetch(`${API_URL}/auth/logout.php`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token.value}` }
      })
    } catch (e) { /* ignorar errores de red al logout */ }
    token.value   = null
    usuario.value = null
  }

  return {
    token,
    usuario,
    estaAutenticado,
    login,
    registrar,
    obtenerPerfil,
    editarPerfil,
    logout,
    persist: true
  }
})
