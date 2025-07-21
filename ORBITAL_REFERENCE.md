## Quick Reference: All Valid Hydrogen Orbitals

| n | l | m | Orbital | Shape | Energy (eV) | Nodes (R,A) | Threshold |
|---|---|---|---------|-------|-------------|-------------|-----------|
| 1 | 0 | 0 | 1s | Sphere | -13.6 | 0,0 | 0.005 |
| 2 | 0 | 0 | 2s | Large sphere + radial node | -3.4 | 1,0 | 0.001 |
| 2 | 1 | -1 | 2p_y | Dumbbell (y-axis) | -3.4 | 0,1 | 0.001 |
| 2 | 1 | 0 | 2p_z | Dumbbell (z-axis) | -3.4 | 0,1 | 0.001 |
| 2 | 1 | 1 | 2p_x | Dumbbell (x-axis) | -3.4 | 0,1 | 0.001 |
| 3 | 0 | 0 | 3s | Very large sphere + 2 radial nodes | -1.51 | 2,0 | 0.0005 |
| 3 | 1 | -1 | 3p_y | Large dumbbell (y) + radial node | -1.51 | 1,1 | 0.0005 |
| 3 | 1 | 0 | 3p_z | Large dumbbell (z) + radial node | -1.51 | 1,1 | 0.0005 |
| 3 | 1 | 1 | 3p_x | Large dumbbell (x) + radial node | -1.51 | 1,1 | 0.0005 |
| 3 | 2 | -2 | 3d_xy | Four lobes (xy diagonal) | -1.51 | 0,2 | 0.0005 |
| 3 | 2 | -1 | 3d_yz | Four lobes (yz plane) | -1.51 | 0,2 | 0.0005 |
| 3 | 2 | 0 | 3d_z² | Donut + z-lobes | -1.51 | 0,2 | 0.0005 |
| 3 | 2 | 1 | 3d_xz | Four lobes (xz plane) | -1.51 | 0,2 | 0.0005 |
| 3 | 2 | 2 | 3d_x²-y² | Four lobes (x,y axes) | -1.51 | 0,2 | 0.0005 |
| 4 | 0 | 0 | 4s | Huge sphere + 3 radial nodes | -0.85 | 3,0 | 0.0002 |
| 4 | 1 | -1,0,1 | 4p | Huge dumbbells + 2 radial nodes | -0.85 | 2,1 | 0.0002 |
| 4 | 2 | -2,-1,0,1,2 | 4d | Large d-shapes + 1 radial node | -0.85 | 1,2 | 0.0002 |
| 4 | 3 | -3,-2,-1,0,1,2,3 | 4f | Complex multi-lobe shapes | -0.85 | 0,3 | 0.0002 |

**Legend:**
- **Nodes (R,A)**: Radial nodes, Angular nodes
- **Threshold**: Recommended minimum threshold for visibility
- **Energy**: Binding energy (negative = bound state)

### What You Should See:

**s orbitals (l=0)**: Perfect spheres, getting larger with increasing n
- 1s: Dense small sphere
- 2s: Larger sphere with radial gap
- 3s: Very large with 2 radial gaps
- 4s: Huge with 3 radial gaps

**p orbitals (l=1)**: Dumbbell shapes along coordinate axes
- 2p: Clean two-lobe dumbbells
- 3p: Larger dumbbells with radial node in each lobe
- 4p: Very large with 2 radial nodes

**d orbitals (l=2)**: Complex cloverleaf patterns
- 3d_z²: Donut shape with lobes above/below
- 3d_x²-y²: Four lobes pointing along x,y axes
- 3d_xy: Four lobes at 45° angles
- 3d_xz, 3d_yz: Four lobes in respective planes

**f orbitals (l=3)**: Very complex shapes with many lobes
- 4f: Multiple orientations, very intricate patterns

### Troubleshooting:
- **Can't see orbital**: Lower threshold value
- **Orbital too faint**: Increase opacity (0.8-1.0)
- **Wrong size**: Check n² scaling is working
- **Missing lobes**: Use 2D cross-sections to verify shape
