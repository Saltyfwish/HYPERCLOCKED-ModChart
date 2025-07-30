Shader "Custom/GapBlit"
{
    Properties
    {
        _MainTex ("Texture", 2D) = "white" {}
        _TopOffset ("Top", Range(-0.5, 0.5)) = 0
        _BottomOffset ("Bottom", Range(-0.5, 0.5)) = 0
        _LeftOffset ("Left", Range(-0.5, 0.5)) = 0
        _RightOffset ("Right", Range(-0.5, 0.5)) = 0
        _GapSizeX ("Gap Size X", Range(0, 1)) = 0.0
        _GapSizeY ("Gap Size Y", Range(0, 1)) = 0.0
    }
    SubShader
    {
        Tags { "RenderType"="Opaque" }
        Cull Off ZWrite Off ZTest Always

        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag

            #include "UnityCG.cginc"

            // VivifyTemplate Libraries (for screen space texture sampling)
            // #include "Assets/VivifyTemplate/Utilities/Shader Functions/Noise.cginc"
            // #include "Assets/VivifyTemplate/Utilities/Shader Functions/Colors.cginc"
            // #include "Assets/VivifyTemplate/Utilities/Shader Functions/Math.cginc"
            // #include "Assets/VivifyTemplate/Utilities/Shader Functions/Easings.cginc"

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

            float _TopOffset;
            float _BottomOffset;
            float _LeftOffset;
            float _RightOffset;
            float _GapSizeX;
            float _GapSizeY;

            
            v2f vert(appdata v)
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

            
            fixed4 frag(v2f i) : SV_Target
            {
                UNITY_SETUP_STEREO_EYE_INDEX_POST_VERTEX(i);

                
                float2 uv = i.uv;

                float gapX = _GapSizeX * 0.5;
                float splitX = 0.5 - gapX;

                float gapY = _GapSizeY * 0.5;
                float splitY = 0.5 - gapY;

                
                if ((i.uv.x > splitX && i.uv.x < splitX + _GapSizeX) && 
                    (i.uv.y > splitY && i.uv.y < splitY + _GapSizeY)) {
                    uv = i.uv; 
                } else {
                    
                    if (i.uv.y > splitY + _GapSizeY) {
                        uv.x += _TopOffset * 0.5;
                    }
                    if (i.uv.y < splitY) {
                        uv.x += _BottomOffset * 0.5;
                    }
                    if (i.uv.x > splitX + _GapSizeX) {
                        uv.y += _RightOffset * 0.5;
                    }
                    if (i.uv.x < splitX) {
                        uv.y += _LeftOffset * 0.5;
                    }
                }

                
                fixed4 color = getScreenCol(uv);

                return color;
            }

            ENDCG
        }
    }
}
