// Application de gestion de crise cyber - JavaScript

const API_BASE_URL = '/api'; // Assuming frontend is served from the same origin as backend after nginx proxy

async function fetchIncidents() {
    console.log('Attempting to fetch incidents...');
    const token = localStorage.getItem('gestcyber_token'); // Placeholder for where token might be stored after login

    try {
        const response = await fetch(`${API_BASE_URL}/incidents`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Conditionally add Authorization header if token exists
                ...(token && { 'x-auth-token': token })
            }
        });

        if (response.status === 401) {
            console.error('Unauthorized: No token or token invalid. Please log in.');
            // Optionally, redirect to a login page or show a message
            // For now, we'll just log and display a message on the dashboard.
            const dashboardPage = document.getElementById('dashboard');
            if (dashboardPage.classList.contains('active')) {
                displayErrorOnDashboard('Failed to fetch incidents: Authorization required. Please log in.');
            }
            return []; // Return empty array or handle as appropriate
        }
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ msg: 'Unknown error occurred' }));
            console.error('Échec de la récupération des incidents:', response.status, errorData.msg);
            const dashboardPage = document.getElementById('dashboard');
            if (dashboardPage.classList.contains('active')) {
                displayErrorOnDashboard(`Échec de la récupération des incidents: ${errorData.msg || response.statusText}`);
            }
            return [];
        }
        const incidents = await response.json();
        console.log('Incidents fetched:', incidents);
        return incidents;
    } catch (error) {
        console.error('Error fetching incidents:', error);
        const dashboardPage = document.getElementById('dashboard');
        if (dashboardPage.classList.contains('active')) {
            displayErrorOnDashboard('Error fetching incidents: Could not connect to server.');
        }
        return [];
    }
}

function displayErrorOnDashboard(message) {
    // This function needs to be adapted to where you want to show the error.
    // For example, modifying a specific part of the dashboard.
    // For now, let's try to put it in the 'status-overview' card if it exists.
    const statusOverviewCardBody = document.querySelector('#dashboard .status-overview .card__body');
    if (statusOverviewCardBody) {
        statusOverviewCardBody.innerHTML = `<p style="color: red; text-align: center;">${message}</p>`;
    } else {
        // Fallback if the specific element isn't found
        const dashboardGrid = document.querySelector('#dashboard .dashboard-grid');
        if (dashboardGrid) {
            const errorDiv = document.createElement('div');
            errorDiv.innerHTML = `<p style="color: red; text-align: center;">${message}</p>`;
            errorDiv.style.gridColumn = "1 / -1"; // Span all columns
            dashboardGrid.prepend(errorDiv);
        }
    }
}

function renderIncidents(incidents) {
    const timelineRecentCardBody = document.querySelector('#dashboard .timeline-recent .card__body');
    const timelineContainer = document.querySelector('#dashboard .timeline-recent .timeline');

    if (!timelineRecentCardBody) {
        console.warn('Timeline recent card body not found for rendering incidents.');
        return;
    }

    // Clear existing mock timeline items
    if(timelineContainer) {
      timelineContainer.innerHTML = ''; // Clear existing items
    } else {
      // if .timeline is not there, clear card body and append to it
      timelineRecentCardBody.innerHTML = '';
    }

    if (incidents.length === 0) {
        const p = document.createElement('p');
        p.textContent = 'Aucun incident trouvé ou échec du chargement.';
        if(timelineContainer) timelineContainer.appendChild(p);
        else timelineRecentCardBody.appendChild(p);
        return;
    }

    const newTimelineContainer = timelineContainer || document.createElement('div');
    newTimelineContainer.className = 'timeline'; // Ensure class if creating new

    incidents.forEach(incident => {
        const item = document.createElement('div');
        item.className = 'timeline-item'; // Add class for styling
        // Add a class based on niveau_critique if needed, e.g. incident.niveau_critique
        if (incident.niveau_critique === 'crise' || incident.niveau_critique === 'critique') {
            item.classList.add('critical');
        } else if (incident.niveau_critique === 'alerte') {
            item.classList.add('warning');
        }

        // Format date nicely (basic example)
        const date = new Date(incident.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

        item.innerHTML = `
            <div class="timeline-time">${date}</div>
            <div class="timeline-content">
                <strong>${incident.titre || 'Titre non disponible'}</strong>
                <p>Description: ${incident.description || 'N/A'}</p>
                <p>Statut: ${incident.statut || 'N/A'} | Phase: ${incident.phase_actuelle || 'N/A'} | Criticité: ${incident.niveau_critique || 'N/A'}</p>
                <div class="incident-item-actions" style="margin-top: 10px; display: flex; gap: 10px;">
                    <button class="btn btn--sm btn--secondary edit-incident-btn" data-id="${incident.id}">Modifier</button>
                    <button class="btn btn--sm btn--outline delete-incident-btn" data-id="${incident.id}" style="border-color: var(--color-error); color: var(--color-error);">Supprimer</button>
                </div>
            </div>
        `;
        newTimelineContainer.appendChild(item);
    });

    if(!timelineContainer) { // if we created newTimelineContainer, append it
      timelineRecentCardBody.appendChild(newTimelineContainer);
    }
}

async function loadDashboardData() {
    const incidents = await fetchIncidents();
    renderIncidents(incidents);
    // You might want to update other dashboard parts here too eventually
}

// DonnÃ©es de dÃ©monstration
const crisisData = {
    startTime: new Date('2025-06-11T08:30:00'),
    currentStatus: 'Crise',
    currentPhase: 2,
    affectedSystems: ['Serveurs de donnÃ©es patients', 'SystÃ¨me de facturation', 'Messagerie interne'],
    actionsInProgress: 12,
    actionsCompleted: 8,
    mobilizedTeams: 25
};

const phases = [
    {
        id: 1,
        nom: "Alerter, mobiliser et endiguer",
        description: "Activation du dispositif de crise et premiÃ¨res mesures d'endiguement",
        actionsTypes: ["Activer cellule de crise", "Isoler systÃ¨mes compromis", "Alerter autoritÃ©s", "Mobiliser Ã©quipes"]
    },
    {
        id: 2,
        nom: "Maintenir la confiance et comprendre l'attaque", 
        description: "Communication de crise et investigation technique",
        actionsTypes: ["Communiquer parties prenantes", "Analyser logs", "Identifier pÃ©rimÃ¨tre", "Mode dÃ©gradÃ©"]
    },
    {
        id: 3,
        nom: "Relancer les activitÃ©s et durcir les SI",
        description: "Reconstruction sÃ©curisÃ©e et durcissement", 
        actionsTypes: ["Durcir systÃ¨mes", "Restaurer donnÃ©es", "Tester applications", "Valider sÃ©curitÃ©"]
    },
    {
        id: 4,
        nom: "Tirer les leÃ§ons et capitaliser",
        description: "Retour d'expÃ©rience et amÃ©lioration continue",
        actionsTypes: ["RETEX Ã©quipes", "Rapport final", "Plan amÃ©lioration", "Formation"]
    }
];

const roles = [
    {id: "strategique", nom: "Cellule StratÃ©gique", couleur: "#6f42c1"},
    {id: "cyber-it", nom: "Ãquipes Cyber & IT", couleur: "#20c997"},
    {id: "metiers", nom: "MÃ©tiers", couleur: "#fd7e14"},
    {id: "communication", nom: "Communication", couleur: "#0dcaf0"},
    {id: "juridique", nom: "Juridique", couleur: "#6c757d"}
];

// Actions de dÃ©monstration
let actions = [
    {
        id: 1,
        title: "Isolation immÃ©diate des serveurs compromis",
        phase: 1,
        priority: "P0",
        role: "cyber-it",
        status: "done",
        description: "DÃ©connecter physiquement les serveurs affectÃ©s du rÃ©seau principal",
        createdAt: "2025-06-11T08:45:00",
        completedAt: "2025-06-11T09:15:00"
    },
    {
        id: 2,
        title: "Activation de la cellule de crise",
        phase: 1,
        priority: "P0", 
        role: "strategique",
        status: "done",
        description: "Convoquer tous les membres de la cellule de crise selon le plan d'urgence",
        createdAt: "2025-06-11T08:35:00",
        completedAt: "2025-06-11T09:00:00"
    },
    {
        id: 3,
        title: "DÃ©claration incident ANSSI/CNIL",
        phase: 1,
        priority: "P1",
        role: "juridique",
        status: "done",
        description: "Notification rÃ©glementaire sous 72h aux autoritÃ©s compÃ©tentes",
        createdAt: "2025-06-11T09:00:00",
        completedAt: "2025-06-11T09:30:00"
    },
    {
        id: 4,
        title: "Analyse forensique des logs systÃ¨me",
        phase: 2,
        priority: "P1",
        role: "cyber-it", 
        status: "in-progress",
        description: "Examiner les journaux pour identifier le vecteur d'attaque et la chronologie",
        createdAt: "2025-06-11T09:30:00"
    },
    {
        id: 5,
        title: "Communication interne Ã©quipes soignantes",
        phase: 2,
        priority: "P1",
        role: "communication",
        status: "in-progress", 
        description: "Informer les Ã©quipes mÃ©dicales des procÃ©dures en mode dÃ©gradÃ©",
        createdAt: "2025-06-11T09:45:00"
    },
    {
        id: 6,
        title: "Ãvaluation pÃ©rimÃ¨tre de compromission",
        phase: 2,
        priority: "P0",
        role: "cyber-it",
        status: "in-progress",
        description: "Cartographie complÃ¨te des systÃ¨mes affectÃ©s et potentiellement compromis",
        createdAt: "2025-06-11T10:00:00"
    },
    {
        id: 7,
        title: "Activation plan de continuitÃ© mÃ©tier",
        phase: 2,
        priority: "P1",
        role: "metiers",
        status: "in-progress",
        description: "Basculement vers les procÃ©dures papier et systÃ¨mes de secours",
        createdAt: "2025-06-11T10:15:00"
    },
    {
        id: 8,
        title: "ConfÃ©rence de presse direction",
        phase: 2,
        priority: "P2",
        role: "communication",
        status: "todo",
        description: "PrÃ©paration et organisation point presse pour rassurer patients et familles",
        createdAt: "2025-06-11T10:30:00"
    }
];

// EntrÃ©es de main courante
let mainCourante = [
    {
        id: 1,
        author: "Chef de projet SI",
        time: "09:45",
        content: "Isolation des serveurs patients effectuÃ©e. Aucune propagation dÃ©tectÃ©e sur ce segment."
    },
    {
        id: 2,
        author: "Responsable Communication",
        time: "09:30", 
        content: "ANSSI et CNIL informÃ©es par tÃ©lÃ©phone. Confirmation Ã©crite envoyÃ©e."
    },
    {
        id: 3,
        author: "DSI",
        time: "09:15",
        content: "Cellule de crise activÃ©e. 15 personnes mobilisÃ©es sur site, 10 en tÃ©lÃ©travail sÃ©curisÃ©."
    },
    {
        id: 4,
        author: "Analyste Cyber",
        time: "09:00",
        content: "PremiÃ¨re analyse : ransomware de type Ryuk dÃ©tectÃ©. Investigation en cours sur le vecteur initial."
    }
];

// Ãtat de l'application
let currentPage = 'dashboard';
let filteredActions = [...actions];

const editIncidentModal = document.getElementById('edit-incident-modal');
const editIncidentForm = document.getElementById('edit-incident-form');
const editIncidentErrorMessage = document.getElementById('edit-incident-error-message');
// Selectors for modal fields
const editIncidentIdField = document.getElementById('edit-incident-id');
const editIncidentTitreField = document.getElementById('edit-incident-titre');
const editIncidentDescriptionField = document.getElementById('edit-incident-description');
const editIncidentTypeField = document.getElementById('edit-incident-type');
const editIncidentNiveauCritiqueField = document.getElementById('edit-incident-niveau-critique');
const editIncidentPhaseActuelleField = document.getElementById('edit-incident-phase-actuelle');
const editIncidentStatutField = document.getElementById('edit-incident-statut');
const editIncidentPerimetreImpactField = document.getElementById('edit-incident-perimetre-impact');
const editIncidentDirigeantCriseIdField = document.getElementById('edit-incident-dirigeant-crise-id');
const editIncidentDateFinField = document.getElementById('edit-incident-date-fin');

const editActionModal = document.getElementById('edit-action-modal');
const editActionForm = document.getElementById('edit-action-form');
const editActionErrorMessage = document.getElementById('edit-action-error-message');
// Define field selectors for edit action modal
const editActionIdField = document.getElementById('edit-action-id');
const editActionTitreField = document.getElementById('edit-action-titre');
const editActionDescriptionField = document.getElementById('edit-action-description');
const editActionIncidentIdField = document.getElementById('edit-action-incident-id');
const editActionPhaseField = document.getElementById('edit-action-phase');
const editActionPrioriteField = document.getElementById('edit-action-priorite');
const editActionTypeActionField = document.getElementById('edit-action-type-action');
const editActionAssigneeIdField = document.getElementById('edit-action-assignee-id');
const editActionEquipeResponsableField = document.getElementById('edit-action-equipe-responsable');
const editActionStatutField = document.getElementById('edit-action-statut');
const editActionDateEcheanceField = document.getElementById('edit-action-date-echeance');
const editActionDateDebutExecutionField = document.getElementById('edit-action-date-debut-execution');
const editActionDateFinExecutionField = document.getElementById('edit-action-date-fin-execution');
const editActionTempsEstimeField = document.getElementById('edit-action-temps-estime');
const editActionTempsReelField = document.getElementById('edit-action-temps-reel');
const editActionCommentairesField = document.getElementById('edit-action-commentaires');


async function openEditIncidentModal(incidentId) {
    if (editIncidentErrorMessage) editIncidentErrorMessage.style.display = 'none';
    try {
        const token = localStorage.getItem('gestcyber_token');
        const response = await fetch(`${API_BASE_URL}/incidents/${incidentId}`, {
            headers: { ...(token && { 'x-auth-token': token }) }
        });
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            showNotification(`Erreur: Impossible de charger les détails de l'incident. ${errData.msg || response.statusText}`, 'error');
            return;
        }
        const incident = await response.json();

        editIncidentIdField.value = incident.id;
        editIncidentTitreField.value = incident.titre || '';
        editIncidentDescriptionField.value = incident.description || '';
        editIncidentTypeField.value = incident.type_incident || '';
        editIncidentNiveauCritiqueField.value = incident.niveau_critique || '';
        editIncidentPhaseActuelleField.value = incident.phase_actuelle || '';
        editIncidentStatutField.value = incident.statut || '';
        editIncidentPerimetreImpactField.value = incident.perimetre_impact || '';
        editIncidentDirigeantCriseIdField.value = incident.dirigeant_crise_id || '';
        // Format date_fin for datetime-local input: YYYY-MM-DDTHH:mm
        if (incident.date_fin) {
          const d = new Date(incident.date_fin);
          // Check if date is valid before formatting
          if (!isNaN(d.getTime())) {
              const year = d.getFullYear();
              const month = (d.getMonth() + 1).toString().padStart(2, '0');
              const day = d.getDate().toString().padStart(2, '0');
              const hours = d.getHours().toString().padStart(2, '0');
              const minutes = d.getMinutes().toString().padStart(2, '0');
              editIncidentDateFinField.value = `${year}-${month}-${day}T${hours}:${minutes}`;
          } else {
              editIncidentDateFinField.value = ''; // Clear if date is invalid
          }
        } else {
            editIncidentDateFinField.value = '';
        }

        if (editIncidentModal) editIncidentModal.classList.add('show');
    } catch (error) {
        console.error('Error fetching incident for edit:', error);
        showNotification("Erreur de connexion lors du chargement de l'incident.", 'error');
    }
}

async function handleDeleteIncident(incidentId) {
    // Corrected: Êtes-vous sûr de vouloir supprimer cet incident et toutes ses actions associées ?
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet incident et toutes ses actions associées ?")) {
        try {
            const token = localStorage.getItem('gestcyber_token');
            const response = await fetch(`${API_BASE_URL}/incidents/${incidentId}`, {
                method: 'DELETE',
                headers: { ...(token && { 'x-auth-token': token }) }
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                showNotification(`Erreur: Impossible de supprimer l'incident. ${errData.msg || response.statusText}`, 'error');
                return;
            }
            showNotification('Incident supprimé avec succès !', 'success');
            loadDashboardData(); // Refresh dashboard
        } catch (error) {
            console.error('Error deleting incident:', error);
            showNotification("Erreur de connexion lors de la suppression de l'incident.", 'error');
        }
    }
}

async function openEditActionModal(actionId) {
    if (editActionErrorMessage) editActionErrorMessage.style.display = 'none';
    try {
        const token = localStorage.getItem('gestcyber_token');
        const response = await fetch(`${API_BASE_URL}/actions/${actionId}`, {
            headers: { ...(token && { 'x-auth-token': token }) }
        });
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            showNotification(`Erreur: Impossible de charger les détails de l'action. ${errData.msg || response.statusText}`, 'error');
            return;
        }
        const action = await response.json();

        editActionIdField.value = action.id;
        editActionTitreField.value = action.titre || '';
        editActionDescriptionField.value = action.description || '';
        editActionIncidentIdField.value = action.incident_id || ''; // Display only, not editable
        editActionPhaseField.value = action.phase || '';
        editActionPrioriteField.value = action.priorite || '';
        editActionTypeActionField.value = action.type_action || '';
        editActionAssigneeIdField.value = action.assignee_id || '';
        editActionEquipeResponsableField.value = action.equipe_responsable || '';
        editActionStatutField.value = action.statut || '';

        const formatDateForInput = (dateString) => {
            if (!dateString) return '';
            const d = new Date(dateString);
            if (isNaN(d.getTime())) return '';
            return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}T${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
        };

        editActionDateEcheanceField.value = formatDateForInput(action.date_echeance);
        editActionDateDebutExecutionField.value = formatDateForInput(action.date_debut_execution);
        editActionDateFinExecutionField.value = formatDateForInput(action.date_fin_execution);

        editActionTempsEstimeField.value = action.temps_estime || '';
        editActionTempsReelField.value = action.temps_reel || '';
        editActionCommentairesField.value = action.commentaires || '';

        if (editActionModal) editActionModal.classList.add('show');
    } catch (error) {
        console.error('Error fetching action for edit:', error);
        showNotification("Erreur de connexion lors du chargement de l'action.", 'error');
    }
}

async function handleDeleteAction(actionId) {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette action ?")) {
        try {
            const token = localStorage.getItem('gestcyber_token');
            const response = await fetch(`${API_BASE_URL}/actions/${actionId}`, {
                method: 'DELETE',
                headers: { ...(token && { 'x-auth-token': token }) }
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                showNotification(`Erreur: Impossible de supprimer l'action. ${errData.msg || response.statusText}`, 'error');
                return;
            }
            showNotification('Action supprimée avec succès !', 'success');
            if (typeof applyActionFilters === 'function') {
               applyActionFilters();
            } else {
               generateActionsList();
            }
        } catch (error) {
            console.error('Error deleting action:', error);
            showNotification("Erreur de connexion lors de la suppression de l'action.", 'error');
        }
    }
}


function updateUIForLoggedInState() {
    const token = localStorage.getItem('gestcyber_token');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const newIncidentBtn = document.getElementById('new-incident-btn');
    const userInfoDisplay = document.getElementById('user-info-display'); // Get the display element

    if (token) {
        // User is logged in
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (newIncidentBtn) newIncidentBtn.disabled = false;
        // User info display will be populated by checkAuthStateOnLoad.
        // Here, we just ensure it's not accidentally cleared if it was set.
    } else {
        // User is logged out
        if (loginBtn) loginBtn.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (newIncidentBtn) newIncidentBtn.disabled = true;

        // Clear user info display when logging out or if no token
        if (userInfoDisplay) {
            userInfoDisplay.innerHTML = '';
            // If userInfoDisplay was dynamically added, you might prefer:
            // if (userInfoDisplay.parentElement) userInfoDisplay.parentElement.removeChild(userInfoDisplay);
            // But if it's a permanent div that's just filled, clearing innerHTML is fine.
            // The current checkAuthStateOnLoad appends it, so removing it might be cleaner if it doesn't exist in HTML.
            // For now, assuming it's created by checkAuthStateOnLoad, it might be better to remove it.
            // Let's stick to removing if it was dynamically created by checkAuthStateOnLoad
            if (userInfoDisplay.parentElement && userInfoDisplay.id === 'user-info-display') { // ensure it is the one we created
                 // userInfoDisplay.remove(); // This would require checkAuthStateOnLoad to always recreate it.
                                       // Simpler: just clear its content. checkAuthStateOnLoad will repopulate or create.
                userInfoDisplay.innerHTML = '';
            }
        }
        // Clear dashboard incidents (already handled in logout event, but good for consistency if called elsewhere)
        const timelineContainer = document.querySelector('#dashboard .timeline-recent .timeline');
        if (timelineContainer && !timelineContainer.querySelector('p')?.textContent.includes('Veuillez vous connecter')) {
             timelineContainer.innerHTML = '<p>Veuillez vous connecter pour voir les incidents.</p>';
        }
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('login-btn'); // Already defined in previous step
    const logoutBtn = document.getElementById('logout-btn'); // Get the logout button
    const loginModal = document.getElementById('login-modal'); // Already defined
    const loginForm = document.getElementById('login-form');
    const loginErrorMessage = document.getElementById('login-error-message');
    // const crisisStatusDiv = document.getElementById('crisis-status'); // Example element to update user info
    // const sidebarHeader = document.querySelector('.sidebar-header'); // Example

    initializeNavigation();
    initializeModals();
    updateCrisisTimer();
    generateActionsList();
    generateMainCourante();
    initializeCharts();
    initializeTemplatesAndReports();
    
    // Mise Ã  jour du timer toutes les minutes
    setInterval(updateCrisisTimer, 60000);

    if (document.getElementById('dashboard').classList.contains('active')) {
        loadDashboardData();
    }

    // Login Modal Toggling Logic
    const loginModal = document.getElementById('login-modal');
    const loginBtn = document.getElementById('login-btn');
    const closeLoginModalBtn = document.getElementById('close-login-modal');
    const cancelLoginModalBtn = document.getElementById('cancel-login-modal');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (loginModal) loginModal.classList.add('show');
        });
    }

    if (closeLoginModalBtn) {
        closeLoginModalBtn.addEventListener('click', () => {
            if (loginModal) loginModal.classList.remove('show');
            if (loginErrorMessage) loginErrorMessage.style.display = 'none'; // Clear error
        });
    }

    if (cancelLoginModalBtn) {
        cancelLoginModalBtn.addEventListener('click', () => {
            if (loginModal) loginModal.classList.remove('show');
            if (loginErrorMessage) loginErrorMessage.style.display = 'none'; // Clear error
        });
    }

    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.classList.remove('show');
                if (loginErrorMessage) loginErrorMessage.style.display = 'none'; // Clear error
            }
        });
    }
    // End of Login Modal Toggling Logic

    // Delegated event listeners for edit/delete incident buttons
    const dashboardTimelineContainer = document.querySelector('#dashboard .timeline-recent .card__body');
    if (dashboardTimelineContainer) {
        dashboardTimelineContainer.addEventListener('click', async (e) => {
            if (e.target.classList.contains('edit-incident-btn')) {
                const incidentId = e.target.dataset.id;
                await openEditIncidentModal(incidentId);
            } else if (e.target.classList.contains('delete-incident-btn')) {
                const incidentId = e.target.dataset.id;
                handleDeleteIncident(incidentId);
            }
        });
    }

    // Edit Incident Form Submission
    if (editIncidentForm) {
        editIncidentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (editIncidentErrorMessage) editIncidentErrorMessage.style.display = 'none';

            const incidentId = editIncidentIdField.value;
            const updatedData = {
                titre: editIncidentTitreField.value,
                description: editIncidentDescriptionField.value,
                type_incident: editIncidentTypeField.value,
                niveau_critique: editIncidentNiveauCritiqueField.value,
                phase_actuelle: editIncidentPhaseActuelleField.value,
                statut: editIncidentStatutField.value,
                perimetre_impact: editIncidentPerimetreImpactField.value,
                dirigeant_crise_id: editIncidentDirigeantCriseIdField.value ? parseInt(editIncidentDirigeantCriseIdField.value) : null,
                date_fin: editIncidentDateFinField.value ? new Date(editIncidentDateFinField.value).toISOString() : null
            };

            // Remove null dirigeant_crise_id if field is empty, to avoid sending "NaN" if parsing empty string
            if (!editIncidentDirigeantCriseIdField.value) delete updatedData.dirigeant_crise_id;


            try {
                const token = localStorage.getItem('gestcyber_token');
                const response = await fetch(`${API_BASE_URL}/incidents/${incidentId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { 'x-auth-token': token })
                    },
                    body: JSON.stringify(updatedData)
                });

                const responseData = await response.json();
                if (!response.ok) {
                    if (editIncidentErrorMessage) {
                        editIncidentErrorMessage.textContent = responseData.msg || `Erreur lors de la mise à jour: ${response.statusText}`;
                        editIncidentErrorMessage.style.display = 'block';
                    }
                    return;
                }
                showNotification('Incident mis à jour avec succès !', 'success');
                if (editIncidentModal) editIncidentModal.classList.remove('show');
                loadDashboardData(); // Refresh dashboard
            } catch (error) {
                console.error('Error updating incident:', error);
                if (editIncidentErrorMessage) {
                    editIncidentErrorMessage.textContent = "Erreur de connexion lors de la mise à jour.";
                    editIncidentErrorMessage.style.display = 'block';
                }
            }
        });
    }

    // Edit Incident Modal Close Handlers
    const closeEditIncidentModalBtn = document.getElementById('close-edit-incident-modal');
    const cancelEditIncidentModalBtn = document.getElementById('cancel-edit-incident-modal');

    if (closeEditIncidentModalBtn) {
        closeEditIncidentModalBtn.addEventListener('click', () => {
            if (editIncidentModal) editIncidentModal.classList.remove('show');
            if (editIncidentErrorMessage) editIncidentErrorMessage.style.display = 'none';
        });
    }
    if (cancelEditIncidentModalBtn) {
        cancelEditIncidentModalBtn.addEventListener('click', () => {
            if (editIncidentModal) editIncidentModal.classList.remove('show');
            if (editIncidentErrorMessage) editIncidentErrorMessage.style.display = 'none';
        });
    }
    if (editIncidentModal) {
        editIncidentModal.addEventListener('click', (e) => {
            if (e.target === editIncidentModal) {
                editIncidentModal.classList.remove('show');
                if (editIncidentErrorMessage) editIncidentErrorMessage.style.display = 'none';
            }
        });
    }


    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (loginErrorMessage) loginErrorMessage.style.display = 'none'; // Clear previous errors

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            if (!email || !password) {
                if (loginErrorMessage) {
                    loginErrorMessage.textContent = 'Veuillez saisir votre email et mot de passe.';
                    loginErrorMessage.style.display = 'block';
                }
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (!response.ok) {
                    if (loginErrorMessage) {
                        loginErrorMessage.textContent = data.msg || 'Échec de la connexion. Vérifiez vos identifiants.';
                        loginErrorMessage.style.display = 'block';
                    }
                    return;
                }

                // Successful login
                if (data.token) {
                    localStorage.setItem('gestcyber_token', data.token);
                    showNotification('Connexion réussie !', 'success');
                    if (loginModal) loginModal.classList.remove('show');
                    loginForm.reset();
                    updateUIForLoggedInState(); // Function to update UI (show/hide buttons etc.)
                    loadDashboardData(); // Refresh dashboard data
                } else {
                     if (loginErrorMessage) {
                        loginErrorMessage.textContent = 'Token non reçu du serveur.';
                        loginErrorMessage.style.display = 'block';
                    }
                }

            } catch (error) {
                console.error('Login error:', error);
                if (loginErrorMessage) {
                    loginErrorMessage.textContent = 'Erreur de connexion au serveur. Veuillez réessayer.';
                    loginErrorMessage.style.display = 'block';
                }
            }
        });
    }
    updateUIForLoggedInState(); // Set initial UI state based on token presence

    // Logout Button Event Listener
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('gestcyber_token'); // Remove the token
            showNotification('Déconnexion réussie.', 'info'); // Corrected: Déconnexion réussie.
            updateUIForLoggedInState(); // Update UI to logged-out state

            // Clear dashboard incidents or reset to a default logged-out view
            const timelineContainer = document.querySelector('#dashboard .timeline-recent .timeline');
            if (timelineContainer) {
                timelineContainer.innerHTML = '<p>Veuillez vous connecter pour voir les incidents.</p>'; // Corrected: Veuillez vous connecter...
            } else {
                // If the specific container isn't found, you might want a more general way
                // to signal that the dashboard needs to be cleared or re-rendered for a logged-out state.
                // For now, this targets the known structure.
                const statusOverviewCardBody = document.querySelector('#dashboard .status-overview .card__body');
                if (statusOverviewCardBody) {
                    statusOverviewCardBody.innerHTML = '<p style="text-align: center;">Veuillez vous connecter.</p>';
                }
            }

            // Optionally, if other parts of the UI show user-specific data, clear them here.
            // For example, if a user's name/email was displayed in the sidebar:
            // const userInfoDisplay = document.getElementById('user-info-display');
            // if (userInfoDisplay) {
            //    userInfoDisplay.remove();
            // }

            // If login modal is not automatically shown by updateUIForLoggedInState,
            // you might want to explicitly show it here or ensure loginBtn is clickable.
            // loginModal.classList.add('show'); // Or rely on user clicking loginBtn
        });
    }

    async function checkAuthStateOnLoad() {
        const token = localStorage.getItem('gestcyber_token');
        const loginModal = document.getElementById('login-modal'); // Ensure it's defined

        if (token) {
            console.log('Token found on load, verifying...');
            try {
                const response = await fetch(`${API_BASE_URL}/auth/me`, {
                    method: 'GET',
                    headers: {
                        'x-auth-token': token
                    }
                });

                if (response.ok) {
                    const user = await response.json();
                    console.log('Token valid. User authenticated:', user);
                    // User is authenticated and token is valid
                    updateUIForLoggedInState(); // Ensure UI is in logged-in state
                    loadDashboardData(); // Load initial data for logged-in user

                    // Optionally, display user information (e.g., in sidebar)
                    // This is an enhanced version of the commented-out code in updateUIForLoggedInState
                    const sidebarHeader = document.querySelector('.sidebar-header');
                    let userInfoSpan = document.getElementById('user-info-display');
                    if (!userInfoSpan && sidebarHeader) {
                        userInfoSpan = document.createElement('div'); // Use div for better block layout
                        userInfoSpan.id = 'user-info-display';
                        userInfoSpan.style.fontSize = 'var(--font-size-sm)';
                        userInfoSpan.style.color = 'var(--color-text-secondary)';
                        userInfoSpan.style.marginTop = 'var(--space-8)';
                        userInfoSpan.style.borderTop = '1px solid var(--color-border)';
                        userInfoSpan.style.paddingTop = 'var(--space-8)';
                        sidebarHeader.appendChild(userInfoSpan);
                    }
                    if (userInfoSpan) {
                        userInfoSpan.innerHTML = `Connecté en tant que: <br><strong>${user.email || 'Utilisateur'}</strong> (${user.role || 'Rôle inconnu'})`;
                    }

                } else {
                    // Token is invalid or expired
                    console.log('Token invalid or expired on load.');
                    localStorage.removeItem('gestcyber_token');
                    updateUIForLoggedInState(); // Set UI to logged-out state
                    if (loginModal && !loginModal.classList.contains('show')) { // Show login if not already shown due to other logic
                         // loginModal.classList.add('show'); // Decide if modal should auto-show
                         console.log("User is not logged in. Login button should be visible.");
                    }
                }
            } catch (error) {
                // Network error or backend not reachable
                console.error('Error verifying token on load:', error);
                localStorage.removeItem('gestcyber_token'); // Assume token is bad if network error
                updateUIForLoggedInState();
                // Don't necessarily show login modal on network error,
                // as the app might be offline. User can click login if they want.
                // Display a generic error if appropriate, or rely on component-level errors.
                displayErrorOnDashboard('Impossible de vérifier la session. Le serveur est peut-être indisponible.');
            }
        } else {
            // No token found
            console.log('No token found on load. User is logged out.');
            updateUIForLoggedInState(); // Ensure UI is in logged-out state
            // Optionally, show login modal by default if no token
            // if (loginModal && !loginModal.classList.contains('show')) {
            //    loginModal.classList.add('show');
            // }
        }
    }

    // Call this new function at the end of DOMContentLoaded
    checkAuthStateOnLoad();

    // Delegated event listeners for edit/delete action buttons
    const actionsListContainer = document.getElementById('actions-list');
    if (actionsListContainer) {
        actionsListContainer.addEventListener('click', async (e) => {
            if (e.target.classList.contains('edit-action-btn')) {
                const actionId = e.target.dataset.id;
                await openEditActionModal(actionId);
            } else if (e.target.classList.contains('delete-action-btn')) {
                const actionId = e.target.dataset.id;
                handleDeleteAction(actionId);
            }
        });
    }

    // Edit Action Form Submission
    if (editActionForm) {
        editActionForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (editActionErrorMessage) editActionErrorMessage.style.display = 'none';

            const actionId = editActionIdField.value;
            const updatedData = {
                titre: editActionTitreField.value,
                description: editActionDescriptionField.value,
                phase: editActionPhaseField.value,
                priorite: editActionPrioriteField.value,
                type_action: editActionTypeActionField.value,
                assignee_id: editActionAssigneeIdField.value ? parseInt(editActionAssigneeIdField.value) : null,
                equipe_responsable: editActionEquipeResponsableField.value,
                statut: editActionStatutField.value,
                date_echeance: editActionDateEcheanceField.value ? new Date(editActionDateEcheanceField.value).toISOString() : null,
                date_debut_execution: editActionDateDebutExecutionField.value ? new Date(editActionDateDebutExecutionField.value).toISOString() : null,
                date_fin_execution: editActionDateFinExecutionField.value ? new Date(editActionDateFinExecutionField.value).toISOString() : null,
                temps_estime: editActionTempsEstimeField.value ? parseInt(editActionTempsEstimeField.value) : null,
                temps_reel: editActionTempsReelField.value ? parseInt(editActionTempsReelField.value) : null,
                commentaires: editActionCommentairesField.value
            };
            if (!editActionAssigneeIdField.value) delete updatedData.assignee_id;
            if (!editActionTempsEstimeField.value) delete updatedData.temps_estime;
            if (!editActionTempsReelField.value) delete updatedData.temps_reel;

            try {
                const token = localStorage.getItem('gestcyber_token');
                const response = await fetch(`${API_BASE_URL}/actions/${actionId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { 'x-auth-token': token })
                    },
                    body: JSON.stringify(updatedData)
                });
                const responseData = await response.json();
                if (!response.ok) {
                    if (editActionErrorMessage) {
                        editActionErrorMessage.textContent = responseData.msg || `Erreur lors de la mise à jour de l'action: ${response.statusText}`;
                        editActionErrorMessage.style.display = 'block';
                    }
                    return;
                }
                showNotification('Action mise à jour avec succès !', 'success');
                if (editActionModal) editActionModal.classList.remove('show');
                if (typeof applyActionFilters === 'function') {
                   applyActionFilters();
                } else {
                   generateActionsList();
                }
            } catch (error) {
                console.error('Error updating action:', error);
                if (editActionErrorMessage) {
                    editActionErrorMessage.textContent = "Erreur de connexion lors de la mise à jour de l'action.";
                    editActionErrorMessage.style.display = 'block';
                }
            }
        });
    }

    // Edit Action Modal Close Handlers
    const closeEditActionModalBtn = document.getElementById('close-edit-action-modal');
    const cancelEditActionModalBtn = document.getElementById('cancel-edit-action-modal');

    if (closeEditActionModalBtn) {
        closeEditActionModalBtn.addEventListener('click', () => {
            if (editActionModal) editActionModal.classList.remove('show');
            if (editActionErrorMessage) editActionErrorMessage.style.display = 'none';
        });
    }
    if (cancelEditActionModalBtn) {
        cancelEditActionModalBtn.addEventListener('click', () => {
            if (editActionModal) editActionModal.classList.remove('show');
            if (editActionErrorMessage) editActionErrorMessage.style.display = 'none';
        });
    }
    if (editActionModal) {
        editActionModal.addEventListener('click', (e) => {
            if (e.target === editActionModal) {
                editActionModal.classList.remove('show');
                if (editActionErrorMessage) editActionErrorMessage.style.display = 'none';
            }
        });
    }
});

// Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            
            // Mettre Ã  jour les liens actifs
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Afficher la page correspondante
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(targetPage).classList.add('active');
            
            currentPage = targetPage;
            
            // RÃ©initialiser les graphiques si nÃ©cessaire
            if (targetPage === 'reporting') {
                setTimeout(initializeCharts, 100);
            } else if (targetPage === 'dashboard') {
                loadDashboardData(); // Load data when dashboard becomes active
            }
        });
    });
}

// Gestion des modals
function initializeModals() {
    const incidentModal = document.getElementById('incident-modal');
    const actionModal = document.getElementById('action-modal');
    
    // Gestion du bouton nouveau incident
    const newIncidentBtn = document.getElementById('new-incident-btn');
    if (newIncidentBtn) {
        newIncidentBtn.addEventListener('click', () => {
            incidentModal.classList.add('show');
        });
    }
    
    // Gestion du bouton nouvelle action avec dÃ©lÃ©gation d'Ã©vÃ©nement
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'new-action-btn') {
            actionModal.classList.add('show');
        }
    });
    
    // Fermeture des modals
    document.getElementById('close-incident-modal').addEventListener('click', () => {
        incidentModal.classList.remove('show');
    });
    
    document.getElementById('cancel-incident').addEventListener('click', () => {
        incidentModal.classList.remove('show');
    });
    
    document.getElementById('close-action-modal').addEventListener('click', () => {
        actionModal.classList.remove('show');
    });
    
    document.getElementById('cancel-action').addEventListener('click', () => {
        actionModal.classList.remove('show');
    });
    
    // Fermeture en cliquant Ã  l'extÃ©rieur
    [incidentModal, actionModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });
    
    // Soumission des formulaires
    document.getElementById('incident-form').addEventListener('submit', handleIncidentSubmit);
    document.getElementById('action-form').addEventListener('submit', handleActionSubmit);
}

async function handleIncidentSubmit(e) {
    e.preventDefault();
    const form = e.target;

    const titre = document.getElementById('incident-titre').value;
    const type_incident_value = document.getElementById('incident-type').value;
    const niveau_critique_value = document.getElementById('incident-urgence').value;
    const description = document.getElementById('incident-description').value;

    // Basic frontend validation
    if (!titre || !type_incident_value || !niveau_critique_value || !description) {
        showNotification('Veuillez remplir tous les champs obligatoires.', 'error'); // Corrected: Veuillez
        return;
    }

    const incidentData = {
        titre: titre,
        type_incident: type_incident_value, // Assuming values match DB enum
        niveau_critique: niveau_critique_value, // Assuming values match DB enum
        description: description,
        phase_actuelle: 'phase1_alerter', // Hardcoded default for now
        statut: 'ouvert' // Hardcoded default for now
        // perimetre_impact and dirigeant_crise_id are not in this simple form
    };

    console.log('Submitting incident data:', incidentData);
    const token = localStorage.getItem('gestcyber_token');

    try {
        const response = await fetch(`${API_BASE_URL}/incidents`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'x-auth-token': token })
            },
            body: JSON.stringify(incidentData)
        });

        if (response.status === 401) {
            showNotification('Non autorisé. Veuillez vous connecter.', 'error'); // Corrected: Non autorisé. Veuillez vous connecter.
            // Optionally, redirect to login or display login modal
            return;
        }

        const responseData = await response.json();

        if (!response.ok) { // Covers 400, 500, etc.
            console.error('Failed to create incident:', responseData);
            showNotification(`Erreur: ${responseData.msg || response.statusText || 'Impossible de créer l\'incident'}`, 'error'); // Corrected: Erreur, Impossible de créer l'incident
            return;
        }

        showNotification('Incident déclaré avec succès !', 'success'); // Corrected: Incident déclaré avec succès !
        document.getElementById('incident-modal').classList.remove('show');
        form.reset();

        // Refresh dashboard data to show new incident
        if (document.getElementById('dashboard').classList.contains('active')) {
            loadDashboardData();
        }

    } catch (error) {
        console.error('Error creating incident:', error);
        showNotification('Erreur de connexion lors de la création de l\'incident.', 'error'); // Corrected: Erreur de connexion lors de la création de l'incident.
    }
}

function handleActionSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const inputs = e.target.querySelectorAll('input, select, textarea');
    const newAction = {
        id: actions.length + 1,
        title: inputs[0].value,
        phase: parseInt(inputs[1].value),
        priority: inputs[2].value,
        role: inputs[3].value,
        status: 'todo',
        description: inputs[4].value,
        createdAt: new Date().toISOString()
    };
    
    actions.unshift(newAction);
    filteredActions = [...actions];
    generateActionsList();
    
    document.getElementById('action-modal').classList.remove('show');
    e.target.reset();
    
    // Notification
    showNotification('Action crÃ©Ã©e avec succÃ¨s !', 'success');
}

// Timer de crise
function updateCrisisTimer() {
    const now = new Date();
    const elapsed = now - crisisData.startTime;
    
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    
    const timerElement = document.getElementById('elapsed-time');
    if (timerElement) {
        timerElement.textContent = `${hours}h ${minutes}min`;
    }
}

// GÃ©nÃ©ration de la liste des actions
function generateActionsList() {
    const container = document.getElementById('actions-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    filteredActions.forEach(action => {
        const actionElement = createActionElement(action);
        container.appendChild(actionElement);
    });
    
    // Initialiser les filtres
    initializeActionFilters();
}

function createActionElement(action) {
    const div = document.createElement('div');
    div.className = 'action-item';
    // Ensure role and phase data are available or handled gracefully if not
    const role = roles.find(r => r.id === action.role) || { nom: action.role || 'N/A' };
    // const phaseObj = phases.find(p => p.id === action.phase) || { nom: `Phase ${action.phase}` }; // phases might not be globally available here.

    const statusLabels = { /* ... already defined or define it ... */ };
    const statusClasses = { /* ... already defined or define it ... */ };
    statusLabels['todo'] = 'À faire'; statusLabels['en_cours'] = 'En cours'; statusLabels['bloque'] = 'Bloqué'; statusLabels['termine'] = 'Terminé'; statusLabels['annule'] = 'Annulé';
    statusClasses['todo'] = 'status--info'; statusClasses['en_cours'] = 'status--warning'; statusClasses['bloque'] = 'status--error'; statusClasses['termine'] = 'status--success'; statusClasses['annule'] = 'status--info';


    div.innerHTML = `
        <div class="action-header">
            <h3 class="action-title">${action.titre}</h3>
            <span class="status ${statusClasses[action.statut] || 'status--info'}">${statusLabels[action.statut] || action.statut}</span>
        </div>
        <div class="action-meta">
            <span class="action-tag priority-${action.priorite}">${action.priorite}</span>
            <span class="action-tag role-${action.role || 'default'}">${role.nom}</span>
            <span class="action-tag">Phase ${action.phase}</span>
        </div>
        <p class="action-description">${action.description || ''}</p>
        <div class="action-footer">
            <span class="action-progress">Créé le ${action.created_at ? formatDate(action.created_at) : 'N/A'}</span>
            <div class="action-buttons">
                <button class="btn btn--sm btn--secondary edit-action-btn" data-id="${action.id}" style="margin-left: 5px;">Modifier</button>
                <button class="btn btn--sm btn--outline delete-action-btn" data-id="${action.id}" style="border-color: var(--color-error); color: var(--color-error); margin-left: 5px;">Supprimer</button>
            </div>
        </div>
    `;
    return div;
}

// Filtres des actions
function initializeActionFilters() {
    const phaseFilter = document.getElementById('filter-phase');
    const priorityFilter = document.getElementById('filter-priority');
    const statusFilter = document.getElementById('filter-status');
    
    [phaseFilter, priorityFilter, statusFilter].forEach(filter => {
        if (filter) {
            filter.removeEventListener('change', applyActionFilters);
            filter.addEventListener('change', applyActionFilters);
        }
    });
}

function applyActionFilters() {
    const phaseFilter = document.getElementById('filter-phase').value;
    const priorityFilter = document.getElementById('filter-priority').value;
    const statusFilter = document.getElementById('filter-status').value;
    
    filteredActions = actions.filter(action => {
        return (!phaseFilter || action.phase.toString() === phaseFilter) &&
               (!priorityFilter || action.priority === priorityFilter) &&
               (!statusFilter || action.status === statusFilter);
    });
    
    const container = document.getElementById('actions-list');
    if (container) {
        container.innerHTML = '';
        filteredActions.forEach(action => {
            const actionElement = createActionElement(action);
            container.appendChild(actionElement);
        });
    }
}

// Main courante
function generateMainCourante() {
    const container = document.getElementById('entries-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    mainCourante.forEach(entry => {
        const entryElement = document.createElement('div');
        entryElement.className = 'entry-item';
        
        entryElement.innerHTML = `
            <div class="entry-header">
                <span class="entry-author">${entry.author}</span>
                <span class="entry-time">${entry.time}</span>
            </div>
            <p class="entry-content">${entry.content}</p>
        `;
        
        container.appendChild(entryElement);
    });
    
    // Bouton d'ajout d'entrÃ©e
    const addBtn = document.getElementById('add-entry-btn');
    if (addBtn) {
        addBtn.addEventListener('click', addMainCouranteEntry);
    }
}

function addMainCouranteEntry() {
    const content = prompt('Nouvelle entrÃ©e dans la main courante :');
    if (content && content.trim()) {
        const now = new Date();
        const entry = {
            id: mainCourante.length + 1,
            author: 'Utilisateur actuel',
            time: now.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'}),
            content: content.trim()
        };
        
        mainCourante.unshift(entry);
        generateMainCourante();
        showNotification('EntrÃ©e ajoutÃ©e Ã  la main courante', 'success');
    }
}

// Graphiques
function initializeCharts() {
    // DÃ©truire les graphiques existants s'ils existent
    if (window.progressChart) {
        window.progressChart.destroy();
    }
    if (window.actionsChart) {
        window.actionsChart.destroy();
    }
    
    // Graphique de progression
    const progressCtx = document.getElementById('progressChart');
    if (progressCtx) {
        window.progressChart = new Chart(progressCtx, {
            type: 'line',
            data: {
                labels: ['08:30', '09:00', '09:30', '10:00', '10:30'],
                datasets: [{
                    label: 'Actions terminÃ©es',
                    data: [0, 2, 5, 8, 8],
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Actions crÃ©Ã©es',
                    data: [4, 8, 12, 16, 20],
                    borderColor: '#FFC185',
                    backgroundColor: 'rgba(255, 193, 133, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Graphique rÃ©partition des actions
    const actionsCtx = document.getElementById('actionsChart');
    if (actionsCtx) {
        window.actionsChart = new Chart(actionsCtx, {
            type: 'doughnut',
            data: {
                labels: ['TerminÃ©es', 'En cours', 'Ã faire', 'BloquÃ©es'],
                datasets: [{
                    data: [8, 4, 6, 2],
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Initialisation des templates et rapports
function initializeTemplatesAndReports() {
    // Gestion des templates de communication
    const templateBtns = document.querySelectorAll('.template-btn');
    templateBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const templateType = this.textContent.trim();
            showNotification(`Template "${templateType}" chargÃ©`, 'success');
        });
    });
    
    // Gestion des boutons de rapport
    const reportBtns = document.querySelectorAll('.report-btn');
    reportBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const reportType = this.textContent.trim();
            showNotification(`GÃ©nÃ©ration du rapport "${reportType}" en cours...`, 'info');
        });
    });
}

// Utilitaires
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit', 
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showNotification(message, type = 'info') {
    // CrÃ©ation d'une notification simple
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        background: var(--color-success);
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 1001;
        transition: all 0.3s ease;
        transform: translateX(100%);
        opacity: 0;
    `;
    
    if (type === 'error') {
        notification.style.background = 'var(--color-error)';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animation d'entrÃ©e
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 100);
    
    // Suppression automatique
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Raccourcis clavier
document.addEventListener('keydown', function(e) {
    // Alt + D : Dashboard
    if (e.altKey && e.key === 'd') {
        e.preventDefault();
        document.querySelector('[data-page="dashboard"]').click();
    }
    
    // Alt + A : Actions
    if (e.altKey && e.key === 'a') {
        e.preventDefault();
        document.querySelector('[data-page="actions"]').click();
    }
    
    // Alt + C : Communication
    if (e.altKey && e.key === 'c') {
        e.preventDefault();
        document.querySelector('[data-page="communication"]').click();
    }
    
    // Ãchap : Fermer les modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.show').forEach(modal => {
            modal.classList.remove('show');
        });
    }
});

// Simulation de donnÃ©es en temps rÃ©el
setInterval(function() {
    // Mise Ã  jour alÃ©atoire de quelques mÃ©triques
    const now = new Date();
    if (now.getMinutes() % 5 === 0 && now.getSeconds() === 0) {
        // Toutes les 5 minutes, simuler une mise Ã  jour
        showNotification('Mise Ã  jour des donnÃ©es en temps rÃ©el', 'info');
    }
}, 1000);

// Gestion de la persistance locale simple (simulation)
function saveApplicationState() {
    const state = {
        actions: actions,
        mainCourante: mainCourante,
        currentPage: currentPage,
        lastUpdate: new Date().toISOString()
    };
    
    // En production, ceci serait envoyÃ© vers un serveur
    console.log('Ãtat de l\'application sauvegardÃ©', state);
}

// Sauvegarde pÃ©riodique de l'Ã©tat
setInterval(saveApplicationState, 30000); // Toutes les 30 secondes

// Variables globales pour les labels de statut
const statusLabels = {
    'todo': 'Ã faire',
    'in-progress': 'En cours', 
    'blocked': 'BloquÃ©',
    'done': 'TerminÃ©'
};
