// API Configuration
const API_URL = "https://6928423eb35b4ffc5014e22c.mockapi.io/clientes"

// State
let clients = []
let filteredClients = []
let editingId = null

// DOM Elements
const clientsTableBody = document.getElementById("clientsTableBody")
const loadingState = document.getElementById("loadingState")
const emptyState = document.getElementById("emptyState")
const modalOverlay = document.getElementById("modalOverlay")
const deleteModalOverlay = document.getElementById("deleteModalOverlay")
const clientForm = document.getElementById("clientForm")
const searchInput = document.getElementById("searchInput")
const categoryFilter = document.getElementById("categoryFilter")
const countryFilter = document.getElementById("countryFilter")
const toastContainer = document.getElementById("toastContainer")

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation()
  loadClients()
  updateCurrentDate()
  initializeMobileMenu()
  setDefaultDate()
})

// Set default date for date input
function setDefaultDate() {
  const dateInput = document.getElementById("fecha_compra")
  if (dateInput) {
    dateInput.valueAsDate = new Date()
  }
}

// Navigation
function initializeNavigation() {
  const navItems = document.querySelectorAll(".nav-item")

  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault()
      const section = item.dataset.section
      navigateTo(section)
    })
  })

  const hash = window.location.hash.replace("#", "") || "dashboard"
  navigateTo(hash)
}

function navigateTo(section) {
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.section === section)
  })

  document.querySelectorAll(".content-section").forEach((sec) => {
    sec.classList.remove("active")
  })

  const targetSection = document.getElementById(section)
  if (targetSection) {
    targetSection.classList.add("active")
    window.location.hash = section
  }

  closeMobileMenu()
}

// Mobile Menu
function initializeMobileMenu() {
  const sidebar = document.getElementById("sidebar")
  const toggle = document.getElementById("sidebarToggle")

  const overlay = document.createElement("div")
  overlay.className = "mobile-overlay"
  overlay.id = "mobileOverlay"
  document.body.appendChild(overlay)

  toggle.addEventListener("click", () => {
    sidebar.classList.toggle("active")
    overlay.classList.toggle("active")
  })

  overlay.addEventListener("click", closeMobileMenu)
}

function closeMobileMenu() {
  document.getElementById("sidebar").classList.remove("active")
  document.getElementById("mobileOverlay")?.classList.remove("active")
}

// Date
function updateCurrentDate() {
  const dateElement = document.getElementById("currentDate")
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  dateElement.textContent = new Date().toLocaleDateString("es-ES", options)
}

// API Functions
async function loadClients() {
  showLoading(true)

  try {
    const response = await fetch(API_URL)
    if (!response.ok) throw new Error("Error al cargar clientes")

    clients = await response.json()
    filteredClients = [...clients]
    populateFilters()
    renderClients()
    updateStats()
    renderRecentActivity()
  } catch (error) {
    console.error("Error:", error)
    showToast("Error al cargar los clientes", "error")
  } finally {
    showLoading(false)
  }
}

async function createClient(data) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) throw new Error("Error al crear cliente")

    const newClient = await response.json()
    clients.push(newClient)
    populateFilters()
    filterClients()
    updateStats()
    renderRecentActivity()
    showToast("Cliente creado exitosamente", "success")
    closeModal()
  } catch (error) {
    console.error("Error:", error)
    showToast("Error al crear el cliente", "error")
  }
}

async function updateClient(id, data) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!response.ok) throw new Error("Error al actualizar cliente")

    const updatedClient = await response.json()
    const index = clients.findIndex((c) => c.id_cliente === id || c.id === id)
    if (index !== -1) {
      clients[index] = updatedClient
    }
    populateFilters()
    filterClients()
    updateStats()
    showToast("Cliente actualizado exitosamente", "success")
    closeModal()
  } catch (error) {
    console.error("Error:", error)
    showToast("Error al actualizar el cliente", "error")
  }
}

async function deleteClient(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) throw new Error("Error al eliminar cliente")

    clients = clients.filter((c) => (c.id_cliente || c.id) !== id)
    populateFilters()
    filterClients()
    updateStats()
    renderRecentActivity()
    showToast("Cliente eliminado exitosamente", "success")
    closeDeleteModal()
  } catch (error) {
    console.error("Error:", error)
    showToast("Error al eliminar el cliente", "error")
  }
}

// Populate Filter Dropdowns
function populateFilters() {
  const categories = [...new Set(clients.map((c) => c.categoria_producto).filter(Boolean))]
  const countries = [...new Set(clients.map((c) => c.pais).filter(Boolean))]

  categoryFilter.innerHTML = '<option value="all">Todas las categorías</option>'
  categories.forEach((cat) => {
    categoryFilter.innerHTML += `<option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>`
  })

  countryFilter.innerHTML = '<option value="all">Todos los países</option>'
  countries.forEach((country) => {
    countryFilter.innerHTML += `<option value="${escapeHtml(country)}">${escapeHtml(country)}</option>`
  })
}

// Render Functions
function renderClients() {
  const tableContainer = document.querySelector(".table-container")

  if (filteredClients.length === 0) {
    tableContainer.style.display = "none"
    emptyState.style.display = "flex"
    return
  }

  tableContainer.style.display = "block"
  emptyState.style.display = "none"

  clientsTableBody.innerHTML = filteredClients
    .map((client) => {
      const id = client.id_cliente || client.id
      return `
        <tr>
          <td><span style="color: var(--text-muted);">#${id}</span></td>
          <td>
            <div class="client-info">
              <div class="client-avatar">${getInitials(client.nombre)}</div>
              <div>
                <span class="client-name">${escapeHtml(client.nombre || "Sin nombre")}</span>
                <div class="client-gender">${escapeHtml(client.genero || "-")}</div>
              </div>
            </div>
          </td>
          <td>${client.edad || "-"}</td>
          <td>${escapeHtml(client.pais || "-")}</td>
          <td>${escapeHtml(client.tipo_dispositivo || "-")}</td>
          <td>${escapeHtml(client.categoria_producto || "-")}</td>
          <td><strong>$${formatNumber(client.monto_compra)}</strong></td>
          <td>
            <span class="badge-sm ${client.descuento_usado ? "badge-discount" : "badge-no-discount"}">
              ${client.descuento_usado ? "Sí" : "No"}
            </span>
          </td>
          <td>
            <div class="action-buttons">
              <button class="action-btn-icon edit" onclick="openModal('edit', '${id}')" title="Editar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button class="action-btn-icon delete" onclick="confirmDelete('${id}', '${escapeHtml(client.nombre)}')" title="Eliminar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </td>
        </tr>
      `
    })
    .join("")
}

function renderRecentActivity() {
  const activityList = document.getElementById("recentActivity")
  const recentClients = [...clients].slice(-5).reverse()

  if (recentClients.length === 0) {
    activityList.innerHTML =
      '<p style="color: var(--text-muted); text-align: center; padding: 1rem;">No hay clientes registrados</p>'
    return
  }

  activityList.innerHTML = recentClients
    .map(
      (client) => `
        <div class="activity-item">
          <div class="activity-avatar">${getInitials(client.nombre)}</div>
          <div class="activity-content">
            <div class="activity-name">${escapeHtml(client.nombre || "Sin nombre")}</div>
            <div class="activity-detail">${escapeHtml(client.pais || "-")} · ${escapeHtml(client.categoria_producto || "-")}</div>
          </div>
          <span class="activity-amount">$${formatNumber(client.monto_compra)}</span>
        </div>
      `,
    )
    .join("")
}

function updateStats() {
  document.getElementById("totalClients").textContent = clients.length

  const totalRevenue = clients.reduce((sum, c) => sum + (Number.parseFloat(c.monto_compra) || 0), 0)
  document.getElementById("totalRevenue").textContent = `$${formatNumber(totalRevenue)}`

  const discountCount = clients.filter((c) => c.descuento_usado).length
  const discountPercentage = clients.length > 0 ? Math.round((discountCount / clients.length) * 100) : 0
  document.getElementById("discountUsage").textContent = `${discountPercentage}%`

  const avgPurchase = clients.length > 0 ? totalRevenue / clients.length : 0
  document.getElementById("avgPurchase").textContent = `$${formatNumber(avgPurchase)}`
}

// Filter Functions
function filterClients() {
  const searchTerm = searchInput.value.toLowerCase()
  const categoryValue = categoryFilter.value
  const countryValue = countryFilter.value

  filteredClients = clients.filter((client) => {
    const matchesSearch =
      (client.nombre || "").toLowerCase().includes(searchTerm) ||
      (client.pais || "").toLowerCase().includes(searchTerm) ||
      (client.categoria_producto || "").toLowerCase().includes(searchTerm)

    const matchesCategory = categoryValue === "all" || client.categoria_producto === categoryValue
    const matchesCountry = countryValue === "all" || client.pais === countryValue

    return matchesSearch && matchesCategory && matchesCountry
  })

  renderClients()
}

// Modal Functions
function openModal(mode, id = null) {
  editingId = id
  const modalTitle = document.getElementById("modalTitle")
  const submitBtn = document.getElementById("submitBtn")

  if (mode === "edit" && id) {
    const client = clients.find((c) => (c.id_cliente || c.id) === id)
    if (client) {
      modalTitle.textContent = "Editar Cliente"
      submitBtn.textContent = "Actualizar"
      document.getElementById("clientId").value = client.id_cliente || client.id
      document.getElementById("nombre").value = client.nombre || ""
      document.getElementById("edad").value = client.edad || ""
      document.getElementById("genero").value = client.genero || ""
      document.getElementById("pais").value = client.pais || ""
      document.getElementById("tipo_dispositivo").value = client.tipo_dispositivo || ""
      document.getElementById("metodo_pago").value = client.metodo_pago || ""
      document.getElementById("monto_compra").value = client.monto_compra || ""
      document.getElementById("categoria_producto").value = client.categoria_producto || ""
      document.getElementById("descuento_usado").checked = client.descuento_usado || false

      // Handle date - could be timestamp or date string
      const fechaInput = document.getElementById("fecha_compra")
      if (client.fecha_compra) {
        const date = new Date(
          typeof client.fecha_compra === "number" ? client.fecha_compra * 1000 : client.fecha_compra,
        )
        if (!isNaN(date.getTime())) {
          fechaInput.valueAsDate = date
        }
      }
    }
  } else {
    modalTitle.textContent = "Agregar Cliente"
    submitBtn.textContent = "Guardar"
    clientForm.reset()
    document.getElementById("clientId").value = ""
    setDefaultDate()
  }

  modalOverlay.classList.add("active")
}

function closeModal() {
  modalOverlay.classList.remove("active")
  clientForm.reset()
  editingId = null
}

function confirmDelete(id, name) {
  document.getElementById("deleteClientName").textContent = name || "este cliente"
  document.getElementById("confirmDeleteBtn").onclick = () => deleteClient(id)
  deleteModalOverlay.classList.add("active")
}

function closeDeleteModal() {
  deleteModalOverlay.classList.remove("active")
}

// Form Submission
function handleSubmit(event) {
  event.preventDefault()

  const fechaInput = document.getElementById("fecha_compra").value
  const fechaTimestamp = fechaInput ? Math.floor(new Date(fechaInput).getTime() / 1000) : null

  const formData = {
    nombre: document.getElementById("nombre").value,
    edad: Number.parseInt(document.getElementById("edad").value) || 0,
    genero: document.getElementById("genero").value,
    pais: document.getElementById("pais").value,
    tipo_dispositivo: document.getElementById("tipo_dispositivo").value,
    metodo_pago: document.getElementById("metodo_pago").value,
    monto_compra: Number.parseFloat(document.getElementById("monto_compra").value) || 0,
    fecha_compra: fechaTimestamp,
    categoria_producto: document.getElementById("categoria_producto").value,
    descuento_usado: document.getElementById("descuento_usado").checked,
  }

  const id = document.getElementById("clientId").value

  if (id) {
    updateClient(id, formData)
  } else {
    createClient(formData)
  }
}

// Export Function
function exportData() {
  if (clients.length === 0) {
    showToast("No hay datos para exportar", "info")
    return
  }

  const csvContent = generateCSV(clients)
  const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `trendgear_clientes_${new Date().toISOString().split("T")[0]}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  showToast("Datos exportados exitosamente", "success")
}

function generateCSV(data) {
  const headers = [
    "ID",
    "Nombre",
    "Edad",
    "Género",
    "País",
    "Tipo Dispositivo",
    "Método Pago",
    "Monto Compra",
    "Fecha Compra",
    "Categoría",
    "Descuento Usado",
  ]

  const rows = data.map((client) => [
    client.id_cliente || client.id || "",
    client.nombre || "",
    client.edad || "",
    client.genero || "",
    client.pais || "",
    client.tipo_dispositivo || "",
    client.metodo_pago || "",
    client.monto_compra || "",
    client.fecha_compra
      ? new Date(
          typeof client.fecha_compra === "number" ? client.fecha_compra * 1000 : client.fecha_compra,
        ).toLocaleDateString("es-ES")
      : "",
    client.categoria_producto || "",
    client.descuento_usado ? "Sí" : "No",
  ])

  return [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
}

// Utility Functions
function showLoading(show) {
  loadingState.style.display = show ? "flex" : "none"
  document.querySelector(".table-container").style.display = show ? "none" : "block"
}

function showToast(message, type = "info") {
  const toast = document.createElement("div")
  toast.className = `toast ${type}`

  const icons = {
    success:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
    error:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
  }

  toast.innerHTML = `
    <span class="toast-icon">${icons[type]}</span>
    <span class="toast-message">${message}</span>
  `

  toastContainer.appendChild(toast)

  setTimeout(() => {
    toast.style.opacity = "0"
    toast.style.transform = "translateX(100%)"
    setTimeout(() => toast.remove(), 300)
  }, 3500)
}

function getInitials(name) {
  if (!name) return "??"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()
}

function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return "0"
  return Number.parseFloat(num).toLocaleString("es-MX", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

function escapeHtml(text) {
  if (!text) return ""
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

// Event Listeners
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal()
    closeDeleteModal()
  }
})

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal()
})

deleteModalOverlay.addEventListener("click", (e) => {
  if (e.target === deleteModalOverlay) closeDeleteModal()
})
