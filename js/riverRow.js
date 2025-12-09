import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { lilypad } from "./lilypad.js";

// ---------- GLSL SHADERS ----------

// Simple pass-through vertex shader: just forward UVs
const WATER_VERT = /* glsl */`
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Flowing water + splash / ripple rings around lilypads
const WATER_FRAG = /* glsl */`
uniform float uTime;
uniform vec3  uBaseColor;
uniform vec3  uDeepColor;
uniform vec3  uFoamColor;
uniform vec2  uRippleCenters[3];
uniform float uWidth;

varying vec2 vUv;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float gauss(float d, float s) {
    return exp(-(d*d) / (2.0*s*s));
}

void main() {
    // UV -> local (x,z)
    float x = (vUv.x - 0.5);
    float z = (vUv.y - 0.5) * uWidth;

    // ----- BASE FLOWING WAVES (now advected to the right) -----
    float t = uTime * 0.4;
    float flowSpeed = 1.6;                 // +z direction (left -> right)
    float zf = z - flowSpeed * t;          // advected coordinate

    float wave1 = sin(zf * 0.7 + sin(x * 3.0)) * 0.5 + 0.5;
    float wave2 = sin(zf * 1.4 - cos(x * 5.0) + 1.3) * 0.5 + 0.5;
    float waves = mix(wave1, wave2, 0.5);

    vec3 col = mix(uDeepColor, uBaseColor, waves);

    // ----- FOAM: downstream wake + moving splashes (NO circular rings) -----
    float foam = 0.0;
    for (int i = 0; i < 3; i++) {
        vec2 c = uRippleCenters[i];
        float cz = (c.y - 0.5) * uWidth;
        float cx = (c.x - 0.5);

        float dx = x - cx;
        float dz = z - cz; // downstream is dz > 0 when flowing +z

        // Narrow wake ribbon behind the pad
        float w = 0.16 + 0.05 * hash(vec2(float(i), 2.7)); // wake half-width
        float wake = gauss(dx, w) * exp(-dz * 0.55) * smoothstep(0.05, 0.9, dz);

        // Random splashes that get carried downstream
        float h = hash(vec2(float(i), 7.3));
        float rate = 0.55 + 0.18 * float(i);                  // splash frequency
        float phase = fract(uTime * rate + h);                 // 0..1
        float splashZ = cz + phase * 6.0;                      // 0..6 units behind pad

        // Elliptical blob: tight across (x), longer along flow (z)
        float sx = dx * 3.8;                                   // tighter sideways
        float sz = (z - splashZ) * 1.4;                        // longer downstream
        float blob = exp(-18.0 * (sx*sx + sz*sz)) * smoothstep(0.0, 100.4, z - cz);

        // A little flicker so splashes sparkle
        float flicker = 0.65 + 0.35 * sin(uTime * 6.0 + h * 12.0 + float(i) * 2.0);

        foam += 0.85 * wake + 0.65 * blob * flicker;
    }
    foam = clamp(foam, 0.0, 1.6);

    // ----- HIGH-FREQUENCY SPARKLES (also advected) -----
    float cell = hash(floor(vec2(x * 32.0, zf * 32.0)));
    float sparkle = sin(zf * 12.0 + uTime * 5.0 + x * 9.0 + cell * 10.0) * 0.5 + 0.5;
    sparkle *= 0.35;

    vec3 water = col;
    water += foam * 0.9 * uFoamColor;
    water += sparkle * 0.3 * uFoamColor;

    water = mix(water, vec3(1.0), 0.12 * foam);

    gl_FragColor = vec4(water, 0.94);
}
`;


// ---------- JS CLASS ----------

export class riverRow extends GrObject {
    constructor(x) {
        // geometry unchanged: 1 × 0.2 × 17 box
        const geometry = new T.BoxGeometry(1, 0.2, 17);

        // simple flat blue for prototype mode (what you had before)
        const protoMaterial = new T.MeshStandardMaterial({ color: 0x365eba });

        // Shader material for normal mode
        const waterMaterial = new T.ShaderMaterial({
            uniforms: {
                uTime:        { value: 0.0 },
                uBaseColor:   { value: new T.Color(0x3b7bd9) }, // bright mid blue
                uDeepColor:   { value: new T.Color(0x183d70) }, // deep water
                uFoamColor:   { value: new T.Color(0xcdefff) },
                uWidth:       { value: 17.0 },                  // width in Z
                uRippleCenters: {
                    // UV positions corresponding to lilypads at z = +3, 0, -3
                    // mesh spans z ∈ [-8.5, +8.5], so uv.y = (z + 8.5)/17
                    value: [
                        new T.Vector2(0.5, (3 + 8.5) / 17.0),   // z = +3
                        new T.Vector2(0.5, (0 + 8.5) / 17.0),   // z = 0
                        new T.Vector2(0.5, (-3 + 8.5) / 17.0),  // z = -3
                    ],
                },
            },
            vertexShader: WATER_VERT,
            fragmentShader: WATER_FRAG,
            transparent: true,
        });
        waterMaterial.side = T.DoubleSide;

        const mesh = new T.Mesh(geometry, waterMaterial);
        mesh.position.set(x, -0.2, 0);

        // create lilypads exactly as before
        const lilypads = [];
        const lp1 = new lilypad(3);
        mesh.add(lp1.objects[0]);
        lilypads.push(lp1);
        const lp2 = new lilypad(-3);
        mesh.add(lp2.objects[0]);
        lilypads.push(lp2);
        const lp3 = new lilypad(0);
        mesh.add(lp3.objects[0]);
        lilypads.push(lp3);

        super("riverRow", mesh);

        this.x = x;
        this.lilypads = lilypads;

        // keep your proto/normal pattern: geometry is same, material swaps
        this.protoGeo = new T.BoxGeometry(1, 0.2, 17);
        this.normalGeo = geometry;
        this.protoMat = protoMaterial;
        this.normalMat = waterMaterial;   // IMPORTANT: normal uses shader
    }

    rowType() {
        return "river";
    }

    stepWorld(delta, timeOfDay, frozen, char) {
        // same X-snapping logic as before
        if (this.objects[0].position.x < (this.x - 0.06)) {
            this.objects[0].position.x += 0.2;
        } else if (this.objects[0].position.x > (this.x + 0.06)) {
            this.objects[0].position.x -= 0.2;
        }

        // Update water time, even if in prototype we won't see it

        if (!frozen) {
            const mat = this.normalMat;
            if (mat && mat.uniforms && mat.uniforms.uTime) {
                // use timeOfDay from GrWorld as animation clock
                mat.uniforms.uTime.value = timeOfDay;
            }

            const protoBox = document.getElementById("prototype");
            const proto = protoBox ? protoBox.checked : false;

            if (proto) {
                this.objects[0].geometry = this.protoGeo;
                this.objects[0].material = this.protoMat;
            } else {
                this.objects[0].geometry = this.normalGeo;
                this.objects[0].material = this.normalMat;
            }

            // lily pads still do their own proto/normal swap
            this.lilypads.forEach((lp) => {
                lp.stepWorld(delta, timeOfDay);
            });

            // After lilypads update, push their CURRENT local positions into the shader
            //const mat = this.normalMat;
            if (mat && mat.uniforms && mat.uniforms.uRippleCenters && mat.uniforms.uWidth) {
            const width = mat.uniforms.uWidth.value;              // 17
            const centers = mat.uniforms.uRippleCenters.value;    // array of Vector2

            for (let i = 0; i < this.lilypads.length && i < centers.length; i++) {
                const p = this.lilypads[i].objects[0].position;     // local to river mesh
                const u = p.x + 0.5;                                // x in [-0.5,+0.5] -> uv.x in [0,1]
                const v = (p.z + width / 2) / width;                // z in [-8.5,+8.5] -> uv.y in [0,1]
                centers[i].set(u, v);
            }

            }

        }
    }

}


