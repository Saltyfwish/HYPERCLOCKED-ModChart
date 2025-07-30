Shader "Custom/VRMeshSplitRGB_Glow_Move_CenterHole_Sides"
{
    Properties
    {
        _MainTex("Texture", 2D) = "white" {}
        _SplitAmount("Split Amount", Range(0, 1)) = 0.0
        _ColorR("Red", Range(0, 1)) = 1.0
        _ColorG("Green", Range(0, 1)) = 1.0
        _ColorB("Blue", Range(0, 1)) = 1.0
        _Glow("Glow Intensity", Range(0, 1)) = 1.0
        _MoveZ("Move Z", Range(-1.0, 1.0)) = 0.0

        _CropLeft("Crop Left", Range(0, 0.5)) = 0.0
        _CropRight("Crop Right", Range(0, 0.5)) = 0.0
        _CropTop("Crop Top", Range(0, 0.5)) = 0.0
        _CropBottom("Crop Bottom", Range(0, 0.5)) = 0.0
    }
    SubShader
    {
        Tags { "RenderType"="Opaque" }

        Pass
        {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #pragma multi_compile_instancing
            #pragma multi_compile _ STEREO_INSTANCING_ON

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

            sampler2D _MainTex;
            float4 _MainTex_ST;
            float _SplitAmount;
            float _ColorR;
            float _ColorG;
            float _ColorB;
            float _Glow;
            float _MoveZ;

            float _CropLeft;
            float _CropRight;
            float _CropTop;
            float _CropBottom;

            v2f vert(appdata v)
            {
                UNITY_SETUP_INSTANCE_ID(v);
                v2f o;
                UNITY_INITIALIZE_OUTPUT(v2f, o);
                UNITY_INITIALIZE_VERTEX_OUTPUT_STEREO(o);

                float3 localPos = v.vertex.xyz;

                if (localPos.x > 0.0)
                {
                    localPos.x += _SplitAmount;
                }
                else if (localPos.x < 0.0)
                {
                    localPos.x -= _SplitAmount;
                }

                localPos.z += _MoveZ;

                v.vertex.xyz = localPos;
                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv = TRANSFORM_TEX(v.uv, _MainTex);
                return o;
            }

            fixed4 frag(v2f i) : SV_Target
            {
                // Split discard
                if (abs(i.uv.x - 0.5) < (_SplitAmount * 0.5))
                    discard;

                // Crop from center using individual side controls
                float minX = 0.5 - _CropLeft;
                float maxX = 0.5 + _CropRight;
                float minY = 0.5 - _CropBottom;
                float maxY = 0.5 + _CropTop;

                if (i.uv.x > minX && i.uv.x < maxX &&
                    i.uv.y > minY && i.uv.y < maxY)
                {
                    discard;
                }

                fixed4 col = tex2D(_MainTex, i.uv);
                col.rgb *= float3(_ColorR, _ColorG, _ColorB);
                col.a = _Glow;
                return col;
            }
            ENDCG
        }
    }
}
