// Elementos del DOM
const loginForm = document.getElementById("loginForm")
const togglePassword = document.getElementById("togglePassword")
const passwordInput = document.getElementById("password")
const usernameInput = document.getElementById("username")
const loginBtn = document.querySelector(".login-btn")

// Funcionalidad para mostrar/ocultar contraseña
togglePassword.addEventListener("click", function () {
  const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
  passwordInput.setAttribute("type", type)

  const icon = this.querySelector("i")
  icon.classList.toggle("fa-eye")
  icon.classList.toggle("fa-eye-slash")
})

// Validación en tiempo real
function validateInput(input) {
  const container = input.parentElement
  const value = input.value.trim()

  // Remover clases previas
  container.classList.remove("error", "success")

  if (value === "") {
    return false
  }

  if (input.type === "text") {
    // Validación para usuario (mínimo 3 caracteres)
    if (value.length >= 3) {
      container.classList.add("success")
      return true
    } else {
      container.classList.add("error")
      return false
    }
  }

  if (input.type === "password") {
    // Validación para contraseña (mínimo 6 caracteres)
    if (value.length >= 6) {
      container.classList.add("success")
      return true
    } else {
      container.classList.add("error")
      return false
    }
  }

  return false
}

// Eventos de validación en tiempo real
usernameInput.addEventListener("input", function () {
  validateInput(this)
})

passwordInput.addEventListener("input", function () {
  validateInput(this)
})

// Manejo del envío del formulario
loginForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const username = usernameInput.value.trim()
  const password = passwordInput.value.trim()
  const rememberMe = document.getElementById("rememberMe").checked

  // Validar campos
  const isUsernameValid = validateInput(usernameInput)
  const isPasswordValid = validateInput(passwordInput)

  if (!isUsernameValid || !isPasswordValid) {
    showNotification("Por favor, completa todos los campos correctamente.", "error")
    return
  }

  // Simular proceso de login
  simulateLogin(username, password, rememberMe)
})

// Función para simular el proceso de login
function simulateLogin(username, password, rememberMe) {
  // Agregar estado de carga
  loginBtn.classList.add("loading")
  loginBtn.disabled = true

  // Simular llamada a API (2 segundos)
  setTimeout(() => {
    // Remover estado de carga
    loginBtn.classList.remove("loading")
    loginBtn.disabled = false

    // Simular respuesta exitosa o error
    if (username === "admin" && password === "123456") {
      showNotification("¡Inicio de sesión exitoso! Redirigiendo...", "success")

      // Guardar en localStorage si "recordarme" está marcado
      if (rememberMe) {
        localStorage.setItem("rememberedUser", username)
      }

      // Simular redirección después de 2 segundos
      setTimeout(() => {
        console.log("Redirigiendo al dashboard...")
        // window.location.href = '/dashboard';
      }, 2000)
    } else {
      showNotification("Usuario o contraseña incorrectos.", "error")
    }
  }, 2000)
}

// Función para mostrar notificaciones
function showNotification(message, type) {
  // Crear elemento de notificación
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.innerHTML = `
        <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}"></i>
        <span>${message}</span>
    `

  // Agregar estilos CSS dinámicamente si no existen
  if (!document.querySelector("#notification-styles")) {
    const styles = document.createElement("style")
    styles.id = "notification-styles"
    styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 1000;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            
            .notification.success {
                background: linear-gradient(135deg, #10b981, #059669);
            }
            
            .notification.error {
                background: linear-gradient(135deg, #ef4444, #dc2626);
            }
            
            .notification.show {
                transform: translateX(0);
            }
        `
    document.head.appendChild(styles)
  }

  // Agregar al DOM
  document.body.appendChild(notification)

  // Mostrar con animación
  setTimeout(() => {
    notification.classList.add("show")
  }, 100)

  // Remover después de 4 segundos
  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 4000)
}

// Cargar usuario recordado al cargar la página
window.addEventListener("load", () => {
  const rememberedUser = localStorage.getItem("rememberedUser")
  if (rememberedUser) {
    usernameInput.value = rememberedUser
    document.getElementById("rememberMe").checked = true
    validateInput(usernameInput)
  }
})

// Efectos adicionales para mejorar la UX
document.addEventListener("DOMContentLoaded", () => {
  // Animación de entrada para el formulario
  const loginContainer = document.querySelector(".login-container")
  loginContainer.style.opacity = "0"
  loginContainer.style.transform = "translateY(20px)"

  setTimeout(() => {
    loginContainer.style.transition = "all 0.6s ease"
    loginContainer.style.opacity = "1"
    loginContainer.style.transform = "translateY(0)"
  }, 200)

  // Focus automático en el campo de usuario
  setTimeout(() => {
    usernameInput.focus()
  }, 800)
})

// Manejo de teclas especiales
document.addEventListener("keydown", (e) => {
  // Enter para enviar formulario
  if (e.key === "Enter" && (usernameInput === document.activeElement || passwordInput === document.activeElement)) {
    loginForm.dispatchEvent(new Event("submit"))
  }

  // Escape para limpiar formulario
  if (e.key === "Escape") {
    usernameInput.value = ""
    passwordInput.value = ""
    document.getElementById("rememberMe").checked = false

    // Remover clases de validación
    document.querySelectorAll(".input-container").forEach((container) => {
      container.classList.remove("error", "success")
    })

    usernameInput.focus()
  }
})
