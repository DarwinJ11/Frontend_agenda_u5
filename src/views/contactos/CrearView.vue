<template>
  <div class="container" style="max-width:520px;">
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
        <h2>Nuevo Contacto</h2>
        <router-link to="/agenda" class="btn btn-secondary">← Volver</router-link>
      </div>

      <div v-if="mensaje" :class="['alert', error ? 'alert-error' : 'alert-success']">
        {{ mensaje }}
      </div>

      <div class="form-group">
        <label>Nombre *</label>
        <input v-model="form.nombre" type="text" />
      </div>
      <div class="form-group">
        <label>Apellido</label>
        <input v-model="form.apellido" type="text" />
      </div>
      <div class="form-group">
        <label>Teléfono *</label>
        <input v-model="form.telefono" type="text" />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" type="email" />
      </div>
      <div class="form-group">
        <label>Dirección</label>
        <input v-model="form.direccion" type="text" />
      </div>
      <div class="form-group">
        <label>Notas</label>
        <textarea v-model="form.notas"></textarea>
      </div>
      <div class="form-group">
        <label>Foto</label>
        <input type="file" accept="image/jpg,image/jpeg,image/png,image/webp" @change="onFoto" />
      </div>

      <button class="btn btn-primary" :disabled="cargando" @click="enviar">
        {{ cargando ? 'Guardando...' : 'Guardar' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useContactosStore } from '@/stores/contactos'

const contactosStore = useContactosStore()
const router         = useRouter()
const cargando       = ref(false)
const mensaje        = ref('')
const error          = ref(false)
const archivoFoto    = ref(null)
const form           = ref({
  nombre: '', apellido: '', telefono: '', email: '', direccion: '', notas: ''
})

function onFoto(e) {
  archivoFoto.value = e.target.files[0] || null
}

async function enviar() {
  mensaje.value = ''

  if (!form.value.nombre.trim()) {
    error.value   = true
    mensaje.value = 'El nombre es obligatorio'
    return
  }
  if (!form.value.telefono.trim()) {
    error.value   = true
    mensaje.value = 'El teléfono es obligatorio'
    return
  }
  if (form.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    error.value   = true
    mensaje.value = 'El email no es válido'
    return
  }

  const fd = new FormData()
  Object.entries(form.value).forEach(([k, v]) => fd.append(k, v))
  if (archivoFoto.value) fd.append('foto', archivoFoto.value)

  cargando.value = true
  try {
    const data = await contactosStore.crear(fd)
    if (data.success) {
      router.push('/agenda')
    } else {
      error.value   = true
      mensaje.value = data.message || 'Error al crear contacto'
    }
  } catch (e) {
    error.value   = true
    mensaje.value = 'Error de conexión'
  } finally {
    cargando.value = false
  }
}
</script>
