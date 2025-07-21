/**
 * Debug utilities for quantum calculations
 */

function debugQuantumNumbers(n, l, m) {
    const quantum = new QuantumMath();
    
    console.log(`=== Debugging Quantum Numbers: n=${n}, l=${l}, m=${m} ===`);
    
    // Test radial function at various distances
    console.log('Radial function values:');
    for (let r = 0.5; r <= 20; r += 2) {
        const R_nl = quantum.radialWaveFunction(r, n, l);
        const prob = quantum.radialProbabilityDensity(r, n, l);
        console.log(`r=${r.toFixed(1)}: R_nl=${R_nl.toFixed(6)}, prob=${prob.toFixed(6)}`);
    }
    
    // Test angular function
    console.log('\nSpherical harmonic values:');
    for (let theta = 0; theta <= Math.PI; theta += Math.PI/4) {
        const Y_lm = quantum.sphericalHarmonic(theta, 0, l, m);
        console.log(`theta=${(theta*180/Math.PI).toFixed(0)}°: Y_lm=${Y_lm.toFixed(6)}`);
    }
    
    // Test full wave function
    console.log('\nFull wave function values:');
    for (let r = 1; r <= 10; r += 3) {
        const psi = quantum.waveFunction(r, Math.PI/2, 0, n, l, m);
        const prob = quantum.probabilityDensity(r, Math.PI/2, 0, n, l, m);
        console.log(`r=${r}: psi=${psi.toFixed(6)}, |psi|²=${prob.toFixed(6)}`);
    }
    
    console.log('=== End Debug ===\n');
}

// Add to window for browser console access
if (typeof window !== 'undefined') {
    window.debugQuantumNumbers = debugQuantumNumbers;
}
