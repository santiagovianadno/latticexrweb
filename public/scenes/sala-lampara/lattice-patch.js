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
      centerY: (minY + maxY) * 0.5,
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

  function resolveHeadHeight(config, bounds, fallbackY) {
    if (typeof config.headHeight === "number") return config.headHeight;
    if (typeof config.initialPosition?.[1] === "number") {
      return config.initialPosition[1];
    }
    if (typeof fallbackY === "number") return fallbackY;
    if (bounds) {
      return (
        bounds.minY + (config.headHeightOffsetFromFloor ?? 1.65)
      );
    }
    return 0;
  }

  function hasManualHeight(config) {
    return (
      typeof config.headHeight === "number" ||
      typeof config.initialPosition?.[1] === "number"
    );
  }

  function hasManualFootprint(config) {
    return !!(config.bounds || (config.walkablePolygon?.length >= 3));
  }

  function applyCameraConstraints(viewer, config, bounds, collision, collisionState) {
    const { state } = viewer.global;
    if (!bounds) return;

    // Double-tap / pick switches SuperSplat to orbit and escapes limits.
    // Keep fly mode locked whenever LatticeXR owns navigation.
    if (config.forceFlyMode !== false && state.cameraMode !== "fly") {
      state.cameraMode = "fly";
    }

    if (state.cameraMode !== "fly") return;

    const cam = viewer.cameraManager.camera;
    let x = cam.position.x;
    let y = cam.position.y;
    let z = cam.position.z;

    // Only clamp footprint when the scene defines bounds/polygon.
    // Huge auto AABBs (with outliers) would otherwise trap/misplace the camera.
    if (hasManualFootprint(config) && collision) {
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
    } else {
      collisionState.hit = false;
    }

    // Only lock head height when explicitly configured — auto minY+offset
    // fails on scans with outlier points far below the floor.
    if (hasManualHeight(config)) {
      y = resolveHeadHeight(config, bounds, y);
    }

    cam.position.x = x;
    cam.position.y = y;
    cam.position.z = z;

    const pitchLimit = config.pitchLimit ?? 28;
    cam.angles.x = clamp(cam.angles.x, -pitchLimit, pitchLimit);

    const entity = viewer.global.camera;
    entity.setPosition(cam.position);
    entity.setEulerAngles(cam.angles);
  }

  function polygonCentroid(polygon) {
    let sumX = 0;
    let sumZ = 0;
    for (const [x, z] of polygon) {
      sumX += x;
      sumZ += z;
    }
    return { x: sumX / polygon.length, z: sumZ / polygon.length };
  }

  function getEntryPose(config, bounds, viewer) {
    if (!bounds) return null;

    const yaw = config.initialYaw ?? 0;
    const pitch = config.initialPitch ?? 0;
    const cam = viewer?.cameraManager?.camera;

    if (config.initialPosition) {
      return {
        x: config.initialPosition[0],
        headY: resolveHeadHeight(config, bounds, config.initialPosition[1]),
        z: config.initialPosition[2],
        yaw,
        pitch,
      };
    }

    if (config.walkablePolygon?.length >= 3) {
      const center = polygonCentroid(config.walkablePolygon);
      return {
        x: center.x,
        headY: resolveHeadHeight(
          config,
          bounds,
          cam?.position?.y ?? bounds.centerY,
        ),
        z: center.z,
        yaw,
        pitch,
      };
    }

    // No manual spawn: keep the SuperSplat export pose.
    // Do NOT use AABB center — outlier points often inflate the bbox so the
    // geometric center sits in empty space while the real room is elsewhere.
    if (cam) {
      return {
        x: cam.position.x,
        headY: hasManualHeight(config)
          ? resolveHeadHeight(config, bounds, cam.position.y)
          : cam.position.y,
        z: cam.position.z,
        yaw: cam.angles?.y ?? yaw,
        pitch: cam.angles?.x ?? pitch,
      };
    }

    return {
      x: bounds.centerX,
      headY: hasManualHeight(config)
        ? resolveHeadHeight(config, bounds, bounds.centerY)
        : bounds.centerY,
      z: bounds.centerZ,
      yaw,
      pitch,
    };
  }

  function applyEntryPose(viewer, config, pose, yawOffset = 0) {
    if (!pose) return;

    const cam = viewer.cameraManager.camera;
    cam.position.set(pose.x, pose.headY, pose.z);
    cam.angles.set(pose.pitch, pose.yaw + yawOffset, 0);
    cam.distance = 0;

    applyFov(viewer, config);

    const entity = viewer.global.camera;
    entity.setPosition(cam.position);
    entity.setEulerAngles(cam.angles);
  }

  function setInitialPose(viewer, config, bounds) {
    const { state } = viewer.global;
    const pose = getEntryPose(config, bounds, viewer);
    if (!pose) return;

    // Write pose into CameraManager.camera first…
    applyEntryPose(viewer, config, pose, 0);

    // …then bounce fly↔orbit so FlyController.onEnter re-attaches that pose.
    // Without this, the next cameraManager.update() restores the old controller
    // pose and the spawn (position/yaw/pitch) is lost on reload.
    config._suppressFlyLock = true;
    if (state.cameraMode === "fly") {
      state.cameraMode = "orbit";
    }
    applyEntryPose(viewer, config, pose, 0);
    state.cameraMode = "fly";
    applyEntryPose(viewer, config, pose, 0);
    config._suppressFlyLock = false;

    // Keep re-asserting for a short window while SuperSplat transitions settle.
    config._spawnPose = pose;
    config._spawnUntil = performance.now() + 1200;
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
    // Never show debug chrome on card/home previews.
    if (new URLSearchParams(window.location.search).has("preview")) return;

    const el = document.createElement("div");
    el.style.cssText =
      "position:fixed;bottom:12px;left:12px;z-index:9999;padding:8px 12px;" +
      "background:rgba(0,0,0,0.8);color:#e4e6ea;font:12px/1.45 monospace;" +
      "border:1px solid rgba(228,230,234,0.25);border-radius:4px;" +
      "pointer-events:none;max-width:min(92vw,360px)";
    document.body.appendChild(el);

    viewer.global.app.on("update", () => {
      const p = viewer.cameraManager.camera.position;
      const a = viewer.cameraManager.camera.angles;
      const heightLocked =
        typeof config.headHeight === "number" ||
        typeof config.initialPosition?.[1] === "number";
      el.innerHTML =
        `<strong>LatticeXR debug</strong><br>` +
        `pos: [${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)}]<br>` +
        `yaw: ${a.y.toFixed(1)}° · pitch: ${a.x.toFixed(1)}° · y ${
          heightLocked ? "LOCKED" : "free"
        }<br>` +
        `<span style="opacity:.7">Shift+click → copia [x,z] (polígono)<br>` +
        `Ctrl+Shift+click → copia initialPosition [x,y,z]</span>`;
    });

    viewer.global.app.graphicsDevice.canvas.addEventListener("click", (e) => {
      if (!e.shiftKey) return;
      const p = viewer.cameraManager.camera.position;
      if (e.ctrlKey || e.metaKey) {
        const line = `[${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)}]`;
        console.log(`[LatticeXR] initialPosition: ${line}`);
        navigator.clipboard?.writeText(line).catch(() => {});
      } else {
        const line = `[${p.x.toFixed(2)}, ${p.z.toFixed(2)}]`;
        console.log(`[LatticeXR] walkable corner: ${line}`);
        navigator.clipboard?.writeText(line).catch(() => {});
      }
    });
  }

  /** Block SuperSplat pick/orbit escapes (desktop dblclick + mobile double-tap). */
  function installNavigationLocks(viewer, config) {
    if (config.forceFlyMode === false) return;

    const { events, state } = viewer.global;

    const forceFly = () => {
      if (state.cameraMode !== "fly") {
        state.cameraMode = "fly";
      }
    };

    events.on("pick", () => {
      // CameraManager switches to orbit on pick; reclaim fly on next tick.
      queueMicrotask(forceFly);
      requestAnimationFrame(forceFly);
    });

    events.on("inputEvent", (eventName) => {
      if (eventName === "dblclick" || eventName === "frame" || eventName === "reset") {
        queueMicrotask(forceFly);
        requestAnimationFrame(forceFly);
      }
    });

    events.on("cameraMode:changed", (value) => {
      if (value !== "fly" && !config._suppressFlyLock) {
        queueMicrotask(forceFly);
      }
    });
  }

  function installPreviewMode(viewer, config) {
    const { events, state, app } = viewer.global;
    const params = new URLSearchParams(window.location.search);
    const isStill = params.has("still");
    const hold = params.has("hold") || isStill;
    const rotateSpeed = parseFloat(
      params.get("rotateSpeed") ||
        config.previewRotateSpeed ||
        "8",
    );

    const resolveBounds = () => {
      const gsplatEntity = findGsplatEntity(app.root);
      if (!gsplatEntity) return null;

      let bounds = computeWorldBounds(
        gsplatEntity,
        config.boundaryPadding ?? 0.8,
      );
      if (config.bounds) {
        bounds = { ...bounds, ...config.bounds };
      }
      return bounds;
    };

    const notifyReady = () => {
      const slug = params.get("sceneSlug") || "";
      window.parent?.postMessage(
        { type: "latticexr-preview-ready", slug },
        "*",
      );
    };

    const capturePoster = () => {
      if (!isStill) return;
      const slug = params.get("sceneSlug") || "";
      try {
        const canvas = app.graphicsDevice.canvas;
        const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
        window.parent?.postMessage(
          { type: "latticexr-poster-captured", slug, dataUrl },
          "*",
        );
      } catch {
        /* canvas export blocked */
      }
    };

    let booted = false;
    let entryPose = null;
    let yawOffset = 0;
    let rotationEnabled = false;

    const applyHeldPose = () => {
      if (!entryPose) return;
      applyEntryPose(viewer, config, entryPose, yawOffset);
    };

    const boot = () => {
      if (booted) return;
      if (!state.readyToRender) return;

      const bounds = resolveBounds();
      entryPose = getEntryPose(config, bounds, viewer);
      if (!entryPose) {
        notifyReady();
        return;
      }

      booted = true;
      yawOffset = 0;
      rotationEnabled = !hold && !isStill;

      if (state.cameraMode !== "fly") {
        const prev = state.cameraMode;
        state.cameraMode = "fly";
        events.fire("cameraMode:changed", "fly", prev);
      }

      viewer.inputController.update = function () {};

      applyEntryPose(viewer, config, entryPose, 0);

      const cm = viewer.cameraManager;
      cm.update = function (dt) {
        if (rotationEnabled) {
          yawOffset += rotateSpeed * dt;
        }
        applyEntryPose(viewer, config, entryPose, yawOffset);
      };

      window.LatticeXR.setPreviewYawOffset = (deg) => {
        yawOffset = Number(deg) || 0;
        applyHeldPose();
        app.renderNextFrame = true;
      };

      window.addEventListener("message", (event) => {
        if (event.data?.type === "latticexr-preview-play") {
          rotationEnabled = true;
          app.renderNextFrame = true;
        }
        if (event.data?.type === "latticexr-preview-pause") {
          rotationEnabled = false;
          yawOffset = 0;
          applyHeldPose();
          app.renderNextFrame = true;
        }
      });

      app.renderNextFrame = true;
      app.once("frameend", () => {
        requestAnimationFrame(() => {
          notifyReady();
          capturePoster();
        });
      });
    };

    if (state.readyToRender) {
      boot();
    } else {
      events.once("firstFrame", boot);
    }
  }

  function installViewerPatch(viewer, config) {
    if (new URLSearchParams(window.location.search).has("preview")) {
      installPreviewMode(viewer, config);
      return;
    }

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
    installNavigationLocks(viewer, config);

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

      if (config._spawnPose && performance.now() < (config._spawnUntil ?? 0)) {
        applyEntryPose(viewer, config, config._spawnPose, 0);
      } else if (config._spawnPose) {
        config._spawnPose = null;
      }

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
      const { events, state } = viewer.global;
      const isPreview = new URLSearchParams(window.location.search).has(
        "preview",
      );

      const run = () => installViewerPatch(viewer, config);

      if (isPreview) {
        events.once("firstFrame", run);
        if (state.readyToRender) run();
        return;
      }

      if (viewer.inputController && viewer.cameraManager) {
        run();
        return;
      }

      events.once("firstFrame", run);
    },
  };
})();
