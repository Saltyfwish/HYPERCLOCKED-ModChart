Shader "Custom/BloomBlit"
{
    Properties
    {
        _MainTex ("Texture", 2D) = "white" {}
        _BloomThreshold ("Bloom Threshold", Range(0, 1)) = 0.5
        _BloomIntensity ("Bloom Intensity", Range(0, 5)) = 1.0
    }

    SubShader
    {
        Cull Off ZWrite Off ZTest Always

        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag

            #include "UnityCG.cginc"

            UNITY_DECLARE_SCREENSPACE_TEXTURE(_MainTex);

            
            float _BloomThreshold;
            float _BloomIntensity;

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

            
            float4 getScreenCol(float2 uv)
            {
                return UNITY_SAMPLE_SCREENSPACE_TEXTURE(_MainTex, UnityStereoTransformScreenSpaceTex(uv));
            }

            
            fixed4 frag(v2f i) : SV_Target
            {
                UNITY_SETUP_STEREO_EYE_INDEX_POST_VERTEX(i);

                
                fixed4 c = getScreenCol(i.uv);

                
                float bloomFactor = smoothstep(_BloomThreshold - 0.05, _BloomThreshold + 0.05, c.r + c.g + c.b);

                
                c.rgb *= _BloomIntensity * bloomFactor;

               
                c.a = 1.0;

                return c;
            }
            ENDCG
        }
    }

    FallBack "Diffuse"
}
