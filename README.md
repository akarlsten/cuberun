
![Cuberun](./src/textures/cuberun-logo.png)

<p align="center">
A Cubefield-like game built with react-three-fiber.
</p>

### TODO

- [x] Add interpolating between colors of: cubes, walls, fog, ground when level changes (find a formula that will do this slowly over a plate)
- [x] Find some way to make it easier to distinguish distant cubes from the background
- [x] Add reset logic when restarting game (move everything back to initial values and reset all variables) - maybe we can "remount" all components to achieve this with React?
- [x] Make skybox spin in time with gameSpeed
- [x] Find way to make rainbow level interpolate quickly between all colors
- [x] Write music track for game (32 bar loop enough?) - Maybe increase playback rate with gameSpeed
- [x] Favicon
- [ ] Add mobile onscreen controls
- [ ] Maybe slimmen track down

### Potentials

- [ ] Add cool wormhole graphic from: https://github.com/Mamboleoo/InfiniteTubes/blob/master/js/demo3.js - help: https://discourse.threejs.org/t/react-three-fiber-tunnel-tube-with-catmullromcurve3/21277/3 or https://github.com/pmndrs/react-three-fiber/discussions/906
- [x] Create framework for defined cube positions, to create tunnels and such