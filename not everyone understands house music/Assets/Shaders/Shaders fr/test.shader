Shader "Custom/HorizontalStretch2"
{
    Properties
    {
        _MainTex ("Texture", 2D) = "white" {}
        _GlitchIntensity ("Glitch Intensity", Range(0,1)) = 0.5
        _Threshold ("Threshold", Range(0,1)) = 0.5
        _LeftStretchAmount ("Left Stretch Amount", Range(0, 0.1)) = 0.05
        _RightStretchAmount ("Right Stretch Amount", Range(0, 0.1)) = 0.05
        _NoiseTex ("Noise Texture", 2D) = "white" {}
        _DisplacementStrength ("Displacement Strength", Range(0,10)) = 0.8 // Strength of the displacement effect
    }
    SubShader
    {
        Tags { "RenderType"="Opaque" }
        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #include "UnityCG.cginc"

            sampler2D _MainTex;
            sampler2D _NoiseTex;
            float _GlitchIntensity;
            float _Threshold;
            float _LeftStretchAmount;
            float _RightStretchAmount;
            float _DisplacementStrength;
            float4 _MainTex_TexelSize;

            UNITY_DECLARE_SCREENSPACE_TEXTURE(_Notes);
            
            struct appdata_t
            {
                float4 vertex : POSITION;
                float2 uv : TEXCOORD0;
            };

            struct v2f
            {
                float2 uv : TEXCOORD0;
                float4 vertex : SV_POSITION;
            };

            v2f vert (appdata_t v)
            {
                v2f o;
                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv = v.uv;
                return o;
            }

            fixed4 frag (v2f i) : SV_Target
            {
                float4 color = tex2D(_MainTex, i.uv);
                

                float noise = tex2D(_NoiseTex, i.uv * 10.0).r; 


                if (color.r + color.g + color.b > _Threshold && noise < _GlitchIntensity)
                {

                    float leftStretchFactor = _LeftStretchAmount * (noise - 0.5) * 2.0;
                    float rightStretchFactor = _RightStretchAmount * (noise - 0.5) * 2.0;


                    float2 uvLeft = i.uv - float2(leftStretchFactor, 0);
                    float2 uvRight = i.uv + float2(rightStretchFactor, 0);

                  
                    color = (tex2D(_MainTex, uvLeft) + tex2D(_MainTex, uvRight) + color) / 3.0;

                   
                    color.rgb = lerp(tex2D(_MainTex, i.uv).rgb, color.rgb, _DisplacementStrength);
                }
                
                return color;
            }
            
            ENDCG
        }
    }
}
