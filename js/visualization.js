/**
 * 3D Visualization Engine for Hydrogen Atom
 * ==========================================
 * 
 * This module handles all the 3D visualization using Three.js,
 * including orbital rendering, cross-sections, and interactive controls.
 */

class HydrogenVisualization {
    constructor(canvasId) {
        console.log('🎬 HydrogenVisualization: Starting constructor...');
        
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            throw new Error(`Canvas with id "${canvasId}" not found`);
        }
        console.log('✓ Canvas found:', this.canvas);
        
        console.log('🧮 Creating QuantumMath...');
        this.quantumMath = new QuantumMath();
        console.log('✓ QuantumMath created');
        
        this.currentQuantumNumbers = { n: 1, l: 0, m: 0 };
        this.visualizationType = '3d';
        this.crossSectionPlane = 'xz';
        this.opacity = 0.8;
        this.threshold = 0.001;
        this.renderQuality = 'medium';
        this.isAnimating = false;
        
        // Wait for container to be properly laid out
        this.initializeWhenReady();
    }

    async initializeWhenReady() {
        // Wait for layout to stabilize
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Check if container has proper dimensions
        const container = this.canvas.parentElement;
        let attempts = 0;
        const maxAttempts = 10;
        
        while (attempts < maxAttempts && (container.clientWidth <= 0 || container.clientHeight <= 0)) {
            console.log(`⏳ Waiting for container layout (attempt ${attempts + 1})...`);
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        console.log('📐 Final container dimensions:', container.clientWidth, 'x', container.clientHeight);
        
        console.log('🎨 Setting up Three.js...');
        this.setupThreeJS();
        console.log('✓ Three.js setup complete');
        
        console.log('💡 Setting up lights...');
        this.setupLights();
        console.log('✓ Lights setup complete');
        
        console.log('🎮 Setting up controls...');
        this.setupControls();
        console.log('✓ Controls setup complete');
        
        console.log('⚛️ Generating initial orbital...');
        
        // Add a simple test sphere first to verify visibility
        this.createTestSphere();
        
        this.updateVisualization();
        console.log('✓ Initial orbital generated');
        
        console.log('🖼️ Starting render...');
        this.render();
        
        // Force a final resize to ensure proper canvas dimensions
        setTimeout(() => this.forceCanvasResize(), 100);
        setTimeout(() => this.forceCanvasResize(), 500);
        
        // Test mouse interactions after everything is set up
        setTimeout(() => this.testMouseInteraction(), 1000);
        
        console.log('✓ HydrogenVisualization constructor complete');
    }

    setupThreeJS() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);

        // Get the container dimensions using clientWidth/Height for proper sizing
        const container = this.canvas.parentElement;
        
        // Use the full container size minus the absolute positioning margins (40px total)
        let width = container.clientWidth - 40; // 20px left + 20px right
        let height = container.clientHeight - 40; // 20px top + 20px bottom
        
        if (width <= 0 || height <= 0) {
            console.warn('⚠️ Container not properly sized, using fallback dimensions');
            width = 800;
            height = 600;
        }

        console.log('📐 Container dimensions:', container.clientWidth, 'x', container.clientHeight);
        console.log('📐 Canvas dimensions:', width, 'x', height);

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75, 
            width / height, 
            0.1, 
            1000
        );
        this.camera.position.set(20, 20, 20);
        this.camera.lookAt(0, 0, 0);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas,
            antialias: true,
            alpha: false,
            preserveDrawingBuffer: true
        });
        
        // Set the canvas size directly
        this.renderer.setSize(width, height, false);
        
        // Configure renderer settings
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Set canvas attributes to match the rendered size
        this.canvas.width = width;
        this.canvas.height = height;
        
        // Clear the renderer to ensure clean start
        this.renderer.clear();

        // Controls
        console.log('🎮 Creating OrbitControls...');
        console.log('THREE.OrbitControls available:', typeof THREE.OrbitControls !== 'undefined');
        console.log('Canvas element:', this.canvas);
        console.log('Canvas dimensions:', this.canvas.width, 'x', this.canvas.height);
        
        if (typeof THREE.OrbitControls === 'undefined') {
            console.warn('⚠️ THREE.OrbitControls not available, creating basic controls...');
            this.controls = {
                enableDamping: true,
                dampingFactor: 0.05,
                enableZoom: true,
                autoRotate: false,
                autoRotateSpeed: 2.0,
                update: () => {} // No-op for now
            };
        } else {
            try {
                // Try using renderer.domElement which is the recommended approach
                this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
                this.controls.enableDamping = true;
                this.controls.dampingFactor = 0.05;
                this.controls.enableZoom = true;
                this.controls.enablePan = true;
                this.controls.enableRotate = true;
                this.controls.autoRotate = false;
                this.controls.autoRotateSpeed = 2.0;
                
                // Ensure controls are enabled
                this.controls.enabled = true;
                
                // Add mouse event listeners for debugging
                this.renderer.domElement.addEventListener('mousedown', (e) => {
                    console.log('🖱️ Canvas mousedown:', e.button, e.clientX, e.clientY);
                });
                
                this.renderer.domElement.addEventListener('wheel', (e) => {
                    console.log('🎯 Canvas wheel:', e.deltaY);
                });
                
                this.renderer.domElement.addEventListener('contextmenu', (e) => {
                    e.preventDefault(); // Prevent context menu for right-click panning
                });
                
                console.log('✓ OrbitControls created successfully with renderer.domElement');
                console.log('Controls object:', this.controls);
                console.log('Controls enabled:', this.controls.enabled);
                console.log('Renderer domElement:', this.renderer.domElement);
            } catch (error) {
                console.error('❌ Failed to create OrbitControls:', error);
                // Fallback to basic controls
                this.controls = {
                    enableDamping: true,
                    dampingFactor: 0.05,
                    enableZoom: true,
                    autoRotate: false,
                    autoRotateSpeed: 2.0,
                    update: () => {}
                };
            }
        }

        // Raycaster for interactions
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // Add resize listener
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Call resize multiple times to ensure proper initial sizing
        setTimeout(() => this.onWindowResize(), 100);
        setTimeout(() => this.onWindowResize(), 500);
        setTimeout(() => this.onWindowResize(), 1000);
    }

    createTestSphere() {
        // Create a simple red sphere to test visibility
        const geometry = new THREE.SphereGeometry(5, 32, 16);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xff0000,
            transparent: true,
            opacity: 0.5,
            wireframe: true
        });
        this.testSphere = new THREE.Mesh(geometry, material);
        this.scene.add(this.testSphere);
        console.log('✅ Test sphere added to scene');
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
        if (this.orbitalMesh && this.orbitalMesh.material) {
            // Handle both PointsMaterial and ShaderMaterial
            if (this.orbitalMesh.material.uniforms) {
                // ShaderMaterial with uniforms
                this.orbitalMesh.material.uniforms.opacity.value = opacity;
            } else {
                // Regular PointsMaterial
                this.orbitalMesh.material.opacity = opacity;
            }
            this.orbitalMesh.material.needsUpdate = true;
        }
    }

    updateThreshold(threshold) {
        this.threshold = threshold;
        this.updateVisualization();
    }
    
    updateRenderQuality(quality) {
        this.renderQuality = quality;
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
        console.log(`Starting orbital creation: n=${n}, l=${l}, m=${m}`);
        
        // Use a very low threshold to ensure we get points
        const forceThreshold = 0.00001; // Much lower threshold for testing
        
        const points = [];
        const colors = [];
        
        // Simplified, guaranteed-to-work approach
        const maxR = Math.max(10, n * n * 3); // Ensure reasonable size
        const resolution = 25; // Smaller resolution for faster testing
        const adaptiveThreshold = forceThreshold;
        
        console.log(`Parameters: maxR=${maxR}, resolution=${resolution}, threshold=${adaptiveThreshold}`);

        // Generate points
        let debugCount = 0;
        for (let i = 0; i < resolution; i++) {
            for (let j = 0; j < resolution; j++) {
                for (let k = 0; k < resolution; k++) {
                    const x = (i - resolution/2) * maxR / resolution;
                    const y = (j - resolution/2) * maxR / resolution;
                    const z = (k - resolution/2) * maxR / resolution;

                    const { r, theta, phi } = this.quantumMath.cartesianToSpherical(x, y, z);
                    
                    if (r > 0.5) { // Avoid singularity
                        const probability = this.quantumMath.probabilityDensity(r, theta, phi, n, l, m);
                        
                        if (debugCount < 10) {
                            console.log(`Point ${debugCount}: r=${r.toFixed(2)}, prob=${probability.toFixed(8)}, threshold=${adaptiveThreshold.toFixed(8)}`);
                            debugCount++;
                        }
                        
                        if (probability > adaptiveThreshold && isFinite(probability)) {
                            points.push(new THREE.Vector3(x, y, z));
                            
                            // Simple, visible colors
                            const color = new THREE.Color();
                            const intensity = Math.min(probability / adaptiveThreshold, 5);
                            
                            if (l === 0) { // s orbitals - bright blue
                                color.setRGB(0.2 + intensity * 0.2, 0.4 + intensity * 0.2, 0.8 + intensity * 0.2);
                            } else if (l === 1) { // p orbitals - bright green  
                                color.setRGB(0.2 + intensity * 0.2, 0.8 + intensity * 0.2, 0.2 + intensity * 0.2);
                            } else { // d orbitals - bright red
                                color.setRGB(0.8 + intensity * 0.2, 0.2 + intensity * 0.2, 0.2 + intensity * 0.2);
                            }
                            
                            colors.push(color);
                        }
                    }
                }
            }
        }

        console.log(`Generated ${points.length} points for orbital`);

        if (points.length > 0) {
            // Create geometry
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            
            // Add colors
            const colorArray = new Float32Array(colors.length * 3);
            colors.forEach((color, i) => {
                colorArray[i * 3] = color.r;
                colorArray[i * 3 + 1] = color.g;
                colorArray[i * 3 + 2] = color.b;
            });
            geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

            // Use simple, reliable material with larger, more visible points
            const material = new THREE.PointsMaterial({
                size: Math.max(2.0, 3.0 - n * 0.2), // Much larger, more visible points
                vertexColors: true,
                transparent: true,
                opacity: 1.0, // Full opacity for testing
                sizeAttenuation: false // Disable size attenuation for consistent visibility
            });

            this.orbitalMesh = new THREE.Points(geometry, material);
            this.scene.add(this.orbitalMesh);
            
            console.log(`✅ Orbital mesh created with ${points.length} points and added to scene`);
            
            // Log some sample points for debugging
            if (points.length > 0) {
                console.log('Sample points:', points.slice(0, 3));
                console.log('Orbital mesh position:', this.orbitalMesh.position);
                console.log('Camera position:', this.camera.position);
            }
            
            // Update view info with point count
            if (window.controlsManager && window.controlsManager.updateViewInfo) {
                window.controlsManager.updateViewInfo(points.length);
            }
            
        } else {
            console.warn('❌ No points generated - trying emergency fallback');
            this.createEmergencyOrbital(n, l, m);
        }
    }
    
    createEmergencyOrbital(n, l, m) {
        console.log('Creating emergency orbital with minimal requirements');
        
        const points = [];
        const colors = [];
        
        // Very simple sphere for s orbitals, basic shapes for others
        const numPoints = 1000;
        const radius = n * 3;
        
        for (let i = 0; i < numPoints; i++) {
            let x, y, z;
            
            if (l === 0) { // s orbital - simple sphere
                const phi = Math.random() * 2 * Math.PI;
                const cosTheta = Math.random() * 2 - 1;
                const sinTheta = Math.sqrt(1 - cosTheta * cosTheta);
                const r = radius * Math.pow(Math.random(), 1/3);
                
                x = r * sinTheta * Math.cos(phi);
                y = r * sinTheta * Math.sin(phi);
                z = r * cosTheta;
            } else {
                // Simple random distribution for p/d orbitals
                x = (Math.random() - 0.5) * radius * 2;
                y = (Math.random() - 0.5) * radius * 2;
                z = (Math.random() - 0.5) * radius * 2;
            }
            
            points.push(new THREE.Vector3(x, y, z));
            
            const color = new THREE.Color();
            if (l === 0) color.setHex(0x4488ff);
            else if (l === 1) color.setHex(0x44ff88);
            else color.setHex(0xff8844);
            colors.push(color);
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        const colorArray = new Float32Array(colors.length * 3);
        colors.forEach((color, i) => {
            colorArray[i * 3] = color.r;
            colorArray[i * 3 + 1] = color.g;
            colorArray[i * 3 + 2] = color.b;
        });
        geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

        const material = new THREE.PointsMaterial({
            size: 1.0,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });

        this.orbitalMesh = new THREE.Points(geometry, material);
        this.scene.add(this.orbitalMesh);
        
        console.log('🚨 Emergency orbital created (not physically accurate)');
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
        const container = this.canvas.parentElement;
        
        let width = container.clientWidth - 40; // Account for padding
        let height = container.clientHeight - 40; // Account for padding
        
        // Use minimum dimensions if container is too small
        if (width <= 0) width = 400;
        if (height <= 0) height = 300;

        console.log('🔄 Resizing to container:', container.clientWidth, 'x', container.clientHeight);
        console.log('🔄 Canvas target size:', width, 'x', height);

        // Update camera aspect ratio
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        // Update renderer size
        this.renderer.setSize(width, height, false);
        
        // Update canvas attributes to match
        this.canvas.width = width;
        this.canvas.height = height;
    }

    render() {
        requestAnimationFrame(() => this.render());
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        
        // Update camera position display occasionally (throttled to avoid performance issues)
        if (!this.lastCameraUpdate || Date.now() - this.lastCameraUpdate > 500) {
            if (window.controlsManager && window.controlsManager.updateViewInfo) {
                // Get current point count from the existing orbital
                const pointCount = this.orbitalMesh ? 
                    (this.orbitalMesh.geometry ? this.orbitalMesh.geometry.attributes.position.count : 0) : 0;
                window.controlsManager.updateViewInfo(pointCount);
            }
            this.lastCameraUpdate = Date.now();
        }
    }

    // Force canvas to take proper dimensions
    forceCanvasResize() {
        const container = this.canvas.parentElement;
        console.log('🔧 Force resizing canvas container dimensions:', container.clientWidth, 'x', container.clientHeight);
        
        // Calculate proper dimensions
        let width = container.clientWidth - 40;
        let height = container.clientHeight - 40;
        
        if (width <= 0) width = 600;
        if (height <= 0) height = 400;
        
        // Force canvas attributes
        this.canvas.width = width;
        this.canvas.height = height;
        
        // Update renderer
        this.renderer.setSize(width, height, false);
        
        // Update camera
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        console.log('🔧 Forced canvas size to:', width, 'x', height);
    }

    // Test mouse interaction functionality
    testMouseInteraction() {
        console.log('🧪 Testing mouse interaction...');
        const domElement = this.renderer.domElement;
        console.log('Canvas (domElement) pointer events:', getComputedStyle(domElement).pointerEvents);
        console.log('Canvas z-index:', getComputedStyle(domElement).zIndex);
        console.log('Canvas position:', getComputedStyle(domElement).position);
        console.log('Controls enabled:', this.controls.enabled !== false);
        console.log('DomElement === canvas:', domElement === this.canvas);
        
        if (this.controls && typeof this.controls.update === 'function') {
            console.log('✓ Controls are properly initialized');
        } else {
            console.error('❌ Controls are not properly initialized');
        }
        
        // Add a test click handler to see if events reach the canvas
        domElement.addEventListener('click', () => {
            console.log('✅ Canvas click detected!');
        }, { once: true });
        
        console.log('🖱️ Click on the canvas to test interaction...');
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
