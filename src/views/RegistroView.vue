<template>
  <div class="container" style="max-width:420px;">
    <div class="card" style="margin-top:3rem;">
      <h2 style="margin-bottom:1rem;">Crear cuenta</h2>

      <div v-if="mensaje" :class="['alert', error ? 'alert-error' : 'alert-success']">
        {{ mensaje }}
      </div>

      <div class="form-group">
        <label>Usuario</label>
        <input v-model="form.nombre_de_usuario" type="text" placeholder="nombre de usuario" />
      </div>
      <div class="form-group">
        <label>Contraseña</label>
        <input v-model="form.password" type="password" placeholder="mínimo 6 caracteres" />
      </div>
      <div class="form-group">
        <label>Foto (opcional)</label>
        <input type="file" accept="image/jpg,image/jpeg,image/png,image/webp" @change="onFoto" />
      </div>

      <button class="btn btn-primary" :disabled="cargando" @click="enviar">
        {{ cargando ? 'Registrando...' : 'Registrarse' }}
      </button>

      <p style="margin-top:0.8rem;font-size:13px;">
        ¿Ya tienes cuenta? <router-link to="/login">Inicia sesión</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth    = useAuthStore()
const router  = useRouter()
const cargando = ref(false)
const mensaje  = ref('')
const error    = ref(false)
const form     = ref({ nombre_de_usuario: '', password: '' })
const archivoFoto = ref(null)

function onFoto(e) {
  archivoFoto.value = e.target.files[0] || null
}

async function enviar() {
  mensaje.value = ''

  if (!form.value.nombre_de_usuario || !form.value.password) {
    error.value   = true
    mensaje.value = 'Completa todos los campos obligatorios'
    return
  }
  if (form.value.nombre_de_usuario.length < 3) {
    error.value   = true
    mensaje.value = 'El usuario debe tener al menos 3 caracteres'
    return
  }
  if (form.value.password.length < 6) {
    error.value   = true
    mensaje.value = 'La contraseña debe tener al menos 6 caracteres'
    return
  }

  const fd = new FormData()
  fd.append('nombre_de_usuario', form.value.nombre_de_usuario)
  fd.append('password', form.value.password)
  if (archivoFoto.value) fd.append('foto', archivoFoto.value)

  cargando.value = true
  try {
    const data = await auth.registrar(fd)
    if (data.success) {
      error.value   = false
      mensaje.value = 'Cuenta creada. Redirigiendo...'
      setTimeout(() => router.push('/login'), 1200)
    } else {
      error.value   = true
      mensaje.value = data.message || 'Error al registrar'
    }
  } catch (e) {
    error.value   = true
    mensaje.value = 'Error de conexión con el servidor'
  } finally {
    cargando.value = false
  }
}
</script>
