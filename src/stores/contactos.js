// src/stores/contactos.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getApiUrl } from '@/config/api'
import { useAuthStore } from './auth'

export const useContactosStore = defineStore('contactos', () => {
  const contactos = ref([])

  function authHeader() {
    const auth = useAuthStore()
    return { 'Authorization': `Bearer ${auth.token}` }
  }

  async function listar() {
    const API_URL = await getApiUrl()
    const res = await fetch(`${API_URL}/contactos/index.php`, {
      headers: authHeader()
    })
    const data = await res.json()
    if (data.success) {
      contactos.value = data.contactos
    }
    return data
  }

  async function obtener(id) {
    const API_URL = await getApiUrl()
    const res = await fetch(`${API_URL}/contactos/detalle.php?id=${id}`, {
      headers: authHeader()
    })
    return await res.json()
  }

  async function crear(formData) {
    const API_URL = await getApiUrl()
    const res = await fetch(`${API_URL}/contactos/crear.php`, {
      method: 'POST',
      headers: authHeader(),
      body: formData
    })
    return await res.json()
  }

  async function actualizar(formData) {
    const API_URL = await getApiUrl()
    const res = await fetch(`${API_URL}/contactos/actualizar.php`, {
      method: 'POST',
      headers: authHeader(),
      body: formData
    })
    return await res.json()
  }

  async function eliminar(id) {
    const API_URL = await getApiUrl()
    const res = await fetch(`${API_URL}/contactos/eliminar.php`, {
      method: 'POST',
      headers: {
        ...authHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    })
    return await res.json()
  }

  return { contactos, listar, obtener, crear, actualizar, eliminar }
})
