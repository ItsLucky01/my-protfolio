/**
 * LUCKY KUMARI - PORTFOLIO INTERACTIVE APPLICATION LOGIC
 * Dynamic Project Uploads, Certificate Uploads, Profile Management & LocalStorage Persistence
 */

// ==========================================================================
// DEFAULT SEED DATA
// ==========================================================================
const DEFAULT_PROFILE = {
    name: "Lucky Kumari",
    title: "B.Tech IT Student & Web Developer",
    bio: "Passionate IT student interested in Web Development, Software Engineering, and Data Analytics. Dedicated to building efficient applications, learning emerging technologies, and solving real-world challenges.",
    email: "luckykumari@example.com",
    location: "Lucknow, Uttar Pradesh, India",
    degree: "B.Tech (Information Technology)",
    college: "Bansal Institute of Engineering & Technology, Lucknow",
    linkedin: "https://www.linkedin.com/",
    github: "https://github.com/",
    resume: "resume.pdf",
    photo: "images/profile.jpg"
};

const DEFAULT_PROJECTS = [
    {
        id: "proj_1",
        title: "Student Management System",
        category: "software",
        description: "A web application to streamline student registration, academic record keeping, attendance tracking, and administrative grade reporting.",
        tech: ["HTML5", "CSS3", "JavaScript", "MySQL"],
        demoUrl: "",
        githubUrl: "https://github.com/",
        image: "images/project-placeholder.svg"
    },
    {
        id: "proj_2",
        title: "Personal Portfolio Website",
        category: "web",
        description: "A responsive portfolio platform featuring dynamic project & certificate management, dark cyber theme, and smooth mobile navigation.",
        tech: ["HTML5", "CSS3", "JavaScript"],
        demoUrl: "#",
        githubUrl: "https://github.com/",
        image: "images/project-placeholder.svg"
    },
    {
        id: "proj_3",
        title: "College Information Portal",
        category: "web",
        description: "An intuitive web application providing campus notices, department directory, syllabus downloads, and event announcements for students.",
        tech: ["HTML5", "CSS3", "Bootstrap"],
        demoUrl: "",
        githubUrl: "https://github.com/",
        image: "images/project-placeholder.svg"
    }
];

const DEFAULT_CERTIFICATES = [
    {
        id: "cert_1",
        title: "Web Development Specialist",
        issuer: "Coursera / FreeCodeCamp",
        date: "2025",
        link: "https://coursera.org",
        image: "images/cert-placeholder.svg"
    },
    {
        id: "cert_2",
        title: "Data Analytics & Visualization",
        issuer: "IBM / Great Learning",
        date: "2025",
        link: "https://greatlearning.in",
        image: "images/cert-placeholder.svg"
    },
    {
        id: "cert_3",
        title: "Power BI & SQL Foundations",
        issuer: "Microsoft / Udemy",
        date: "2026",
        link: "https://udemy.com",
        image: "images/cert-placeholder.svg"
    }
];

// ==========================================================================
// STATE MANAGEMENT & LOCAL STORAGE HELPERS
// ==========================================================================
const STORAGE_KEYS = {
    PROFILE: 'portfolio_profile_data',
    PROJECTS: 'portfolio_projects_data',
    CERTS: 'portfolio_certificates_data'
};

function getStoredProfile() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
        let parsed = data ? { ...DEFAULT_PROFILE, ...JSON.parse(data) } : { ...DEFAULT_PROFILE };
        // Upgrade any previous default avatar reference to the user's actual profile photo
        if (!parsed.photo || parsed.photo.includes('default-avatar.svg')) {
            parsed.photo = 'images/profile.jpg';
        }
        return parsed;
    } catch (e) {
        console.error("Error reading profile from localStorage", e);
        return { ...DEFAULT_PROFILE };
    }
}

function saveProfile(profile) {
    try {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
        showToast("Storage quota exceeded or error saving profile", "danger");
    }
}

function getStoredProjects() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
        return data ? JSON.parse(data) : [...DEFAULT_PROJECTS];
    } catch (e) {
        console.error("Error reading projects from localStorage", e);
        return [...DEFAULT_PROJECTS];
    }
}

function saveProjects(projects) {
    try {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (e) {
        showToast("Storage quota exceeded. Try using a smaller image.", "danger");
    }
}

function getStoredCertificates() {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.CERTS);
        return data ? JSON.parse(data) : [...DEFAULT_CERTIFICATES];
    } catch (e) {
        console.error("Error reading certificates from localStorage", e);
        return [...DEFAULT_CERTIFICATES];
    }
}

function saveCertificates(certs) {
    try {
        localStorage.setItem(STORAGE_KEYS.CERTS, JSON.stringify(certs));
    } catch (e) {
        showToast("Storage quota exceeded. Try using a smaller image.", "danger");
    }
}

// Current In-Memory State
let profileData = getStoredProfile();
let projectsData = getStoredProjects();
let certificatesData = getStoredCertificates();
let currentProjectFilter = 'all';

// Temporary image stores for form upload preview
let tempProfilePhotoDataUrl = null;
let tempProjectImageDataUrl = null;
let tempCertImageDataUrl = null;

// ==========================================================================
// TOAST NOTIFICATIONS
// ==========================================================================
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' 
        ? '<i class="fa-solid fa-circle-check"></i>' 
        : '<i class="fa-solid fa-circle-exclamation"></i>';

    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

// ==========================================================================
// MODAL CONTROLS
// ==========================================================================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Attach event listeners for closing modals via [data-close-modal] & clicking backdrop
document.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('[data-close-modal]');
    if (closeBtn) {
        const modalId = closeBtn.getAttribute('data-close-modal');
        closeModal(modalId);
    } else if (e.target.classList.contains('modal-backdrop')) {
        e.target.classList.remove('active');
        e.target.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
});

// ESC key to close any active modal
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal-backdrop.active');
        if (activeModal) {
            closeModal(activeModal.id);
        }
    }
});

// ==========================================================================
// RENDER & SYNC PROFILE DATA
// ==========================================================================
function renderProfile() {
    // Hero Section
    const heroName = document.getElementById('heroName');
    const heroTitle = document.getElementById('heroTitle');
    const heroBio = document.getElementById('heroBio');
    const heroResume = document.getElementById('heroResumeBtn');
    const profileImg = document.getElementById('profileImageDisplay');
    const navBrand = document.getElementById('navBrandText');
    const footerBrand = document.getElementById('footerBrandText');
    const footerCopyright = document.getElementById('footerCopyrightName');

    if (heroName) heroName.textContent = profileData.name;
    if (heroTitle) heroTitle.textContent = profileData.title;
    if (heroBio) heroBio.textContent = profileData.bio;
    const currentPhoto = (profileData.photo && !profileData.photo.includes('default-avatar.svg')) 
        ? profileData.photo 
        : 'images/profile.jpg';

    if (profileImg) {
        profileImg.src = currentPhoto;
        profileImg.alt = profileData.name;
    }

    const aboutProfileImg = document.getElementById('aboutProfileImageDisplay');
    if (aboutProfileImg) {
        aboutProfileImg.src = currentPhoto;
        aboutProfileImg.alt = profileData.name;
    }

    const modalAvatarPreview = document.getElementById('modalAvatarPreview');
    if (modalAvatarPreview) {
        modalAvatarPreview.src = currentPhoto;
    }

    // Initials for Brand logo
    const initials = profileData.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 3)
        .toUpperCase();
    if (navBrand) navBrand.textContent = initials || "LK";
    if (footerBrand) footerBrand.textContent = profileData.name;
    if (footerCopyright) footerCopyright.textContent = profileData.name;

    // Resume Button
    if (heroResume) {
        if (profileData.resume && profileData.resume.trim() !== '') {
            heroResume.href = profileData.resume;
            heroResume.style.display = 'inline-flex';
        } else {
            heroResume.href = '#';
        }
    }

    // Social Links updates (LinkedIn, GitHub, Email)
    const linkedInUrl = profileData.linkedin || 'https://www.linkedin.com/';
    const gitHubUrl = profileData.github || 'https://github.com/';
    const emailAddr = profileData.email || 'mailto:luckykumari@example.com';
    const emailMailto = emailAddr.startsWith('mailto:') ? emailAddr : `mailto:${emailAddr}`;

    // Hero Socials
    const heroLinkedIn = document.getElementById('socialLinkedIn');
    const heroGitHub = document.getElementById('socialGitHub');
    const heroEmail = document.getElementById('socialEmail');
    if (heroLinkedIn) heroLinkedIn.href = linkedInUrl;
    if (heroGitHub) heroGitHub.href = gitHubUrl;
    if (heroEmail) heroEmail.href = emailMailto;

    // Contact Section Links
    const contactEmailCard = document.getElementById('contactEmailCard');
    const contactEmailText = document.getElementById('contactEmailText');
    const contactLinkedInCard = document.getElementById('contactLinkedInCard');
    const contactGitHubCard = document.getElementById('contactGitHubCard');
    const contactLocationText = document.getElementById('contactLocationText');

    if (contactEmailCard) contactEmailCard.href = emailMailto;
    if (contactEmailText) contactEmailText.textContent = profileData.email;
    if (contactLinkedInCard) contactLinkedInCard.href = linkedInUrl;
    if (contactGitHubCard) contactGitHubCard.href = gitHubUrl;
    if (contactLocationText) contactLocationText.textContent = profileData.location;

    // About Section Info
    const aboutCardName = document.getElementById('aboutCardName');
    const aboutCardRole = document.getElementById('aboutCardRole');
    const aboutLocation = document.getElementById('aboutLocation');
    const aboutEmail = document.getElementById('aboutEmail');
    if (aboutCardName) aboutCardName.textContent = profileData.name;
    if (aboutCardRole) aboutCardRole.textContent = profileData.title;
    if (aboutLocation) aboutLocation.textContent = profileData.location;
    if (aboutEmail) aboutEmail.textContent = profileData.email;

    // Footer Socials
    const footerLinkedIn = document.getElementById('footerLinkedIn');
    const footerGitHub = document.getElementById('footerGitHub');
    const footerEmail = document.getElementById('footerEmail');
    if (footerLinkedIn) footerLinkedIn.href = linkedInUrl;
    if (footerGitHub) footerGitHub.href = gitHubUrl;
    if (footerEmail) footerEmail.href = emailMailto;

    // Update Counts
    updateStatsCounts();
}

function updateStatsCounts() {
    const projCount = document.getElementById('statsProjectCount');
    const certCount = document.getElementById('statsCertCount');
    if (projCount) projCount.textContent = `${projectsData.length}+`;
    if (certCount) certCount.textContent = `${certificatesData.length}+`;
}

// Pre-fill Profile Form Fields
function populateProfileForm() {
    document.getElementById('inputProfileName').value = profileData.name || '';
    document.getElementById('inputProfileTitle').value = profileData.title || '';
    document.getElementById('inputProfileBio').value = profileData.bio || '';
    document.getElementById('inputProfileLinkedIn').value = profileData.linkedin || '';
    document.getElementById('inputProfileGitHub').value = profileData.github || '';
    document.getElementById('inputProfileEmail').value = profileData.email || '';
    document.getElementById('inputProfileLocation').value = profileData.location || '';
    document.getElementById('inputProfileResume').value = profileData.resume || '';
    
    const preview = document.getElementById('modalAvatarPreview');
    if (preview) {
        preview.src = (profileData.photo && !profileData.photo.includes('default-avatar.svg')) 
            ? profileData.photo 
            : 'images/profile.jpg';
    }
    tempProfilePhotoDataUrl = null;
}

// Handle Profile Photo Upload
const profileImageFileInput = document.getElementById('profileImageFileInput');
if (profileImageFileInput) {
    profileImageFileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 3 * 1024 * 1024) {
            showToast("File size too large! Please choose an image under 3MB.", "danger");
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            tempProfilePhotoDataUrl = event.target.result;
            const preview = document.getElementById('modalAvatarPreview');
            if (preview) preview.src = tempProfilePhotoDataUrl;
            showToast("Photo selected! Click 'Save Profile' to apply.", "success");
        };
        reader.readAsDataURL(file);
    });
}

// Save Profile Form Submission
const profileForm = document.getElementById('profileForm');
if (profileForm) {
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();

        profileData.name = document.getElementById('inputProfileName').value.trim() || profileData.name;
        profileData.title = document.getElementById('inputProfileTitle').value.trim() || profileData.title;
        profileData.bio = document.getElementById('inputProfileBio').value.trim() || profileData.bio;
        profileData.linkedin = document.getElementById('inputProfileLinkedIn').value.trim() || profileData.linkedin;
        profileData.github = document.getElementById('inputProfileGitHub').value.trim() || profileData.github;
        profileData.email = document.getElementById('inputProfileEmail').value.trim() || profileData.email;
        profileData.location = document.getElementById('inputProfileLocation').value.trim() || profileData.location;
        profileData.resume = document.getElementById('inputProfileResume').value.trim() || profileData.resume;

        if (tempProfilePhotoDataUrl) {
            profileData.photo = tempProfilePhotoDataUrl;
        }

        saveProfile(profileData);
        renderProfile();
        closeModal('profileModal');
        showToast("Profile and Social links updated successfully! ✨", "success");
    });
}

// Open Profile Modal triggers
const openProfileBtn = document.getElementById('openProfileSettingsBtn');
const openProfileMobileBtn = document.getElementById('openProfileSettingsMobileBtn');
const quickChangePhotoBtn = document.getElementById('quickChangePhotoBtn');

function triggerOpenProfileModal() {
    populateProfileForm();
    openModal('profileModal');
}

if (openProfileBtn) openProfileBtn.addEventListener('click', triggerOpenProfileModal);
if (openProfileMobileBtn) openProfileMobileBtn.addEventListener('click', () => {
    closeMobileMenu();
    triggerOpenProfileModal();
});
if (quickChangePhotoBtn) quickChangePhotoBtn.addEventListener('click', triggerOpenProfileModal);


// ==========================================================================
// RENDER & MANAGE PROJECTS
// ==========================================================================
function renderProjects(filter = 'all') {
    currentProjectFilter = filter;
    const container = document.getElementById('projectsContainer');
    if (!container) return;

    const filteredProjects = filter === 'all' 
        ? projectsData 
        : projectsData.filter(p => p.category.toLowerCase() === filter.toLowerCase());

    if (filteredProjects.length === 0) {
        container.innerHTML = `
            <div class="empty-state-card">
                <i class="fa-solid fa-laptop-code"></i>
                <h3>No Projects Found</h3>
                <p>No projects in this category yet. Click below to add one!</p>
                <button class="btn btn-primary btn-sm" onclick="openAddProjectModal()">
                    <i class="fa-solid fa-plus"></i> Upload Project
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredProjects.map(project => {
        // Tech tags HTML
        const techHtml = Array.isArray(project.tech) 
            ? project.tech.map(t => `<span class="tech-tag">${escapeHtml(t.trim())}</span>`).join('')
            : '';

        // Category label
        const categoryLabels = {
            web: 'Web Dev',
            software: 'Software App',
            data: 'Data Analytics',
            other: 'Project'
        };
        const catLabel = categoryLabels[project.category] || 'Project';

        // Links
        const demoBtnHtml = project.demoUrl && project.demoUrl.trim() !== '' && project.demoUrl !== '#'
            ? `<a href="${escapeHtml(project.demoUrl)}" target="_blank" rel="noopener noreferrer" class="btn-card-link" title="Open Live Preview">
                <i class="fa-solid fa-arrow-up-right-from-square"></i> Demo
               </a>`
            : '';

        const githubBtnHtml = project.githubUrl && project.githubUrl.trim() !== ''
            ? `<a href="${escapeHtml(project.githubUrl)}" target="_blank" rel="noopener noreferrer" class="btn-card-link" title="View Source Code">
                <i class="fa-brands fa-github"></i> Code
               </a>`
            : '';

        const coverImage = project.image || 'images/project-placeholder.svg';

        return `
            <div class="project-card" data-id="${project.id}">
                <div class="project-thumb">
                    <img src="${coverImage}" alt="${escapeHtml(project.title)}" onerror="this.src='images/project-placeholder.svg'">
                    <span class="project-category-badge">${catLabel}</span>
                </div>
                <div class="project-body">
                    <h3 class="project-title">${escapeHtml(project.title)}</h3>
                    <p class="project-desc">${escapeHtml(project.description)}</p>
                    <div class="project-tech-tags">
                        ${techHtml}
                    </div>
                    <div class="project-actions">
                        <div class="project-links">
                            ${demoBtnHtml}
                            ${githubBtnHtml}
                        </div>
                        <button class="btn-card-danger" onclick="deleteProject('${project.id}')" title="Delete Project">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    updateStatsCounts();
}

// Project Category Filter Buttons
const projectFilterGroup = document.getElementById('projectFilters');
if (projectFilterGroup) {
    projectFilterGroup.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;

        projectFilterGroup.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        renderProjects(filter);
    });
}

// Open Add Project Modal
function openAddProjectModal() {
    const form = document.getElementById('projectForm');
    if (form) form.reset();
    document.getElementById('projectEditId').value = '';
    document.getElementById('projectModalHeading').textContent = 'Upload / Add Project';
    document.getElementById('projectImagePreview').src = 'images/project-placeholder.svg';
    tempProjectImageDataUrl = null;
    openModal('projectModal');
}

const openAddProjectModalBtn = document.getElementById('openAddProjectModalBtn');
if (openAddProjectModalBtn) {
    openAddProjectModalBtn.addEventListener('click', openAddProjectModal);
}

// Project Image File Upload Preview
const projectImageFileInput = document.getElementById('projectImageFileInput');
if (projectImageFileInput) {
    projectImageFileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 3 * 1024 * 1024) {
            showToast("File size too large! Please choose an image under 3MB.", "danger");
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            tempProjectImageDataUrl = event.target.result;
            document.getElementById('projectImagePreview').src = tempProjectImageDataUrl;
        };
        reader.readAsDataURL(file);
    });
}

// Project Image URL Input Listener
const inputProjectImageUrl = document.getElementById('inputProjectImageUrl');
if (inputProjectImageUrl) {
    inputProjectImageUrl.addEventListener('input', function(e) {
        const url = e.target.value.trim();
        if (url) {
            document.getElementById('projectImagePreview').src = url;
            tempProjectImageDataUrl = null; // Prioritize input URL if provided
        } else {
            document.getElementById('projectImagePreview').src = 'images/project-placeholder.svg';
        }
    });
}

// Project Form Submission
const projectForm = document.getElementById('projectForm');
if (projectForm) {
    projectForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const title = document.getElementById('inputProjectTitle').value.trim();
        const category = document.getElementById('inputProjectCategory').value;
        const description = document.getElementById('inputProjectDescription').value.trim();
        const techStr = document.getElementById('inputProjectTech').value.trim();
        const demoUrl = document.getElementById('inputProjectDemoUrl').value.trim();
        const githubUrl = document.getElementById('inputProjectGithubUrl').value.trim();
        const urlInput = document.getElementById('inputProjectImageUrl').value.trim();

        if (!title || !description || !techStr) {
            showToast("Please fill in all required fields.", "danger");
            return;
        }

        const techArray = techStr.split(',').map(t => t.trim()).filter(t => t.length > 0);

        // Determine Image
        let finalImage = 'images/project-placeholder.svg';
        if (tempProjectImageDataUrl) {
            finalImage = tempProjectImageDataUrl;
        } else if (urlInput) {
            finalImage = urlInput;
        }

        const newProject = {
            id: 'proj_' + Date.now(),
            title,
            category,
            description,
            tech: techArray,
            demoUrl,
            githubUrl,
            image: finalImage
        };

        // Add to top of projects array
        projectsData.unshift(newProject);
        saveProjects(projectsData);
        renderProjects(currentProjectFilter);
        closeModal('projectModal');
        showToast("Project uploaded successfully! 🚀", "success");
    });
}

// Delete Project
window.deleteProject = function(projectId) {
    if (!confirm("Are you sure you want to delete this project?")) return;

    projectsData = projectsData.filter(p => p.id !== projectId);
    saveProjects(projectsData);
    renderProjects(currentProjectFilter);
    showToast("Project deleted.", "success");
};


// ==========================================================================
// RENDER & MANAGE CERTIFICATES
// ==========================================================================
function renderCertificates() {
    const container = document.getElementById('certificatesContainer');
    if (!container) return;

    if (certificatesData.length === 0) {
        container.innerHTML = `
            <div class="empty-state-card">
                <i class="fa-solid fa-award"></i>
                <h3>No Certificates Yet</h3>
                <p>Upload your achievements and course completion certificates!</p>
                <button class="btn btn-primary btn-sm" onclick="openAddCertModal()">
                    <i class="fa-solid fa-plus"></i> Upload Certificate
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = certificatesData.map(cert => {
        const certImage = cert.image || 'images/cert-placeholder.svg';
        const verifyBtnHtml = cert.link && cert.link.trim() !== ''
            ? `<a href="${escapeHtml(cert.link)}" target="_blank" rel="noopener noreferrer" class="btn-card-link" onclick="event.stopPropagation()">
                <i class="fa-solid fa-arrow-up-right-from-square"></i> Verify
               </a>`
            : '';

        return `
            <div class="certificate-card" onclick="openLightbox('${cert.id}')">
                <div class="cert-thumb">
                    <img src="${certImage}" alt="${escapeHtml(cert.title)}" onerror="this.src='images/cert-placeholder.svg'">
                    <div class="cert-preview-hover-tag">
                        <i class="fa-solid fa-magnifying-glass-plus"></i>
                        <span>Click to Preview</span>
                    </div>
                </div>
                <div class="cert-body">
                    <span class="cert-issuer"><i class="fa-solid fa-certificate"></i> ${escapeHtml(cert.issuer)}</span>
                    <h3 class="cert-title">${escapeHtml(cert.title)}</h3>
                    <span class="cert-date">${cert.date ? 'Issued: ' + escapeHtml(cert.date) : ''}</span>
                    <div class="cert-actions">
                        ${verifyBtnHtml}
                        <button class="btn-card-danger" onclick="event.stopPropagation(); deleteCertificate('${cert.id}')" title="Delete Certificate">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    updateStatsCounts();
}

// Open Add Certificate Modal
function openAddCertModal() {
    const form = document.getElementById('certificateForm');
    if (form) form.reset();
    document.getElementById('certEditId').value = '';
    document.getElementById('certModalHeading').textContent = 'Upload / Add Certificate';
    document.getElementById('certImagePreview').src = 'images/cert-placeholder.svg';
    tempCertImageDataUrl = null;
    openModal('certificateModal');
}

const openAddCertificateModalBtn = document.getElementById('openAddCertificateModalBtn');
if (openAddCertificateModalBtn) {
    openAddCertificateModalBtn.addEventListener('click', openAddCertModal);
}

// Certificate Image File Upload Preview
const certImageFileInput = document.getElementById('certImageFileInput');
if (certImageFileInput) {
    certImageFileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 3 * 1024 * 1024) {
            showToast("File size too large! Please choose an image under 3MB.", "danger");
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            tempCertImageDataUrl = event.target.result;
            document.getElementById('certImagePreview').src = tempCertImageDataUrl;
        };
        reader.readAsDataURL(file);
    });
}

// Certificate Image URL Input
const inputCertImageUrl = document.getElementById('inputCertImageUrl');
if (inputCertImageUrl) {
    inputCertImageUrl.addEventListener('input', function(e) {
        const url = e.target.value.trim();
        if (url) {
            document.getElementById('certImagePreview').src = url;
            tempCertImageDataUrl = null;
        } else {
            document.getElementById('certImagePreview').src = 'images/cert-placeholder.svg';
        }
    });
}

// Certificate Form Submission
const certificateForm = document.getElementById('certificateForm');
if (certificateForm) {
    certificateForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const title = document.getElementById('inputCertTitle').value.trim();
        const issuer = document.getElementById('inputCertIssuer').value.trim();
        const date = document.getElementById('inputCertDate').value.trim();
        const link = document.getElementById('inputCertLink').value.trim();
        const urlInput = document.getElementById('inputCertImageUrl').value.trim();

        if (!title || !issuer) {
            showToast("Please fill in title and issuing organization.", "danger");
            return;
        }

        let finalImage = 'images/cert-placeholder.svg';
        if (tempCertImageDataUrl) {
            finalImage = tempCertImageDataUrl;
        } else if (urlInput) {
            finalImage = urlInput;
        }

        const newCert = {
            id: 'cert_' + Date.now(),
            title,
            issuer,
            date,
            link,
            image: finalImage
        };

        certificatesData.unshift(newCert);
        saveCertificates(certificatesData);
        renderCertificates();
        closeModal('certificateModal');
        showToast("Certificate uploaded successfully! 🏆", "success");
    });
}

// Delete Certificate
window.deleteCertificate = function(certId) {
    if (!confirm("Are you sure you want to remove this certificate?")) return;

    certificatesData = certificatesData.filter(c => c.id !== certId);
    saveCertificates(certificatesData);
    renderCertificates();
    showToast("Certificate removed.", "success");
};

// Certificate Lightbox
window.openLightbox = function(certId) {
    const cert = certificatesData.find(c => c.id === certId);
    if (!cert) return;

    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxIssuer = document.getElementById('lightboxIssuer');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxVerifyBtn = document.getElementById('lightboxVerifyBtn');

    if (lightboxTitle) lightboxTitle.textContent = cert.title;
    if (lightboxIssuer) lightboxIssuer.textContent = `Issued by: ${cert.issuer} ${cert.date ? '(' + cert.date + ')' : ''}`;
    if (lightboxImage) lightboxImage.src = cert.image || 'images/cert-placeholder.svg';

    if (lightboxVerifyBtn) {
        if (cert.link && cert.link.trim() !== '') {
            lightboxVerifyBtn.href = cert.link;
            lightboxVerifyBtn.style.display = 'inline-flex';
        } else {
            lightboxVerifyBtn.style.display = 'none';
        }
    }

    openModal('lightboxModal');
};


// ==========================================================================
// DATA EXPORT, IMPORT & RESET
// ==========================================================================
const exportDataBtn = document.getElementById('exportDataBtn');
if (exportDataBtn) {
    exportDataBtn.addEventListener('click', () => {
        const fullBackup = {
            profile: profileData,
            projects: projectsData,
            certificates: certificatesData,
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio-backup-${profileData.name.replace(/\s+/g, '-').toLowerCase()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast("Backup downloaded successfully! 📁", "success");
    });
}

const importDataFileInput = document.getElementById('importDataFileInput');
if (importDataFileInput) {
    importDataFileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const parsed = JSON.parse(event.target.result);
                if (parsed.profile) {
                    profileData = { ...DEFAULT_PROFILE, ...parsed.profile };
                    saveProfile(profileData);
                }
                if (Array.isArray(parsed.projects)) {
                    projectsData = parsed.projects;
                    saveProjects(projectsData);
                }
                if (Array.isArray(parsed.certificates)) {
                    certificatesData = parsed.certificates;
                    saveCertificates(certificatesData);
                }

                renderProfile();
                renderProjects(currentProjectFilter);
                renderCertificates();
                closeModal('profileModal');
                showToast("Portfolio data imported successfully! 🎉", "success");
            } catch (err) {
                showToast("Invalid JSON backup file.", "danger");
            }
        };
        reader.readAsText(file);
    });
}

const resetDataBtn = document.getElementById('resetDataBtn');
if (resetDataBtn) {
    resetDataBtn.addEventListener('click', () => {
        if (!confirm("Reset all projects, certificates, and profile to initial defaults?")) return;

        localStorage.removeItem(STORAGE_KEYS.PROFILE);
        localStorage.removeItem(STORAGE_KEYS.PROJECTS);
        localStorage.removeItem(STORAGE_KEYS.CERTS);

        profileData = { ...DEFAULT_PROFILE };
        projectsData = [...DEFAULT_PROJECTS];
        certificatesData = [...DEFAULT_CERTIFICATES];

        renderProfile();
        renderProjects('all');
        renderCertificates();
        closeModal('profileModal');
        showToast("Portfolio reset to default state.", "success");
    });
}


// ==========================================================================
// CONTACT FORM HANDLER
// ==========================================================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('contactSenderName').value.trim();
        const email = document.getElementById('contactSenderEmail').value.trim();
        const subject = document.getElementById('contactSubject').value.trim();
        const message = document.getElementById('contactMessage').value.trim();

        if (!name || !email || !message) {
            showToast("Please fill in all required fields.", "danger");
            return;
        }

        // Feedback toast
        showToast(`Thank you, ${name}! Your message has been prepared.`, "success");
        contactForm.reset();
    });
}


// ==========================================================================
// NAVIGATION & MOBILE MENU
// ==========================================================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

function toggleMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.toggle('active');
}

function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('active');
}

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
}

document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Scrollspy for active navigation links
const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let currentSection = '';
    const scrollPosition = window.pageYOffset + 200;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});

// Footer year sync
const currentYearSpan = document.getElementById('currentYear');
if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
}

// Utility: HTML Sanitizer
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}


// ==========================================================================
// INITIAL APPLICATION BOOTSTRAP
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    renderProfile();
    renderProjects('all');
    renderCertificates();
});
