(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,840177,e=>{"use strict";let t=5,i=[1,2,3,4].map(e=>e/t),n=e=>i.filter(t=>e>=t).length,s=e=>e<.5?4*e*e*e:1-(-2*e+2)**3/2,r=e=>1-(1-e)**3;e.s(["Playback",0,class{reduced;stages;time;stage;from;to;elapsed;duration;playing;ease;constructor(e=!1,i=t){this.reduced=e,this.stages=i,this.time=0,this.stage=0,this.from=0,this.to=0,this.elapsed=0,this.duration=0,this.playing=!1,this.ease=s}get moving(){return this.playing}setReduced(e){this.reduced=e,e&&this.cut()}start(e){this.stage=n(Math.min(1,Math.max(0,e))),this.cut()}jump(e){this.stage=e,this.cut()}setProgress(e){this.go(n(Math.min(1,Math.max(0,e))))}go(e){if(e!==this.stage){if(this.stage=e,this.reduced)return this.cut();this.from=this.time,this.to=((e,i=t)=>e/(i-1))(e,this.stages),this.elapsed=0,this.duration=Math.min(1.2,.3+.6*(Math.abs(this.to-this.time)*(this.stages-1))),this.ease=this.playing?r:s,this.playing=!0}}advance(e){if(!this.playing)return!1;this.elapsed+=e;let t=Math.min(1,this.elapsed/this.duration);return this.time=t>=1?this.to:this.from+(this.to-this.from)*this.ease(t),t>=1&&(this.playing=!1),!0}cut(){this.time=((e,i=t)=>e/(i-1))(this.stage,this.stages),this.playing=!1}}])},155340,e=>{"use strict";let t,i;var n=e.i(208359),s=e.i(427919),r=n;s.UniformsLib.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new r.Vector2},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}},s.ShaderLib.line={uniforms:r.UniformsUtils.merge([s.UniformsLib.common,s.UniformsLib.fog,s.UniformsLib.line]),vertexShader:`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		float trimSegmentAlpha( const in vec4 start, const in vec4 end ) {

			// compute the interpolation factor needed to trim the segment so it terminates
			// between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column

			// we need different nearEstimate formula for reversed and default depth buffer
			// a is positive with a reversed depth buffer so it can be used for controlling the code flow
			float nearEstimate = ( a > 0.0 ) ? ( - b / ( a + 1.0 ) ) : ( - 0.5 * b / a );

			return ( nearEstimate - start.z ) / ( end.z - start.z );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef USE_DASH

				float lineDistanceStart = dashScale * instanceDistanceStart;
				float lineDistanceEnd = dashScale * instanceDistanceEnd;

			#endif

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					float alpha = trimSegmentAlpha( start, end );
					end.xyz = mix( start.xyz, end.xyz, alpha );

					#ifdef USE_DASH

						lineDistanceEnd = mix( lineDistanceStart, lineDistanceEnd, alpha );

					#endif

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					float alpha = trimSegmentAlpha( end, start );
					start.xyz = mix( end.xyz, start.xyz, alpha );

					#ifdef USE_DASH

						lineDistanceStart = mix( lineDistanceEnd, lineDistanceStart, alpha );

					#endif

				}

			}

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? lineDistanceStart : lineDistanceEnd;
				vUv = uv;

			#endif

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 tmpFwd = normalize( mix( start.xyz, end.xyz, 0.5 ) );
				vec3 worldUp = normalize( cross( worldDir, tmpFwd ) );
				vec3 worldFwd = cross( worldDir, worldUp );
				worldPos = position.y < 0.5 ? start: end;

				// height offset
				float hw = linewidth * 0.5;
				worldPos.xyz += position.x < 0.0 ? hw * worldUp : - hw * worldUp;

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// cap extension
					worldPos.xyz += position.y < 0.5 ? - hw * worldDir : hw * worldDir;

					// add width to the box
					worldPos.xyz += worldFwd * hw;

					// endcaps
					if ( position.y > 1.0 || position.y < 0.0 ) {

						worldPos.xyz -= worldFwd * 2.0 * hw;

					}

				#endif

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,fragmentShader:`
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			float alpha = opacity;
			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};class a extends r.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:r.UniformsUtils.clone(s.ShaderLib.line.uniforms),vertexShader:s.ShaderLib.line.vertexShader,fragmentShader:s.ShaderLib.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){!0===e!==this.worldUnits&&(this.needsUpdate=!0),!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){!0===e!==this.dashed&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(!0===e!==this.alphaToCoverage&&(this.needsUpdate=!0),!0===e?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}var o=n,l=n;let d=new l.Box3,c=new l.Vector3;class h extends l.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new l.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new l.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let i=new l.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new l.InterleavedBufferAttribute(i,3,0)),this.setAttribute("instanceEnd",new l.InterleavedBufferAttribute(i,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let i=new l.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceColorStart",new l.InterleavedBufferAttribute(i,3,0)),this.setAttribute("instanceColorEnd",new l.InterleavedBufferAttribute(i,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new l.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new l.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),d.setFromBufferAttribute(t),this.boundingBox.union(d))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new l.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let i=this.boundingSphere.center;this.boundingBox.getCenter(i);let n=0;for(let s=0,r=e.count;s<r;s++)c.fromBufferAttribute(e,s),n=Math.max(n,i.distanceToSquared(c)),c.fromBufferAttribute(t,s),n=Math.max(n,i.distanceToSquared(c));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}}let u=new o.Vector4,f=new o.Vector3,p=new o.Vector3,m=new o.Vector4,v=new o.Vector4,g=new o.Vector4,y=new o.Vector3,w=new o.Matrix4,x=new o.Line3,S=new o.Vector3,b=new o.Box3,M=new o.Sphere,A=new o.Vector4;function z(e,t,n){return A.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),A.multiplyScalar(1/A.w),A.x=i/n.width,A.y=i/n.height,A.applyMatrix4(e.projectionMatrixInverse),A.multiplyScalar(1/A.w),Math.abs(Math.max(A.x,A.y))}class _ extends o.Mesh{constructor(e=new h,t=new a({color:0xffffff*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let e=0,s=0,r=t.count;e<r;e++,s+=2)f.fromBufferAttribute(t,e),p.fromBufferAttribute(i,e),n[s]=0===s?0:n[s-1],n[s+1]=n[s]+f.distanceTo(p);let s=new o.InstancedInterleavedBuffer(n,2,1);return e.setAttribute("instanceDistanceStart",new o.InterleavedBufferAttribute(s,1,0)),e.setAttribute("instanceDistanceEnd",new o.InterleavedBufferAttribute(s,1,1)),this}raycast(e,n){let s,r,a=this.material.worldUnits,l=e.camera;if(null!==l||a||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.'),!1===a&&(0===this.material.resolution.x||0===this.material.resolution.y))return;let d=void 0!==e.params.Line2&&e.params.Line2.threshold||0;t=e.ray;let c=this.matrixWorld,h=this.geometry,u=this.material;if(i=u.linewidth+d,null===h.boundingSphere&&h.computeBoundingSphere(),M.copy(h.boundingSphere).applyMatrix4(c),a)s=.5*i;else{let e=Math.max(l.near,M.distanceToPoint(t.origin));s=z(l,e,u.resolution)}if(M.radius+=s,!1!==t.intersectsSphere(M)){if(null===h.boundingBox&&h.computeBoundingBox(),b.copy(h.boundingBox).applyMatrix4(c),a)r=.5*i;else{let e=Math.max(l.near,b.distanceToPoint(t.origin));r=z(l,e,u.resolution)}b.expandByScalar(r),!1!==t.intersectsBox(b)&&(a?function(e,n){let s=e.matrixWorld,r=e.geometry,a=r.attributes.instanceStart,l=r.attributes.instanceEnd,d=Math.min(r.instanceCount,a.count);for(let r=0;r<d;r++){x.start.fromBufferAttribute(a,r),x.end.fromBufferAttribute(l,r),x.applyMatrix4(s);let d=new o.Vector3,c=new o.Vector3;t.distanceSqToSegment(x.start,x.end,c,d),c.distanceTo(d)<.5*i&&n.push({point:c,pointOnLine:d,distance:t.origin.distanceTo(c),object:e,face:null,faceIndex:r,uv:null,uv1:null})}}(this,n):function(e,n,s){let r=n.projectionMatrix,a=e.material.resolution,l=e.matrixWorld,d=e.geometry,c=d.attributes.instanceStart,h=d.attributes.instanceEnd,u=Math.min(d.instanceCount,c.count),f=-n.near;t.at(1,g),g.w=1,g.applyMatrix4(n.matrixWorldInverse),g.applyMatrix4(r),g.multiplyScalar(1/g.w),g.x*=a.x/2,g.y*=a.y/2,g.z=0,y.copy(g),w.multiplyMatrices(n.matrixWorldInverse,l);for(let n=0;n<u;n++){if(m.fromBufferAttribute(c,n),v.fromBufferAttribute(h,n),m.w=1,v.w=1,m.applyMatrix4(w),v.applyMatrix4(w),m.z>f&&v.z>f)continue;if(m.z>f){let e=m.z-v.z,t=(m.z-f)/e;m.lerp(v,t)}else if(v.z>f){let e=v.z-m.z,t=(v.z-f)/e;v.lerp(m,t)}m.applyMatrix4(r),v.applyMatrix4(r),m.multiplyScalar(1/m.w),v.multiplyScalar(1/v.w),m.x*=a.x/2,m.y*=a.y/2,v.x*=a.x/2,v.y*=a.y/2,x.start.copy(m),x.start.z=0,x.end.copy(v),x.end.z=0;let d=x.closestPointToPointParameter(y,!0);x.at(d,S);let u=o.MathUtils.lerp(m.z,v.z,d),p=u>=-1&&u<=1,g=y.distanceTo(S)<.5*i;if(p&&g){x.start.fromBufferAttribute(c,n),x.end.fromBufferAttribute(h,n),x.start.applyMatrix4(l),x.end.applyMatrix4(l);let i=new o.Vector3,r=new o.Vector3;t.distanceSqToSegment(x.start,x.end,r,i),s.push({point:r,pointOnLine:i,distance:t.origin.distanceTo(r),object:e,face:null,faceIndex:n,uv:null,uv1:null})}}}(this,l,n))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(u),this.material.uniforms.resolution.value.set(u.z,u.w))}}var E=e.i(980563),U=e.i(460383),B=e.i(840177);let D="#0b0f0d",P="#eaeee9",L=24*Math.PI/180,T=24*Math.PI/180,V=e=>/^(body|cap)/.test(e)?{rings:"ends",meridians:!0}:/^(core|film)/.test(e)?{rings:"every2",meridians:!0}:{rings:"none",meridians:!1},C=`
  uniform vec2 uResolution;
  uniform float uWidth;
  void main() {
    vec4 clip = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vec3 n = normalize(normalMatrix * normal);
    vec2 dir = (projectionMatrix * vec4(n, 0.0)).xy;
    float len = length(dir);
    dir = len > 1e-6 ? dir / len : vec2(0.0);
    clip.xy += dir * (uWidth * 2.0 / uResolution) * clip.w;
    gl_Position = clip;
  }
`,O=`
  uniform vec3 uColor;
  void main() { gl_FragColor = vec4(uColor, 1.0); }
`;class I extends E.Surface{scene=new n.Scene;camera=new n.PerspectiveCamera(16,1,.01,100);root;mixer;duration;lineMaterials=[];outline;disposables=[];dims=[];clones=[];center=new n.Vector3;frameBox=new n.Box3;frameSphere=new n.Sphere;radius=1;playback=new B.Playback;progress=0;motion=!0;placed=!1;framed=!1;constructor(e){super(),this.scene.background=new n.Color(D),this.root=e.scene.clone(!0),this.scene.add(this.root);const t=e.animations[0];this.mixer=new n.AnimationMixer(this.root),this.duration=t?.duration??1,t&&this.mixer.clipAction(t).play(),this.outline=new n.ShaderMaterial({vertexShader:C,fragmentShader:O,uniforms:{uResolution:{value:new n.Vector2(1,1)},uWidth:{value:1.6},uColor:{value:new n.Color(P)}},side:n.BackSide}),this.disposables.push(this.outline),this.build()}static async create(e){return(0,E.getHub)()?new I(await (0,U.loadGLB)(e)):null}build(){let e=new n.MeshBasicMaterial({color:D,polygonOffset:!0,polygonOffsetFactor:1.5,polygonOffsetUnits:2,toneMapped:!1}),t=new a({color:new n.Color(P),linewidth:1.6,toneMapped:!1});this.lineMaterials.push(t),this.disposables.push(e,t);let i=new Map,s=[],r=new Map;for(let a of(this.root.traverse(e=>{e instanceof n.Mesh&&s.push(e),e.name.startsWith("dim_")&&r.set(e.name,e),/_rig_c\d+$/.test(e.name)&&this.clones.push(e)}),s)){let s=a.name.replace(/_c\d+$/,""),r=`${a.geometry.uuid}:${s}`,o=i.get(r);if(void 0===o){let e=function(e,t){let i=e.getIndex(),n=e.getAttribute("position");if(!i||0===n.count||"none"===t.rings&&!t.meridians)return[];let s=e=>Math.round(1e6*n.getY(e)),r=e=>Math.hypot(n.getX(e),n.getZ(e)),a=new Map;for(let e=0;e<n.count;e++)a.set(s(e),(a.get(s(e))??0)+1);let o=Math.max(...a.values());if(o<6)return[];let l=[...a.entries()].filter(([,e])=>e===o).map(([e])=>e).sort((e,t)=>e-t),d=new Set;if("every2"===t.rings&&l.forEach((e,t)=>t%2==0&&d.add(e)),"ends"===t.rings&&l.length>1){d.add(l[0]),d.add(l[l.length-1]);for(let e=1;e<l.length-1;e++)l[e+1]-l[e]>3*(l[e]-l[e-1])&&d.add(l[e])}let c=2*Math.PI/o,h=Math.max(1,Math.round(o/4)),u=e=>(Math.round(Math.atan2(n.getZ(e),n.getX(e))/c)%o+o)%o,f=new Set,p=[],m=(e,t)=>{p.push(n.getX(e),n.getY(e),n.getZ(e),n.getX(t),n.getY(t),n.getZ(t))},v=(e,i)=>{let a=Math.min(e,i)*n.count+Math.max(e,i);if(f.has(a))return;f.add(a);let o=r(e),l=r(i);if(s(e)===s(i)){"none"!==t.rings&&d.has(s(e))&&o>1e-9&&m(e,i);return}if(!t.meridians)return;let c=o<1e-9,p=c?i:e;(c||l<1e-9||u(e)===u(i))&&u(p)%h==0&&m(e,i)};for(let e=0;e<i.count;e+=3){let t=i.getX(e),n=i.getX(e+1),s=i.getX(e+2);v(t,n),v(n,s),v(s,t)}return p}(a.geometry,V(s));o=e.length?new h().setPositions(e):null,i.set(r,o),o&&this.disposables.push(o)}let l=a.geometry;a.material=e,a.castShadow=a.receiveShadow=!1;let d=new n.Mesh(l,this.outline);a.add(d),o&&a.add(new _(o,t))}for(let[e,t]of r){if(!e.endsWith("_a"))continue;let i=r.get(`${e.slice(0,-2)}_b`);if(!i)continue;let s=new h,o=new a({color:new n.Color(P),linewidth:1.2800000000000002,toneMapped:!1});this.lineMaterials.push(o),this.disposables.push(s,o);let l=new _(s,o);l.frustumCulled=!1,this.scene.add(l),this.dims.push({a:t,b:i,line:l})}}pose(){for(let e of(this.mixer.setTime(this.progress*this.duration),this.clones))e.visible=e.scale.x>.05}measurePose(){this.root.updateMatrixWorld(!0);let e=this.frameBox.makeEmpty(),t=new n.Box3;this.root.traverse(i=>{i instanceof n.Mesh&&i.material!==this.outline&&!(i.getWorldScale(new n.Vector3).x<.05)&&(t.setFromObject(i),t.isEmpty()||e.union(t))}),e.isEmpty()||e.getBoundingSphere(this.frameSphere)}setMotion(e){this.motion=e,this.playback.setReduced(!e),this.invalidate()}setProgress(e){this.placed?this.playback.setProgress(e):this.playback.start(e),this.placed=!0,this.invalidate()}onResize(){this.camera.aspect=this.pxW/Math.max(this.pxH,1),this.camera.updateProjectionMatrix();let e=Math.min(window.devicePixelRatio||1,2);for(let e of this.lineMaterials)e.resolution.set(this.pxW,this.pxH);this.outline.uniforms.uResolution.value.set(this.pxW,this.pxH),this.outline.uniforms.uWidth.value=1.6*e}update(e){let t=this.playback.advance(e),i=this.progress!==this.playback.time;return this.progress=this.playback.time,(t||i)&&(this.needsDraw=!0),this.stepFrame(e)||this.playback.moving}stepFrame(e){this.pose(),this.measurePose();let t=this.frameSphere.radius,i=this.frameSphere.center;if(!this.framed)return this.radius=t,this.center.copy(i),this.framed=!0,this.needsDraw=!0,!1;let n=1-Math.exp(-4*e);return!!(Math.abs(t-this.radius)>.001*this.radius||this.center.distanceToSquared(i)>(.001*this.radius)**2)&&(this.radius+=(t-this.radius)*n,this.center.lerp(i,n),this.needsDraw=!0,!0)}render(e){this.pose(),this.root.updateMatrixWorld(!0);let t=L+(this.motion?(this.progress-.5)*.5:0),i=this.radius/.9/Math.sin(16*Math.PI/360);this.camera.position.set(this.center.x+i*Math.sin(t)*Math.cos(T),this.center.y+i*Math.sin(T),this.center.z+i*Math.cos(t)*Math.cos(T)),this.camera.lookAt(this.center),this.camera.updateMatrixWorld(),this.updateDimensions(),e.render(this.scene,this.camera)}updateDimensions(){let e=new n.Vector3,t=new n.Vector3,i=new n.Vector3,s=new n.Vector3,r=new n.Vector3,a=new n.Vector3().setFromMatrixColumn(this.camera.matrixWorld,0),o=new n.Vector3,l=new n.Vector3,d=new n.Vector3;for(let n of this.dims){n.a.getWorldPosition(e),n.b.getWorldPosition(t);let c=e.distanceTo(t);n.line.visible=c>1e-4,n.line.visible&&(i.copy(t).sub(e).normalize(),r.copy(this.camera.position).sub(e).normalize(),s.copy(i).cross(r).normalize(),0>s.dot(a)&&s.negate(),o.copy(e).addScaledVector(s,.38*c),l.copy(t).addScaledVector(s,.38*c),d.copy(s).add(i).normalize().multiplyScalar(.06*c),n.line.geometry.setPositions([...e.toArray(),...o.toArray(),...t.toArray(),...l.toArray(),...o.toArray(),...l.toArray(),o.x-d.x,o.y-d.y,o.z-d.z,o.x+d.x,o.y+d.y,o.z+d.z,l.x-d.x,l.y-d.y,l.z-d.z,l.x+d.x,l.y+d.y,l.z+d.z]))}}dispose(){for(let e of(this.detach(),this.disposables))e.dispose();this.mixer.stopAllAction()}}e.s(["ProcessSurface",0,I],155340)}]);