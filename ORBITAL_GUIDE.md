# Complete Guide to Hydrogen Atom Orbitals
## Quantum Numbers and Expected Visualizations

### Quantum Number Rules
- **n (Principal)**: 1, 2, 3, 4, ... (energy level)
- **l (Angular Momentum)**: 0 to n-1 (orbital shape)
- **m (Magnetic)**: -l to +l (orbital orientation)

### Shell Names
- n=1: K shell
- n=2: L shell  
- n=3: M shell
- n=4: N shell

### Subshell Names
- l=0: s orbital (spherical)
- l=1: p orbital (dumbbell)
- l=2: d orbital (cloverleaf/complex)
- l=3: f orbital (very complex)

---

## n=1 (K Shell)
### 1s Orbital (n=1, l=0, m=0)
- **Energy**: -13.6 eV
- **Shape**: Perfect sphere centered at nucleus
- **Nodes**: 0 radial, 0 angular
- **What to expect**: Dense spherical cloud, most probable at ~0.5 Å from nucleus
- **Color**: Blue (typically)
- **Threshold**: 0.005 works well

---

## n=2 (L Shell)  
### 2s Orbital (n=2, l=0, m=0)
- **Energy**: -3.4 eV
- **Shape**: Larger sphere with radial node
- **Nodes**: 1 radial (spherical shell where ψ=0), 0 angular
- **What to expect**: 
  - Large spherical cloud around nucleus
  - May see gap/dimmer region (radial node) at ~1 Å
  - Maximum probability at ~2.6 Å
- **Threshold**: 0.001 or lower

### 2p Orbitals (n=2, l=1)
- **Energy**: -3.4 eV  
- **Nodes**: 0 radial, 1 angular (nodal plane)

#### 2p_z (n=2, l=1, m=0)
- **Shape**: Dumbbell along z-axis
- **What to expect**: Two lobes above/below xy-plane
- **Nodal plane**: xy-plane (z=0)

#### 2p_x (n=2, l=1, m=±1) 
- **Shape**: Dumbbell along x-axis  
- **What to expect**: Two lobes left/right of yz-plane
- **Nodal plane**: yz-plane (x=0)
- **Note**: m=+1 and m=-1 are linear combinations for real orbitals

#### 2p_y (n=2, l=1, m=±1)
- **Shape**: Dumbbell along y-axis
- **What to expect**: Two lobes front/back of xz-plane  
- **Nodal plane**: xz-plane (y=0)

---

## n=3 (M Shell)
### 3s Orbital (n=3, l=0, m=0)
- **Energy**: -1.51 eV
- **Shape**: Large sphere with 2 radial nodes
- **Nodes**: 2 radial, 0 angular
- **What to expect**:
  - Very large spherical cloud
  - Two spherical nodal surfaces where probability drops to zero
  - Maximum probability at ~7.9 Å
- **Threshold**: 0.0005 or lower

### 3p Orbitals (n=3, l=1)
- **Energy**: -1.51 eV
- **Nodes**: 1 radial, 1 angular

#### 3p_z (n=3, l=1, m=0)
- **Shape**: Large dumbbell along z-axis with radial node
- **What to expect**: Larger version of 2p_z with radial node in each lobe

#### 3p_x, 3p_y (n=3, l=1, m=±1)
- **Shape**: Large dumbbells along x and y axes
- **What to expect**: Similar to 3p_z but oriented along different axes

### 3d Orbitals (n=3, l=2)
- **Energy**: -1.51 eV
- **Nodes**: 0 radial, 2 angular

#### 3d_z² (n=3, l=2, m=0)
- **Shape**: Donut around z-axis with lobes above/below
- **What to expect**: 
  - Two lobes along z-axis
  - Toroidal (donut) cloud in xy-plane
- **Nodal surfaces**: Two conical surfaces

#### 3d_xz (n=3, l=2, m=±1)
- **Shape**: Four lobes in xz-plane
- **What to expect**: Cloverleaf pattern in xz-plane
- **Nodal planes**: yz-plane and xy-plane

#### 3d_yz (n=3, l=2, m=±1)  
- **Shape**: Four lobes in yz-plane
- **What to expect**: Cloverleaf pattern in yz-plane
- **Nodal planes**: xz-plane and xy-plane

#### 3d_x²-y² (n=3, l=2, m=±2)
- **Shape**: Four lobes along x and y axes
- **What to expect**: Lobes point along +x, -x, +y, -y directions
- **Nodal planes**: x=y and x=-y planes

#### 3d_xy (n=3, l=2, m=±2)
- **Shape**: Four lobes between x and y axes  
- **What to expect**: Lobes in xy-plane at 45° to axes
- **Nodal planes**: xz-plane and yz-plane

---

## n=4 (N Shell)
### 4s Orbital (n=4, l=0, m=0)
- **Energy**: -0.85 eV
- **Nodes**: 3 radial, 0 angular
- **What to expect**: Very large sphere with 3 radial nodes
- **Threshold**: 0.0002 or lower

### 4p Orbitals (n=4, l=1, m=0,±1)
- **Nodes**: 2 radial, 1 angular  
- **What to expect**: Very large dumbbells with 2 radial nodes each

### 4d Orbitals (n=4, l=2, m=0,±1,±2)
- **Nodes**: 1 radial, 2 angular
- **What to expect**: Larger versions of 3d orbitals with additional radial node

### 4f Orbitals (n=4, l=3, m=0,±1,±2,±3)
- **Nodes**: 0 radial, 3 angular
- **What to expect**: Very complex shapes with multiple lobes
- **Note**: May be difficult to visualize clearly due to complexity

---

## Complete List of Valid (n,l,m) Combinations

### n=1: 1 orbital total
- (1,0,0) → 1s

### n=2: 4 orbitals total  
- (2,0,0) → 2s
- (2,1,-1) → 2p_y
- (2,1,0) → 2p_z  
- (2,1,1) → 2p_x

### n=3: 9 orbitals total
- (3,0,0) → 3s
- (3,1,-1) → 3p_y
- (3,1,0) → 3p_z
- (3,1,1) → 3p_x  
- (3,2,-2) → 3d_xy
- (3,2,-1) → 3d_yz
- (3,2,0) → 3d_z²
- (3,2,1) → 3d_xz
- (3,2,2) → 3d_x²-y²

### n=4: 16 orbitals total
- (4,0,0) → 4s
- (4,1,-1), (4,1,0), (4,1,1) → 4p orbitals
- (4,2,-2), (4,2,-1), (4,2,0), (4,2,1), (4,2,2) → 4d orbitals  
- (4,3,-3), (4,3,-2), (4,3,-1), (4,3,0), (4,3,1), (4,3,2), (4,3,3) → 4f orbitals

---

## Visualization Tips

### Threshold Settings
- **n=1**: 0.005
- **n=2**: 0.001  
- **n=3**: 0.0005
- **n=4**: 0.0002

### What You Should See
1. **Spherical orbitals (s)**: Spherical clouds, larger with increasing n
2. **Dumbbell orbitals (p)**: Two-lobed shapes along coordinate axes
3. **Cloverleaf orbitals (d)**: Four or more lobes in complex patterns
4. **Complex orbitals (f)**: Very intricate multi-lobed structures

### Common Issues
- **No cloud visible**: Lower the threshold
- **Too dim**: Increase opacity
- **Too small**: Check that maxR scaling is appropriate for the quantum number
- **Wrong shape**: Verify you're using the correct (n,l,m) combination

### Cross-Section Views  
Use 2D cross-sections to better understand orbital shapes:
- **XZ plane**: Good for seeing p_z and d_xz orbitals
- **XY plane**: Good for seeing p_x, p_y and d orbitals in xy-plane
- **YZ plane**: Good for seeing p_y and d_yz orbitals
