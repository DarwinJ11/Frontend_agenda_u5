<template>
  <div class="container" style="max-width:520px;">
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
        <h2>Editar Contacto</h2>
        <router-link to="/agenda" class="btn btn-secondary">← Volver</router-link>
      </div>

      <div v-if="cargandoInicial">Cargando...</div>

      <template v-else>
        <div v-if="mensaje" :class="['alert', error ? 'alert-error' : 'alert-success']">
          {{ mensaje }}
        </div>

        <div v-if="form.foto" style="margin-bottom:0.8rem;">
          <img :src="form.foto" class="avatar-md" alt="foto actual" />
          <small>Foto actual</small>
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
          <label>Cambiar foto</label>
          <input type="file" accept="image/jpg,image/jpeg,image/png,image/webp" @change="onFoto" />
        </div>

        <button class="btn btn-primary" :disabled="cargando" @click="enviar">
          {{ cargando ? 'Guardando...' : 'Guardar cambios' }}
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContactosStore } from '@/stores/contactos'

const contactosStore  = useContactosStore()
const route           = useRoute()
const router          = useRouter()
const cargandoInicial = ref(true)
const cargando        = ref(false)
const mensaje         = ref('')
const error           = ref(false)
const archivoFoto     = ref(null)
const form            = ref({
  id: '', nombre: '', apellido: '', telefono: '', email: '',
  direccion: '', notas: '', foto: ''
})

onMounted(async () => {
  try {
    const data = await contactosStore.obtener(route.params.id)
    if (data.success) {
      Object.assign(form.value, data.contacto)
    } else {
      error.value   = true
      mensaje.value = data.message || 'No se pudo cargar el contacto'
    }
  } catch (e) {
    error.value   = true
    mensaje.value = 'Error de conexión'
  } finally {
    cargandoInicial.value = false
  }
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

  const fd = new FormData()
  fd.append('id', form.value.id)
  fd.append('nombre',    form.value.nombre)
  fd.append('apellido',  form.value.apellido || '')
  fd.append('telefono',  form.value.telefono)
  fd.append('email',     form.value.email || '')
  fd.append('direccion', form.value.direccion || '')
  fd.append('notas',     form.value.notas || '')
  if (archivoFoto.value) fd.append('foto', archivoFoto.value)

  cargando.value = true
  try {
    const data = await contactosStore.actualizar(fd)
    if (data.success) {
      error.value   = false
      mensaje.value = 'Contacto actualizado correctamente'
      setTimeout(() => router.push('/agenda'), 1000)
    } else {
      error.value   = true
      mensaje.value = data.message || 'Error al actualizar'
    }
  } catch (e) {
    error.value   = true
    mensaje.value = 'Error de conexión'
  } finally {
    cargando.value = false
  }
}
</script>
