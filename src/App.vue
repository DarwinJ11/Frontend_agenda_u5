<template>
  <div>
    <nav class="navbar" v-if="auth.estaAutenticado">
      <div>
        <router-link to="/agenda">Agenda</router-link>
        <router-link to="/agenda/crear">+ Contacto</router-link>
        <router-link to="/perfil">Perfil</router-link>
      </div>
      <div style="display:flex;align-items:center;gap:0.8rem;">
        <img v-if="auth.usuario?.foto" :src="auth.usuario.foto" class="avatar-sm" alt="foto" />
        <span>{{ auth.usuario?.nombre_de_usuario }}</span>
        <button class="btn btn-secondary" @click="cerrarSesion">Salir</button>
      </div>
    </nav>

    <router-view />
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth   = useAuthStore()
const router = useRouter()

async function cerrarSesion() {
  await auth.logout()
  router.push('/login')
}
</script>
