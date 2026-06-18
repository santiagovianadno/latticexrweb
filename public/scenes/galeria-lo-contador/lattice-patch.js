/**
 * LatticeXR viewer patch — first-person WASD with indoor boundaries and walls.
 */
(function () {
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  function transformPoint(mat, p) {
    const x = p.x * mat.data[0] + p.y * mat.data[4] + p.z * mat.data[8] + mat.data[12];
    const y = p.x * mat.data[1] + p.y * mat.data[5] + p.z * mat.data[9] + mat.data[13];
    const z = p.x * mat.data[2] + p.y * mat.data[6] + p.z * mat.data[10] + mat.data[14];
    return { x, y, z };
  }

  function computeWorldBounds(entity, padding) {
    const aabb = entity.gsplat?.customAabb;
    if (!aabb) return null;

    const mat = entity.getWorldTransform();
    const c = aabb.center;
    const h = aabb.halfExtents;
    const corners = [];

    for (const sx of [-1, 1]) {
      for (const sy of [-1, 1]) {
        for (const sz of [-1, 1]) {
          corners.push(
            transformPoint(mat, {
              x: c.x + sx * h.x,
              y: c.y + sy * h.y,
              z: c.z + sz * h.z,
            }),
          );
        }
      }
    }

    let minX = Infinity;
    let minY = Infinity;
    let minZ = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    let maxZ = -Infinity;

    for (const p of corners) {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      minZ = Math.min(minZ, p.z);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
      maxZ = Math.max(maxZ, p.z);
    }

    return {
      minX: minX + padding,
      maxX: maxX - padding,
      minY,
      maxY,
      minZ: minZ + padding,
      maxZ: maxZ - padding,
      centerX: (minX + maxX) * 0.5,
      centerZ: (minZ + maxZ) * 0.5,
    };
  }

  function boundsToPolygon(bounds) {
    return [
      [bounds.minX, bounds.minZ],
      [bounds.maxX, bounds.minZ],
      [bounds.maxX, bounds.maxZ],
      [bounds.minX, bounds.maxZ],
    ];
  }

  function pointInPolygon(x, z, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, zi] = polygon[i];
      const [xj, zj] = polygon[j];
      const intersect =
        zi > z !== zj > z &&
        x < ((xj - xi) * (z - zi)) / (zj - zi + 1e-8) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function closestPointOnSegment(px, pz, ax, az, bx, bz) {
    const abx = bx - ax;
    const abz = bz - az;
    const lenSq = abx * abx + abz * abz;
    if (lenSq < 1e-8) return { x: ax, z: az, t: 0 };
    let t = ((px - ax) * abx + (pz - az) * abz) / lenSq;
    t = clamp(t, 0, 1);
    return { x: ax + abx * t, z: az + abz * t, t };
  }

  function pushOutOfSegment(x, z, ax, az, bx, bz, minDist) {
    const closest = closestPointOnSegment(x, z, ax, az, bx, bz);
    const dx = x - closest.x;
    const dz = z - closest.z;
    const dist = Math.hypot(dx, dz);

    if (dist >= minDist) {
      return { x, z, hit: false };
    }

    if (dist < 1e-6) {
      const nx = -(bz - az);
      const nz = bx - ax;
      const nLen = Math.hypot(nx, nz) || 1;
      return {
        x: closest.x + (nx / nLen) * minDist,
        z: closest.z + (nz / nLen) * minDist,
        hit: true,
      };
    }

    const scale = minDist / dist;
    return {
      x: closest.x + dx * scale,
      z: closest.z + dz * scale,
      hit: true,
    };
  }

  function resolvePolygonCollision(x, z, polygon, radius) {
    let px = x;
    let pz = z;
    let hit = false;

    for (let pass = 0; pass < 3; pass++) {
      for (let i = 0; i < polygon.length; i++) {
        const [ax, az] = polygon[i];
        const [bx, bz] = polygon[(i + 1) % polygon.length];
        const pushed = pushOutOfSegment(px, pz, ax, az, bx, bz, radius);
        px = pushed.x;
        pz = pushed.z;
        hit = hit || pushed.hit;
      }

      if (pointInPolygon(px, pz, polygon)) break;

      let bestDist = Infinity;
      let bestX = px;
      let bestZ = pz;

      for (let i = 0; i < polygon.length; i++) {
        const [ax, az] = polygon[i];
        const [bx, bz] = polygon[(i + 1) % polygon.length];
        const closest = closestPointOnSegment(px, pz, ax, az, bx, bz);
        const dist = Math.hypot(px - closest.x, pz - closest.z);
        if (dist < bestDist) {
          bestDist = dist;
          const dx = px - closest.x;
          const dz = pz - closest.z;
          const len = dist || 1;
          bestX = closest.x + (dx / len) * radius;
          bestZ = closest.z + (dz / len) * radius;
        }
      }

      px = bestX;
      pz = bestZ;
      hit = true;
    }

    return { x: px, z: pz, hit };
  }

  function resolveWallCollisions(x, z, walls, radius) {
    let px = x;
    let pz = z;
    let hit = false;

    for (const wall of walls) {
      const [ax, az] = wall.a;
      const [bx, bz] = wall.b;
      const thickness = wall.thickness ?? 0.2;
      const pushed = pushOutOfSegment(
        px,
        pz,
        ax,
        az,
        bx,
        bz,
        radius + thickness * 0.5,
      );
      px = pushed.x;
      pz = pushed.z;
      hit = hit || pushed.hit;
    }

    return { x: px, z: pz, hit };
  }

  function buildCollision(config, bounds) {
    const polygon =
      config.walkablePolygon && config.walkablePolygon.length >= 3
        ? config.walkablePolygon
        : boundsToPolygon(bounds);

    return {
      polygon,
      walls: config.walls ?? [],
      playerRadius: config.playerRadius ?? 0.35,
    };
  }

  function findGsplatEntity(node) {
    if (node.gsplat) return node;
    for (let i = 0; i < node.children.length; i++) {
      const found = findGsplatEntity(node.children[i]);
      if (found) return found;
    }
    return null;
  }

  function hideElement(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  }

  function applyFov(viewer, config) {
    if (typeof config.fov !== "number") return;

    const cam = viewer.cameraManager.camera;
    cam.fov = config.fov;
    viewer.global.camera.camera.fov = config.fov;
  }

  function applyCameraConstraints(viewer, config, bounds, collision, collisionState) {
    const { state } = viewer.global;
    if (state.cameraMode !== "fly" || !bounds) return;

    const cam = viewer.cameraManager.camera;
    const headY =
      config.headHeight ??
      bounds.minY + (config.headHeightOffsetFromFloor ?? 1.65);

    let x = cam.position.x;
    let z = cam.position.z;

    x = clamp(x, bounds.minX, bounds.maxX);
    z = clamp(z, bounds.minZ, bounds.maxZ);

    const polyResult = resolvePolygonCollision(
      x,
      z,
      collision.polygon,
      collision.playerRadius,
    );
    x = polyResult.x;
    z = polyResult.z;

    const wallResult = resolveWallCollisions(
      x,
      z,
      collision.walls,
      collision.playerRadius,
    );
    x = wallResult.x;
    z = wallResult.z;

    collisionState.hit = polyResult.hit || wallResult.hit;

    cam.position.x = x;
    cam.position.y = headY;
    cam.position.z = z;

    const pitchLimit = config.pitchLimit ?? 28;
    cam.angles.x = clamp(cam.angles.x, -pitchLimit, pitchLimit);

    const entity = viewer.global.camera;
    entity.setPosition(cam.position);
    entity.setEulerAngles(cam.angles);
  }

  function setInitialPose(viewer, config, bounds) {
    const { state, events } = viewer.global;
    const cam = viewer.cameraManager.camera;
    const headY =
      config.headHeight ??
      bounds.minY + (config.headHeightOffsetFromFloor ?? 1.65);

    const x = config.initialPosition?.[0] ?? bounds.centerX;
    const z = config.initialPosition?.[2] ?? bounds.centerZ;
    const yaw = config.initialYaw ?? 0;

    cam.position.set(x, headY, z);
    cam.angles.set(0, yaw, 0);
    cam.distance = 0;

    applyFov(viewer, config);

    if (config.forceFlyMode !== false) {
      const prev = state.cameraMode;
      if (prev !== "fly") {
        state.cameraMode = "fly";
        events.fire("cameraMode:changed", "fly", prev);
      }
    }

    const entity = viewer.global.camera;
    entity.setPosition(cam.position);
    entity.setEulerAngles(cam.angles);
  }

  async function loadConfig() {
    try {
      const res = await fetch("./lattice-config.json");
      if (!res.ok) return {};
      return await res.json();
    } catch {
      return {};
    }
  }

  function installInputGuards(config) {
    if (config.disableVerticalKeys === false) return;

    window.addEventListener(
      "keydown",
      (event) => {
        const key = event.key.toLowerCase();
        if (key === "q" || key === "e") {
          event.preventDefault();
          event.stopImmediatePropagation();
        }
      },
      true,
    );
  }

  function installDebugOverlay(viewer, config) {
    if (!config.debug) return;

    const el = document.createElement("div");
    el.style.cssText =
      "position:fixed;bottom:12px;left:12px;z-index:9999;padding:8px 12px;" +
      "background:rgba(0,0,0,0.75);color:#c47a3a;font:12px monospace;" +
      "border-radius:6px;pointer-events:none";
    document.body.appendChild(el);

    viewer.global.app.on("update", () => {
      const p = viewer.cameraManager.camera.position;
      el.textContent = `x: ${p.x.toFixed(2)}  z: ${p.z.toFixed(2)}  (click canvas + consola para copiar)`;
    });

    viewer.global.app.graphicsDevice.canvas.addEventListener("click", (e) => {
      if (e.shiftKey) {
        const p = viewer.cameraManager.camera.position;
        console.log(
          `[LatticeXR] posición: [${p.x.toFixed(2)}, ${p.z.toFixed(2)}]`,
        );
      }
    });
  }

  function installViewerPatch(viewer, config) {
    const { app, state } = viewer.global;
    let bounds = null;
    let collision = null;
    const collisionState = { hit: false };

    if (typeof config.moveSpeed === "number") {
      viewer.inputController.moveSpeed = config.moveSpeed;
    }

    if (config.hideModeToggle !== false) {
      hideElement("orbitCamera");
      hideElement("flyCamera");
    }

    if (config.hideSuperSplatUI) {
      hideElement("ui");
    }

    installInputGuards(config);

    const gsplatEntity = findGsplatEntity(app.root);
    if (gsplatEntity) {
      bounds = computeWorldBounds(
        gsplatEntity,
        config.boundaryPadding ?? 0.8,
      );

      if (config.bounds) {
        bounds = { ...bounds, ...config.bounds };
      }

      collision = buildCollision(config, bounds);
    }

    const originalUpdate = viewer.cameraManager.update.bind(
      viewer.cameraManager,
    );
    viewer.cameraManager.update = function (dt, frame) {
      originalUpdate(dt, frame);
      applyCameraConstraints(
        viewer,
        config,
        bounds,
        collision,
        collisionState,
      );
    };

    if (bounds) {
      setInitialPose(viewer, config, bounds);
      if (collision) {
        applyCameraConstraints(
          viewer,
          config,
          bounds,
          collision,
          collisionState,
        );
      }
    }

    if (config.forceFlyMode !== false) {
      state.cameraMode = "fly";
    }

    installDebugOverlay(viewer, config);
    app.renderNextFrame = true;
  }

  window.LatticeXR = {
    async patchViewer(viewer) {
      const config = await loadConfig();
      const { events } = viewer.global;

      const run = () => installViewerPatch(viewer, config);

      if (viewer.inputController && viewer.cameraManager) {
        run();
        return;
      }

      events.once("firstFrame", run);
    },
  };
})();
