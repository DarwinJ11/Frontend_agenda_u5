<template>
  <div class="container" style="max-width:420px;">
    <div class="card" style="margin-top:3rem;">
      <h2 style="margin-bottom:1rem;">Iniciar sesión</h2>

      <div v-if="mensaje" :class="['alert', error ? 'alert-error' : 'alert-success']">
        {{ mensaje }}
      </div>

      <div class="form-group">
        <label>Usuario</label>
        <input v-model="form.nombre_de_usuario" type="text" placeholder="nombre de usuario" />
      </div>
      <div class="form-group">
        <label>Contraseña</label>
        <input v-model="form.password" type="password" placeholder="contraseña" />
      </div>

      <button class="btn btn-primary" :disabled="cargando" @click="enviar">
        {{ cargando ? 'Entrando...' : 'Entrar' }}
      </button>

      <p style="margin-top:0.8rem;font-size:13px;">
        ¿No tienes cuenta? <router-link to="/registro">Regístrate</router-link>
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

async function enviar() {
  mensaje.value = ''

  // Validación front-end
  if (!form.value.nombre_de_usuario || !form.value.password) {
    error.value   = true
    mensaje.value = 'Completa todos los campos'
    return
  }

  cargando.value = true
  try {
    const data = await auth.login(form.value.nombre_de_usuario, form.value.password)
    if (data.success) {
      router.push('/agenda')
    } else {
      error.value   = true
      mensaje.value = data.message || 'Error al iniciar sesión'
    }
  } catch (e) {
    error.value   = true
    mensaje.value = 'Error de conexión con el servidor'
  } finally {
    cargando.value = false
  }
}
</script>
