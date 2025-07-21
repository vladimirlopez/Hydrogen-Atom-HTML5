/**
 * Quantum Mathematics for Hydrogen Atom
 * =====================================
 * 
 * This module contains all the mathematical functions needed to calculate
 * hydrogen atom wave functions, probability densities, and related quantum
 * mechanical properties.
 */

class QuantumMath {
    constructor() {
        this.a0 = 1.0; // Bohr radius (normalized)
        this.setupFactorialCache();
        this.setupSphericalHarmonics();
    }

    setupFactorialCache() {
        this.factorialCache = [1]; // 0! = 1
        for (let i = 1; i <= 20; i++) {
            this.factorialCache[i] = this.factorialCache[i-1] * i;
        }
    }

    factorial(n) {
        if (n <= 20) return this.factorialCache[n];
        let result = this.factorialCache[20];
        for (let i = 21; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    setupSphericalHarmonics() {
        // Pre-calculate some common spherical harmonics
        this.sphericalHarmonics = {
            // s orbitals (l=0)
            '0,0': (theta, phi) => 1 / Math.sqrt(4 * Math.PI),
            
            // p orbitals (l=1)
            '1,-1': (theta, phi) => Math.sqrt(3 / (8 * Math.PI)) * Math.sin(theta) * Math.sin(phi),
            '1,0': (theta, phi) => Math.sqrt(3 / (4 * Math.PI)) * Math.cos(theta),
            '1,1': (theta, phi) => -Math.sqrt(3 / (8 * Math.PI)) * Math.sin(theta) * Math.cos(phi),
            
            // d orbitals (l=2)
            '2,-2': (theta, phi) => Math.sqrt(15 / (32 * Math.PI)) * Math.sin(theta) * Math.sin(theta) * Math.sin(2 * phi),
            '2,-1': (theta, phi) => Math.sqrt(15 / (8 * Math.PI)) * Math.sin(theta) * Math.cos(theta) * Math.sin(phi),
            '2,0': (theta, phi) => Math.sqrt(5 / (16 * Math.PI)) * (3 * Math.cos(theta) * Math.cos(theta) - 1),
            '2,1': (theta, phi) => -Math.sqrt(15 / (8 * Math.PI)) * Math.sin(theta) * Math.cos(theta) * Math.cos(phi),
            '2,2': (theta, phi) => Math.sqrt(15 / (32 * Math.PI)) * Math.sin(theta) * Math.sin(theta) * Math.cos(2 * phi)
        };
    }

    /**
     * Calculate the associated Laguerre polynomial
     */
    associatedLaguerre(x, n, alpha) {
        if (n === 0) return 1;
        if (n === 1) return 1 + alpha - x;
        
        // Use recurrence relation for higher orders
        let L0 = 1;
        let L1 = 1 + alpha - x;
        
        for (let k = 2; k <= n; k++) {
            const Lk = ((2*k - 1 + alpha - x) * L1 - (k - 1 + alpha) * L0) / k;
            L0 = L1;
            L1 = Lk;
        }
        
        return L1;
    }

    /**
     * Calculate the radial wave function R_nl(r)
     */
    radialWaveFunction(r, n, l) {
        if (r <= 0) return 0;
        
        const rho = 2 * r / (n * this.a0);
        
        // Normalization constant
        const norm = Math.sqrt(
            Math.pow(2 / (n * this.a0), 3) * 
            this.factorial(n - l - 1) / 
            (2 * n * this.factorial(n + l))
        );
        
        // Laguerre polynomial
        const laguerre = this.associatedLaguerre(rho, n - l - 1, 2 * l + 1);
        
        // Radial wave function
        const R_nl = norm * Math.exp(-rho / 2) * Math.pow(rho, l) * laguerre;
        
        return R_nl;
    }

    /**
     * Calculate spherical harmonic Y_l^m(theta, phi)
     */
    sphericalHarmonic(theta, phi, l, m) {
        const key = `${l},${m}`;
        if (this.sphericalHarmonics[key]) {
            return this.sphericalHarmonics[key](theta, phi);
        }
        
        // Fallback for higher order harmonics (simplified)
        if (l === 0) {
            return 1 / Math.sqrt(4 * Math.PI);
        }
        
        // Complex calculation for general case would go here
        // For now, return a simplified approximation
        return Math.cos(m * phi) * Math.pow(Math.sin(theta), Math.abs(m)) * Math.pow(Math.cos(theta), l - Math.abs(m));
    }

    /**
     * Calculate the complete hydrogen wave function ψ_nlm(r, θ, φ)
     */
    waveFunction(r, theta, phi, n, l, m) {
        const R_nl = this.radialWaveFunction(r, n, l);
        const Y_lm = this.sphericalHarmonic(theta, phi, l, m);
        
        return R_nl * Y_lm;
    }

    /**
     * Calculate probability density |ψ|²
     */
    probabilityDensity(r, theta, phi, n, l, m) {
        const psi = this.waveFunction(r, theta, phi, n, l, m);
        return Math.abs(psi) * Math.abs(psi);
    }

    /**
     * Calculate radial probability density 4πr²|R_nl|²
     */
    radialProbabilityDensity(r, n, l) {
        const R_nl = this.radialWaveFunction(r, n, l);
        return 4 * Math.PI * r * r * R_nl * R_nl;
    }

    /**
     * Calculate energy level for hydrogen atom
     */
    energyLevel(n) {
        return -13.6 / (n * n); // in eV
    }

    /**
     * Get orbital name from quantum numbers
     */
    getOrbitalName(n, l, m) {
        const shellNames = ['1', '2', '3', '4', '5', '6'];
        const subshellNames = ['s', 'p', 'd', 'f', 'g', 'h'];
        
        let name = shellNames[n - 1] + subshellNames[l];
        
        if (l > 0) {
            const orientations = {
                1: { // p orbitals
                    '-1': 'y',
                    '0': 'z', 
                    '1': 'x'
                },
                2: { // d orbitals
                    '-2': 'xy',
                    '-1': 'yz',
                    '0': 'z²',
                    '1': 'xz',
                    '2': 'x²-y²'
                }
            };
            
            if (orientations[l] && orientations[l][m.toString()]) {
                name += '_' + orientations[l][m.toString()];
            }
        }
        
        return name;
    }

    /**
     * Count radial nodes
     */
    getRadialNodes(n, l) {
        return n - l - 1;
    }

    /**
     * Count angular nodes
     */
    getAngularNodes(l) {
        return l;
    }

    /**
     * Get wave function equation as LaTeX string
     */
    getWaveFunctionEquation(n, l, m) {
        const orbital = this.getOrbitalName(n, l, m);
        
        // Simplified equations for common orbitals
        const equations = {
            '1s': 'ψ₁ₛ = (1/√πa₀³) e^(-r/a₀)',
            '2s': 'ψ₂ₛ = (1/4√2πa₀³)(2-r/a₀) e^(-r/2a₀)',
            '2p_z': 'ψ₂ₚ = (1/4√2πa₀³)(r/a₀) e^(-r/2a₀) cos θ',
            '3s': 'ψ₃ₛ = (1/9√3πa₀³)(6-6r/a₀+r²/a₀²) e^(-r/3a₀)',
            '3p_z': 'ψ₃ₚ = (1/9√6πa₀³)(4r/a₀-2r²/3a₀²) e^(-r/3a₀) cos θ',
            '3d_z²': 'ψ₃d = (1/81√30πa₀³)(r²/a₀²) e^(-r/3a₀)(3cos²θ-1)'
        };
        
        return equations[orbital] || `ψ${n}${this.getSubshellLetter(l)} = R${n}${l}(r) Y${l}^${m}(θ,φ)`;
    }

    /**
     * Get radial function equation
     */
    getRadialFunctionEquation(n, l) {
        return `R${n}${l}(r) = N e^(-r/${n}a₀) (r/a₀)^${l} L${n-l-1}^(${2*l+1})(2r/${n}a₀)`;
    }

    /**
     * Get angular function equation
     */
    getAngularFunctionEquation(l, m) {
        if (l === 0) return 'Y₀⁰ = 1/√(4π)';
        if (l === 1) {
            if (m === 0) return 'Y₁⁰ = √(3/4π) cos θ';
            if (m === 1) return 'Y₁¹ = -√(3/8π) sin θ e^(iφ)';
            if (m === -1) return 'Y₁⁻¹ = √(3/8π) sin θ e^(-iφ)';
        }
        return `Y${l}^${m}(θ,φ) = N P${l}^${Math.abs(m)}(cos θ) e^(i${m}φ)`;
    }

    getSubshellLetter(l) {
        const letters = ['s', 'p', 'd', 'f', 'g', 'h'];
        return letters[l] || l.toString();
    }

    /**
     * Create coordinate grids for visualization
     */
    createSphericalGrid(maxR = 20, numPoints = 50) {
        const r = [];
        const theta = [];
        const phi = [];
        
        for (let i = 0; i < numPoints; i++) {
            r.push((i + 1) * maxR / numPoints);
            theta.push(i * Math.PI / (numPoints - 1));
            phi.push(i * 2 * Math.PI / (numPoints - 1));
        }
        
        return { r, theta, phi };
    }

    /**
     * Convert spherical to Cartesian coordinates
     */
    sphericalToCartesian(r, theta, phi) {
        return {
            x: r * Math.sin(theta) * Math.cos(phi),
            y: r * Math.sin(theta) * Math.sin(phi),
            z: r * Math.cos(theta)
        };
    }

    /**
     * Convert Cartesian to spherical coordinates
     */
    cartesianToSpherical(x, y, z) {
        const r = Math.sqrt(x*x + y*y + z*z);
        const theta = Math.acos(z / (r + 1e-10));
        const phi = Math.atan2(y, x);
        
        return { r, theta, phi };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuantumMath;
}

// Global instance for browser use
if (typeof window !== 'undefined') {
    window.QuantumMath = QuantumMath;
}
