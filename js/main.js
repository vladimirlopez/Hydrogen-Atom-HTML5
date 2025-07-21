/**
 * Main Application Entry Point
 * ============================
 * 
 * This module initializes the entire hydrogen atom simulation application
 * and coordinates all the different components.
 */

class HydrogenAtomApp {
    constructor(skipLoadingScreen = false) {
        this.isInitialized = false;
        this.loadingOverlay = null;
        this.skipLoadingScreen = skipLoadingScreen;
        
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Starting Hydrogen Atom Simulation initialization...');
            
            // Only show loading screen if not skipped
            if (!this.skipLoadingScreen) {
                this.showLoadingScreen();
            }
            
            // Wait for DOM to be ready
            console.log('⏳ Waiting for DOM...');
            await this.waitForDOM();
            console.log('✓ DOM ready');
            
            // Check for Three.js
            console.log('⏳ Checking Three.js...');
            if (typeof THREE === 'undefined') {
                throw new Error('Three.js library not loaded');
            }
            console.log('✓ Three.js available');
            
            // Add OrbitControls to THREE if not already available
            console.log('⏳ Checking OrbitControls...');
            if (!THREE.OrbitControls) {
                console.log('⏳ Loading OrbitControls...');
                await this.loadOrbitControls();
            }
            console.log('✓ OrbitControls available');
            
            // Check for required classes
            console.log('⏳ Checking required classes...');
            if (typeof QuantumMath === 'undefined') {
                throw new Error('QuantumMath class not loaded');
            }
            if (typeof HydrogenVisualization === 'undefined') {
                throw new Error('HydrogenVisualization class not loaded');
            }
            if (typeof ControlsManager === 'undefined') {
                throw new Error('ControlsManager class not loaded');
            }
            if (typeof TutorialManager === 'undefined') {
                throw new Error('TutorialManager class not loaded');
            }
            console.log('✓ All required classes available');
            
            // Initialize core components
            console.log('⏳ Initializing components...');
            this.initializeComponents();
            console.log('✓ Components initialized');
            
            // Setup application features
            console.log('⏳ Setting up features...');
            this.setupFeatures();
            console.log('✓ Features set up');
            
            // Start the application
            console.log('⏳ Starting application...');
            this.start();
            console.log('✓ Application started');
            
            setTimeout(() => {
                if (!this.skipLoadingScreen) {
                    this.hideLoadingScreen();
                }
                this.isInitialized = true;
                console.log('🎉 Hydrogen Atom Simulation initialized successfully!');
            }, 1000);
            
        } catch (error) {
            console.error('❌ Failed to initialize application:', error);
            this.showError(`Failed to initialize the simulation: ${error.message}. Please refresh the page.`);
        }
    }

    showLoadingScreen() {
        this.loadingOverlay = document.createElement('div');
        this.loadingOverlay.className = 'loading-overlay';
        this.loadingOverlay.innerHTML = `
            <div class="loading-content">
                <div class="atom-spinner">
                    <div class="nucleus"></div>
                    <div class="electron-orbit orbit-1">
                        <div class="electron"></div>
                    </div>
                    <div class="electron-orbit orbit-2">
                        <div class="electron"></div>
                    </div>
                    <div class="electron-orbit orbit-3">
                        <div class="electron"></div>
                    </div>
                </div>
                <h2>Initializing Quantum Simulation...</h2>
                <p>Loading hydrogen atom wave functions</p>
                <div class="progress-bar">
                    <div class="progress-fill" id="loading-progress"></div>
                </div>
            </div>
        `;

        // Add CSS for loading screen
        const style = document.createElement('style');
        style.textContent = `
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                color: white;
            }
            
            .loading-content {
                text-align: center;
                max-width: 400px;
            }
            
            .atom-spinner {
                width: 120px;
                height: 120px;
                position: relative;
                margin: 0 auto 30px;
            }
            
            .nucleus {
                width: 20px;
                height: 20px;
                background: #ff6b6b;
                border-radius: 50%;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                box-shadow: 0 0 20px #ff6b6b;
            }
            
            .electron-orbit {
                position: absolute;
                border: 2px solid rgba(255, 215, 0, 0.3);
                border-radius: 50%;
                animation: rotate 3s linear infinite;
            }
            
            .orbit-1 {
                width: 60px;
                height: 60px;
                top: 30px;
                left: 30px;
                animation-duration: 2s;
            }
            
            .orbit-2 {
                width: 90px;
                height: 90px;
                top: 15px;
                left: 15px;
                animation-duration: 3s;
                animation-direction: reverse;
            }
            
            .orbit-3 {
                width: 120px;
                height: 120px;
                top: 0;
                left: 0;
                animation-duration: 4s;
            }
            
            .electron {
                width: 8px;
                height: 8px;
                background: #ffd700;
                border-radius: 50%;
                position: absolute;
                top: -4px;
                left: 50%;
                transform: translateX(-50%);
                box-shadow: 0 0 10px #ffd700;
            }
            
            @keyframes rotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            .loading-content h2 {
                margin-bottom: 10px;
                font-size: 1.5em;
            }
            
            .loading-content p {
                margin-bottom: 20px;
                opacity: 0.8;
            }
            
            .progress-bar {
                width: 100%;
                height: 4px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 2px;
                overflow: hidden;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #ffd700, #ffed4e);
                width: 0%;
                transition: width 0.3s ease;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(this.loadingOverlay);

        // Simulate loading progress
        this.simulateLoading();
    }

    simulateLoading() {
        const progressBar = document.getElementById('loading-progress');
        let progress = 0;
        
        const updateProgress = () => {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            
            progressBar.style.width = `${progress}%`;
            
            if (progress < 100) {
                setTimeout(updateProgress, 200 + Math.random() * 300);
            }
        };
        
        updateProgress();
    }

    hideLoadingScreen() {
        if (this.loadingOverlay) {
            this.loadingOverlay.style.opacity = '0';
            this.loadingOverlay.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                if (this.loadingOverlay && this.loadingOverlay.parentNode) {
                    this.loadingOverlay.parentNode.removeChild(this.loadingOverlay);
                }
            }, 500);
        }
    }

    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    async loadOrbitControls() {
        return new Promise((resolve, reject) => {
            // Try to load OrbitControls from CDN
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';
            script.onload = () => {
                // The script will add OrbitControls to THREE
                resolve();
            };
            script.onerror = () => {
                // Fallback: create a basic OrbitControls implementation
                console.warn('Could not load OrbitControls from CDN, using fallback');
                this.createFallbackOrbitControls();
                resolve();
            };
            document.head.appendChild(script);
        });
    }

    createFallbackOrbitControls() {
        // Simple fallback OrbitControls implementation
        THREE.OrbitControls = function(camera, domElement) {
            this.camera = camera;
            this.domElement = domElement;
            this.enableDamping = true;
            this.dampingFactor = 0.05;
            this.enableZoom = true;
            this.autoRotate = false;
            this.autoRotateSpeed = 2.0;
            
            this.spherical = new THREE.Spherical();
            this.sphericalDelta = new THREE.Spherical();
            this.target = new THREE.Vector3();
            this.scale = 1;
            
            this.update = () => {
                if (this.autoRotate) {
                    this.sphericalDelta.theta += 0.01;
                }
                
                this.spherical.theta += this.sphericalDelta.theta;
                this.spherical.phi += this.sphericalDelta.phi;
                this.spherical.radius *= this.scale;
                
                const position = new THREE.Vector3();
                position.setFromSpherical(this.spherical);
                position.add(this.target);
                
                this.camera.position.copy(position);
                this.camera.lookAt(this.target);
                
                this.sphericalDelta.set(0, 0, 0);
                this.scale = 1;
            };
            
            this.reset = () => {
                this.spherical.setFromVector3(this.camera.position.clone().sub(this.target));
                this.update();
            };
            
            // Initialize
            this.reset();
        };
    }

    initializeComponents() {
        // Initialize visualization engine
        this.visualization = new HydrogenVisualization('main-canvas');
        
        // Initialize controls manager
        this.controlsManager = new ControlsManager(this.visualization);
        
        // Initialize tutorial manager
        this.tutorialManager = new TutorialManager(this.controlsManager);
        
        // Make globally accessible for debugging
        window.visualization = this.visualization;
        window.controlsManager = this.controlsManager;
        window.tutorialManager = this.tutorialManager;
    }

    setupFeatures() {
        // Setup keyboard shortcuts
        this.controlsManager.setupKeyboardShortcuts();
        
        // Setup performance monitoring
        this.controlsManager.setupPerformanceMonitoring();
        
        // Setup error handling
        this.setupErrorHandling();
        
        // Setup responsive design
        this.setupResponsiveDesign();
        
        // Setup accessibility features
        this.setupAccessibility();
    }

    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Application error:', e.error);
            this.showError('An unexpected error occurred. Some features may not work correctly.');
        });

        // Handle WebGL context loss
        const canvas = document.getElementById('main-canvas');
        canvas.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            this.showError('WebGL context lost. Please refresh the page to restore 3D visualization.');
        });
    }

    setupResponsiveDesign() {
        // Handle window resize
        window.addEventListener('resize', () => {
            this.visualization.onWindowResize();
            
            // Adjust layout for mobile
            this.adjustMobileLayout();
        });

        // Initial mobile layout check
        this.adjustMobileLayout();
    }

    adjustMobileLayout() {
        const isMobile = window.innerWidth <= 768;
        const mainContent = document.querySelector('.main-content');
        
        if (isMobile) {
            mainContent.style.gridTemplateColumns = '1fr';
            
            // Adjust canvas size for mobile
            const canvas = document.getElementById('main-canvas');
            canvas.style.maxHeight = '300px';
        } else {
            mainContent.style.gridTemplateColumns = '300px 1fr';
            
            // Reset canvas size
            const canvas = document.getElementById('main-canvas');
            canvas.style.maxHeight = '';
        }
    }

    setupAccessibility() {
        // Add ARIA labels
        this.addAriaLabels();
        
        // Setup focus management
        this.setupFocusManagement();
        
        // Add screen reader announcements
        this.setupScreenReaderAnnouncements();
    }

    addAriaLabels() {
        const controls = [
            { id: 'n-quantum', label: 'Principal quantum number' },
            { id: 'l-quantum', label: 'Angular momentum quantum number' },
            { id: 'm-quantum', label: 'Magnetic quantum number' },
            { id: 'visualization-type', label: 'Visualization type' },
            { id: 'opacity', label: 'Visualization opacity' },
            { id: 'threshold', label: 'Probability threshold' }
        ];

        controls.forEach(control => {
            const element = document.getElementById(control.id);
            if (element) {
                element.setAttribute('aria-label', control.label);
            }
        });
    }

    setupFocusManagement() {
        // Trap focus in tutorial steps
        document.querySelectorAll('.tutorial-step').forEach(step => {
            const focusableElements = step.querySelectorAll('button, input, select');
            if (focusableElements.length > 0) {
                step.setAttribute('tabindex', '-1');
            }
        });
    }

    setupScreenReaderAnnouncements() {
        // Create announcement region
        const announcer = document.createElement('div');
        announcer.id = 'screen-reader-announcements';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        document.body.appendChild(announcer);

        // Announce orbital changes
        const originalSetOrbital = this.controlsManager.setOrbital.bind(this.controlsManager);
        this.controlsManager.setOrbital = (n, l, m) => {
            originalSetOrbital(n, l, m);
            const orbitalName = this.controlsManager.quantumMath.getOrbitalName(n, l, m);
            const energy = this.controlsManager.quantumMath.energyLevel(n);
            announcer.textContent = `Selected ${orbitalName} orbital with energy ${energy.toFixed(2)} electron volts`;
        };
    }

    start() {
        // Initial render
        this.visualization.updateVisualization();
        
        // Welcome message
        setTimeout(() => {
            this.showWelcomeMessage();
        }, 1000);
        
        // Analytics (if needed)
        this.trackUsage();
    }

    showWelcomeMessage() {
        const welcomeModal = document.createElement('div');
        welcomeModal.className = 'welcome-modal';
        welcomeModal.innerHTML = `
            <div class="welcome-content">
                <h2>🎉 Welcome to the Hydrogen Atom Simulation!</h2>
                <p>Explore the quantum mechanical world of the hydrogen atom through interactive 3D visualizations.</p>
                <div class="welcome-features">
                    <div class="feature">
                        <span class="feature-icon">🔬</span>
                        <h3>Interactive 3D Orbitals</h3>
                        <p>Visualize electron probability densities in 3D</p>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">📊</span>
                        <h3>Multiple Views</h3>
                        <p>Cross-sections, radial functions, and energy diagrams</p>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">🎓</span>
                        <h3>Guided Tutorial</h3>
                        <p>Learn quantum mechanics step by step</p>
                    </div>
                </div>
                <div class="welcome-actions">
                    <button id="start-tutorial">Start Tutorial</button>
                    <button id="explore-freely">Explore Freely</button>
                </div>
            </div>
        `;

        // Add styles for welcome modal
        const style = document.createElement('style');
        style.textContent = `
            .welcome-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                backdrop-filter: blur(5px);
            }
            
            .welcome-content {
                background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                padding: 40px;
                border-radius: 20px;
                max-width: 600px;
                color: white;
                text-align: center;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .welcome-content h2 {
                margin-bottom: 20px;
                color: #ffd700;
            }
            
            .welcome-features {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 20px;
                margin: 30px 0;
            }
            
            .feature {
                text-align: center;
            }
            
            .feature-icon {
                font-size: 2em;
                display: block;
                margin-bottom: 10px;
            }
            
            .feature h3 {
                font-size: 1.1em;
                margin-bottom: 5px;
                color: #ffed4e;
            }
            
            .feature p {
                font-size: 0.9em;
                opacity: 0.8;
            }
            
            .welcome-actions {
                display: flex;
                gap: 15px;
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .welcome-actions button {
                padding: 12px 24px;
                font-size: 16px;
                min-width: 150px;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(welcomeModal);

        // Handle welcome modal actions
        document.getElementById('start-tutorial').addEventListener('click', () => {
            this.tutorialManager.goToStep(1);
            document.body.removeChild(welcomeModal);
        });

        document.getElementById('explore-freely').addEventListener('click', () => {
            this.tutorialManager.startExploration();
            document.body.removeChild(welcomeModal);
        });
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div class="error-content">
                <span class="error-icon">⚠️</span>
                <span class="error-text">${message}</span>
                <button class="error-close">×</button>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            .error-message {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ff4444;
                color: white;
                padding: 15px;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(255, 68, 68, 0.3);
                z-index: 1000;
                max-width: 400px;
                animation: slideIn 0.3s ease;
            }
            
            .error-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .error-text {
                flex: 1;
            }
            
            .error-close {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                width: auto;
                min-width: auto;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;

        if (!document.querySelector('style[data-error-styles]')) {
            style.setAttribute('data-error-styles', 'true');
            document.head.appendChild(style);
        }

        document.body.appendChild(errorDiv);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 10000);

        // Manual close
        errorDiv.querySelector('.error-close').addEventListener('click', () => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        });
    }

    trackUsage() {
        // Simple usage tracking (privacy-friendly)
        const sessionData = {
            startTime: new Date().toISOString(),
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`,
            webGLSupported: !!window.WebGLRenderingContext,
            touchSupported: 'ontouchstart' in window
        };

        console.log('Session started:', sessionData);
        
        // Track orbital views
        let orbitalViews = 0;
        const originalSetOrbital = this.controlsManager.setOrbital.bind(this.controlsManager);
        this.controlsManager.setOrbital = (...args) => {
            originalSetOrbital(...args);
            orbitalViews++;
            console.log(`Orbital views: ${orbitalViews}`);
        };
    }

    // Public API methods
    getVersion() {
        return '1.0.0';
    }

    getInfo() {
        return {
            version: this.getVersion(),
            initialized: this.isInitialized,
            components: {
                visualization: !!this.visualization,
                controls: !!this.controlsManager,
                tutorial: !!this.tutorialManager
            }
        };
    }

    // Cleanup method
    destroy() {
        if (this.visualization) {
            this.visualization.dispose();
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('error', this.handleError);
        
        console.log('Application destroyed');
    }
}

// Initialize the application when the page loads
// HydrogenAtomApp class and functions defined above

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HydrogenAtomApp;
}
