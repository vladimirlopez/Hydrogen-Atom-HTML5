/**
 * Interactive Tutorial System
 * ===========================
 * 
 * This module manages the interactive tutorial that guides users
 * through learning about hydrogen atom quantum mechanics.
 */

class TutorialManager {
    constructor(controlsManager) {
        this.controlsManager = controlsManager;
        this.currentStep = 1;
        this.totalSteps = 4;
        this.tutorialActive = true;
        
        this.setupTutorialEvents();
        this.setupInteractiveExamples();
    }

    setupTutorialEvents() {
        // Check if tutorial elements exist before setting up events
        const nextStepButtons = document.querySelectorAll('.next-step');
        if (nextStepButtons.length > 0) {
            nextStepButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const nextStep = parseInt(e.target.dataset.next);
                    this.goToStep(nextStep);
                });
            });
        }

        // Previous step buttons
        const prevStepButtons = document.querySelectorAll('.prev-step');
        if (prevStepButtons.length > 0) {
            prevStepButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const prevStep = parseInt(e.target.dataset.prev);
                    this.goToStep(prevStep);
                });
            });
        }

        // Start exploration button
        const startExplorationBtn = document.querySelector('.start-exploration');
        if (startExplorationBtn) {
            startExplorationBtn.addEventListener('click', () => {
                this.startExploration();
            });
        }

        // Auto-advance tutorial based on user actions
        this.setupAutoAdvance();
    }

    setupInteractiveExamples() {
        // Add interactive examples for each tutorial step
        this.examples = {
            1: () => this.demonstrateQuantumNumbers(),
            2: () => this.demonstrateEnergyLevels(),
            3: () => this.demonstrateOrbitalShapes(),
            4: () => this.demonstrateProbabilityDensity()
        };
    }

    goToStep(stepNumber) {
        if (stepNumber < 1 || stepNumber > this.totalSteps) return;

        // Hide all steps
        document.querySelectorAll('.tutorial-step').forEach(step => {
            step.classList.remove('active');
        });

        // Show current step
        document.getElementById(`step-${stepNumber}`).classList.add('active');
        this.currentStep = stepNumber;

        // Run interactive example for this step
        if (this.examples[stepNumber]) {
            setTimeout(() => this.examples[stepNumber](), 500);
        }

        // Update progress indicator
        this.updateProgressIndicator();
    }

    updateProgressIndicator() {
        // Create or update progress bar
        let progressBar = document.getElementById('tutorial-progress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.id = 'tutorial-progress';
            progressBar.innerHTML = `
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                <div class="progress-text">Step ${this.currentStep} of ${this.totalSteps}</div>
            `;
            document.querySelector('.tutorial-content').prepend(progressBar);
        }

        const progressFill = progressBar.querySelector('.progress-fill');
        const progressText = progressBar.querySelector('.progress-text');
        
        const percentage = (this.currentStep / this.totalSteps) * 100;
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `Step ${this.currentStep} of ${this.totalSteps}`;
    }

    demonstrateQuantumNumbers() {
        // Highlight quantum number controls
        const controls = ['n-quantum', 'l-quantum', 'm-quantum'];
        this.highlightElements(controls);

        // Show example transitions
        this.showQuantumNumberExample();
    }

    demonstrateEnergyLevels() {
        // Set visualization to energy levels
        document.getElementById('visualization-type').value = 'energy';
        this.controlsManager.updateVisualizationType('energy');

        // Animate through different n values
        this.animateEnergyLevels();
    }

    demonstrateOrbitalShapes() {
        // Switch to 3D visualization
        document.getElementById('visualization-type').value = '3d';
        this.controlsManager.updateVisualizationType('3d');

        // Cycle through different orbital shapes
        this.cycleOrbitalShapes();
    }

    demonstrateProbabilityDensity() {
        // Show 2D cross-section
        document.getElementById('visualization-type').value = '2d-cross';
        this.controlsManager.updateVisualizationType('2d-cross');

        // Demonstrate probability interpretation
        this.demonstrateProbabilityInterpretation();
    }

    showQuantumNumberExample() {
        const examples = [
            { n: 1, l: 0, m: 0, description: "1s orbital - spherical, lowest energy" },
            { n: 2, l: 0, m: 0, description: "2s orbital - larger sphere, higher energy" },
            { n: 2, l: 1, m: 0, description: "2p orbital - dumbbell shape" },
            { n: 3, l: 2, m: 0, description: "3d orbital - complex shape" }
        ];

        let index = 0;
        const showNext = () => {
            if (index < examples.length) {
                const example = examples[index];
                this.controlsManager.setOrbital(example.n, example.l, example.m);
                
                this.showTooltip(example.description, 3000);
                
                index++;
                setTimeout(showNext, 4000);
            }
        };

        showNext();
    }

    animateEnergyLevels() {
        const energyLevels = [1, 2, 3, 4];
        let index = 0;

        const showLevel = () => {
            if (index < energyLevels.length) {
                const n = energyLevels[index];
                this.controlsManager.setOrbital(n, 0, 0);
                
                const energy = this.controlsManager.quantumMath.energyLevel(n);
                this.showTooltip(`n=${n}: Energy = ${energy.toFixed(2)} eV`, 2500);
                
                index++;
                setTimeout(showLevel, 3000);
            }
        };

        showLevel();
    }

    cycleOrbitalShapes() {
        const orbitals = [
            { n: 1, l: 0, m: 0, name: "1s - Spherical" },
            { n: 2, l: 1, m: 0, name: "2p - Dumbbell" },
            { n: 3, l: 2, m: 0, name: "3d - Four-leaf clover" },
            { n: 3, l: 2, m: 2, name: "3d - Different orientation" }
        ];

        let index = 0;
        const showOrbital = () => {
            if (index < orbitals.length) {
                const orbital = orbitals[index];
                this.controlsManager.setOrbital(orbital.n, orbital.l, orbital.m);
                this.showTooltip(orbital.name, 3000);
                
                index++;
                setTimeout(showOrbital, 4000);
            }
        };

        showOrbital();
    }

    demonstrateProbabilityInterpretation() {
        // Cycle through different cross-section planes
        const planes = ['xz', 'xy', 'yz'];
        let index = 0;

        const showPlane = () => {
            if (index < planes.length) {
                document.getElementById('cross-section').value = planes[index];
                this.controlsManager.visualization.updateCrossSectionPlane(planes[index]);
                
                this.showTooltip(`${planes[index].toUpperCase()} plane cross-section`, 3000);
                
                index++;
                setTimeout(showPlane, 4000);
            }
        };

        showPlane();
    }

    highlightElements(elementIds, duration = 3000) {
        elementIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.classList.add('highlight', 'pulse');
                setTimeout(() => {
                    element.classList.remove('highlight', 'pulse');
                }, duration);
            }
        });
    }

    showTooltip(message, duration = 3000) {
        // Create tooltip element
        let tooltip = document.getElementById('tutorial-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.id = 'tutorial-tooltip';
            tooltip.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(45deg, #4CAF50, #66BB6A);
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                font-size: 16px;
                font-weight: bold;
                box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                z-index: 1000;
                max-width: 400px;
                text-align: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(tooltip);
        }

        tooltip.textContent = message;
        tooltip.style.opacity = '1';

        setTimeout(() => {
            tooltip.style.opacity = '0';
        }, duration);
    }

    setupAutoAdvance() {
        // Auto-advance tutorial based on user interactions
        let userInteractions = 0;
        const requiredInteractions = 3;

        const trackInteraction = () => {
            userInteractions++;
            if (userInteractions >= requiredInteractions && this.tutorialActive) {
                this.suggestNextStep();
                userInteractions = 0; // Reset counter
            }
        };

        // Track quantum number changes
        ['n-quantum', 'l-quantum', 'm-quantum'].forEach(id => {
            document.getElementById(id).addEventListener('change', trackInteraction);
        });

        // Track visualization type changes
        document.getElementById('visualization-type').addEventListener('change', trackInteraction);
    }

    suggestNextStep() {
        if (this.currentStep < this.totalSteps) {
            this.showTooltip(`Great! You're getting the hang of it. Ready for step ${this.currentStep + 1}?`, 4000);
            
            // Auto-advance after a delay
            setTimeout(() => {
                if (this.tutorialActive) {
                    this.goToStep(this.currentStep + 1);
                }
            }, 5000);
        }
    }

    startExploration() {
        this.tutorialActive = false;
        
        // Hide tutorial section
        document.querySelector('.tutorial-section').style.display = 'none';
        
        // Show exploration mode message
        this.showTooltip("Tutorial complete! You're now in exploration mode. Have fun discovering the quantum world!", 5000);
        
        // Add exploration features
        this.setupExplorationMode();
    }

    setupExplorationMode() {
        // Add quick orbital buttons
        this.addQuickOrbitalButtons();
        
        // Add comparison mode
        this.addComparisonMode();
        
        // Add export/share functionality
        this.addExportFeatures();
    }

    addQuickOrbitalButtons() {
        const quickButtons = document.createElement('div');
        quickButtons.className = 'quick-orbitals';
        quickButtons.innerHTML = `
            <h3>Quick Orbital Selection</h3>
            <div class="orbital-buttons">
                <button onclick="controlsManager.set1s()">1s</button>
                <button onclick="controlsManager.set2s()">2s</button>
                <button onclick="controlsManager.set2p()">2p</button>
                <button onclick="controlsManager.set3s()">3s</button>
                <button onclick="controlsManager.set3p()">3p</button>
                <button onclick="controlsManager.set3d()">3d</button>
            </div>
        `;

        document.querySelector('.control-panel').appendChild(quickButtons);
    }

    addComparisonMode() {
        const comparisonSection = document.createElement('div');
        comparisonSection.className = 'comparison-mode';
        comparisonSection.innerHTML = `
            <h3>Comparison Mode</h3>
            <button id="compare-s-orbitals">Compare s Orbitals</button>
            <button id="compare-p-orbitals">Compare p Orbitals</button>
            <button id="compare-same-n">Compare Same n</button>
        `;

        document.querySelector('.control-panel').appendChild(comparisonSection);

        // Add comparison functionality
        this.setupComparisonButtons();
    }

    setupComparisonButtons() {
        document.getElementById('compare-s-orbitals').addEventListener('click', () => {
            this.startComparison([
                { n: 1, l: 0, m: 0 },
                { n: 2, l: 0, m: 0 },
                { n: 3, l: 0, m: 0 }
            ], "s orbital comparison");
        });

        document.getElementById('compare-p-orbitals').addEventListener('click', () => {
            this.startComparison([
                { n: 2, l: 1, m: -1 },
                { n: 2, l: 1, m: 0 },
                { n: 2, l: 1, m: 1 }
            ], "2p orbital orientations");
        });

        document.getElementById('compare-same-n').addEventListener('click', () => {
            this.startComparison([
                { n: 3, l: 0, m: 0 },
                { n: 3, l: 1, m: 0 },
                { n: 3, l: 2, m: 0 }
            ], "n=3 orbital comparison");
        });
    }

    startComparison(orbitals, title) {
        let index = 0;
        this.showTooltip(`Starting ${title}...`, 2000);

        const showNext = () => {
            if (index < orbitals.length) {
                const orbital = orbitals[index];
                this.controlsManager.setOrbital(orbital.n, orbital.l, orbital.m);
                
                const name = this.controlsManager.quantumMath.getOrbitalName(orbital.n, orbital.l, orbital.m);
                this.showTooltip(`${name} orbital`, 3000);
                
                index++;
                setTimeout(showNext, 4000);
            } else {
                this.showTooltip(`${title} complete!`, 2000);
            }
        };

        setTimeout(showNext, 2500);
    }

    addExportFeatures() {
        const exportSection = document.createElement('div');
        exportSection.className = 'export-features';
        exportSection.innerHTML = `
            <h3>Export & Share</h3>
            <button id="export-state">Export Current State</button>
            <button id="capture-image">Capture Screenshot</button>
            <input type="file" id="import-state" accept=".json" style="display:none;">
            <button id="import-btn">Import State</button>
        `;

        document.querySelector('.control-panel').appendChild(exportSection);

        // Add export functionality
        this.setupExportFeatures();
    }

    setupExportFeatures() {
        document.getElementById('export-state').addEventListener('click', () => {
            const state = this.controlsManager.exportState();
            this.downloadFile(state, 'hydrogen-atom-state.json', 'application/json');
        });

        document.getElementById('capture-image').addEventListener('click', () => {
            this.captureScreenshot();
        });

        document.getElementById('import-btn').addEventListener('click', () => {
            document.getElementById('import-state').click();
        });

        document.getElementById('import-state').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const success = this.controlsManager.importState(e.target.result);
                    if (success) {
                        this.showTooltip('State imported successfully!', 3000);
                    } else {
                        this.showTooltip('Failed to import state. Please check the file format.', 3000);
                    }
                };
                reader.readAsText(file);
            }
        });
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    captureScreenshot() {
        const canvas = document.getElementById('main-canvas');
        const link = document.createElement('a');
        link.download = 'hydrogen-atom-orbital.png';
        link.href = canvas.toDataURL();
        link.click();
        
        this.showTooltip('Screenshot saved!', 2000);
    }

    // Reset tutorial
    resetTutorial() {
        this.tutorialActive = true;
        this.currentStep = 1;
        document.querySelector('.tutorial-section').style.display = 'block';
        this.goToStep(1);
        
        // Remove exploration mode additions
        const additions = ['.quick-orbitals', '.comparison-mode', '.export-features'];
        additions.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) element.remove();
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TutorialManager;
}

// Global class for browser use
if (typeof window !== 'undefined') {
    window.TutorialManager = TutorialManager;
}
