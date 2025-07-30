Shader "Custom/WtfIsACullingShader"
{
    Properties
    {
        _MainTex ("Texture", 2D) = "white" {}
        _GlitchIntensity ("Glitch Intensity", Range(0,1)) = 0.5
        _Threshold ("Threshold", Range(0,1)) = 0.5
        _LeftStretchAmount ("Left Stretch Amount", Range(0, 0.1)) = 0.05
        _RightStretchAmount ("Right Stretch Amount", Range(0, 0.1)) = 0.05
        _NoiseTex ("Noise Texture", 2D) = "white" {}
        _DisplacementStrength ("Displacement Strength", Range(0,10)) = 0.8
    }
    SubShader
    {
        Tags { "RenderType"="Opaque" }
        Cull Off
        ZWrite Off
        ZTest Always

        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #pragma multi_compile _ UNITY_SINGLE_PASS_STEREO

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
            UNITY_DECLARE_SCREENSPACE_TEXTURE(_Notes);
            sampler2D _NoiseTex;

            float _GlitchIntensity;
            float _Threshold;
            float _LeftStretchAmount;
            float _RightStretchAmount;
            float _DisplacementStrength;
            float4 _MainTex_TexelSize;

            v2f vert(appdata v)
            {
                v2f o;

                UNITY_SETUP_INSTANCE_ID(v);
                UNITY_INITIALIZE_OUTPUT(v2f, o);
                UNITY_INITIALIZE_VERTEX_OUTPUT_STEREO(o);

                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv = v.uv;
                return o;
            }

            fixed4 frag(v2f i) : SV_Target
            {
                UNITY_SETUP_STEREO_EYE_INDEX_POST_VERTEX(i);

                float2 uv = UnityStereoTransformScreenSpaceTex(i.uv);
                fixed4 color = UNITY_SAMPLE_SCREENSPACE_TEXTURE(_MainTex, uv);
                fixed4 note = UNITY_SAMPLE_SCREENSPACE_TEXTURE(_Notes, uv);

                float noteMask = step(0.01, note.r + note.g + note.b);

                if (noteMask < 0.1)
                {
                    fixed4 noiseTex = tex2D(_NoiseTex, i.uv * 10.0);
                    float noise = noiseTex.r;

                    float2 uvLeft = UnityStereoTransformScreenSpaceTex(i.uv - float2(_LeftStretchAmount * noise, 0));
                    float2 uvRight = UnityStereoTransformScreenSpaceTex(i.uv + float2(_RightStretchAmount * noise, 0));

                    fixed4 leftColor = UNITY_SAMPLE_SCREENSPACE_TEXTURE(_MainTex, uvLeft);
                    fixed4 rightColor = UNITY_SAMPLE_SCREENSPACE_TEXTURE(_MainTex, uvRight);

                    if (_LeftStretchAmount > 0.0)
                        color = (leftColor + color) * 0.5;
                    if (_RightStretchAmount > 0.0)
                        color = (rightColor + color) * 0.5;

                    fixed4 originalColor = UNITY_SAMPLE_SCREENSPACE_TEXTURE(_MainTex, uv);
                    color.rgb = lerp(originalColor.rgb, color.rgb, _DisplacementStrength);
                }

                return color;
            }
            ENDCG
        }
    }
}
