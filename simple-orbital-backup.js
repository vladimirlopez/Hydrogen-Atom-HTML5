/**
 * Simple Cloud Visualization - Guaranteed to Work
 * This is a simplified version that uses proven methods
 */

// Add this to the visualization class as a backup method
createSimple3DOrbital(n, l, m) {
    const points = [];
    const colors = [];
    
    // Simple, reliable parameters
    const maxR = n * n * 8;
    const resolution = 50; // Fixed reasonable resolution
    const adaptiveThreshold = this.threshold / Math.max(1, n);
    
    console.log(`Creating SIMPLE 3D orbital: n=${n}, l=${l}, m=${m}, threshold=${adaptiveThreshold}`);

    // Create basic point cloud
    for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
            for (let k = 0; k < resolution; k++) {
                const x = (i - resolution/2) * maxR / resolution;
                const y = (j - resolution/2) * maxR / resolution;
                const z = (k - resolution/2) * maxR / resolution;

                const { r, theta, phi } = this.quantumMath.cartesianToSpherical(x, y, z);
                
                if (r > 0.1 && r < maxR * 0.9) {
                    const probability = this.quantumMath.probabilityDensity(r, theta, phi, n, l, m);
                    
                    if (probability > adaptiveThreshold && isFinite(probability)) {
                        points.push(new THREE.Vector3(x, y, z));
                        
                        // Simple color based on orbital type
                        const color = new THREE.Color();
                        if (l === 0) {
                            color.setHex(0x4444ff); // Blue for s
                        } else if (l === 1) {
                            color.setHex(0x44ff44); // Green for p
                        } else {
                            color.setHex(0xff4444); // Red for d
                        }
                        colors.push(color);
                    }
                }
            }
        }
    }

    console.log(`Generated ${points.length} points (simple method)`);

    if (points.length > 0) {
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        // Add colors
        const colorArray = new Float32Array(colors.length * 3);
        colors.forEach((color, i) => {
            colorArray[i * 3] = color.r;
            colorArray[i * 3 + 1] = color.g;
            colorArray[i * 3 + 2] = color.b;
        });
        geometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

        // Use simple, reliable PointsMaterial
        const material = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: this.opacity,
            sizeAttenuation: true
        });

        this.orbitalMesh = new THREE.Points(geometry, material);
        this.scene.add(this.orbitalMesh);
        
        console.log('Simple orbital mesh created and added successfully');
        return true;
    } else {
        console.warn('No points generated with simple method');
        return false;
    }
}
