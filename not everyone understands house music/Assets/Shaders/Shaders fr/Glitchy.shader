Shader "BeatSaber/Glitch"
{
    Properties
    {
        _MainTex ("Main Texture", 2D) = "white" {}
        _GlitchMultiplier ("Glitch Multiplier", Range(0, 10)) = 1.0
        _Resolution ("Resolution", Range(0, 1024)) = 1024
    }

    SubShader
    {
        Tags { "Queue" = "Overlay" }

        Pass
        {
            Cull Off ZWrite Off ZTest Always

            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag

            #include "UnityCG.cginc"

            struct appdata
            {
                float4 vertex : POSITION;
                float2 uv : TEXCOORD0;
                
                UNITY_VERTEX_INPUT_INSTANCE_ID
            };

            struct v2f
            {
                float2 uv : TEXCOORD0;
                float4 vertex : SV_POSITION;

                UNITY_VERTEX_OUTPUT_STEREO
            };

            UNITY_DECLARE_SCREENSPACE_TEXTURE(_MainTex);
            float _GlitchMultiplier;
            float _Resolution;

            v2f vert(appdata v)
            {
                v2f o;
                
                UNITY_SETUP_INSTANCE_ID(v);
                UNITY_INITIALIZE_VERTEX_OUTPUT_STEREO(o);

                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv = UnityStereoTransformScreenSpaceTex(v.uv);
                return o;
            }

            float3 hash33(float3 p3)
            {
                p3 = frac(p3 * float3(0.1031, 0.103, 0.0973));
                p3 += dot(p3, p3.yxz + 33.33);
                return frac((p3.xxy + p3.yxx) * p3.zyx);
            }

            float2 hash21(float p)
            {
                float3 p3 = frac(((float3)p) * float3(0.1031, 0.103, 0.0973));
                p3 += dot(p3, p3.yzx + 33.33);
                return frac((p3.xx + p3.yz) * p3.zy);
            }

            float4 frag(v2f i) : SV_Target
            {
                UNITY_SETUP_STEREO_EYE_INDEX_POST_VERTEX(i);

                float4 fragColor = UNITY_SAMPLE_SCREENSPACE_TEXTURE(_MainTex, i.uv);
                
                float2 uv = i.uv;
                float speed = 10.0;
                float t = floor(_Time.y * speed);
                float2 lod = _Resolution / hash21(t) / 200.0;
                float2 p = floor(uv * lod);
                float3 rng = hash33(float3(p, t));
                float2 offset = float2(cos(rng.x * 6.283), sin(rng.x * 6.283)) * rng.y;
                float fade = sin(frac(_Time.y * speed) * 3.14);
                float2 scale = 50.0 / _Resolution;
                float threshold = step(0.9, rng.z);

                uv += offset * threshold * fade * scale * _GlitchMultiplier;
                
                fragColor.rgb = UNITY_SAMPLE_SCREENSPACE_TEXTURE(_MainTex, uv);
                
                fragColor.rgb = clamp(fragColor.rgb, 0.0, 1.0);
                fragColor.a = 1.0;

                return fragColor;
            }

            ENDCG
        }
    }

    FallBack "Diffuse"
}
