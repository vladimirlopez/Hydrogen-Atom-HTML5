/**
 * 3D Visualization Engine for Hydrogen Atom
 * ==========================================
 * 
 * This module handles all the 3D visualization using Three.js,
 * including orbital rendering, cross-sections, and interactive controls.
 */

class HydrogenVisualization {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.quantumMath = new QuantumMath();
        
        this.currentQuantumNumbers = { n: 1, l: 0, m: 0 };
        this.visualizationType = '3d';
        this.crossSectionPlane = 'xz';
        this.opacity = 0.8;
        this.threshold = 0.01;
        this.isAnimating = false;
        
        this.setupThreeJS();
        this.setupLights();
        this.setupControls();
        this.render();
    }

    setupThreeJS() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75, 
            this.canvas.width / this.canvas.height, 
            0.1, 
            1000
        );
        this.camera.position.set(20, 20, 20);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas,
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(this.canvas.width, this.canvas.height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.autoRotate = false;
        this.controls.autoRotateSpeed = 2.0;

        // Raycaster for interactions
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
    }

    setupLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.scene.add(ambientLight);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 50, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // Point lights for better illumination
        const pointLight1 = new THREE.PointLight(0xffd700, 0.5, 100);
        pointLight1.position.set(20, 20, 20);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x4080ff, 0.3, 100);
        pointLight2.position.set(-20, -20, -20);
        this.scene.add(pointLight2);
    }

    setupControls() {
        // Add axes helper
        const axesHelper = new THREE.AxesHelper(15);
        this.scene.add(axesHelper);

        // Add nucleus representation
        const nucleusGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const nucleusMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff0000,
            emissive: 0x330000 
        });
        this.nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
        this.scene.add(this.nucleus);

        // Add coordinate grid
        this.addCoordinateGrid();
    }

    addCoordinateGrid() {
        const gridHelper = new THREE.GridHelper(40, 20, 0x444444, 0x222222);
        gridHelper.position.y = 0;
        this.scene.add(gridHelper);
    }

    updateQuantumNumbers(n, l, m) {
        this.currentQuantumNumbers = { n, l, m };
        this.updateVisualization();
    }

    updateVisualizationType(type) {
        this.visualizationType = type;
        this.updateVisualization();
    }

    updateCrossSectionPlane(plane) {
        this.crossSectionPlane = plane;
        if (this.visualizationType === '2d-cross') {
            this.updateVisualization();
        }
    }

    updateOpacity(opacity) {
        this.opacity = opacity;
        if (this.orbitalMesh) {
            this.orbitalMesh.material.opacity = opacity;
        }
    }

    updateThreshold(threshold) {
        this.threshold = threshold;
        this.updateVisualization();
    }

    updateVisualization() {
        // Clear existing orbital
        if (this.orbitalMesh) {
            this.scene.remove(this.orbitalMesh);
            if (this.orbitalMesh.geometry) this.orbitalMesh.geometry.dispose();
            if (this.orbitalMesh.material) this.orbitalMesh.material.dispose();
        }

        // Clear existing 2D plane
        if (this.crossSectionMesh) {
            this.scene.remove(this.crossSectionMesh);
            if (this.crossSectionMesh.geometry) this.crossSectionMesh.geometry.dispose();
            if (this.crossSectionMesh.material) this.crossSectionMesh.material.dispose();
        }

        const { n, l, m } = this.currentQuantumNumbers;

        switch (this.visualizationType) {
            case '3d':
                this.create3DOrbital(n, l, m);
                break;
            case '2d-cross':
                this.create2DCrossSection(n, l, m);
                break;
            case 'radial':
                this.createRadialPlot(n, l);
                break;
            case 'energy':
                this.createEnergyLevelDiagram();
                break;
        }
    }

    create3DOrbital(n, l, m) {
        const points = [];
        const colors = [];
        const maxR = Math.min(30, n * n * 8); // Scale with quantum number
        const resolution = 40;

        // Create point cloud for probability density
        for (let i = 0; i < resolution; i++) {
            for (let j = 0; j < resolution; j++) {
                for (let k = 0; k < resolution; k++) {
                    const x = (i - resolution/2) * maxR / resolution;
                    const y = (j - resolution/2) * maxR / resolution;
                    const z = (k - resolution/2) * maxR / resolution;

                    const { r, theta, phi } = this.quantumMath.cartesianToSpherical(x, y, z);
                    
                    if (r > 0.1) { // Avoid singularity at origin
                        const probability = this.quantumMath.probabilityDensity(r, theta, phi, n, l, m);
                        
                        if (probability > this.threshold) {
                            points.push(new THREE.Vector3(x, y, z));
                            
                            // Color based on probability density
                            const intensity = Math.min(probability / (this.threshold * 10), 1);
                            const color = new THREE.Color();
                            color.setHSL(0.6 - intensity * 0.4, 1.0, 0.3 + intensity * 0.4);
                            colors.push(color);
                        }
                    }
                }
            }
        }

        if (points.length > 0) {
            // Create point cloud geometry
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const colorArray = new Float32Array(colors.length * 3);
            
            colors.forEach((color, i) => {
                colorArray[i * 3] = color.r;
                colorArray[i * 3 + 1] = color.g;
                colorArray[i * 3 + 2] = color.b;
            });
            
            geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

            const material = new THREE.PointsMaterial({
                size: 0.3,
                vertexColors: true,
                transparent: true,
                opacity: this.opacity,
                sizeAttenuation: true
            });

            this.orbitalMesh = new THREE.Points(geometry, material);
            this.scene.add(this.orbitalMesh);
        }
    }

    create2DCrossSection(n, l, m) {
        const resolution = 200;
        const maxR = Math.min(25, n * n * 6);
        
        // Create texture for cross-section
        const canvas = document.createElement('canvas');
        canvas.width = resolution;
        canvas.height = resolution;
        const ctx = canvas.getContext('2d');
        
        const imageData = ctx.createImageData(resolution, resolution);
        const data = imageData.data;

        let maxProbability = 0;
        const probabilities = [];

        // Calculate probability densities
        for (let i = 0; i < resolution; i++) {
            probabilities[i] = [];
            for (let j = 0; j < resolution; j++) {
                let x, y, z;
                
                switch (this.crossSectionPlane) {
                    case 'xz':
                        x = (i - resolution/2) * maxR / resolution;
                        y = 0;
                        z = (j - resolution/2) * maxR / resolution;
                        break;
                    case 'xy':
                        x = (i - resolution/2) * maxR / resolution;
                        y = (j - resolution/2) * maxR / resolution;
                        z = 0;
                        break;
                    case 'yz':
                        x = 0;
                        y = (i - resolution/2) * maxR / resolution;
                        z = (j - resolution/2) * maxR / resolution;
                        break;
                }

                const { r, theta, phi } = this.quantumMath.cartesianToSpherical(x, y, z);
                const probability = r > 0.1 ? this.quantumMath.probabilityDensity(r, theta, phi, n, l, m) : 0;
                
                probabilities[i][j] = probability;
                maxProbability = Math.max(maxProbability, probability);
            }
        }

        // Create image data
        for (let i = 0; i < resolution; i++) {
            for (let j = 0; j < resolution; j++) {
                const index = (j * resolution + i) * 4;
                const normalizedProb = probabilities[i][j] / (maxProbability + 1e-10);
                
                // HSL to RGB conversion for color mapping
                const hue = 0.7 - normalizedProb * 0.5; // Blue to red
                const saturation = 1.0;
                const lightness = normalizedProb * 0.8;
                
                const rgb = this.hslToRgb(hue, saturation, lightness);
                
                data[index] = rgb.r;     // R
                data[index + 1] = rgb.g; // G
                data[index + 2] = rgb.b; // B
                data[index + 3] = normalizedProb > 0.01 ? 255 : 0; // A
            }
        }

        ctx.putImageData(imageData, 0, 0);

        // Create texture and plane
        const texture = new THREE.CanvasTexture(canvas);
        texture.magFilter = THREE.LinearFilter;
        texture.minFilter = THREE.LinearFilter;

        const planeGeometry = new THREE.PlaneGeometry(maxR, maxR);
        const planeMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: this.opacity,
            side: THREE.DoubleSide
        });

        this.crossSectionMesh = new THREE.Mesh(planeGeometry, planeMaterial);
        
        // Position plane according to cross-section type
        switch (this.crossSectionPlane) {
            case 'xz':
                this.crossSectionMesh.rotation.x = -Math.PI / 2;
                break;
            case 'xy':
                // Default orientation
                break;
            case 'yz':
                this.crossSectionMesh.rotation.y = Math.PI / 2;
                break;
        }
        
        this.scene.add(this.crossSectionMesh);
    }

    createRadialPlot(n, l) {
        // Create 2D plot showing radial wave function and probability
        const resolution = 500;
        const maxR = n * n * 8;
        
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Setup plot area
        const margin = 60;
        const plotWidth = canvas.width - 2 * margin;
        const plotHeight = canvas.height - 2 * margin;
        
        // Calculate data points
        const rValues = [];
        const waveValues = [];
        const probValues = [];
        
        for (let i = 0; i < resolution; i++) {
            const r = (i + 1) * maxR / resolution;
            const waveFunction = this.quantumMath.radialWaveFunction(r, n, l);
            const probability = this.quantumMath.radialProbabilityDensity(r, n, l);
            
            rValues.push(r);
            waveValues.push(waveFunction);
            probValues.push(probability);
        }
        
        // Find max values for scaling
        const maxWave = Math.max(...waveValues.map(Math.abs));
        const maxProb = Math.max(...probValues);
        
        // Draw axes
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(margin, margin);
        ctx.lineTo(margin, canvas.height - margin);
        ctx.lineTo(canvas.width - margin, canvas.height - margin);
        ctx.stroke();
        
        // Draw wave function
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < resolution; i++) {
            const x = margin + (i / resolution) * plotWidth;
            const y = canvas.height - margin - (waveValues[i] / maxWave) * plotHeight * 0.4 - plotHeight * 0.5;
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // Draw probability density
        ctx.strokeStyle = '#ff6600';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < resolution; i++) {
            const x = margin + (i / resolution) * plotWidth;
            const y = canvas.height - margin - (probValues[i] / maxProb) * plotHeight * 0.8;
            
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // Add labels
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.fillText('R(r) - Wave Function', 20, 30);
        ctx.fillStyle = '#00ff00';
        ctx.fillText('— Wave Function', 20, 50);
        ctx.fillStyle = '#ff6600';
        ctx.fillText('— Probability Density', 20, 70);
        
        // Create texture and plane for display
        const texture = new THREE.CanvasTexture(canvas);
        const planeGeometry = new THREE.PlaneGeometry(20, 10);
        const planeMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: false,
            side: THREE.DoubleSide
        });

        this.crossSectionMesh = new THREE.Mesh(planeGeometry, planeMaterial);
        this.crossSectionMesh.position.set(0, 0, 0);
        this.scene.add(this.crossSectionMesh);
    }

    createEnergyLevelDiagram() {
        // Create energy level visualization
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 500;
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw energy levels
        const levels = [1, 2, 3, 4, 5];
        const colors = ['#ff0000', '#ff6600', '#ffaa00', '#ffdd00', '#ffff00'];
        
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.font = '14px Arial';
        
        levels.forEach((n, index) => {
            const energy = this.quantumMath.energyLevel(n);
            const y = 50 + index * 80;
            
            // Draw energy level line
            ctx.strokeStyle = colors[index];
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(100, y);
            ctx.lineTo(500, y);
            ctx.stroke();
            
            // Add labels
            ctx.fillStyle = 'white';
            ctx.fillText(`n = ${n}`, 20, y + 5);
            ctx.fillText(`E = ${energy.toFixed(2)} eV`, 520, y + 5);
        });
        
        // Add title
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText('Hydrogen Energy Levels', 200, 30);
        
        // Create texture and plane for display
        const texture = new THREE.CanvasTexture(canvas);
        const planeGeometry = new THREE.PlaneGeometry(20, 16);
        const planeMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: false,
            side: THREE.DoubleSide
        });

        this.crossSectionMesh = new THREE.Mesh(planeGeometry, planeMaterial);
        this.crossSectionMesh.position.set(0, 0, 0);
        this.scene.add(this.crossSectionMesh);
    }

    hslToRgb(h, s, l) {
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h * 6) % 2 - 1));
        const m = l - c / 2;
        
        let r, g, b;
        
        if (h < 1/6) {
            r = c; g = x; b = 0;
        } else if (h < 2/6) {
            r = x; g = c; b = 0;
        } else if (h < 3/6) {
            r = 0; g = c; b = x;
        } else if (h < 4/6) {
            r = 0; g = x; b = c;
        } else if (h < 5/6) {
            r = x; g = 0; b = c;
        } else {
            r = c; g = 0; b = x;
        }
        
        return {
            r: Math.round((r + m) * 255),
            g: Math.round((g + m) * 255),
            b: Math.round((b + m) * 255)
        };
    }

    toggleAnimation() {
        this.isAnimating = !this.isAnimating;
        this.controls.autoRotate = this.isAnimating;
    }

    resetView() {
        this.camera.position.set(20, 20, 20);
        this.controls.reset();
    }

    onWindowResize() {
        const rect = this.canvas.getBoundingClientRect();
        this.camera.aspect = rect.width / rect.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(rect.width, rect.height);
    }

    render() {
        requestAnimationFrame(() => this.render());
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    dispose() {
        // Clean up resources
        if (this.orbitalMesh) {
            this.scene.remove(this.orbitalMesh);
            if (this.orbitalMesh.geometry) this.orbitalMesh.geometry.dispose();
            if (this.orbitalMesh.material) this.orbitalMesh.material.dispose();
        }
        
        if (this.crossSectionMesh) {
            this.scene.remove(this.crossSectionMesh);
            if (this.crossSectionMesh.geometry) this.crossSectionMesh.geometry.dispose();
            if (this.crossSectionMesh.material) this.crossSectionMesh.material.dispose();
        }
        
        this.renderer.dispose();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HydrogenVisualization;
}

// Global class for browser use
if (typeof window !== 'undefined') {
    window.HydrogenVisualization = HydrogenVisualization;
}
