// Intelligent API routing: Use Cloud Run backend if hosted on GitHub Pages, otherwise use relative path
const API_BASE_URL = window.location.hostname.includes('github.io') 
    ? 'https://smart-stadium-dashboard-770201920290.us-central1.run.app/api' 
    : '/api';

// DOM Elements
const matchContainer = document.getElementById('live-match-container');
const newsList = document.getElementById('news-list');
const facilitiesContainer = document.getElementById('facilities-container');
const lastUpdateTime = document.getElementById('last-update-time');

// Fetch Live Scores
async function fetchLiveScores() {
    try {
        const response = await fetch(`${API_BASE_URL}/live-scores`);
        const result = await response.json();
        
        if (result.success && result.data.length > 0) {
            renderMatches(result.data);
        } else {
            matchContainer.innerHTML = '<p>No live matches currently.</p>';
        }
    } catch (error) {
        console.error('Error fetching live scores:', error);
        matchContainer.innerHTML = '<p>Unable to load live scores.</p>';
    }
}

// Fetch News
async function fetchNews() {
    try {
        const response = await fetch(`${API_BASE_URL}/news`);
        const result = await response.json();
        
        if (result.success) {
            renderNews(result.data);
        }
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

// Fetch Stadium Status
async function fetchStadiumStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/stadium-status`);
        const result = await response.json();
        
        if (result.success) {
            renderStadiumStatus(result.data);
            updateMapVisualization(result.data);
            
            const now = new Date();
            lastUpdateTime.innerText = now.toLocaleTimeString();
        }
    } catch (error) {
        console.error('Error fetching stadium status:', error);
    }
}

// Render Functions
function renderMatches(matches) {
    matchContainer.innerHTML = '';
    
    matches.forEach(match => {
        const isLive = match.status === 'Live';
        
        let scoreHtml = `
            <div class="team-score">
                <span class="team-name">${match.team1.name}</span>
                <span class="score">${match.team1.score} <span class="overs">(${match.team1.overs})</span></span>
            </div>
            <div class="team-score">
                <span class="team-name">${match.team2.name}</span>
                <span class="score">${match.team2.score || 'Yet to bat'} ${match.team2.overs ? `<span class="overs">(${match.team2.overs})</span>` : ''}</span>
            </div>
        `;
        
        if (!isLive) {
            scoreHtml = `
                <div class="team-score">
                    <span class="team-name">${match.team1.name}</span>
                    <span class="score">vs</span>
                </div>
                <div class="team-score">
                    <span class="team-name">${match.team2.name}</span>
                </div>
            `;
        }

        const card = document.createElement('div');
        card.className = 'match-card';
        card.innerHTML = `
            <div class="match-title">${match.title} - <strong>${match.status}</strong></div>
            ${scoreHtml}
            <div class="match-summary">${match.summary}</div>
            ${match.currentRunRate ? `<div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-muted);">CRR: ${match.currentRunRate} | Proj: ${match.projectedScore}</div>` : ''}
        `;
        
        matchContainer.appendChild(card);
    });
}

function renderNews(newsItems) {
    newsList.innerHTML = '';
    
    newsItems.forEach(item => {
        const li = document.createElement('li');
        li.className = 'news-item';
        li.innerHTML = `
            <div class="news-headline">${item.headline}</div>
            <div class="news-time"><i class="fa-regular fa-clock"></i> ${item.time}</div>
        `;
        newsList.appendChild(li);
    });
}

function renderStadiumStatus(zones) {
    facilitiesContainer.innerHTML = '';
    
    // Only show top 4 zones in facilities grid for space
    zones.slice(0, 4).forEach(zone => {
        const card = document.createElement('div');
        card.className = 'facility-card';
        card.innerHTML = `
            <div class="facility-name">${zone.zone}</div>
            <div class="wait-times">
                <div class="wait-time"><i class="fa-solid fa-burger" style="color: var(--warning)"></i> ${zone.concessionWaitTime}m</div>
                <div class="wait-time"><i class="fa-solid fa-restroom" style="color: var(--primary)"></i> ${zone.restroomWaitTime}m</div>
            </div>
        `;
        facilitiesContainer.appendChild(card);
    });
}

function updateMapVisualization(zones) {
    zones.forEach(data => {
        // Find map element
        const zoneElements = document.querySelectorAll('.zone');
        let targetZone = null;
        
        zoneElements.forEach(el => {
            if (el.getAttribute('data-zone') === data.zone) {
                targetZone = el;
            }
        });
        
        if (targetZone) {
            const densityVal = targetZone.querySelector('.density-val');
            densityVal.innerText = `${data.density}%`;
            
            // Remove existing color classes
            densityVal.classList.remove('density-low', 'density-medium', 'density-high');
            
            // Add appropriate color class based on density
            if (data.density < 40) {
                densityVal.classList.add('density-low');
            } else if (data.density < 75) {
                densityVal.classList.add('density-medium');
            } else {
                densityVal.classList.add('density-high');
            }
        }
    });
}

// Initialization and intervals
function init() {
    // Initial fetch
    fetchLiveScores();
    fetchNews();
    fetchStadiumStatus();
    
    // Set intervals for real-time updates
    setInterval(fetchLiveScores, 30000); // 30s
    setInterval(fetchNews, 60000); // 60s
    setInterval(fetchStadiumStatus, 5000); // 5s for fast demo
}

// Run init when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// --- SPA Routing Logic ---
const navButtons = document.querySelectorAll('.nav-btn');
const views = document.querySelectorAll('.view-section');

navButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all buttons
        navButtons.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Hide all views
        views.forEach(v => {
            v.style.display = 'none';
            v.classList.remove('active-view');
        });
        
        // Show target view
        const targetId = btn.getAttribute('data-target');
        const targetView = document.getElementById(targetId);
        if (targetView) {
            targetView.style.display = targetId === 'view-dashboard' ? 'grid' : 'flex';
            targetView.classList.add('active-view');
        }
    });
});
