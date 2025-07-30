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

            
            sampler2D _MainTex;   float4 _MainTex_TexelSize;
            sampler2D _SecondTex; float4 _SecondTex_TexelSize;
            sampler2D _ThirdTex;  float4 _ThirdTex_TexelSize;
            sampler2D _FourthTex; float4 _FourthTex_TexelSize;
            float4 _Mouse;
            float _GammaCorrect;
            float _Resolution;

           
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

           
            static v2f vertex_output;

            v2f vert (appdata v)
            {
                v2f o;
                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv =  v.uv;
                return o;
            }

            
            static float gTime = 0.;
            static const float REPEAT = 5.;
            float2x2 rot(float a)
            {
                float c = cos(a), s = sin(a);
                return transpose(float2x2(c, s, -s, c));
            }

            float sdBox(float3 p, float3 b)
            {
                float3 q = abs(p)-b;
                return length(max(q, 0.))+min(max(q.x, max(q.y, q.z)), 0.);
            }

            float box(float3 pos, float scale)
            {
                pos *= scale;
                float base = sdBox(pos, float3(0.4, 0.4, 0.1))/1.5;
                pos.xy *= 5.;
                pos.y -= 3.5;
                pos.xy = mul(pos.xy,rot(0.75));
                float result = -base;
                return result;
            }

            float box_set(float3 pos, float iTime)
            {
                float3 pos_origin = pos;
                pos = pos_origin;
                pos.y += sin(gTime*0.4)*2.5;
                pos.xy = mul(pos.xy,rot(0.8));
                float box1 = box(pos, 2.-abs(sin(gTime*0.4))*1.5);
                pos = pos_origin;
                pos.y -= sin(gTime*0.4)*2.5;
                pos.xy = mul(pos.xy,rot(0.8));
                float box2 = box(pos, 2.-abs(sin(gTime*0.4))*1.5);
                pos = pos_origin;
                pos.x += sin(gTime*0.4)*2.5;
                pos.xy = mul(pos.xy,rot(0.8));
                float box3 = box(pos, 2.-abs(sin(gTime*0.4))*1.5);
                pos = pos_origin;
                pos.x -= sin(gTime*0.4)*2.5;
                pos.xy = mul(pos.xy,rot(0.8));
                float box4 = box(pos, 2.-abs(sin(gTime*0.4))*1.5);
                pos = pos_origin;
                pos.xy = mul(pos.xy,rot(0.8));
                float box5 = box(pos, 0.5)*6.;
                pos = pos_origin;
                float box6 = box(pos, 0.5)*6.;
                float result = max(max(max(max(max(box1, box2), box3), box4), box5), box6);
                return result;
            }

            float map(float3 pos, float iTime)
            {
                float3 pos_origin = pos;
                float box_set1 = box_set(pos, _Time.y);
                return box_set1;
            }

            float4 frag (v2f __vertex_output) : SV_Target
            {
                vertex_output = __vertex_output;
                float4 fragColor = 0;
                float2 fragCoord = vertex_output.uv * _Resolution;
                float2 p = (fragCoord.xy*2.-iResolution.xy)/min(iResolution.x, iResolution.y);
                float3 ro = float3(0., -0.2, _Time.y*4.);
                float3 ray = normalize(float3(p, 1.5));
                ray.xy = mul(ray.xy,rot(sin(_Time.y*0.03)*5.));
                ray.yz = mul(ray.yz,rot(sin(_Time.y*0.05)*0.2));
                float t = 0.1;
                float3 col = ((float3)0.);
                float ac = 0.;
                for (int i = 0;i<99; i++)
                {
                    float3 pos = ro+ray*t;
                    pos = glsl_mod(pos-2., 4.)-2.;
                    gTime = _Time.y-float(i)*0.01;
                    float d = map(pos, _Time.y);
                    d = max(abs(d), 0.01);
                    ac += exp(-d*23.);
                    t += d*0.55;
                }
                col = ((float3)ac*0.02);
                col += float3(0., 0.2*abs(sin(_Time.y)), 0.5+sin(_Time.y)*0.2);
                fragColor = float4(col, 1.-t*(0.02+0.02*sin(_Time.y)));
                if (_GammaCorrect) fragColor.rgb = pow(fragColor.rgb, 2.2);
                return fragColor;
            }
            ENDCG
        }
    }
}