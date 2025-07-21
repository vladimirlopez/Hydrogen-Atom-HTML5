# Interactive Hydrogen Atom Simulation (HTML5)

An interactive web-based simulation of hydrogen atom wave functions and quantum mechanical orbitals. This HTML5 version provides a comprehensive, accessible, and engaging way to explore quantum mechanics concepts through 3D visualizations and guided tutorials.

## 🚀 Features

### Interactive 3D Visualizations
- **Real-time 3D orbital rendering** using Three.js
- **Multiple visualization modes**:
  - 3D probability density clouds
  - 2D cross-sectional views (XZ, XY, YZ planes)
  - Radial wave function plots
  - Energy level diagrams
- **Dynamic quantum number controls** (n, l, m)
- **Adjustable opacity and probability thresholds**
- **Smooth camera controls** with orbit, zoom, and pan

### Educational Content
- **Guided interactive tutorial** covering:
  - Quantum numbers and their meanings
  - Energy levels and quantization
  - Orbital shapes and symmetries
  - Probability density interpretation
- **Real-time orbital information** display
- **Mathematical equations** for wave functions
- **Node counting** (radial and angular)

### Advanced Features
- **Animation controls** for orbital rotation
- **Comparison modes** for different orbitals
- **Export/import functionality** for saving states
- **Screenshot capture** capability
- **Keyboard shortcuts** for quick navigation
- **Performance monitoring** with FPS display
- **Responsive design** for mobile and desktop
- **Accessibility features** for screen readers

## 🎮 Quick Start

1. **Open the simulation**: Open `index.html` in a modern web browser
2. **Start the tutorial**: Click "Start Tutorial" for guided learning
3. **Explore freely**: Use the control panel to change quantum numbers
4. **Try different views**: Switch between 3D, 2D cross-sections, and radial plots

## 🎯 Controls Guide

### Quantum Number Controls
- **n (Principal)**: Determines energy level and orbital size (1-4)
- **l (Angular Momentum)**: Determines orbital shape (0 to n-1)
  - l = 0: s orbitals (spherical)
  - l = 1: p orbitals (dumbbell)
  - l = 2: d orbitals (complex shapes)
- **m (Magnetic)**: Determines orbital orientation (-l to +l)

### Visualization Controls
- **Type**: Choose between 3D, 2D cross-section, radial plot, or energy diagram
- **Cross-section plane**: Select XZ, XY, or YZ plane for 2D views
- **Opacity**: Adjust transparency of the orbital visualization
- **Threshold**: Set minimum probability density to display

### Camera Controls
- **Left mouse**: Rotate view around the atom
- **Right mouse**: Pan the view
- **Scroll wheel**: Zoom in/out
- **Reset View button**: Return to default camera position

## ⌨️ Keyboard Shortcuts

- `Ctrl+1`: Show 1s orbital
- `Ctrl+2`: Show 2s orbital
- `Ctrl+Shift+2`: Show 2p orbital
- `Ctrl+3`: Show 3s orbital
- `Ctrl+Shift+3`: Show 3p orbital
- `Ctrl+Alt+3`: Show 3d orbital
- `Ctrl+R`: Reset camera view
- `Ctrl+A`: Toggle rotation animation

## 🔬 Scientific Background

### Quantum Mechanics Concepts

**Wave Functions**: The simulation displays solutions to the Schrödinger equation for hydrogen:
```
ψ(r,θ,φ) = R_nl(r) × Y_l^m(θ,φ)
```

**Energy Levels**: Energy depends only on the principal quantum number:
```
E_n = -13.6 eV / n²
```

**Quantum Numbers**:
- **n**: Principal quantum number (1, 2, 3, ...)
- **l**: Orbital angular momentum (0, 1, 2, ..., n-1)
- **m**: Magnetic quantum number (-l, ..., 0, ..., +l)

### Orbital Types
- **s orbitals** (l=0): Spherically symmetric
- **p orbitals** (l=1): Dumbbell-shaped with angular node
- **d orbitals** (l=2): Complex four-leaf or unique shapes
- **f orbitals** (l=3): Even more complex multi-lobed shapes

## 🛠️ Technical Implementation

### Core Technologies
- **HTML5/CSS3**: Modern web standards for UI and styling
- **JavaScript ES6+**: Object-oriented application architecture
- **Three.js**: 3D graphics and WebGL rendering
- **Canvas 2D**: 2D plotting for radial functions and cross-sections

### Architecture
```
js/
├── quantum-math.js     # Quantum mechanical calculations
├── visualization.js    # 3D rendering engine
├── controls.js        # UI controls and interactions
├── tutorial.js        # Interactive tutorial system
└── main.js            # Application initialization
```

### Key Classes
- **QuantumMath**: Calculates wave functions and quantum properties
- **HydrogenVisualization**: Manages 3D rendering and visualization modes
- **ControlsManager**: Handles UI interactions and state management
- **TutorialManager**: Provides guided learning experience

## 🎨 Customization

### Adding New Orbitals
To add support for higher quantum numbers, modify the quantum number limits in `controls.js`:

```javascript
// In updateLOptions method
for (let l = 0; l < Math.min(n, 5); l++) {
    // Add orbital options
}
```

### Custom Color Schemes
Modify the color mapping in `visualization.js`:

```javascript
// In create3DOrbital method
color.setHSL(0.6 - intensity * 0.4, 1.0, 0.3 + intensity * 0.4);
```

### Performance Optimization
Adjust visualization resolution in `visualization.js`:

```javascript
const resolution = 40; // Decrease for better performance
```

## 📱 Mobile Support

The simulation is fully responsive and optimized for mobile devices:
- **Touch controls** for orbital manipulation
- **Adaptive UI** that adjusts to screen size
- **Optimized performance** for mobile GPUs
- **Accessible controls** with proper touch targets

## 🔍 Browser Compatibility

### Recommended Browsers
- **Chrome 80+**: Full WebGL 2.0 support
- **Firefox 75+**: Excellent performance
- **Safari 13+**: Good compatibility
- **Edge 80+**: Full feature support

### Minimum Requirements
- **WebGL support**: Required for 3D visualization
- **ES6 support**: Modern JavaScript features
- **Canvas 2D**: For 2D plotting fallbacks

## 🚨 Troubleshooting

### Common Issues

**Black screen or no 3D visualization**:
- Ensure WebGL is enabled in your browser
- Update graphics drivers
- Try a different browser

**Poor performance**:
- Reduce visualization resolution
- Lower opacity and threshold values
- Close other browser tabs

**Controls not responding**:
- Check browser console for errors
- Ensure JavaScript is enabled
- Refresh the page

### Debug Mode
Open browser developer tools and check the console for detailed logging and performance metrics.

## 🔬 Educational Applications

### Classroom Use
- **Physics courses**: Quantum mechanics introduction
- **Chemistry classes**: Atomic structure and bonding
- **Advanced placement**: AP Physics and Chemistry
- **University level**: Physical chemistry and quantum mechanics

### Learning Objectives
Students will understand:
- Quantum number relationships
- Wave function interpretation
- Probability density concepts
- Energy quantization
- Orbital shapes and symmetries

### Assessment Ideas
- Compare orbital sizes across quantum numbers
- Predict orbital shapes from quantum numbers
- Explain node formation and counting
- Relate energy levels to quantum numbers

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Additional visualization modes
- More orbital types (f, g orbitals)
- Enhanced tutorial content
- Performance optimizations
- Accessibility improvements

## 📄 License

This project is open source and available under the MIT License.

## 🔗 Related Resources

- [Original Python simulation](hydrogen_atom_simulation.py)
- [Three.js documentation](https://threejs.org/docs/)
- [Quantum mechanics textbooks](https://en.wikipedia.org/wiki/Quantum_mechanics)
- [Hydrogen atom physics](https://en.wikipedia.org/wiki/Hydrogen_atom)

## 📧 Support

For questions, bug reports, or feature requests, please check the browser console for errors and provide detailed information about your system and browser version.

---

*Built with ❤️ for quantum education and scientific visualization*
