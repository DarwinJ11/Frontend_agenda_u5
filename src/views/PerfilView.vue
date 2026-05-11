<template>
  <div class="container" style="max-width:480px;">
    <div class="card">
      <h2 style="margin-bottom:1rem;">Mi Perfil</h2>

      <div v-if="mensaje" :class="['alert', error ? 'alert-error' : 'alert-success']">
        {{ mensaje }}
      </div>

      <div v-if="form.foto" style="margin-bottom:0.8rem;">
        <img :src="form.foto" class="avatar-md" alt="foto de perfil" />
      </div>

      <div class="form-group">
        <label>Usuario *</label>
        <input v-model="form.nombre_de_usuario" type="text" />
      </div>
      <div class="form-group">
        <label>Nueva contraseña (dejar vacío para no cambiar)</label>
        <input v-model="form.password" type="password" placeholder="mínimo 6 caracteres" />
      </div>
      <div class="form-group">
        <label>Cambiar foto</label>
        <input type="file" accept="image/jpg,image/jpeg,image/png,image/webp" @change="onFoto" />
      </div>

      <button class="btn btn-primary" :disabled="cargando" @click="enviar">
        {{ cargando ? 'Guardando...' : 'Guardar cambios' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth        = useAuthStore()
const cargando    = ref(false)
const mensaje     = ref('')
const error       = ref(false)
const archivoFoto = ref(null)
const form        = ref({
  nombre_de_usuario: '',
  password: '',
  foto: ''
})

onMounted(() => {
  if (auth.usuario) {
    form.value.nombre_de_usuario = auth.usuario.nombre_de_usuario
    form.value.foto              = auth.usuario.foto || ''
  }
})

function onFoto(e) {
  archivoFoto.value = e.target.files[0] || null
}

async function enviar() {
  mensaje.value = ''

  if (!form.value.nombre_de_usuario.trim()) {
    error.value   = true
    mensaje.value = 'El nombre de usuario es obligatorio'
    return
  }
  if (form.value.password && form.value.password.length < 6) {
    error.value   = true
    mensaje.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  const fd = new FormData()
  fd.append('nombre_de_usuario', form.value.nombre_de_usuario)
  if (form.value.password) fd.append('password', form.value.password)
  if (archivoFoto.value) fd.append('foto', archivoFoto.value)

  cargando.value = true
  try {
    const data = await auth.editarPerfil(fd)
    if (data.success) {
      error.value   = false
      mensaje.value = 'Perfil actualizado correctamente'
      form.value.password = ''
      if (data.usuario?.foto) form.value.foto = data.usuario.foto
    } else {
      error.value   = true
      mensaje.value = data.message || 'Error al actualizar perfil'
    }
  } catch (e) {
    error.value   = true
    mensaje.value = 'Error de conexión'
  } finally {
    cargando.value = false
  }
}
</script>
