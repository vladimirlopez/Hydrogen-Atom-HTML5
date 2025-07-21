/**
 * Controls and UI Management
 * ==========================
 * 
 * This module manages all the user interface controls and their
 * interactions with the visualization engine.
 */

class ControlsManager {
    constructor(visualization) {
        this.visualization = visualization;
        this.quantumMath = new QuantumMath();
        
        this.setupEventListeners();
        this.updateQuantumNumberOptions();
        this.updateInfo();
    }

    setupEventListeners() {
        // Quantum number controls
        document.getElementById('n-quantum').addEventListener('change', (e) => {
            this.updateLOptions(parseInt(e.target.value));
            this.updateVisualization();
        });

        document.getElementById('l-quantum').addEventListener('change', (e) => {
            this.updateMOptions(parseInt(e.target.value));
            this.updateVisualization();
        });

        document.getElementById('m-quantum').addEventListener('change', () => {
            this.updateVisualization();
        });

        // Visualization controls
        document.getElementById('visualization-type').addEventListener('change', (e) => {
            this.updateVisualizationType(e.target.value);
        });

        document.getElementById('cross-section').addEventListener('change', (e) => {
            this.visualization.updateCrossSectionPlane(e.target.value);
        });

        // Slider controls
        document.getElementById('opacity').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            document.getElementById('opacity-value').textContent = value.toFixed(1);
            this.visualization.updateOpacity(value);
        });

        document.getElementById('threshold').addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            document.getElementById('threshold-value').textContent = value.toFixed(3);
            this.visualization.updateThreshold(value);
        });

        // Button controls
        document.getElementById('animate-btn').addEventListener('click', () => {
            this.toggleAnimation();
        });

        document.getElementById('reset-view').addEventListener('click', () => {
            this.visualization.resetView();
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.visualization.onWindowResize();
        });

        // Cross-section control visibility
        this.updateCrossSectionVisibility();
        document.getElementById('visualization-type').addEventListener('change', () => {
            this.updateCrossSectionVisibility();
        });
    }

    updateQuantumNumberOptions() {
        // Initialize with 1s orbital
        this.updateLOptions(1);
        this.updateMOptions(0);
    }

    updateLOptions(n) {
        const lSelect = document.getElementById('l-quantum');
        lSelect.innerHTML = '';

        for (let l = 0; l < n; l++) {
            const option = document.createElement('option');
            option.value = l;
            option.textContent = `${l} (${this.getSubshellName(l)})`;
            lSelect.appendChild(option);
        }

        // Reset to l=0 when n changes
        lSelect.value = '0';
        this.updateMOptions(0);
    }

    updateMOptions(l) {
        const mSelect = document.getElementById('m-quantum');
        mSelect.innerHTML = '';

        for (let m = -l; m <= l; m++) {
            const option = document.createElement('option');
            option.value = m;
            option.textContent = m.toString();
            mSelect.appendChild(option);
        }

        // Reset to m=0 when l changes
        mSelect.value = '0';
    }

    getSubshellName(l) {
        const names = ['s', 'p', 'd', 'f', 'g', 'h'];
        return names[l] || l.toString();
    }

    updateVisualization() {
        const n = parseInt(document.getElementById('n-quantum').value);
        const l = parseInt(document.getElementById('l-quantum').value);
        const m = parseInt(document.getElementById('m-quantum').value);

        this.visualization.updateQuantumNumbers(n, l, m);
        this.updateInfo();
    }

    updateVisualizationType(type) {
        this.visualization.updateVisualizationType(type);
        this.updateCrossSectionVisibility();
    }

    updateCrossSectionVisibility() {
        const type = document.getElementById('visualization-type').value;
        const crossSectionControl = document.getElementById('cross-section').parentElement;
        
        if (type === '2d-cross') {
            crossSectionControl.style.display = 'block';
        } else {
            crossSectionControl.style.display = 'none';
        }
    }

    updateInfo() {
        const n = parseInt(document.getElementById('n-quantum').value);
        const l = parseInt(document.getElementById('l-quantum').value);
        const m = parseInt(document.getElementById('m-quantum').value);

        // Update orbital name
        const orbitalName = this.quantumMath.getOrbitalName(n, l, m);
        document.getElementById('orbital-name').textContent = `${orbitalName} Orbital`;

        // Update quantum numbers display
        document.getElementById('n-display').textContent = n;
        document.getElementById('l-display').textContent = l;
        document.getElementById('m-display').textContent = m;

        // Update energy
        const energy = this.quantumMath.energyLevel(n);
        document.getElementById('energy-value').textContent = `${energy.toFixed(2)} eV`;

        // Update nodes
        const radialNodes = this.quantumMath.getRadialNodes(n, l);
        const angularNodes = this.quantumMath.getAngularNodes(l);
        document.getElementById('radial-nodes').textContent = radialNodes;
        document.getElementById('angular-nodes').textContent = angularNodes;

        // Update equations
        this.updateEquations(n, l, m);
    }

    updateEquations(n, l, m) {
        const waveFunctionEq = this.quantumMath.getWaveFunctionEquation(n, l, m);
        const radialFunctionEq = this.quantumMath.getRadialFunctionEquation(n, l);
        const angularFunctionEq = this.quantumMath.getAngularFunctionEquation(l, m);

        document.getElementById('wave-function-eq').textContent = waveFunctionEq;
        document.getElementById('radial-function-eq').textContent = radialFunctionEq;
        document.getElementById('angular-function-eq').textContent = angularFunctionEq;
    }

    toggleAnimation() {
        this.visualization.toggleAnimation();
        const button = document.getElementById('animate-btn');
        
        if (this.visualization.isAnimating) {
            button.textContent = 'Stop Animation';
            button.style.background = 'linear-gradient(45deg, #ff4444, #ff6666)';
        } else {
            button.textContent = 'Animate Rotation';
            button.style.background = 'linear-gradient(45deg, #ffd700, #ffed4e)';
        }
    }

    // Preset orbital configurations
    setOrbital(n, l, m) {
        document.getElementById('n-quantum').value = n;
        this.updateLOptions(n);
        document.getElementById('l-quantum').value = l;
        this.updateMOptions(l);
        document.getElementById('m-quantum').value = m;
        this.updateVisualization();
    }

    // Quick orbital selection methods
    set1s() { this.setOrbital(1, 0, 0); }
    set2s() { this.setOrbital(2, 0, 0); }
    set2p() { this.setOrbital(2, 1, 0); }
    set3s() { this.setOrbital(3, 0, 0); }
    set3p() { this.setOrbital(3, 1, 0); }
    set3d() { this.setOrbital(3, 2, 0); }
    set4s() { this.setOrbital(4, 0, 0); }

    // Keyboard shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case '1':
                        e.preventDefault();
                        this.set1s();
                        break;
                    case '2':
                        e.preventDefault();
                        if (e.shiftKey) this.set2p();
                        else this.set2s();
                        break;
                    case '3':
                        e.preventDefault();
                        if (e.shiftKey) this.set3p();
                        else if (e.altKey) this.set3d();
                        else this.set3s();
                        break;
                    case '4':
                        e.preventDefault();
                        this.set4s();
                        break;
                    case 'r':
                        e.preventDefault();
                        this.visualization.resetView();
                        break;
                    case 'a':
                        e.preventDefault();
                        this.toggleAnimation();
                        break;
                }
            }
        });

        // Add keyboard shortcuts info
        this.showKeyboardShortcuts();
    }

    showKeyboardShortcuts() {
        const shortcutsInfo = document.createElement('div');
        shortcutsInfo.className = 'keyboard-shortcuts';
        shortcutsInfo.innerHTML = `
            <h4>Keyboard Shortcuts:</h4>
            <ul>
                <li><kbd>Ctrl+1</kbd> - 1s orbital</li>
                <li><kbd>Ctrl+2</kbd> - 2s orbital</li>
                <li><kbd>Ctrl+Shift+2</kbd> - 2p orbital</li>
                <li><kbd>Ctrl+3</kbd> - 3s orbital</li>
                <li><kbd>Ctrl+Shift+3</kbd> - 3p orbital</li>
                <li><kbd>Ctrl+Alt+3</kbd> - 3d orbital</li>
                <li><kbd>Ctrl+R</kbd> - Reset view</li>
                <li><kbd>Ctrl+A</kbd> - Toggle animation</li>
            </ul>
        `;

        // Add to control panel
        document.querySelector('.control-panel').appendChild(shortcutsInfo);
    }

    // Performance monitoring
    setupPerformanceMonitoring() {
        this.performanceStats = {
            frameCount: 0,
            lastTime: performance.now(),
            fps: 0
        };

        const fpsDisplay = document.createElement('div');
        fpsDisplay.id = 'fps-display';
        fpsDisplay.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
        `;
        document.body.appendChild(fpsDisplay);

        this.updateFPS();
    }

    updateFPS() {
        const now = performance.now();
        this.performanceStats.frameCount++;

        if (now - this.performanceStats.lastTime >= 1000) {
            this.performanceStats.fps = Math.round(
                (this.performanceStats.frameCount * 1000) / 
                (now - this.performanceStats.lastTime)
            );
            
            document.getElementById('fps-display').textContent = 
                `FPS: ${this.performanceStats.fps}`;
            
            this.performanceStats.frameCount = 0;
            this.performanceStats.lastTime = now;
        }

        requestAnimationFrame(() => this.updateFPS());
    }

    // Export current state
    exportState() {
        const state = {
            quantumNumbers: {
                n: parseInt(document.getElementById('n-quantum').value),
                l: parseInt(document.getElementById('l-quantum').value),
                m: parseInt(document.getElementById('m-quantum').value)
            },
            visualizationType: document.getElementById('visualization-type').value,
            crossSectionPlane: document.getElementById('cross-section').value,
            opacity: parseFloat(document.getElementById('opacity').value),
            threshold: parseFloat(document.getElementById('threshold').value),
            cameraPosition: this.visualization.camera.position.toArray(),
            timestamp: new Date().toISOString()
        };

        return JSON.stringify(state, null, 2);
    }

    // Import state
    importState(stateJson) {
        try {
            const state = JSON.parse(stateJson);
            
            // Set quantum numbers
            this.setOrbital(
                state.quantumNumbers.n,
                state.quantumNumbers.l,
                state.quantumNumbers.m
            );

            // Set visualization options
            document.getElementById('visualization-type').value = state.visualizationType;
            document.getElementById('cross-section').value = state.crossSectionPlane;
            document.getElementById('opacity').value = state.opacity;
            document.getElementById('threshold').value = state.threshold;

            // Update displays
            document.getElementById('opacity-value').textContent = state.opacity.toFixed(1);
            document.getElementById('threshold-value').textContent = state.threshold.toFixed(3);

            // Set camera position
            this.visualization.camera.position.fromArray(state.cameraPosition);

            // Update visualization
            this.updateVisualizationType(state.visualizationType);
            this.visualization.updateCrossSectionPlane(state.crossSectionPlane);
            this.visualization.updateOpacity(state.opacity);
            this.visualization.updateThreshold(state.threshold);

            return true;
        } catch (error) {
            console.error('Failed to import state:', error);
            return false;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ControlsManager;
}

// Global class for browser use
if (typeof window !== 'undefined') {
    window.ControlsManager = ControlsManager;
}
