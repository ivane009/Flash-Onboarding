# Plan: Camino curvo ondulante de izquierda a derecha

## Objetivo
Crear un camino curvo que va de izquierda a derecha, ondulando hacia abajo. Según el scroll, el camino se va llenando desde el inicio.

## Path ondulante
```svg
d="M 80 100 C 180 100, 280 150, 240 200 C 200 250, 320 300, 280 350 C 240 400, 340 450, 300 500 C 260 550, 360 600, 320 650 C 280 700, 380 750, 340 800"
```

## Posiciones de los 5 puntos
1. `cx="80" cy="100"` - Inicio
2. `cx="240" cy="200"` 
3. `cx="280" cy="350"`
4. `cx="300" cy="500"`
5. `cx="320" cy="650"`

## Archivos a modificar

### 1. landing.html
- Reemplazar `path-base` y `path-progress` con el nuevo path ondulante
- Mantener 5 `circle.step-dot` en las posiciones indicadas

### 2. landing.js
- Ajustar `pathSegments` para que el progreso se llene de arriba hacia abajo:
  ```javascript
  const pathSegments = [
    { end: 0.20 },  // punto 1
    { end: 0.45 },  // punto 2
    { end: 0.70 },  // punto 3
    { end: 0.90 },  // punto 4
    { end: 1.0 }    // punto 5 (fin)
  ];
  ```
