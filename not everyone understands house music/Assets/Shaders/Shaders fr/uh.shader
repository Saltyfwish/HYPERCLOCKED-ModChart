Shader "Converted/Template"
{
    Properties
    {
        _MainTex ("iChannel0", 2D) = "white" {}
        _SecondTex ("iChannel1", 2D) = "white" {}
        _ThirdTex ("iChannel2", 2D) = "white" {}
        _FourthTex ("iChannel3", 2D) = "white" {}
        _Mouse ("Mouse", Vector) = (0.5, 0.5, 0.5, 0.5)
        [ToggleUI] _GammaCorrect ("Gamma Correction", Float) = 1
        _Resolution ("Resolution (Change if AA is bad)", Range(1, 1024)) = 1
    }
    SubShader
    {
        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag

            #include "UnityCG.cginc"

            struct appdata
            {
                float4 vertex : POSITION;
                float2 uv : TEXCOORD0;
            };

            struct v2f
            {
                float2 uv : TEXCOORD0;
                float4 vertex : SV_POSITION;
            };

            // Built-in properties
            sampler2D _MainTex;   float4 _MainTex_TexelSize;
            sampler2D _SecondTex; float4 _SecondTex_TexelSize;
            sampler2D _ThirdTex;  float4 _ThirdTex_TexelSize;
            sampler2D _FourthTex; float4 _FourthTex_TexelSize;
            float4 _Mouse;
            float _GammaCorrect;
            float _Resolution;

            // GLSL Compatability macros
            #define glsl_mod(x,y) (((x)-(y)*floor((x)/(y))))
            #define texelFetch(ch, uv, lod) tex2Dlod(ch, float4((uv).xy * ch##_TexelSize.xy + ch##_TexelSize.xy * 0.5, 0, lod))
            #define textureLod(ch, uv, lod) tex2Dlod(ch, float4(uv, 0, lod))
            #define iResolution float3(_Resolution, _Resolution, _Resolution)
            #define iFrame (floor(_Time.y / 60))
            #define iChannelTime float4(_Time.y, _Time.y, _Time.y, _Time.y)
            #define iDate float4(2020, 6, 18, 30)
            #define iSampleRate (44100)
            #define iChannelResolution float4x4(                      \
                _MainTex_TexelSize.z,   _MainTex_TexelSize.w,   0, 0, \
                _SecondTex_TexelSize.z, _SecondTex_TexelSize.w, 0, 0, \
                _ThirdTex_TexelSize.z,  _ThirdTex_TexelSize.w,  0, 0, \
                _FourthTex_TexelSize.z, _FourthTex_TexelSize.w, 0, 0)

            // Global access to uv data
            static v2f vertex_output;

            v2f vert (appdata v)
            {
                v2f o;
                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv =  v.uv;
                return o;
            }

#define MaxSteps 30
#define MinimumDistance 0.0009
#define normalDistance 0.0002
#define Iterations 7
#define PI 3.141592
#define Scale 3.
#define FieldOfView 1.
#define Jitter 0.05
#define FudgeFactor 0.7
#define NonLinearPerspective 2.
#define DebugNonlinearPerspective false
#define Ambient 0.32184
#define Diffuse 0.5
#define LightDir ((float3)1.)
#define LightColor float3(1., 1., 0.858824)
#define LightDir2 float3(1., -1., 1.)
#define LightColor2 float3(0., 0.333333, 1.)
#define Offset float3(0.92858, 0.92858, 0.32858)
            float2 rotate(float2 v, float a)
            {
                return float2(cos(a)*v.x+sin(a)*v.y, -sin(a)*v.x+cos(a)*v.y);
            }

            float3 getLight(in float3 color, in float3 normal, in float3 dir)
            {
                float3 lightDir = normalize(LightDir);
                float diffuse = max(0., dot(-normal, lightDir));
                float3 lightDir2 = normalize(LightDir2);
                float diffuse2 = max(0., dot(-normal, lightDir2));
                return diffuse*Diffuse*(LightColor*color)+diffuse2*Diffuse*(LightColor2*color);
            }

            float DE(in float3 z)
            {
                if (DebugNonlinearPerspective)
                {
                    z = frac(z);
                    float d = length(z.xy-((float2)0.5));
                    d = min(d, length(z.xz-((float2)0.5)));
                    d = min(d, length(z.yz-((float2)0.5)));
                    return d-0.01;
                }
                
                z = abs(1.-glsl_mod(z, 2.));
                float d = 1000.;
                for (int n = 0;n<Iterations; n++)
                {
                    z.xy = rotate(z.xy, 4.+2.*cos(_Time.y/8.));
                    z = abs(z);
                    if (z.x<z.y)
                    {
                        z.xy = z.yx;
                    }
                    
                    if (z.x<z.z)
                    {
                        z.xz = z.zx;
                    }
                    
                    if (z.y<z.z)
                    {
                        z.yz = z.zy;
                    }
                    
                    z = Scale*z-Offset*(Scale-1.);
                    if (z.z<-0.5*Offset.z*(Scale-1.))
                        z.z += Offset.z*(Scale-1.);
                        
                    d = min(d, length(z)*pow(Scale, float(-n)-1.));
                }
                return d-0.001;
            }

            float3 getNormal(in float3 pos)
            {
                float3 e = float3(0., normalDistance, 0.);
                return normalize(float3(DE(pos+e.yxx)-DE(pos-e.yxx), DE(pos+e.xyx)-DE(pos-e.xyx), DE(pos+e.xxy)-DE(pos-e.xxy)));
            }

            float3 getColor(float3 normal, float3 pos)
            {
                return ((float3)1.);
            }

            float rand(float2 co)
            {
                return frac(cos(dot(co, float2(4.898, 7.23)))*23421.63);
            }

            float4 rayMarch(in float3 from, in float3 dir, in float2 fragCoord)
            {
                float totalDistance = Jitter*rand(fragCoord.xy+((float2)_Time.y));
                float3 dir2 = dir;
                float distance;
                int steps = 0;
                float3 pos;
                for (int i = 0;i<MaxSteps; i++)
                {
                    dir.zy = rotate(dir2.zy, totalDistance*cos(_Time.y/4.)*NonLinearPerspective);
                    pos = from+totalDistance*dir;
                    distance = DE(pos)*FudgeFactor;
                    totalDistance += distance;
                    if (distance<MinimumDistance)
                        break;
                        
                    steps = i;
                }
                float smoothStep = float(steps)+distance/MinimumDistance;
                float ao = 1.1-smoothStep/float(MaxSteps);
                float3 normal = getNormal(pos-dir*normalDistance*3.);
                float3 color = getColor(normal, pos);
                float3 light = getLight(color, normal, dir);
                color = (color*Ambient+light)*ao;
                return float4(color, 1.);
            }

            float4 frag (v2f __vertex_output) : SV_Target
            {
                vertex_output = __vertex_output;
                float4 fragColor = 0;
                float2 fragCoord = vertex_output.uv * _Resolution;
                float3 camPos = 0.5*_Time.y*float3(1., 0., 0.);
                float3 target = camPos+float3(1., 0.*cos(_Time.y), 0.*sin(0.4*_Time.y));
                float3 camUp = float3(0., 1., 0.);
                float3 camDir = normalize(target-camPos);
                camUp = normalize(camUp-dot(camDir, camUp)*camDir);
                float3 camRight = normalize(cross(camDir, camUp));
                float2 coord = -1.+2.*fragCoord.xy/iResolution.xy;
                coord.x *= iResolution.x/iResolution.y;
                float3 rayDir = normalize(camDir+(coord.x*camRight+coord.y*camUp)*FieldOfView);
                fragColor = rayMarch(camPos, rayDir, fragCoord);
                if (_GammaCorrect) fragColor.rgb = pow(fragColor.rgb, 2.2);
                return fragColor;
            }
            ENDCG
        }
    }
}
