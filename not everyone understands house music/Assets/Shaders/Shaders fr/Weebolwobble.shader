Shader "Custom/weebolwobble"
{
    Properties
    {
        _MainTex ("Base (RGB)", 2D) = "white" {}
        _GlitchAmount ("Glitch Amount", Range(0, 1)) = 0.5
        _SortDirection ("Sort Direction", Range(0, 1)) = 0.5
        _GlitchSpeed ("Glitch Speed", Range(0.1, 5)) = 1.0
        _SortThreshold ("Sort Threshold", Range(0.0, 1.0)) = 0.3
    }
    SubShader
    {
        Cull Off
        ZWrite Off
        ZTest Always

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
                UNITY_VERTEX_INPUT_INSTANCE_ID
            };

            struct v2f
            {
                float4 vertex : SV_POSITION;
                float2 uv : TEXCOORD0;
                UNITY_VERTEX_OUTPUT_STEREO
            };

            UNITY_DECLARE_SCREENSPACE_TEXTURE(_MainTex);

            
            v2f vert (appdata v)
            {
                UNITY_SETUP_INSTANCE_ID(v);
                UNITY_INITIALIZE_OUTPUT(v2f, v2f o);
                UNITY_INITIALIZE_VERTEX_OUTPUT_STEREO(o);

                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv = v.uv;

                return o;
            }

            
            float4 getScreenCol(float2 uv)
            {
                
                return UNITY_SAMPLE_SCREENSPACE_TEXTURE(_MainTex, UnityStereoTransformScreenSpaceTex(uv));
            }

            float _GlitchAmount;
            float _SortDirection;
            float _GlitchSpeed;
            float _SortThreshold;

            
            fixed4 frag (v2f i) : SV_Target
            {
                UNITY_SETUP_STEREO_EYE_INDEX_POST_VERTEX(i);

                
                float4 color = getScreenCol(i.uv);

                
                float brightness = dot(color.rgb, float3(0.299, 0.587, 0.114));

                
                if (brightness < _SortThreshold)
                {
                    float glitchOffset = sin(_Time.y * _GlitchSpeed + i.uv.y * 10.0) * _GlitchAmount;
                    i.uv.x += glitchOffset * (1.0 - _SortDirection);
                    i.uv.y += glitchOffset * _SortDirection;
                }
                color.a = 0;
                
                color = getScreenCol(i.uv);

                return color;
            }

            ENDCG
        }
    }
}
