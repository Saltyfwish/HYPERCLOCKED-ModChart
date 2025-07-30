Shader "Custom/HorizontalStretch"
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
            #include "UnityCG.cginc"

            UNITY_DECLARE_SCREENSPACE_TEXTURE(_MainTex);
            sampler2D _NoiseTex; 

            float _GlitchIntensity;
            float _Threshold;
            float _LeftStretchAmount;
            float _RightStretchAmount;
            float _DisplacementStrength;

            struct appdata_t
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

            v2f vert (appdata_t v)
            {
                v2f o;
                UNITY_SETUP_INSTANCE_ID(v);
                UNITY_INITIALIZE_OUTPUT(v2f, o);
                UNITY_INITIALIZE_VERTEX_OUTPUT_STEREO(o);

                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv = v.uv;

                return o;
            }

            fixed4 frag (v2f i) : SV_Target
            {
                UNITY_SETUP_STEREO_EYE_INDEX_POST_VERTEX(i);

               
                float2 mainTexUV = UnityStereoTransformScreenSpaceTex(i.uv);
                float2 noiseUV = i.uv * 10.0; 
                
                float4 color = UNITY_SAMPLE_SCREENSPACE_TEXTURE(_MainTex, mainTexUV);
                float noise = tex2D(_NoiseTex, noiseUV).r;

                if (color.r + color.g + color.b > _Threshold && noise < _GlitchIntensity)
                {
                    float leftStretchFactor = _LeftStretchAmount * noise;
                    float rightStretchFactor = _RightStretchAmount * noise;

                    float2 uvLeft = mainTexUV - float2(leftStretchFactor, 0);
                    float2 uvRight = mainTexUV + float2(rightStretchFactor, 0);

                    float4 leftColor = UNITY_SAMPLE_SCREENSPACE_TEXTURE(_MainTex, uvLeft);
                    float4 rightColor = UNITY_SAMPLE_SCREENSPACE_TEXTURE(_MainTex, uvRight);
                    
                    if (leftStretchFactor > 0)
                        color = (leftColor + color) / 2.0;
                    if (rightStretchFactor > 0)
                        color = (rightColor + color) / 2.0;

                    color.rgb = lerp(UNITY_SAMPLE_SCREENSPACE_TEXTURE(_MainTex, mainTexUV).rgb, color.rgb, _DisplacementStrength);
                }

                return color;
            }
            ENDCG
        }
    }
}
