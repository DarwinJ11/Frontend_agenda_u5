<template>
  <div class="container">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
      <h2>Mis Contactos</h2>
      <router-link to="/agenda/crear" class="btn btn-primary">+ Nuevo contacto</router-link>
    </div>

    <div v-if="mensaje" :class="['alert', error ? 'alert-error' : 'alert-success']">
      {{ mensaje }}
    </div>

    <div v-if="cargando">Cargando...</div>

    <div v-else-if="contactosStore.contactos.length === 0" class="card">
      No tienes contactos aún.
    </div>

    <div v-else class="card" style="padding:0;overflow:auto;">
      <table>
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in contactosStore.contactos" :key="c.id">
            <td>
              <img v-if="c.foto" :src="c.foto" class="avatar-sm" :alt="c.nombre" />
              <span v-else>—</span>
            </td>
            <td>{{ c.nombre }} {{ c.apellido }}</td>
            <td>{{ c.telefono }}</td>
            <td>{{ c.email || '—' }}</td>
            <td>
              <div class="acciones">
                <router-link :to="`/agenda/${c.id}`" class="btn btn-secondary">Editar</router-link>
                <button class="btn btn-danger" @click="confirmarEliminar(c)">Eliminar</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Confirmación de eliminación -->
    <div v-if="contactoAEliminar" class="card" style="position:fixed;top:30%;left:50%;transform:translateX(-50%);z-index:100;max-width:340px;width:90%;box-shadow:0 4px 16px rgba(0,0,0,.25);">
      <p>¿Eliminar a <strong>{{ contactoAEliminar.nombre }}</strong>?</p>
      <div style="display:flex;gap:0.5rem;margin-top:0.8rem;">
        <button class="btn btn-danger" :disabled="eliminando" @click="eliminar">
          {{ eliminando ? 'Eliminando...' : 'Sí, eliminar' }}
        </button>
        <button class="btn btn-secondary" @click="contactoAEliminar = null">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useContactosStore } from '@/stores/contactos'

const contactosStore    = useContactosStore()
const cargando          = ref(false)
const eliminando        = ref(false)
const mensaje           = ref('')
const error             = ref(false)
const contactoAEliminar = ref(null)

onMounted(async () => {
  cargando.value = true
  try {
    const data = await contactosStore.listar()
    if (!data.success) {
      error.value   = true
      mensaje.value = data.message || 'Error al cargar contactos'
    }
  } catch (e) {
    error.value   = true
    mensaje.value = 'Error de conexión'
  } finally {
    cargando.value = false
  }
})

function confirmarEliminar(c) {
  contactoAEliminar.value = c
}

async function eliminar() {
  eliminando.value = true
  try {
    const data = await contactosStore.eliminar(contactoAEliminar.value.id)
    if (data.success) {
      error.value   = false
      mensaje.value = 'Contacto eliminado'
      contactoAEliminar.value = null
      await contactosStore.listar()
    } else {
      error.value   = true
      mensaje.value = data.message || 'Error al eliminar'
    }
  } catch (e) {
    error.value   = true
    mensaje.value = 'Error de conexión'
  } finally {
    eliminando.value = false
  }
}
</script>
