Shader "BeatSaber/StretchThing"
{
    Properties
    {
        _MainTex ("Texture", 2D) = "white" {}
        _TopOffset ("Top Offset", Range(-0.5, 0.5)) = 0
        _BottomOffset ("Bottom Offset", Range(-0.5, 0.5)) = 0
        _LeftOffset ("Left Offset", Range(-0.5, 0.5)) = 0
        _RightOffset ("Right Offset", Range(-0.5, 0.5)) = 0
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

            float _TopOffset;
            float _BottomOffset;
            float _LeftOffset;
            float _RightOffset;

            v2f vert (appdata v)
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

                float2 uv = i.uv;
                uv = UnityStereoTransformScreenSpaceTex(uv); 

               
                if (uv.x < 0.5) {
                    uv.x += _LeftOffset * 0.5;
                    uv.x = clamp(uv.x, 0.0, 0.5);
                }

                else {
                    uv.x += _RightOffset * 0.5;
                    uv.x = clamp(uv.x, 0.5, 1.0);
                }


                if (uv.y < 0.5) {
                    uv.y += _TopOffset * 0.5;
                    uv.y = clamp(uv.y, 0.0, 0.5);
                }

                else {
                    uv.y += _BottomOffset * 0.5;
                    uv.y = clamp(uv.y, 0.5, 1.0);
                }


                fixed4 color = UNITY_SAMPLE_SCREENSPACE_TEXTURE(_MainTex, uv);
                
                return color;
            }
            ENDCG
        }
    }
}
