# Animated Tech Backgrounds

Two animated tech background components are available for your portfolio:

## 1. AnimatedBackground (Canvas-based) ✨ **Currently Active**

**Features:**
- Particle system with floating dots
- Connected particles (network effect)
- Animated grid pattern
- Smooth animations
- Adapts to light/dark mode
- Performance-optimized

**Best for:** Modern, dynamic feel with interactive particles

**Location:** `src/components/common/AnimatedBackground.tsx`

## 2. TechBackground (CSS-only)

**Features:**
- Moving grid pattern
- Floating code symbols (`</>`, `{}`, etc.)
- Gradient orbs
- Pure CSS animations (no canvas)
- Lighter performance footprint

**Best for:** Subtle tech aesthetic, better mobile performance

**Location:** `src/components/common/TechBackground.tsx`

## How to Switch Backgrounds

### Currently Using: AnimatedBackground

To switch to TechBackground:

1. Open `src/pages/PortfolioPage.tsx`
2. Replace:
   ```tsx
   import AnimatedBackground from '../components/common/AnimatedBackground';
   ```
   with:
   ```tsx
   import TechBackground from '../components/common/TechBackground';
   ```

3. Replace:
   ```tsx
   <AnimatedBackground />
   ```
   with:
   ```tsx
   <TechBackground />
   ```

4. Do the same in `src/pages/HomePage.tsx`

## Customization

### AnimatedBackground

Edit `src/components/common/AnimatedBackground.tsx`:

- **Particle count**: Change `particleCount` (line ~35)
- **Grid size**: Change `gridSize` (line ~56)
- **Connection distance**: Change `150` (line ~99)
- **Particle speed**: Adjust `vx` and `vy` multipliers (lines ~42-43)
- **Colors**: Adjust `rgba()` values throughout

### TechBackground

Edit `src/components/common/TechBackground.tsx`:

- **Number of symbols**: Change `[...Array(20)]` (line ~13)
- **Symbol types**: Edit array in line 22
- **Animation speed**: Adjust `animationDuration` (line ~20)
- **Grid size**: Change `background-size: 50px 50px` (line ~47)
- **Colors**: Adjust Tailwind classes and rgba values

## Remove Background

To remove the animated background entirely:

1. Remove the import:
   ```tsx
   import AnimatedBackground from '../components/common/AnimatedBackground';
   ```

2. Remove the component:
   ```tsx
   <AnimatedBackground />
   ```

## Performance Notes

- **AnimatedBackground**: Uses Canvas API, slightly more resource-intensive
- **TechBackground**: Pure CSS, better for low-end devices
- Both are optimized to run at 60fps
- Animations pause when tab is not active
- Opacity set to 60% to not distract from content

## Tips

- The background automatically adjusts to light/dark theme
- Test on mobile devices for performance
- Reduce particle count if experiencing lag
- Both backgrounds are designed to be subtle and not distract from content
